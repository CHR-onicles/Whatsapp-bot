const app = require('express')();
const { Client, LocalAuth, List } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const fs = require('fs');

require('./utils/db');
const { pickRandomReply, extractTime, msToHMS, extractCommand, extractCommandArgs, startNotificationCalculation, stopOngoingNotifications } = require('./utils/helpers');
const { CLASSES, HELP_COMMANDS, MUTE_REPLIES, UNMUTE_REPLIES, NOTIFY_REPLIES, LINKS_BLACKLIST, WORDS_IN_LINKS_BLACKLIST } = require('./utils/data');
const { muteBot, unmuteBot, getMutedStatus, getAllLinks, getAllAnnouncements, addAnnouncement, addLink, addUserToBeNotified, removeUserToBeNotified, getUsersToNotifyForClass } = require('./middleware');



// --------------------------------------------------
// Global variables
// --------------------------------------------------
const GRANDMASTER = process.env.GRANDMASTER;
const BOT_NUMBER = process.env.BOT_NUMBER;
const BOT_PUSHNAME = 'Ethereal';
const EPIC_DEVS_GROUP_ID_USER = process.env.EPIC_DEVS_GROUP_ID_USER; // chat.id.user is better than chat.name as it is immutable
const port = process.env.PORT || 3000;
let BOT_START_TIME = 0;


// --------------------------------------------------
// Configurations
// --------------------------------------------------

const authStrategy = new LocalAuth(
    // dataPath: storage.sessionPath,
    // don't use dataPath to keep it default to ./wwwjs_auth
)

const worker = `${authStrategy.dataPath}/session/Default/Service Worker`
if (fs.existsSync(worker)) {
    fs.rmdirSync(worker, { recursive: true })
}

const client = new Client({
    authStrategy,
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.setMaxListeners(0); // for an infinite number of event listeners

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("disconnected", () => {
    console.log("Oh no! Client is disconnected!");
})

app.get("/", (req, res) => {
    res.send(
        '<h1>This server is powered by Ethereal Bot</h1>'
    );
});

app.listen(port, () => console.log(`Server is running on port ${port}`));


// --------------------------------------------------
// BOT LOGIC FROM HERE DOWN
// --------------------------------------------------

// Bot inits
client.on('ready', async () => {
    console.log('Client is ready!\n');
    BOT_START_TIME = new Date();
    await startNotificationCalculation(client);
    //     const chats = await client.getChats();
    //     console.log(chats[0]);
});


// Ping
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!ping' && await getMutedStatus() === false) {
        msg.reply('pong 🏓');
    }
});


// Mention everyone
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!everyone' && await getMutedStatus() === false) {
        const contact = await msg.getContact();
        if (contact.id.user !== GRANDMASTER) {
            await msg.reply("Only admins can use this, so that it is not abused 🐦");
            return;
        }
        const chat = await msg.getChat();

        let text = "";
        let mentions = [];

        if (chat.participants) {
            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);

                mentions.push(contact);
                text += `@${participant.id.user} `;
            }

            await msg.reply(text, "", { mentions });
        } else {
            await msg.reply("Can't do this - This is not a  group chat 😗");
            console.log("Called !everyone in a chat that is not a group chat");
        }
    }
});


