// --------------------------------------------------
// main.js contains the primary bot logic
// --------------------------------------------------
const app = require('express')();
const { Client, LocalAuth, List } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

require('./utils/db');
const { current_env, current_prefix, pickRandomReply, extractCommand, extractCommandArgs, startNotificationCalculation, stopOngoingNotifications, allClassesReply, todayClassReply, sendSlides, isUserBotAdmin, pickRandomWeightedMessage, areAllItemsEqual, sleep, checkForAlias } = require('./utils/helpers');
const { ALL_CLASSES, HELP_COMMANDS, DM_REPLIES, LINKS_BLACKLIST, WORDS_IN_LINKS_BLACKLIST, NOT_BOT_ADMIN_REPLIES, PROMOTE_BOT_REPLIES, DEMOTE_BOT_REPLIES, DEMOTE_GRANDMASTER_REPLIES, PROMOTE_GRANDMASTER_REPLIES, WAIT_REPLIES, FOOTNOTES, COURSE_MATERIALS_REPLIES } = require('./utils/data');
const { getMutedStatus, getAllLinks, getAllAnnouncements, addAnnouncement, addLink, addUserToBeNotified, removeUserToBeNotified, getUsersToNotifyForClass, addBotAdmin, removeBotAdmin, getNotificationStatus, disableAllNotifications, enableAllNotifications, getForwardToUsers } = require('./models/misc');


// --------------------------------------------------
// Global variables
// --------------------------------------------------
const GRANDMASTER = process.env.GRANDMASTER; // Owner of the bot
const BOT_NUMBER = process.env.BOT_NUMBER; // The bot's whatsapp number
const BOT_PUSHNAME = 'Ethereal'; // The bot's whatsapp username
const port = process.env.PORT || 3000;
let BOT_START_TIME = 0;
const args = {};
let isDoneReadingCommands = false;
console.log("Current prefix:", current_prefix)


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
    console.log('Client is ready!');
    BOT_START_TIME = new Date();
    args.BOT_START_TIME = BOT_START_TIME;
    await startNotificationCalculation(client);

    if (current_env === 'production') {
        const chats = await client.getChats();
        const grandmaster_chat = chats.find(chat => chat.id.user === GRANDMASTER);
        const _23_hours_in_ms = 82_800_000; // using numeric separator for readability
        setTimeout(async () => {
            await grandmaster_chat.sendMessage("Reminder to restart the bot after 23 hours!");
        }, _23_hours_in_ms);
        console.log("Preparing to send bot restart reminder in 23 hours\n");
    }
});


client.commands = new Map();

// Read commands into memory
const root_dir = path.join(__dirname, './commands');
fs.readdir('./commands', (err, folders) => {
    if (err) return console.error(err);
    folders.forEach(folder => {
        const commands = fs.readdirSync(`${root_dir}/${folder}`).filter((file) => file.endsWith(".js"));
        for (let file of commands) {
            const command = require(`${root_dir}/${folder}/${file}`);
            client.commands.set(command.name, command);
            // console.log('done')
        }
    })

    // console.log(client.commands.has('everyone'));
    console.log('Number of commands read successfully:', client.commands.size);
    isDoneReadingCommands = true;

    // console.log(client.commands.get(checkForAlias(client.commands, 'all')));
})

// handle message event
client.on('message', async (msg) => {
    await sleep(500);
    if (!isDoneReadingCommands) {
        console.log("Not done reading commands");
        return;
    }
    // await new Promise(resolve => setTimeout(resolve, 3000));
    const possibleCommand = extractCommand(msg);
    const isValidCommand = possibleCommand.startsWith(current_prefix);
    if (!isValidCommand) return; // stop processing if message doesn't start with a valid command syntax
    const cmd = client.commands.get(possibleCommand.slice(1)) || client.commands.get(checkForAlias(client.commands, possibleCommand.slice(1)));
    console.log(possibleCommand, cmd, args);
    if (!cmd) return;

    try {
        cmd.execute(client, msg, args);
    } catch (error) {
        console.error(error);
    }
})








