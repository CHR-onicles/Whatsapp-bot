// --------------------------------------------------
// main.js contains the primary bot logic
// --------------------------------------------------
const app = require('express')();
const { Client, LocalAuth, List } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

require('./utils/db');
const { pickRandomReply, msToDHMS, extractCommand, extractCommandArgs, startNotificationCalculation, stopOngoingNotifications, allClassesReply, todayClassReply } = require('./utils/helpers');
const { ALL_CLASSES, HELP_COMMANDS, MUTE_REPLIES, UNMUTE_REPLIES, DM_REPLIES, LINKS_BLACKLIST, WORDS_IN_LINKS_BLACKLIST, NOT_ADMIN_REPLIES, PROMOTE_BOT_REPLIES, DEMOTE_BOT_REPLIES, DEMOTE_GRANDMASTER_REPLIES, PROMOTE_GRANDMASTER_REPLIES } = require('./utils/data');
const { muteBot, unmuteBot, getMutedStatus, getAllLinks, getAllAnnouncements, addAnnouncement, addLink, addUserToBeNotified, removeUserToBeNotified, getUsersToNotifyForClass, getAllSuperAdmins, addSuperAdmin, removeSuperAdmin } = require('./models/misc');


// --------------------------------------------------
// Global variables
// --------------------------------------------------
const GRANDMASTER = process.env.GRANDMASTER; // Owner of the bot
const BOT_NUMBER = process.env.BOT_NUMBER; // The bot's whatsapp number
const BOT_PUSHNAME = 'Ethereal'; // The bot's whatsapp username
const EPIC_DEVS_GROUP_ID_USER = process.env.EPIC_DEVS_GROUP_ID_USER; // this is the group where links and announcements are forwarded to by default
const port = process.env.PORT || 3000;
let BOT_START_TIME = 0;


// --------------------------------------------------
// Configurations
// --------------------------------------------------
const client = new Client({
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    authStrategy: new LocalAuth(),
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
        '<h1>This server is powered by ' + BOT_PUSHNAME + ' bot</h1>'
    );
});

app.listen(port, () => console.log(`Server is running on port ${port}`));


// --------------------------------------------------
// ACTUAL BOT LOGIC FROM HERE DOWN
// --------------------------------------------------

// Bot initialization
client.on('ready', async () => {
    console.log('Client is ready!\n');
    BOT_START_TIME = new Date();
    if (process.env.NODE_ENV === 'production') {
        await startNotificationCalculation(client);
    }
    //     const chats = await client.getChats();
    //     console.log(chats[0]);
});


// Ping bot
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!ping' && await getMutedStatus() === false) {
        msg.reply('pong 🏓');
        // Ping the user who type the command
        // const c = await msg.getContact();
        // const mentions = [c];
        // msg.reply('@' + c.id.user, '', {mentions})
    }
});


// Mention everyone
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!everyone' && await getMutedStatus() === false) {
        const contact = await msg.getContact();
        const admins = await getAllSuperAdmins();
        if (!admins.includes(contact.id.user)) {
            await msg.reply(pickRandomReply(NOT_ADMIN_REPLIES));
            return;
        } else {
            const chat = await msg.getChat();
            let text = "";
            const mentions = [];

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
    }
});