// Reply if pinged
client.on('message', async (msg) => {
    if (msg.body.toLowerCase()[0] === '@' && await getMutedStatus() === false) {
        const first_word = msg.body.toLowerCase().split(' ')[0];
        const contact = await msg.getContact(); // will be used by the replies array later

        const PING_REPLIES = [
            `${contact.id.user !== GRANDMASTER ? "I'm not your bot shoo🐦" : "Need me sir?"}`,
            `I'm here ${contact.id.user === GRANDMASTER ? 'sir' : 'fam'}🐦`,
            `Alive and well ${contact.id.user === GRANDMASTER ? 'sir' : 'fam'}🐦`,
            `Speak forth ${contact.id.user === GRANDMASTER ? 'sir' : 'fam'}🐦`,
            `${contact.id.user !== GRANDMASTER ? "Shoo🐦" : "Sir 🐦"}`,
            `${contact.id.user !== GRANDMASTER ? "🙄" : "Boss 🐦"}`,
            `Up and running 🐦`,
            `🙋🏽‍♂️`,
            `👋🏽`,
            `🐦`,
            `👀`,
            `Adey 🐦`,
            `Yo 🐦`,
        ]

        const list = new List(
            '\nThis is a list of commands the bot can perform',
            'See options',
            [{
                title: 'Commands available to everyone', rows: [
                    { id: '1', title: '!help', description: 'Help commands' },
                    { id: '2', title: '!class', description: "Today's class" },
                    { id: '3', title: '!classes', description: 'Classes for the week' },
                    { id: '4', title: '!uptime', description: 'How long bot has been active' },
                    { id: '5', title: '!notify', description: 'Get notified for class' },
                    { id: '6', title: '!notify stop', description: 'Stop getting notified for class' },
                ]
            },
                // {
                //     title: 'Commands available to EPiC Devs only', rows: [
                //         { id: '100', title: '!everyone', description: 'Ping everyone in the group' },
                //         { id: '101', title: '!mute', description: 'Shut the bot up' },
                //         { id: '102', title: '!unmute', description: 'Allow the bot to talk' },
                //     ]
                // }
            ],
            pickRandomReply(PING_REPLIES),
            'Powered by Ethereal bot'
        );


        if (first_word.slice(1, first_word.length) === BOT_NUMBER) {
            await msg.reply(list);
        }
    }
});


// Mute
client.on('message', async (msg) => {
    if ((extractCommand(msg) === '!mute' || extractCommand(msg) === '!silence') && await getMutedStatus() === false) {
        const contact = await msg.getContact();
        if (contact.id.user === GRANDMASTER) {
            msg.reply(pickRandomReply(MUTE_REPLIES));
            await muteBot();
        }
    }
})


// Unmute
client.on('message', async (msg) => {
    const contact = await msg.getContact();
    if ((extractCommand(msg) === '!unmute' || extractCommand(msg) === '!speak') && await getMutedStatus() === true) {
        if (contact.id.user === GRANDMASTER) {
            await msg.reply(pickRandomReply(UNMUTE_REPLIES));
            await unmuteBot();
        }
    } else if ((msg.body.toLowerCase() === '!unmute' || msg.body.toLowerCase() === '!speak') && await getMutedStatus() === false) {
        await msg.reply(`Haven't been muted ${contact.id.user !== GRANDMASTER ? "fam" : "sir "}🐦`);
    }
})


// Help
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!help' && await getMutedStatus() === false) {
        let text = `Hello there I'm *${BOT_PUSHNAME}*🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n`;

        HELP_COMMANDS.forEach(obj => {
            text += obj.command + ': ' + obj.desc + '\n';
        })
        await msg.reply(text);
    }
})


// Check classes for the week
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!classes' && await getMutedStatus() === false) {
        let text = "If *Software Modelling* is your elective:\n\n";
        CLASSES.forEach(class_obj => {
            text += "*" + class_obj.day + "*:\n" + class_obj.courses.map(course => '→ ' + course.name + "\n").join('') + "\n";
            // added join('') to map() to remove the default comma after each value in array
        })
        await msg.reply(text);
    }
})