// ----------------------------------------------
// OTHER COMMANDS TO BE DEALT WITH LATER
// ----------------------------------------------

// Reply if pinged (contains list but no response)
// client.on('message', async (msg) => {
//     if ((msg.body.toLowerCase().startsWith('@') && await getMutedStatus() === false) ||
//         (extractCommand(msg) === current_prefix + 'commands' && await getMutedStatus() === false)) {
//         const first_word = msg.body.toLowerCase().split(' ').shift();
//         const contact = await msg.getContact();
//         const chat_from_contact = await contact.getChat();
//         const cur_chat = await msg.getChat();
//         const isBotAdmin = await isUserBotAdmin(contact);

//         if (extractCommand(msg) === current_prefix + 'commands' && cur_chat.isGroup) {
//             await msg.reply(pickRandomReply(DM_REPLIES));
//         }

//         // Have to keep this array here because I want the most updated list of super Admins
//         // every time this is needed.
//         const PING_REPLIES = [
//             `${isBotAdmin ? "Need me sir?" : "Hello there🐦"}`,
//             `I'm here ${isBotAdmin ? 'sir' : 'fam'}🐦`,
//             `Alive and well ${isBotAdmin ? 'sir' : 'fam'}🐦`,
//             `Speak forth ${isBotAdmin ? 'sir' : 'fam'}🐦`,
//             `${isBotAdmin ? "Sir🐦" : "Fam 🐦"}`,
//             `${isBotAdmin ? "Boss🐦" : "Uhuh? "}`,
//             `Up and running 🐦`,
//             `Listening in 🐦`,
//             `The bot is fine, thanks for not asking 🙄`,
//             `Great ${new Date().getHours() < 12 ? 'morning' : (new Date().getHours < 17 ? 'afternoon' : 'evening')} ${isBotAdmin ? 'boss' : 'fam'} 🥳`,
//             `🙋🏽‍♂️`,
//             `👋🏽`,
//             `🐦`,
//             `👀`,
//             `🤖`,
//             `👊🏽`,
//             `Adey 🐦`,
//             `Yo 🐦`,
//             `Sup 🐦`,
//             `Hola 🙋🏽‍♂️`,
//             `👁👃🏽👁`,
//         ]

//         let startID = 100; // dynamic ID to be used for whatsapp list later
//         const temp_rows = [];
//         for (const com of HELP_COMMANDS) {
//             const { availableTo, command, desc } = com;
//             ++startID;
//             if (!isBotAdmin && availableTo === 'e') {
//                 temp_rows.push({ id: startID.toString(), title: command, description: desc });
//             } else if (isBotAdmin) {
//                 if (!command.includes('<')) // avoiding commands that would involve extra user input for now
//                     temp_rows.push({ id: startID.toString(), title: command, description: desc });
//                 else continue;
//             }
//         }
//         // console.log(temp_rows);

//         const list = new List(
//             '\nThis is a list of commands the bot can perform',
//             'See commands',
//             [{ title: `Commands available to ${isBotAdmin ? 'admins' : 'everyone'}`, rows: temp_rows }],
//             pickRandomReply(PING_REPLIES),
//             'Powered by Ethereal bot'
//         );

//         if (first_word.slice(1) === BOT_NUMBER) {
//             await msg.reply(list);
//         } else if (extractCommand(msg) === current_prefix + 'commands' && cur_chat.isGroup) {
//             await chat_from_contact.sendMessage(list);
//         } else if (extractCommand(msg) === current_prefix + 'commands' && !cur_chat.isGroup) {
//             await msg.reply(list);
//         }
//     }
// });