// Reply if pinged
client.on('message', async (msg) => {
    if ((msg.body.toLowerCase()[0] === '@' && await getMutedStatus() === false) ||
        (extractCommand(msg) === '!commands' && await getMutedStatus() === false)) {
        const first_word = msg.body.toLowerCase().split(' ')[0];
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();
        const admins = await getAllSuperAdmins();

        // Have to keep this array here because I want the most updated list of super Admins
        // every time this is needed.
        const PING_REPLIES = [
            `${admins.includes(contact.id.user) ? "I'm not your bot shoo🐦" : "Need me sir?"}`,
            `I'm here ${admins.includes(contact.id.user) ? 'sir' : 'fam'}🐦`,
            `Alive and well ${admins.includes(contact.id.user) ? 'sir' : 'fam'}🐦`,
            `Speak forth ${admins.includes(contact.id.user) ? 'sir' : 'fam'}🐦`,
            `${admins.includes(contact.id.user) ? "Shoo🐦" : "Sir 🐦"}`,
            `${admins.includes(contact.id.user) ? "🙄" : "Boss 🐦"}`,
            `Up and running 🐦`,
            `Listening in 🐦`,
            `🙋🏽‍♂️`,
            `👋🏽`,
            `🐦`,
            `👀`,
            `Adey 🐦`,
            `Yo 🐦`,
            `Sup 🐦`,
            `Hola 🙋🏽‍♂️`,
            `👁👃🏽👁`,
        ]

        const list = new List(
            '\nThis is a list of commands the bot can perform',
            'See commands',
            [{
                title: 'Commands available to everyone',
                rows: [
                    { id: '1', title: '!help', description: 'Help commands' },
                    { id: '2', title: '!class', description: "Today's class" },
                    { id: '3', title: '!classes', description: 'Classes for the week' },
                    { id: '4', title: '!uptime', description: 'How long bot has been active' },
                    { id: '5', title: '!notify', description: 'Get notified for class' },
                    { id: '6', title: '!notify stop', description: 'Stop getting notified for class' },
                ]
            },
            ],
            pickRandomReply(PING_REPLIES),
            'Powered by Ethereal bot'
        );
        //todo: Loop through HELP_COMMANDS and dynamically get commands from there to be processed here
        //todo: Create a new list with reserved commands that will be sent as a reply to an admin when he pings the bot


        if (first_word.slice(1, first_word.length) === BOT_NUMBER) {
            await msg.reply(list);
        } else if (extractCommand(msg) === '!commands') {
            chat_from_contact.sendMessage(list);
        }
    }
});


// Mute the bot
client.on('message', async (msg) => {
    if ((extractCommand(msg) === '!mute' || extractCommand(msg) === '!silence') && await getMutedStatus() === false) {
        const contact = await msg.getContact();
        const admins = await getAllSuperAdmins();
        if (admins.includes(contact.id.user)) {
            msg.reply(pickRandomReply(MUTE_REPLIES));
            await muteBot();
        } else {
            await msg.reply(pickRandomReply(NOT_ADMIN_REPLIES));
        }
    }
})


// Unmute the bot
client.on('message', async (msg) => {
    if ((extractCommand(msg) === '!unmute' || extractCommand(msg) === '!speak') && await getMutedStatus() === true) {
        const contact = await msg.getContact();
        const admins = await getAllSuperAdmins();
        if (admins.includes(contact.id.user)) {
            await msg.reply(pickRandomReply(UNMUTE_REPLIES));
            await unmuteBot();
        }
    } else if ((msg.body.toLowerCase() === '!unmute' || msg.body.toLowerCase() === '!speak') && await getMutedStatus() === false) {
        const admins = await getAllSuperAdmins();
        await msg.reply(`Haven't been muted ${admins.includes(contact.id.user) ? "fam" : "sir "}🐦`);
    }
})


// Help users with commands 
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!help' && await getMutedStatus() === false) {
        const cur_chat = await msg.getChat();
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();
        const admins = await getAllSuperAdmins();
        let text = `Hello there I'm *${BOT_PUSHNAME}*🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n`;

        if (cur_chat.isGroup) {
            await msg.reply(pickRandomReply(DM_REPLIES));
        }

        HELP_COMMANDS.forEach(obj => {
            if (!admins.includes(contact.id.user)) {
                if (obj.availableTo === 'e') text += obj.command + ": " + obj.desc + "\n";
            } else text += obj.command + ": " + obj.desc + "\n";
        })

        if (admins.includes(contact.id.user)) {
            text += "\n\nPS:  You're an *admin*, so you have access to _special_ commands 🤫"
        }
        await chat_from_contact.sendMessage(text);
    }
})