// Check class for today
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!class' && await getMutedStatus() === false) {
        const today_day = new Date().toString().split(' ')[0]; // to get day

        if (today_day === 'Sat' || today_day === 'Sun') {
            await msg.reply('Its the weekend! No classes today🥳\n\n_PS:_ You can type *!classes* to know your classes for the week.');
            return;
        }

        const { courses } = CLASSES.find(class_obj => {
            if (class_obj.day.slice(0, 3) === today_day) {
                return class_obj;
            }
        });

        const cur_time = new Date();
        const done_array = [];
        const in_session_array = [];
        const upcoming_array = [];
        let text = "*Today's classes* ☀\n\n";

        courses.forEach(course => {
            const class_time = extractTime(course.name);
            const class_time_hrs = +class_time.split(':')[0]
            const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);

            if ((cur_time.getHours() < class_time_hrs) || (cur_time.getHours() === class_time_hrs && cur_time.getMinutes() < class_time_mins)) {
                // console.log('Not time yet')
                upcoming_array.push(course);
            }
            else if ((cur_time.getHours() === class_time_hrs) || (cur_time.getHours() < class_time_hrs + course.duration) || ((cur_time.getHours() <= class_time_hrs + course.duration) && cur_time.getMinutes() < class_time_mins)) {
                // console.log('In session')
                in_session_array.push(course);
            }
            else if ((cur_time.getHours() > (class_time_hrs + course.duration)) || (cur_time.getHours() >= (class_time_hrs + course.duration) && (cur_time.getMinutes() > class_time_mins))) {
                // console.log('Past time')
                done_array.push(course);
            }
        })

        text += "✅ *Done*:\n" +
            function () {
                return !done_array.length ? '🚫 None\n' : done_array.map(({ name }) => `~${name}~\n`).join('')
            }()
            + "\n" + "⏳ *In session*:\n" +
            function () {
                return !in_session_array.length ? '🚫 None\n' : in_session_array.map(({ name }) => `${name}\n`).join('')
            }()
            + "\n" + "💡 *Upcoming*:\n" +
            function () {
                return !upcoming_array.length ? '🚫 None\n' : upcoming_array.map(({ name }) => `${name}\n`).join('')
            }();
        await msg.reply(text);
    }
})


// Forward messages with links/announcements (in other groups) to EPiC Devs
client.on('message', async (msg) => {
    if (await getMutedStatus() === true) return;
    const current_chat = await msg.getChat();
    const chats = await client.getChats();
    const target_chat = chats.find(chat => chat.id.user === EPIC_DEVS_GROUP_ID_USER);

    //* For Announcements
    if (msg.body.includes('❗') || msg.body.includes('‼')) {

        if (current_chat.id.user === EPIC_DEVS_GROUP_ID_USER) {
            console.log("Announcement from EPiC Devs, so do nothing")
            return;
        }

        const current_forwarded_announcements = await getAllAnnouncements();

        // console.log('Recognized an announcement');

        if (!current_forwarded_announcements.includes(msg.body)) {
            await addAnnouncement(msg.body);
            await msg.forward(target_chat);
        } else {
            console.log('Repeated announcement');
        }
    }

    //* For links
    else if (msg.body.toLowerCase().includes('https') ||
        msg.body.toLowerCase().includes('http') ||
        msg.body.toLowerCase().includes('www')) {
        if (current_chat.id.user === EPIC_DEVS_GROUP_ID_USER) {
            console.log("Link from EPiC Devs, so do nothing")
            return;
        }
        const link_pattern = /(https?:\/\/[^\s]+)/; // Pattern to recognize a link
        const extracted_link = link_pattern.exec(msg.body)[0];
        const current_forwarded_links = await getAllLinks();
        // console.log(current_forwarded_links)

        const blacklisted_stuff = LINKS_BLACKLIST.concat(WORDS_IN_LINKS_BLACKLIST);

        for (let i = 0; i < blacklisted_stuff.length; ++i) {
            if (extracted_link.includes(blacklisted_stuff[i])) {
                console.log("Link contains a blacklisted item:", blacklisted_stuff[i]);
                return;
            }
        }


        // console.log('recognized a link');
        // console.log('extracted link:', extracted_link);
        if (!current_forwarded_links.includes(msg.body)) {
            await addLink(msg.body);
            await msg.forward(target_chat);
        } else {
            console.log("Repeated link");
        }
    }
})