// // Help users with commands (will contain extra arguments)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'help' && await getMutedStatus() === false) {
//         const cur_chat = await msg.getChat();
//         const contact = await msg.getContact();
//         const chat_from_contact = await contact.getChat();
//         const isBotAdmin = await isUserBotAdmin(contact);
//         let text = `Hello there I'm *${BOT_PUSHNAME}*🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n`;

//         if (cur_chat.isGroup) {
//             await msg.reply(pickRandomReply(DM_REPLIES));
//         }

//         let temp_count = 0;
//         HELP_COMMANDS.forEach((obj, index) => {
//             if (!isBotAdmin) {
//                 if (obj.availableTo === 'e') {
//                     if ((temp_count > 0) && (temp_count % 5 === 0)) text += "\n"; // to space out commands and group them in fives.
//                     text += "*" + obj.command + ":* " + obj.desc + "\n";
//                     temp_count++;
//                 }
//             } else {
//                 if ((index > 0) && (index % 5 === 0)) text += "\n"
//                 text += "*" + obj.command + ":* " + obj.desc + "\n";
//             }
//         })

//         if (isBotAdmin) {
//             text += "\n\nPS:  You're a *bot admin*, so you have access to _special_ commands 🤫"
//         }
//         await chat_from_contact.sendMessage(text);
//     }
// })


// // Check classes for the week (contains list response)
// client.on('message', async (msg) => {
//     const contact = await msg.getContact();
//     const chat_from_contact = await contact.getChat();
//     if (extractCommand(msg) === current_prefix + 'classes' && await getMutedStatus() === false) {
//         const cur_chat = await msg.getChat();
//         const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
//         let text = "";

//         if (cur_chat.isGroup) {
//             await msg.reply(pickRandomReply(DM_REPLIES));
//         }

//         // refactored repeated code into local function
//         const helperForAllClassesReply = async (text, elective) => {
//             text += allClassesReply(ALL_CLASSES, elective, text)
//             await chat_from_contact.sendMessage(text);
//             setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
//         }

//         // if the user has already subscribed to be notified, find his elective and send the timetable based on that.
//         if (dataMining.includes(contact.id.user)) {
//             helperForAllClassesReply(text, 'D');
//             return;
//         } else if (networking.includes(contact.id.user)) {
//             helperForAllClassesReply(text, 'N');
//             return;
//         } else if (softModelling.includes(contact.id.user)) {
//             helperForAllClassesReply(text, 'S');
//             return;
//         }

//         const list = new List(
//             '\nMake a choice from the list of electives',
//             'See electives',
//             [{
//                 title: 'Commands available to everyone', rows: [
//                     { id: '11', title: 'Data Mining', description: 'For those offering Data Mining' },
//                     { id: '12', title: 'Networking', description: "For those offering Networking" },
//                     { id: '13', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
//                 ]
//             }
//             ],
//             'What elective do you offer?',
//             'Powered by Ethereal bot'
//         );
//         await chat_from_contact.sendMessage(list);
//     }

//     if (msg.type === 'list_response' && await getMutedStatus() === false) {
//         if (parseInt(msg.selectedRowId) < 11 || parseInt(msg.selectedRowId) > 13) return;
//         let text = "";
//         // console.log(msg.selectedRowId);
//         if (msg.selectedRowId === '11') {
//             text += allClassesReply(ALL_CLASSES, 'D', text);
//         } else if (msg.selectedRowId === '12') {
//             text += allClassesReply(ALL_CLASSES, 'N', text);
//         } else if (msg.selectedRowId === '13') {
//             text += allClassesReply(ALL_CLASSES, 'S', text);
//         }
//         await msg.reply(text);
//         setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
//     }
// })


// // Check class for today (contains list response)
// client.on('message', async (msg) => {
//     const contact = await msg.getContact();
//     const chat_from_contact = await contact.getChat();
//     if (extractCommand(msg) === current_prefix + 'class' && await getMutedStatus() === false) {
//         const cur_chat = await msg.getChat();
//         const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
//         let text = "";