// Check classes for the week
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!classes' && await getMutedStatus() === false) {
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();
        const cur_chat = await msg.getChat();
        const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
        let text = "";

        if (cur_chat.isGroup) {
            await msg.reply(pickRandomReply(DM_REPLIES));
        }

        // if the user has already subscribed to be notified, find his elective and send the timetable based on that.
        if (dataMining.includes(contact.id.user)) {
            text += allClassesReply(ALL_CLASSES, 'D', text)
            await chat_from_contact.sendMessage(text);
            return;
        } else if (networking.includes(contact.id.user)) {
            text += allClassesReply(ALL_CLASSES, 'N', text)
            await chat_from_contact.sendMessage(text);
            return;
        } else if (softModelling.includes(contact.id.user)) {
            text += allClassesReply(ALL_CLASSES, 'S', text)
            await chat_from_contact.sendMessage(text);
            return;
        }

        const list = new List(
            '\nMake a choice from the list of electives',
            'See electives',
            [{
                title: 'Commands available to everyone', rows: [
                    { id: '11', title: 'Data Mining', description: 'For those offering Data Mining' },
                    { id: '12', title: 'Networking', description: "For those offering Networking" },
                    { id: '13', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
                ]
            }
            ],
            'What elective do you offer?',
            'Powered by Ethereal bot'
        );
        await chat_from_contact.sendMessage(list);
    }

    if (msg.type === 'list_response' && await getMutedStatus() === false) {
        if (parseInt(msg.selectedRowId) < 11 || parseInt(msg.selectedRowId) > 13) return;
        let text = "";
        // console.log(msg.selectedRowId);
        if (msg.selectedRowId === '11') {
            text += allClassesReply(ALL_CLASSES, 'D', text);
        } else if (msg.selectedRowId === '12') {
            text += allClassesReply(ALL_CLASSES, 'N', text);
        } else if (msg.selectedRowId === '13') {
            text += allClassesReply(ALL_CLASSES, 'S', text);
        }
        await msg.reply(text);
    }
})


// Check class for today
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!class' && await getMutedStatus() === false) {
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();
        const cur_chat = await msg.getChat();
        const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
        let text = "";

        if (cur_chat.isGroup) {
            await msg.reply(pickRandomReply(DM_REPLIES));
        }

        // if user has already subscribed to be notified for class, get his elective and send the current day's
        // timetable based on the elective.
        if (dataMining.includes(contact.id.user)) {
            text += await todayClassReply(text, 'D')
            await chat_from_contact.sendMessage(text);
            return;
        } else if (networking.includes(contact.id.user)) {
            text += await todayClassReply(text, 'N')
            await chat_from_contact.sendMessage(text);
            return;
        } else if (softModelling.includes(contact.id.user)) {
            text += await todayClassReply(text, 'S')
            await chat_from_contact.sendMessage(text);
            return;
        }

        const list = new List(
            '\nMake a choice from the list of electives',
            'See electives',
            [{
                title: 'Commands available to everyone', rows: [
                    { id: '21', title: 'Data Mining', description: 'For those offering Data Mining' },
                    { id: '22', title: 'Networking', description: "For those offering Networking" },
                    { id: '23', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
                ]
            }
            ],
            'What elective do you offer?',
            'Powered by Ethereal bot'
        );
        await chat_from_contact.sendMessage(list);
    }

    if (msg.type === 'list_response' && await getMutedStatus() === false) {
        if (parseInt(msg.selectedRowId) < 21 || parseInt(msg.selectedRowId) > 23) return;
        let text = "";
        if (msg.selectedRowId === '21') {
            text += await todayClassReply(text, 'D');
        } else if (msg.selectedRowId === '22') {
            text += await todayClassReply(text, 'N');
        } else if (msg.selectedRowId === '23') {
            text += await todayClassReply(text, 'S');
        }
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
        //todo: add check to make sure the exclamation marks aren't the only characters in the message.

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
        const link_pattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/; // Pattern to recognize a link with http, https or www in a message
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
        const { days, hours, minutes, seconds } = msToDHMS(current_time - BOT_START_TIME);
        await msg.reply(`🟢 *Uptime:* ${days ? days : ''}${days ? (days === 1 ? 'day' : 'days') : ''} ${hours ? hours : ''}${hours ? (hours === 1 ? 'hr' : 'hrs') : ''} ${minutes ? minutes : 0}${minutes ? (minutes === 1 ? 'min' : 'mins') : ''} ${seconds ? seconds : 0}secs`);
    }
})


