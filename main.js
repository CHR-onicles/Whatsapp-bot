const app = require('express')();
const { Client, LocalAuth, List } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { pickRandomReply, extractTime, getIsMutedStatus, msToHMS, extractCommand } = require('./helpers');
const { CLASSES, HELP_COMMANDS } = require('./data');


// --------------------------------------------------
// Global variables
// --------------------------------------------------
const SUPER_ADMIN = '233557632802';
const BOT = '233551687450';
const BOT_PUSHNAME = 'Ethereal';
const EPIC_DEVS_GROUP_ID = '233558460645-1620635743'; // chat.id.user is better than chat.name as it is immutable
const L400_ASSIGNMENTS_GROUP_ID = ' 233241011931-1400749467';
const HIGH_COUNCIL_GROUP_ID = '233557632802-1618870529';
const port = process.env.PORT || 3000;
let BOT_START_TIME = null;


// --------------------------------------------------
// Configurations
// --------------------------------------------------

const client = new Client({
    authStrategy: new LocalAuth(), // to persist client session
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.setMaxListeners(0); // for an infinite number of event listeners

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!\n');
    BOT_START_TIME = new Date();
});

client.on("disconnected", () => {
    console.log("Oh no! Client is disconnected!");
})

app.get("/", (req, res) => {
    res.send(
        '<h1>This server is powered by Ethereal Bot</h1>'
    );
});

app.all("*", (req, res) => {
    res.status(404).send("<h1>Sorry, this page does not exist!</h1><a href='/'>Back to Home</a>")
})


app.listen(port, () => console.log(`server is running on port ${port}`));

// client.on('ready', async () => {
//     const chats = await client.getChats();
//     console.log(chats);
// })

// client.on('auth_failure', () => {
//     console.log('Client failed to authenticate!');
// });

// client.on('authenticated', () => {
//     console.log('Client was authenticated successfully!');
// });
/**/


// --------------------------------------------------
// BOT LOGIC FROM HERE DOWN
// --------------------------------------------------

// Ping
client.on('message', msg => {
    if (extractCommand(msg) === '!ping' && !getIsMutedStatus()) {
        msg.reply('pong 🏓');
    }
});


// Mention everyone
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!everyone' && !getIsMutedStatus()) {
        const contact = await msg.getContact();
        if (contact.id.user !== SUPER_ADMIN) {
            await msg.reply("Only the boss can use this, so you don't abuse it🐦");
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

    if (msg.body.toLowerCase()[0] === '@' && !getIsMutedStatus()) {
        const first_word = msg.body.toLowerCase().split(' ')[0];
        const contact = await msg.getContact();

        const PING_REPLIES = [
            `${contact.id.user !== SUPER_ADMIN ? "I'm not your bot shoo🐦" : "Need me sir?"}`,
            `I'm here ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `Alive and well ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `Speak forth ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `${contact.id.user !== SUPER_ADMIN ? "Shoo🐦" : "Sir 🐦"}`,
            `${contact.id.user !== SUPER_ADMIN ? "🙄" : "Boss 🐦"}`,
            `Up and running 🐦`,
            `🙋🏽‍♂️`,
            `👋🏽`,
            `🐦`,
            `👀`,
            `Adey 🐦`,
            `Yo 🐦`,
        ]

        if (first_word.slice(1, first_word.length) === BOT) {
            await msg.reply(pickRandomReply(PING_REPLIES));
        }
    }
});


// Mute
client.on('message', async (msg) => {
    if ((extractCommand(msg) === '!mute' || extractCommand(msg) === '!silence') && !getIsMutedStatus()) {
        const contact = await msg.getContact();
        if (contact.id.user === SUPER_ADMIN) {
            const MUTE_REPLIES = [
                'Yes sir',
                'Roger that🐦',
                'Sigh...oki',
                '👍🏽',
                'Got it 👍🏽',
                '🤐👍🏽'
            ]
            await msg.reply(pickRandomReply(MUTE_REPLIES));
            // localStorage.setItem('IS_MUTED', 'true');
        }
    }
})


// Unmute
client.on('message', async (msg) => {
    const contact = await msg.getContact();
    if ((extractCommand(msg) === '!unmute' || extractCommand(msg) === '!speak') && getIsMutedStatus()) {
        if (contact.id.user === SUPER_ADMIN) {
            const UNMUTE_REPLIES = [
                'Thanks sir',
                'Finally🐦',
                '🥳',
                'Speaking freely now 👍🏽',
            ]
            await msg.reply(pickRandomReply(UNMUTE_REPLIES));
            // localStorage.setItem('IS_MUTED', 'false');
        }
    } else if ((msg.body.toLowerCase() === '!unmute' || msg.body.toLowerCase() === '!speak') && !getIsMutedStatus()) {
        await msg.reply(`Haven't been muted ${contact.id.user !== SUPER_ADMIN ? "fam" : "sir "}🐦`);
    }
})