//         if (cur_chat.isGroup) {
//             await msg.reply(pickRandomReply(DM_REPLIES));
//         }

//         // refactored repeated code into local function
//         const helperForClassesToday = async (text, elective) => {
//             text += await todayClassReply(text, elective);
//             await chat_from_contact.sendMessage(text);
//             setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
//         }

//         // if user has already subscribed to be notified for class, get his elective and send the current day's
//         // timetable based on the elective.
//         if (dataMining.includes(contact.id.user)) {
//             helperForClassesToday(text, 'D');
//             return;
//         } else if (networking.includes(contact.id.user)) {
//             helperForClassesToday(text, 'N');
//             return;
//         } else if (softModelling.includes(contact.id.user)) {
//             helperForClassesToday(text, 'S');
//             return;
//         }

//         const list = new List(
//             '\nMake a choice from the list of electives',
//             'See electives',
//             [{
//                 title: 'Commands available to everyone', rows: [
//                     { id: '21', title: 'Data Mining', description: 'For those offering Data Mining' },
//                     { id: '22', title: 'Networking', description: "For those offering Networking" },
//                     { id: '23', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
//                 ]
//             }
//             ],
//             'What elective do you offer?',
//             'Powered by Ethereal bot'
//         );
//         await chat_from_contact.sendMessage(list);
//     }

//     if (msg.type === 'list_response' && await getMutedStatus() === false) {
//         if (parseInt(msg.selectedRowId) < 21 || parseInt(msg.selectedRowId) > 23) return;
//         let text = "";
//         if (msg.selectedRowId === '21') {
//             text += await todayClassReply(text, 'D');
//         } else if (msg.selectedRowId === '22') {
//             text += await todayClassReply(text, 'N');
//         } else if (msg.selectedRowId === '23') {
//             text += await todayClassReply(text, 'S');
//         }
//         await msg.reply(text);
//         setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
//     }
// })


// // Forward messages with links/announcements (in other groups) to EPiC Devs for now
// client.on('message', async (msg) => {
//     if (await getMutedStatus() === true) return;

//     // local helper function to initialize stuff
//     const helperForInit = async (msg) => {
//         const current_chat = await msg.getChat();
//         const chats = await client.getChats();
//         const forwardToUsers = await getForwardToUsers();
//         const target_chats = [];

//         for (const chat of chats) {
//             for (const ftu of forwardToUsers) {
//                 if (chat.id.user === ftu) target_chats.push(chat);
//             }
//         }
//         return { current_chat, forwardToUsers, target_chats };
//     }

//     //* For Announcements
//     if ((msg.body.includes('❗') || msg.body.includes('‼')) && msg.body.length > 1) {
//         // If length of message is less than 20 characters and all the characters
//         // are the same(announcement emojis), don't forward the announcement. To prevent forwarding just announcement emojis
//         //? Can't fetch messages in order properly so I won't attempt to check for the message 
//         //? just  before this one since it most likely will be the announcement
//         if (msg.body.length < 20) {
//             if (areAllItemsEqual([...msg.body])) return;
//         }

//         const { current_chat, forwardToUsers, target_chats } = await helperForInit(msg);
//         let quoted_msg = null;

//         // Dont forward announcements from chats which receive forwarded announcements
//         for (const user of forwardToUsers) {
//             if (current_chat.id.user === user) {
//                 console.log("Announcement from forwardedUsers, so do nothing")
//                 return;
//             }
//         }
//         const current_forwarded_announcements = await getAllAnnouncements();
//         // console.log('Recognized an announcement');

//         if (!current_forwarded_announcements.includes(msg.body)) {
//             await addAnnouncement(msg.body);
//             if (msg.hasQuotedMsg) {
//                 quoted_msg = await msg.getQuotedMessage();
//                 target_chats.forEach(async (chat) => await quoted_msg.forward(chat));
//             }
//             target_chats.forEach(async (chat) => await msg.forward(chat));
//             target_chats.forEach(async (chat) => await chat.sendMessage(`Forwarded announcement from *${current_chat.name}*`));
//         } else {
//             console.log('Repeated announcement');
//         }
//     }