//Add user to notification list for class
client.on('message', async (msg) => {

    if (extractCommand(msg) === '!notify' &&
        extractCommandArgs(msg) !== 'stop' &&
        await getMutedStatus() === false) {
        const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
        const total_users = [...dataMining, ...networking, ...softModelling];
        const contact = await msg.getContact();

        if (total_users.includes(contact.id.user)) {
            await msg.reply("You are already being notified for class🐦");
            console.log('Already subscribed')
            return;
        }

        const list = new List(
            '\nMake a choice from the list of electives',
            'See electives',
            [{
                title: 'Commands available to everyone', rows: [
                    { id: '31', title: 'Data Mining', description: 'For those offering Data Mining' },
                    { id: '32', title: 'Networking', description: 'For those offering Networking' },
                    { id: '33', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
                ]
            }
            ],
            'Which elective do you offer?',
            'Powered by Ethereal bot'
        );
        await msg.reply(list);
    }

    if (msg.type === 'list_response' && await getMutedStatus() === false) {
        const cur_chat = await msg.getChat();
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();

        if (parseInt(msg.selectedRowId) < 31 || parseInt(msg.selectedRowId) > 33) return;
        const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
        const total_users = [...dataMining, ...networking, ...softModelling];

        if (total_users.includes(contact.id.user)) {
            await msg.reply("You are already being notified for class🐦");
            console.log('Already subscribed')
            return;
        }
        // can't refactor repeated code outside the if statement, because every command
        // will execute this piece of code.

        if (cur_chat.isGroup) {
            msg.reply(pickRandomReply(DM_REPLIES));
        }

        chat_from_contact.sendMessage(`🔔 You will now be notified periodically for class, using *${msg.selectedRowId === '31' ? 'Data Mining' : (msg.selectedRowId === '32' ? 'Networking' : 'Software Modelling')}* as your elective.\n\nExpect me🐦`);
        await addUserToBeNotified(contact.id.user, msg.selectedRowId);
        stopOngoingNotifications();
        await startNotificationCalculation(client);
    }
})


//Stop notifying user for class
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!notify' &&
        extractCommandArgs(msg) === 'stop' &&
        await getMutedStatus() === false) {
        const contact = await msg.getContact();
        const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
        const total_users = [...dataMining, ...networking, ...softModelling]

        if (total_users.includes(contact.id.user)) {
            if (dataMining.includes(contact.id.user)) {
                await removeUserToBeNotified(contact.id.user, 'D');
            } else if (networking.includes(contact.id.user)) {
                await removeUserToBeNotified(contact.id.user, 'N');
            } else if (softModelling.includes(contact.id.user)) {
                await removeUserToBeNotified(contact.id.user, 'S');
            }
            msg.reply("I won't remind you to go to class anymore ✅");
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
        const admins = await getAllSuperAdmins();
        if (admins.includes(contact.id.user)) {
            const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
            await msg.reply('The following users have agreed to be notified for class:\n\n' + '*Data Mining:*\n' + dataMining.map(user => '→ ' + user + '\n').join('') + '\n'
                + '*Networking:*\n' + networking.map(user => '→ ' + user + '\n').join('') + '\n' + '*Software Modelling:*\n' + softModelling.map(user => '→ ' + user + '\n').join(''));
        } else {
            pickRandomReply(NOT_ADMIN_REPLIES);
            return;
        }
    }
})


