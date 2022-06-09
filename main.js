// --------------------------------------------------
// main.js contains the primary bot logic
// --------------------------------------------------
const app = require('express')();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

require('./utils/db');
const { current_env, current_prefix, extractCommand, startNotificationCalculation, stopOngoingNotifications, areAllItemsEqual, sleep, checkForAlias, BOT_PUSHNAME, addCooldown } = require('./utils/helpers');
const { LINKS_BLACKLIST, WORDS_IN_LINKS_BLACKLIST } = require('./utils/data');
const { getMutedStatus, getAllLinks, getAllAnnouncements, addAnnouncement, addLink, getForwardToUsers, getForwardingStatus } = require('./models/misc');


// --------------------------------------------------
// Global variables
// --------------------------------------------------
const GRANDMASTER = process.env.GRANDMASTER; // Owner of the bot
const port = process.env.PORT || 3000;
let BOT_START_TIME = 0;
const args = {};
let isDoneReadingCommands = false;
let isMention = false;
let lastPrefixUsed = null;
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
// BOT LOGIC
// --------------------------------------------------

// Bot initialization
client.on('ready', async () => {
    console.log('Client is ready!', current_env === 'development' ? '\n' : '');
    BOT_START_TIME = new Date();
    args.BOT_START_TIME = BOT_START_TIME;
    await startNotificationCalculation(client);

    if (current_env === 'production') {
        const chats = await client.getChats();
        const grandmaster_chat = chats.find(chat => chat.id.user === GRANDMASTER);
        const _23_hours_in_ms = 82_800_000; // using numeric separator for readability

        // Reminder to restart the bot before Heroku does that for us without our knowledge
        // Will be fixed by RemoteAuth soon
        setTimeout(async () => {
            await grandmaster_chat.sendMessage("Reminder to restart the bot after 23 hours!");
        }, _23_hours_in_ms);
        console.log("Preparing to send bot restart reminder in 23 hours\n");
    }
});


// Using the client object since it's available to *almost* all parts of the codebase
// especially the command files...trying to avoid using a global variable. 👍🏽
client.commands = new Map();
client.usedCommandRecently = new Set();

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

    console.log('Number of commands read successfully:', client.commands.size);
    isDoneReadingCommands = true;
})


// Handle all message events
// todo: Transfer to separate file later
client.on('message', async (msg) => {
    await sleep(500); // Might help with performance slightly maybe?
    if (!isDoneReadingCommands) {
        console.log("Not done reading commands");
        return;
    }
    const contact = await msg.getContact();

    // Handle list responses for certain commands
    if (msg.type === "list_response") {
        if (client.usedCommandRecently.has(contact.id.user)) {
            console.log("Still in cooldown");
            return;
        }
        args.isListResponse = true;
        args.lastPrefixUsed = lastPrefixUsed;
        const selectedRowId = msg.selectedRowId.split('-')[0];

        switch (selectedRowId) {
            case 'slides':
                client.commands.get('slides').execute(client, msg, args);
                break;
            case 'class':
                client.commands.get('class').execute(client, msg, args);
                break;
            case 'classes':
                client.commands.get('classes').execute(client, msg, args);
                break;
            case 'notify':
                client.commands.get('notify').execute(client, msg, args);
                break;
            default:
                const command = extractCommand(msg);
                const isValidCommand = command.startsWith(current_prefix);
                if (!isValidCommand) break;
                args.isListResponse = false;
                client.commands.get(command.slice(1)).execute(client, msg, args);
                break;
        }
        addCooldown(client, contact.id.user);
        return;
    }

    // Handle text messages for commands
    if (msg.type === 'chat') { // no longer "text" as stated in the library's docs
        args.isListResponse = false;
        const possibleCommand = extractCommand(msg);
        const isValidCommand = possibleCommand.startsWith(current_prefix);
        isMention = msg.body.startsWith('@');
        if (!isValidCommand && !isMention) return; // stop processing if message doesn't start with a valid command syntax or a mention
        if (client.usedCommandRecently.has(contact.id.user)) {
            console.log("Still in cooldown");
            return;
        }
        lastPrefixUsed = possibleCommand[0];
        args.lastPrefixUsed = lastPrefixUsed;

        // Check if mention is for bot
        if (isMention) {
            if (current_env === 'development') return; // To prevent 2 replies when the bot is mentioned while both environments are running simultaneously
            const first_word = msg.body.toLowerCase().split(' ').shift();
            if (!(first_word.slice(1) === process.env.BOT_NUMBER)) return; // Stop processing if the bot is not the one mentioned
            args.isMention = isMention;
            try {
                client.commands.get('menu').execute(client, msg, args);
            } catch (error) {
                console.error(error);
            }
            return;
        }

        // Execute command called
        const cmd = client.commands.get(possibleCommand.slice(1)) || client.commands.get(checkForAlias(client.commands, possibleCommand.slice(1)));
        console.log('\nPossible cmd:', possibleCommand, '\nCmd:', cmd, '\nArgs:', args);
        if (!cmd) return;

        try {
            cmd.execute(client, msg, args);
            addCooldown(client, contact.id.user);
        } catch (error) {
            console.error(error);
        }
    }
})