//     //* For links
//     else if (msg.links.length) {
//         const { current_chat, forwardToUsers, target_chats } = await helperForInit(msg);

//         // Dont forward links from chats which receive forwarded links
//         for (const user of forwardToUsers) {
//             if (current_chat.id.user === user) {
//                 console.log("Link from forwardedUsers, so do nothing")
//                 return;
//             }
//         }

//         const links = msg.links;
//         // Don't forward a link if it doesn't have https...to avoid letting stuff like "awww...lol" and "hey.me" 
//         // and insecure links from leaking through
//         for (const single_link of links) {
//             if (!single_link.link.includes('https')) return;
//         }
//         // console.log(links);
//         let current_forwarded_links = await getAllLinks();
//         current_forwarded_links = current_forwarded_links.map(link => link.toLowerCase());
//         // console.log(current_forwarded_links)
//         const blacklisted_stuff = LINKS_BLACKLIST.concat(WORDS_IN_LINKS_BLACKLIST);

//         // Checking if whatsapp has flagged the link as suspicious
//         for (const single_link of links) {
//             if (single_link.isSuspicious) {
//                 console.log("Whatsapp flags this link as suspicious:", single_link.link);
//                 return;
//             }
//         }

//         // Using this style of for-loop for performance and in order to "return" and break from this event 
//         for (const single_link of links) {
//             for (const item of blacklisted_stuff) {
//                 if (single_link.link.includes(item)) {
//                     console.log("Link contains a blacklisted item:", item);
//                     return;
//                 }
//             }
//         }

//         // console.log('recognized a link');
//         if (!current_forwarded_links.includes(msg.body.toLowerCase())) {
//             await addLink(msg.body);
//             target_chats.forEach(async (chat) => await msg.forward(chat));
//             target_chats.forEach(async (chat) => await chat.sendMessage(`Forwarded link from *${current_chat.name}*`));
//         } else {
//             console.log("Repeated link");
//         }
//     }
// })


// //! Schedule DM - could be turned into a custom reminder feature for users
// // client.on('message', async (msg) => {
// //     if (extractCommand(msg) === '!sdm' && await getMutedStatus() === false) {
// //         const contact = await msg.getContact();
// //         const chat_from_contact = await contact.getChat();
// //         const pattern = /!sdm\s+[1-9](h|m|s)\s+("|')[\w\s]+("|')/
// //         if (!pattern.test(msg.body)) {
// //             await msg.reply(`❌ Wrong format\n\n✅ The correct format is:\n*!sdm (1-9)(h|m|s) ("message")*\n\nExample: !sdm 5m "How are you?"\n\nThis sends the message: 'How are you?' in 5 minutes`)
// //         } else {
// //             await msg.reply("✅");

// //             const time = msg.body.split(' ')[1];
// //             const time_value = +time[0];
// //             const time_unit = time[1].toLowerCase();
// //             let message = null;

// //             if (msg.body.includes(`"`)) {
// //                 message = msg.body.split(`"`)[1];
// //             } else if (msg.body.includes(`'`)) {
// //                 message = msg.body.split(`'`)[1];
// //             }
// //             let timeout = null;

// //             switch (time_unit) {
// //                 case 's':
// //                     timeout = time_value * 1000;
// //                     break;
// //                 case 'm':
// //                     timeout = time_value * 60 * 1000;
// //                     break;
// //                 default:
// //                     break;
// //             }

// //             setTimeout(async () => {
// //                 await chat_from_contact.sendMessage(message);
// //             }, timeout);
// //         }
// //     }
// // })
// /**/