// Promote a user to be admin
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!promote' && await getMutedStatus() === false) {
        const user_to_promote = extractCommandArgs(msg);
        const cur_chat = await msg.getChat();
        const contact = await msg.getContact();
        const admins = await getAllSuperAdmins();

        // Don't do anything if run by a user who is not an admin.
        if (!admins.includes(contact.id.user)) {
            await msg.reply(pickRandomReply(NOT_ADMIN_REPLIES));
            return;
        }

        // Make sure the user is using this command in a group chat in order 
        // to be able to ping another user.
        if (!cur_chat.isGroup) {
            await msg.reply("Sorry can't do this in a chat that is not a group.")
            return;
        }

        // Make sure the user is pinging someone
        if (user_to_promote[0] !== '@') {
            await msg.reply("Please make sure to ping a valid user");
            return;
        }

        const found_user = cur_chat.participants.find((user) => user.id.user === user_to_promote.substring(1, user_to_promote.length));

        if (found_user) {
            // The bot shouldn't be promoted lol.
            if (found_user.id.user === BOT_NUMBER) {
                await msg.reply(pickRandomReply(PROMOTE_BOT_REPLIES));
                return;
            } else if (found_user.id.user === GRANDMASTER) {
                await msg.reply(pickRandomReply(PROMOTE_GRANDMASTER_REPLIES));
                return;
            }
            const admins = await getAllSuperAdmins();
            if (admins.includes(found_user.id.user)) {
                await msg.reply('This user is already an admin 😕'); // todo: Add more replies for this later
                return;
            } else {
                await addSuperAdmin(found_user.id.user);
                await msg.reply('Admin successfully added! ✅'); //todo: Add more replies for this later
            }
        } else {
            await msg.reply("Sorry, I couldn't find that user ☹")
            return;
        }
    }
})


// Dismiss an admin
client.on('message', async (msg) => {
    if (extractCommand(msg) === '!demote' && await getMutedStatus() === false) {
        const user_to_demote = extractCommandArgs(msg);
        const cur_chat = await msg.getChat();
        const contact = await msg.getContact();
        const admins = await getAllSuperAdmins();

        // Don't do anything if run by a user who is not an admin.
        if (!admins.includes(contact.id.user)) {
            await msg.reply(pickRandomReply(NOT_ADMIN_REPLIES));
            return;
        }

        // Make sure the user is using this command in a group chat in order 
        // to be able to ping another user.
        if (!cur_chat.isGroup) {
            await msg.reply("Sorry can't do this in a chat that is not a group.");
            return;
        }

        // Make sure the user is pinging someone
        if (user_to_demote[0] !== '@') {
            await msg.reply("Please make sure to ping a valid user");
            return;
        }

        const found_user = cur_chat.participants.find((user) => user.id.user === user_to_demote.substring(1, user_to_demote.length));

        if (found_user) {
            // The bot shouldn't be demoted.
            if (found_user.id.user === BOT_NUMBER) {
                await msg.reply(pickRandomReply(DEMOTE_BOT_REPLIES));
                return;
            } else if (found_user.id.user === GRANDMASTER) {
                await msg.reply(pickRandomReply(DEMOTE_GRANDMASTER_REPLIES));
                return;
            }
            const admins = await getAllSuperAdmins();
            if (admins.includes(found_user.id.user)) {
                await removeSuperAdmin(found_user.id.user);
                await msg.reply('Admin dismissed successfully! ✅'); //todo: Add more replies for this later
                return;
            } else {
                await msg.reply('This user is not an admin 🤦🏽‍♂️'); // todo: Add more replies for this later
            }
        } else {
            await msg.reply("Sorry, I couldn't find that user ☹");
            return;
        }
    }
})


// Endpoint to hit in order to restart calculations for class notifications (will be done by a cron-job)
app.get('/reset-notif-calc', async (req, res) => {
    stopOngoingNotifications();
    await startNotificationCalculation(client);
    res.send('<h1>Restarting the class notification calculation function.</h1>');
})

// All other pages should be returned as error pages
app.all("*", (req, res) => {
    res.status(404).send("<h1>Sorry, this page does not exist!</h1><br><a href='/'>Back to Home</a>")
})


// Start bot
client.initialize();