// Forward messages with links/announcements (in other groups) to EPiC Devs for now
// Not a command so needs to be here
client.on('message', async (msg) => {
    if (await getMutedStatus() === true) return;
    if (await getForwardingStatus() === false) return;

    // local helper function to initialize stuff
    const helperForInit = async (msg) => {
        const current_chat = await msg.getChat();
        const chats = await client.getChats();
        const forwardToUsers = await getForwardToUsers();
        const target_chats = [];

        for (const chat of chats) {
            for (const ftu of forwardToUsers) {
                if (chat.id.user === ftu) target_chats.push(chat);
            }
        }
        return { current_chat, forwardToUsers, target_chats };
    }

    //* For Announcements
    if ((msg.body.includes('❗') || msg.body.includes('‼')) && msg.body.length > 1) {
        // If length of message is less than 20 characters and all the characters
        // are the same(announcement emojis), don't forward the announcement. To prevent forwarding just announcement emojis
        //? Can't fetch messages in order properly so I won't attempt to check for the message 
        //? just  before this one since it most likely will be the announcement
        if (msg.body.length < 20) {
            if (areAllItemsEqual([...msg.body])) return;
        }

        const { current_chat, forwardToUsers, target_chats } = await helperForInit(msg);
        let quoted_msg = null;

        // Dont forward announcements from chats which receive forwarded announcements
        for (const user of forwardToUsers) {
            if (current_chat.id.user === user) {
                console.log("Announcement from forwardedUsers, so do nothing")
                return;
            }
        }
        const current_forwarded_announcements = await getAllAnnouncements();
        // console.log('Recognized an announcement');

        if (!current_forwarded_announcements.includes(msg.body)) {
            await addAnnouncement(msg.body);
            if (msg.hasQuotedMsg) {
                quoted_msg = await msg.getQuotedMessage();
                target_chats.forEach(async (chat) => await quoted_msg.forward(chat));
            }
            target_chats.forEach(async (chat) => await msg.forward(chat));
            target_chats.forEach(async (chat) => await chat.sendMessage(`Forwarded announcement from *${current_chat.name}*`));
        } else {
            console.log('Repeated announcement');
        }
    }


    //* For links
    else if (msg.links.length) {
        const { current_chat, forwardToUsers, target_chats } = await helperForInit(msg);

        // Don't forward links from chats which receive forwarded links
        for (const user of forwardToUsers) {
            if (current_chat.id.user === user) {
                console.log("Link from forwardedUsers, so do nothing")
                return;
            }
        }

        const links = msg.links;
        // Don't forward a link if it doesn't have https...to avoid letting stuff like "awww...lol",  "hey.me" 
        // and insecure links from leaking through
        for (const single_link of links) {
            if (!single_link.link.includes('https')) return;
        }
        // console.log(links);
        let current_forwarded_links = await getAllLinks();
        current_forwarded_links = current_forwarded_links.map(link => link.toLowerCase());
        // console.log(current_forwarded_links)
        const blacklisted_stuff = LINKS_BLACKLIST.concat(WORDS_IN_LINKS_BLACKLIST);

        // Checking if whatsapp has flagged the link as suspicious
        for (const single_link of links) {
            if (single_link.isSuspicious) {
                console.log("Whatsapp flags this link as suspicious:", single_link.link);
                return;
            }
        }

        // Using this style of for-loop for performance and in order to "return" and break from this event 
        for (const single_link of links) {
            for (const item of blacklisted_stuff) {
                if (single_link.link.includes(item)) {
                    console.log("Link contains a blacklisted item:", item);
                    return;
                }
            }
        }

        // console.log('recognized a link');
        if (!current_forwarded_links.includes(msg.body.toLowerCase())) {
            await addLink(msg.body);
            target_chats.forEach(async (chat) => await msg.forward(chat));
            target_chats.forEach(async (chat) => await chat.sendMessage(`Forwarded link from *${current_chat.name}*`));
        } else {
            console.log("Repeated link");
        }
    }
})


//? Schedule DM - Will be turned into a custom reminder feature for users like Tatsumaki on Discord
/*client.on('message', async (msg) => {
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
*/




// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
// Endpoint to hit in order to restart calculations for class notifications (will be done by a cron-job)
app.get('/reset-notif-calc', async (req, res) => {
    stopOngoingNotifications();
    await startNotificationCalculation(client);
    res.send('<h1>Restarting the class notification calculation function...</h1>');
})

// All other pages should be returned as error pages
app.all("*", (req, res) => {
    res.status(404).send("<h1>Sorry, this page does not exist!</h1><br><a href='/'>Back to Home</a>")
})

// Start bot
client.initialize();