// //Add user to notification list for class (may contain extra arguments)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'notify' &&
//         extractCommandArgs(msg) !== 'stop' &&
//         extractCommandArgs(msg) !== 'disable' &&
//         extractCommandArgs(msg) !== 'enable' &&
//         extractCommandArgs(msg) !== 'status' &&
//         await getMutedStatus() === false) {
//         const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
//         const total_users = [...dataMining, ...networking, ...softModelling];
//         const contact = await msg.getContact();

//         if (total_users.includes(contact.id.user)) {
//             await msg.reply("You are already being notified for class🐦");
//             console.log('Already subscribed')
//             return;
//         }

//         const list = new List(
//             '\nMake a choice from the list of electives',
//             'See electives',
//             [{
//                 title: 'Commands available to everyone', rows: [
//                     { id: '31', title: 'Data Mining', description: 'For those offering Data Mining' },
//                     { id: '32', title: 'Networking', description: 'For those offering Networking' },
//                     { id: '33', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
//                 ]
//             }
//             ],
//             'Which elective do you offer?',
//             'Powered by Ethereal bot'
//         );
//         await msg.reply(list);
//     }

//     if (msg.type === 'list_response' && await getMutedStatus() === false) {
//         const cur_chat = await msg.getChat();
//         const contact = await msg.getContact();
//         const chat_from_contact = await contact.getChat();

//         if (parseInt(msg.selectedRowId) < 31 || parseInt(msg.selectedRowId) > 33) return;
//         const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
//         const total_users = [...dataMining, ...networking, ...softModelling];

//         if (total_users.includes(contact.id.user)) {
//             await msg.reply("You are already being notified for class🐦");
//             console.log('Already subscribed')
//             return;
//         }
//         // can't refactor repeated code outside the if statement, because every command
//         // will execute this piece of code.

//         if (cur_chat.isGroup) {
//             msg.reply(pickRandomReply(DM_REPLIES));
//         }

//         await chat_from_contact.sendMessage(`🔔 You will now be notified periodically for class, using *${msg.selectedRowId === '31' ? 'Data Mining' : (msg.selectedRowId === '32' ? 'Networking' : 'Software Modelling')}* as your elective.\n\nExpect me🐦`);
//         await addUserToBeNotified(contact.id.user, msg.selectedRowId);
//         stopOngoingNotifications();
//         await startNotificationCalculation(client);
//     }
// })


// //Stop notifying user for class (contains extra arguments)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'notify' &&
//         extractCommandArgs(msg) === 'stop' &&
//         await getMutedStatus() === false) {
//         const contact = await msg.getContact();
//         const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
//         const total_users = [...dataMining, ...networking, ...softModelling]

//         if (total_users.includes(contact.id.user)) {
//             if (dataMining.includes(contact.id.user)) {
//                 await removeUserToBeNotified(contact.id.user, 'D');
//             } else if (networking.includes(contact.id.user)) {
//                 await removeUserToBeNotified(contact.id.user, 'N');
//             } else if (softModelling.includes(contact.id.user)) {
//                 await removeUserToBeNotified(contact.id.user, 'S');
//             }
//             msg.reply("I won't remind you to go to class anymore ✅");
//             stopOngoingNotifications();
//             await startNotificationCalculation(client);
//         } else {
//             await msg.reply("You weren't subscribed in the first place 🤔");
//         }
//     }
// })


// // Check notifications status (contains extra arguments)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'notify' &&
//         extractCommandArgs(msg) === 'status' &&
//         await getMutedStatus() === false) {
//         const contact = await msg.getContact();
//         const isBotAdmin = await isUserBotAdmin(contact);
//         if (isBotAdmin) {
//             const notifs_status = await getNotificationStatus();
//             await msg.reply(`All notifications for today's classes are *${notifs_status ? 'ON ✅' : 'OFF ❌'}*`);
//         } else {
//             await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
//             return;
//         }
//     }
// })