// Help
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!help' && !getIsMutedStatus()) {
        let text = `Hello there I'm *${BOT_PUSHNAME}*🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n`;

        HELP_COMMANDS.forEach(obj => {
            text += obj.command + ': ' + obj.desc + '\n';
        })
        await msg.reply(text);
    }
})


// Check classes for the week
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!classes' && !getIsMutedStatus()) {
        let text = "If *Software Modelling* is your elective:\n\n";
        CLASSES.forEach(class_obj => {
            text += "*" + class_obj.day + "*:\n" + class_obj.courses.map(course => course.name + "\n").join('') + "\n";
            // added join('') to map() to remove the default comma after each value in array
        })
        await msg.reply(text);
    }
})


// Check class for today
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!class' && !getIsMutedStatus()) {
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

        courses.map(course => {
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
    const current_chat = await msg.getChat();
    const chats = await client.getChats();
    const target_chat = chats.find(chat => chat.id.user === EPIC_DEVS_GROUP_ID);

    //* For Announcements
    if (msg.body.includes('❗') || msg.body.includes('‼')) {

        if (current_chat.id.user === EPIC_DEVS_GROUP_ID) {
            console.log("Announcement from EPiC Devs, so do nothing")
            return;
        }

        const current_forwarded_announcements = [];

        // console.log('Recognized an announcement');

        if (!current_forwarded_announcements.includes(msg.body)) {
            // localStorage.setItem('FORWARDED_ANNOUNCEMENTS', JSON.stringify([...current_forwarded_announcements, msg.body]));
            await msg.forward(target_chat);
            console.log('Added new announcement');
        } else {
            console.log('Repeated announcement');
        }
    }

    //* For links
    else if (msg.body.toLowerCase().includes('https')) {
        if (current_chat.id.user === EPIC_DEVS_GROUP_ID) {
            console.log("Link from EPiC Devs, so do nothing")
            return;
        }
        const link_pattern = /(https?:\/\/[^\s]+)/;
        const extracted_link = link_pattern.exec(msg.body)[0];
        const current_forwarded_links = [];

        // console.log('recognized a link');
        // console.log('extracted link:', extracted_link);
        if (!current_forwarded_links.includes(extracted_link)) {
            // localStorage.setItem('FORWARDED_LINKS', JSON.stringify([...current_forwarded_links, extracted_link]));
            await msg.forward(target_chat);
            console.log('Added new link');
        } else {
            console.log("Repeated link");
        }
    }
})


//! Send a direct message to a user *(Work In Progress)*
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!dm' && !getIsMutedStatus()) {
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();

        chat_from_contact.sendMessage("Sliding in DM - ☀");
    }
})


// Check bot uptime
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!uptime') {
        const current_time = new Date();
        const { hours, minutes, seconds } = msToHMS(current_time - BOT_START_TIME);
        // await msg.reply('Not in deployment');
        await msg.reply(`🟢 *Uptime:* ${hours ? hours : 0}${hours === 1 ? 'hr' : 'hrs'} ${minutes ? minutes : 0}${minutes === 1 ? 'min' : 'mins'} ${seconds ? seconds : 0}secs.`);
    }
})


// Send button - Will prolly be better under "bot ping" command
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!options') {
        const list = new List(
            '\nThis is a list of commands the bot can perform',
            'See options',
            [{
                title: 'everyone', rows: [
                    { id: '1', title: '!help', description: 'Help commands' },
                    { id: '2', title: '!classes', description: 'Classes for the week' },
                    { id: '3', title: '!class', description: "Today's class" },
                    { id: '4', title: '!uptime', description: 'How long bot has been active' },
                    { id: '5', title: '!everyone', description: 'Ping everyone in the group' },
                ]
            }],
            'Hey there 👋🏽',
            'Powered by Ethereal bot'
        );
        // const button = new Buttons(
        //     "Body of message",
        //     [
        //         { id: '1', body: 'button 1' },
        //         { id: '2', body: 'button 2' },
        //     ],
        //     'Title of message',
        //     'Powered by Ethereal bot'
        // );
        // const chat = await msg.getChat();
        // msg.reply(button)
        msg.reply(list);
    }
})



client.initialize();