//! Schedule DM - could be turned into a custom reminder feature for users
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === '!sdm' && await getMutedStatus() === false) {
//         const contact = await msg.getContact();
//         const chat_from_contact = await contact.getChat();
//         const pattern = /!sdm\s+[1-9](h|m|s)\s+("|')[\w\s]+("|')/
//         if (!pattern.test(msg.body)) {
//             await msg.reply(`❌ Wrong format\n\n✅ The correct format is:\n*!sdm (1-9)(h|m|s) ("message")*\n\nExample: !sdm 5m "How are you?"\n\nThis sends the message: 'How are you?' in 5 minutes`)
//         } else {
//             await msg.reply("✅");

//             const time = msg.body.split(' ')[1];
//             const time_value = +time[0];
//             const time_unit = time[1].toLowerCase();
//             let message = null;

//             if (msg.body.includes(`"`)) {
//                 message = msg.body.split(`"`)[1];
//             } else if (msg.body.includes(`'`)) {
//                 message = msg.body.split(`'`)[1];
//             }
//             let timeout = null;

//             switch (time_unit) {
//                 case 's':
//                     timeout = time_value * 1000;
//                     break;
//                 case 'm':
//                     timeout = time_value * 60 * 1000;
//                     break;
//                 default:
//                     break;
//             }

//             setTimeout(async () => {
//                 await chat_from_contact.sendMessage(message);
//             }, timeout);
//         }
//     }
// })
/**/


// Check bot uptime
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!uptime' && await getMutedStatus() === false) {
        const current_time = new Date();
        const { days, hours, minutes, seconds } = msToHMS(current_time - BOT_START_TIME);
        await msg.reply(`🟢 *Uptime:* ${days ? days : ''}${days ? (days === 1 ? 'day' : 'days') : ''} ${hours ? hours : ''}${hours ? (hours === 1 ? 'hr' : 'hrs') : ''} ${minutes ? minutes : 0}${minutes ? (minutes === 1 ? 'min' : 'mins') : ''} ${seconds ? seconds : 0}secs`);
    }
})


// Add user to notification list for class
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!notify' &&
        msg.body.toLowerCase().split(' ')[1] !== 'stop' &&
        await getMutedStatus() === false) {
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();
        const cur_chat = await msg.getChat();

        const current_subscribed = await getUsersToNotifyForClass();
        if (!current_subscribed.includes(contact.id.user)) {
            if (cur_chat.isGroup) {
                msg.reply(pickRandomReply(NOTIFY_REPLIES));
            }
            chat_from_contact.sendMessage("🔔 You will now be notified periodically for class.\n\nExpect me🐦");
            await addUserToBeNotified(contact.id.user);
            stopOngoingNotifications();
            await startNotificationCalculation(client);
        } else {
            await msg.reply("You are already being notified for class🐦");
            console.log('Already subscribed')
        }
    }
})


// Stop user from being notified for class
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!notify' && extractCommandArgs(msg) === 'stop') {
        const contact = await msg.getContact();
        const current_subscribed = await getUsersToNotifyForClass();

        if (current_subscribed.includes(contact.id.user)) {
            await removeUserToBeNotified(contact.id.user);
            msg.reply("I won't remind you to go to class ✅");
            stopOngoingNotifications();
            await startNotificationCalculation(client);
        } else {
            await msg.reply("You weren't subscribed in the first place 🤔");
        }
    }
})


// Get users on class notifications list
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!subs' && await getMutedStatus() === false) {
        const contact = await msg.getContact();
        if (contact.id.user !== GRANDMASTER) {
            await msg.reply("Sorry, this command is not available to you.")
        }
        const users = await getUsersToNotifyForClass();

        await msg.reply('The following users have agreed to be notified for class:\n\n' + users.map(user => '→ ' + user + '\n').join(''));
    }
})

// Endpoint to hit in order to restart calculations for class notifications
app.get('/reset-notif-calc', async (req, res) => {
    stopOngoingNotifications();
    await startNotificationCalculation(client);
    res.send('<h1>Restarting the class notification calculation function.</h1>');
})


app.all("*", (req, res) => {
    res.status(404).send("<h1>Sorry, this page does not exist!</h1><a href='/'>Back to Home</a>")
})


client.initialize();