// // Promote a user to be a bot admin (contains extra arguments)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'promote' && await getMutedStatus() === false) {
//         const user_to_promote = extractCommandArgs(msg);
//         const cur_chat = await msg.getChat();
//         const contact = await msg.getContact();
//         const isBotAdmin = await isUserBotAdmin(contact);

//         // Don't do anything if run by a user who is not a bot admin.
//         if (!isBotAdmin) {
//             await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
//             return;
//         }

//         // Make sure the user is using this command in a group chat in order 
//         // to be able to ping another user.
//         if (!cur_chat.isGroup) {
//             await msg.reply("Sorry can't do this in a chat that is not a group.")
//             return;
//         }

//         // Make sure the user is pinging someone
//         if (user_to_promote[0] !== '@') {
//             await msg.reply("Please make sure to ping a valid user");
//             return;
//         }

//         const found_user = cur_chat.participants.find((user) => user.id.user === user_to_promote.slice(1));

//         if (found_user) {
//             // The bot shouldn't be promoted lol.
//             if (found_user.id.user === BOT_NUMBER) {
//                 await msg.reply(pickRandomReply(PROMOTE_BOT_REPLIES));
//                 return;
//             } else if (found_user.id.user === GRANDMASTER) {
//                 const isGMAdmin = await isUserBotAdmin(found_user);
//                 if (isGMAdmin) {
//                     await msg.reply(pickRandomReply(PROMOTE_GRANDMASTER_REPLIES));
//                     return;
//                 }
//             }
//             const is_found_user_bot_admin = await isUserBotAdmin(found_user);
//             if (is_found_user_bot_admin) {
//                 await msg.reply('This user is already a bot admin 😕'); // todo: Add more replies for this later
//                 return;
//             } else {
//                 await addBotAdmin(found_user.id.user);
//                 await msg.reply('Admin successfully added! ✅'); //todo: Add more replies for this later
//             }
//         } else {
//             await msg.reply("Sorry, I couldn't find that user ☹")
//             return;
//         }
//     }
// })


// // Dismiss a bot admin (contains extra arguments)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'demote' && await getMutedStatus() === false) {
//         const user_to_demote = extractCommandArgs(msg);
//         const cur_chat = await msg.getChat();
//         const contact = await msg.getContact();
//         const isBotAdmin = await isUserBotAdmin(contact);

//         // Don't do anything if run by a user who is not a bot admin.
//         if (!isBotAdmin) {
//             await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
//             return;
//         }

//         // Make sure the user is using this command in a group chat in order 
//         // to be able to ping another user.
//         if (!cur_chat.isGroup) {
//             await msg.reply("Sorry can't do this in a chat that is not a group.");
//             return;
//         }

//         // Make sure the user is pinging someone
//         if (user_to_demote[0] !== '@') {
//             await msg.reply("Please make sure to ping a valid user");
//             return;
//         }

//         const found_user = cur_chat.participants.find((user) => user.id.user === user_to_demote.slice(1));

//         if (found_user) {
//             // The bot shouldn't be demoted.
//             if (found_user.id.user === BOT_NUMBER) {
//                 await msg.reply(pickRandomReply(DEMOTE_BOT_REPLIES));
//                 return;
//             } else if (found_user.id.user === GRANDMASTER) {
//                 await msg.reply(pickRandomReply(DEMOTE_GRANDMASTER_REPLIES));
//                 return;
//             }
//             const is_found_user_bot_admin = await isUserBotAdmin(found_user);
//             if (is_found_user_bot_admin) {
//                 await removeBotAdmin(found_user.id.user);
//                 await msg.reply('Bot admin dismissed successfully! ✅'); //todo: Add more replies for this later
//                 return;
//             } else {
//                 await msg.reply('This user is not a bot admin 🤦🏽‍♂️'); // todo: Add more replies for this later
//             }
//         } else {
//             await msg.reply("Sorry, I couldn't find that user ☹");
//             return;
//         }
//     }
// })


// // Enable all notifications for the day (contains extra arguments)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'notify' &&
//         extractCommandArgs(msg, 1) === 'enable' &&
//         extractCommandArgs(msg, 2) === 'all' &&
//         await getMutedStatus() === false) {
//         const contact = await msg.getContact();
//         const isBotAdmin = await isUserBotAdmin(contact);
//         if (isBotAdmin) {
//             await enableAllNotifications();
//             startNotificationCalculation(client);
//             await msg.reply("All notifications have been turned *ON* for today.")
//         } else {
//             await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
//             return;
//         }
//     }
// })


// // Disable all notifications for the day (contains extra arguments)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'notify' &&
//         extractCommandArgs(msg, 1) === 'disable' &&
//         extractCommandArgs(msg, 2) === 'all' &&
//         await getMutedStatus() === false) {
//         const contact = await msg.getContact();
//         const isBotAdmin = await isUserBotAdmin(contact);
//         if (isBotAdmin) {
//             await disableAllNotifications();
//             stopOngoingNotifications();
//             await msg.reply("All notifications have been turned *OFF* for today.")
//         } else {
//             await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
//             return;
//         }
//     }
// })


// // Gets slides (contains list response)
// client.on('message', async (msg) => {
//     if (extractCommand(msg) === current_prefix + 'slides' && await getMutedStatus() === false) {
//         // if (current_env === 'production') {
//         const contact = await msg.getContact();
//         const cur_chat = await msg.getChat();
//         const chat_from_contact = await contact.getChat();

//         if (cur_chat.isGroup) await msg.reply(pickRandomReply(DM_REPLIES));

//         const list = new List(
//             '\nThis is a list of courses with available materials',
//             'See courses',
//             [{
//                 title: '',
//                 rows: [
//                     { id: '415', title: 'Compilers', description: 'CSCD 415' },
//                     { id: '417', title: 'Theory & Survey of Programming Languages', description: 'CSCD 417' },
//                     { id: '419', title: 'Formal Methods', description: 'CSCD 419' },
//                     { id: '421', title: 'Accounting', description: 'CSCD 421' },
//                     { id: '423', title: 'Software Modelling & Simulation', description: 'CSCD 423' },
//                     { id: '409', title: 'Data Mining', description: 'CSCD 409' },
//                     { id: '427', title: 'Networking', description: 'CSCD 427' },
//                 ]
//             }],
//             pickRandomReply(COURSE_MATERIALS_REPLIES),
//             'Powered by Ethereal bot'
//         );

//         await chat_from_contact.sendMessage(list);
//         // } else {
//         // await msg.reply("The bot is currently hosted locally, so this operation cannot be performed.\n\nThe Grandmaster's data is at stake🐦")
//         // }
//     }

//     if (msg.type === 'list_response' && await getMutedStatus() === false) {
//         if (parseInt(msg.selectedRowId) < 409 || parseInt(msg.selectedRowId) > 427) return;
//         await msg.reply(pickRandomReply(WAIT_REPLIES));
//         if (msg.selectedRowId === '415') {
//             sendSlides(msg, 'CSCD 415');
//         } else if (msg.selectedRowId === '417') {
//             sendSlides(msg, 'CSCD 417');
//         } else if (msg.selectedRowId === '419') {
//             sendSlides(msg, 'CSCD 419');
//         } else if (msg.selectedRowId === '421') {
//             sendSlides(msg, 'CSCD 421');
//         } else if (msg.selectedRowId === '423') {
//             sendSlides(msg, 'CSCD 423');
//         } else if (msg.selectedRowId === '409') {
//             sendSlides(msg, 'CSCD 409');
//         } else if (msg.selectedRowId === '427') {
//             sendSlides(msg, 'CSCD 427');
//         }
//     }
// })


// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
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