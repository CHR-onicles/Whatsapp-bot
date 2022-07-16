// --------------------------------------------------
// main.js contains the primary bot logic
// --------------------------------------------------
const app = require('express')();
const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

require('./utils/db');
const { currentEnv, currentPrefix, extractCommand, startNotificationCalculation, stopAllOngoingNotifications, areAllItemsEqual, sleep, checkForAlias, BOT_PUSHNAME, addToUsedCommandRecently, checkForSpam, checkForChance } = require('./utils/helpers');
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
console.log(`[PREFIX] Current prefix: \"${currentPrefix}\"`);



// --------------------------------------------------
// Configurations
// --------------------------------------------------
mongoose.connect(process.env.MONGO_URL).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.setMaxListeners(0); // for an infinite number of event listeners
    client.initialize();

    client.on('remote_session_saved', () => {
        console.log('[CLIENT] Remote auth session saved')
    })

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
    });

    client.on("disconnected", () => {
        console.error("[CLIENT ERROR] Oh no! Client got disconnected!");
    })


    // Continuously ping the server to prevent it from becoming idle
    setInterval(async () => {
        await axios.get("https://chr-whatsapp-bot.herokuapp.com/");
        console.log('[SERVER] Pinged server')
    }, 15 * 60 * 1000); // every 15 minutes


    // --------------------------------------------------
    // BOT LOGIC
    // --------------------------------------------------

    // Bot initialization
    client.on('ready', async () => {
        console.log('[CLIENT] Client is ready!', currentEnv === 'development' ? '\n' : '');
        BOT_START_TIME = new Date();
        args.BOT_START_TIME = BOT_START_TIME;
        await startNotificationCalculation(client);

        if (currentEnv === 'production') {
            const chats = await client.getChats();
            const grandmasterChat = chats.find(chat => chat.id.user === GRANDMASTER);
            const twentyThreeHrsInMs = 82_800_000; // using numeric separator to improve readability

            // Reminder to restart the bot before Heroku does that for us without our knowledge
            // Will be fixed by RemoteAuth soon
            setTimeout(async () => {
                await grandmasterChat.sendMessage("Reminder to restart the bot after 23 hours!");
            }, twentyThreeHrsInMs);
            console.log("[CLIENT] Preparing to send bot restart reminder in 23 hours\n");
        }

        // Run status command here first to start logging to group chat chain reaction
        try {
            args.RUN_FIRST_TIME = true;
            console.log("[CLIENT] Starting logs...")
            client.commands.get('status').execute(client, null, args);
        } catch (error) {
            console.error('[CLIENT ERROR]', error);
        }
    });


    // Using the client object since it's available to *almost* all parts of the codebase
    // especially the command files...trying to avoid using a global variable. 👍🏽
    client.commands = new Map();
    client.usedCommandRecently = new Set();
    client.potentialSoftBanUsers = new Map();

    // Read commands into memory
    const rootDir = path.join(__dirname, './commands');
    fs.readdir('./commands', (err, folders) => {
        if (err) return console.error('[CLIENT ERROR]', err);
        folders.forEach(folder => {
            const commands = fs.readdirSync(`${rootDir}/${folder}`).filter((file) => file.endsWith(".js"));
            for (let file of commands) {
                const command = require(`${rootDir}/${folder}/${file}`);
                client.commands.set(command.name, command);
                // console.log('[CLIENT] done')
            }
        })

        console.log('[CLIENT] Number of commands read successfully:', client.commands.size);
        isDoneReadingCommands = true;
    })


    //* Handle all message events
    // todo: Transfer to separate file later
    client.on('message', async (msg) => {
        await sleep(500); // Might help with performance slightly maybe?
        if (!isDoneReadingCommands) {
            console.error("[CLIENT ERROR] Not done reading commands");
            return;
        }
        const contact = await msg.getContact();
        const chatFromContact = await contact.getChat();

        // Handle list responses for certain commands
        if (msg.type === "list_response") {
            if (await checkForSpam(client, contact, chatFromContact, msg) === true) return;
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
                    const isValidCommand = command.startsWith(currentPrefix);
                    if (!isValidCommand) break;
                    args.isListResponse = false;
                    client.commands.get(command.slice(1)).execute(client, msg, args);
                    break;
            }
            addToUsedCommandRecently(client, contact.id.user);
            client.potentialSoftBanUsers.set(contact.id.user, { isQualifiedForSoftBan: false, numOfCommandsUsed: 0, hasSentWarningMessage: false, timeout: null });
            return;
        }

        //* Handle text messages for commands
        if (msg.type === 'chat') { // Message type is no longer "text" as stated in the library's docs
            args.isListResponse = false;
            const possibleCommand = extractCommand(msg);
            const isValidCommand = possibleCommand.startsWith(currentPrefix);
            isMention = msg.body.startsWith('@');
            if (!isValidCommand && !isMention) return; // stop processing if message doesn't start with a valid command syntax or a mention
            if (await checkForSpam(client, contact, chatFromContact, msg) === true) return;
            lastPrefixUsed = possibleCommand[0];
            args.lastPrefixUsed = lastPrefixUsed;

            // Check if mention is for bot
            if (isMention) {
                if (currentEnv === 'development') return; // To prevent 2 replies when the bot is mentioned while both environments are running simultaneously
                const firstWord = msg.body.toLowerCase().split(' ').shift();
                if (!(firstWord.slice(1) === client.info.wid.user)) return; // Stop processing if the bot is not the one mentioned
                args.isMention = isMention;
                try {
                    client.commands.get('menu').execute(client, msg, args);
                } catch (error) {
                    console.error('[CLIENT ERROR]', error);
                }
                return;
            }

            // Execute command called
            const cmd = client.commands.get(possibleCommand.slice(1)) || client.commands.get(checkForAlias(client.commands, possibleCommand.slice(1)));
            console.log('\n[CLIENT] Possible cmd:', possibleCommand, '\nCmd:', cmd, '\nArgs:', args);
            if (!cmd) {
                //! Do not always respond to commands as this can be an exploit to spam and crash the bot
                if (checkForChance(1)) { // 10% chance of sending this message to users who type wrong commands
                    await msg.reply("Do you need help with commands?\n\nType *!help* or *!menu* to get started 👍🏻");
                }
                return;
            }

            try {
                cmd.execute(client, msg, args);
                addToUsedCommandRecently(client, contact.id.user);
                client.potentialSoftBanUsers.set(contact.id.user, { isQualifiedForSoftBan: false, numOfCommandsUsed: 0, hasSentWarningMessage: false, timeout: null });
            } catch (error) {
                console.error('[CLIENT ERROR]', error);
            }
        }
    })


    // Forward messages with links/announcements (in other groups) to EPiC Devs for now
    // Not a command so needs to be here
    client.on('message', async (msg) => {
        if (await getMutedStatus() === true) return;
        if (await getForwardingStatus() === false) return;
        const currentChat = await msg.getChat();
        if (!currentChat.isGroup) return; // to prevent forwarding stuff from private chats

        // local helper function to initialize stuff
        const helperForInit = async (msg) => {
            const chats = await client.getChats();
            const forwardToUsers = await getForwardToUsers();
            const targetChats = [];

            for (const chat of chats) {
                for (const ftu of forwardToUsers) {
                    if (chat.id.user === ftu) targetChats.push(chat);
                }
            }
            return { forwardToUsers, targetChats };
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

            const { forwardToUsers, targetChats } = await helperForInit(msg);
            let quotedMsg = null;

            // Don't forward announcements from chats which receive forwarded announcements
            for (const user of forwardToUsers) {
                if (currentChat.id.user === user) {
                    console.log("[CLIENT] Announcement from forwardedUsers, so do nothing")
                    return;
                }
            }
            const currentForwardedAnnouncements = await getAllAnnouncements();
            // console.log('[CLIENT] Recognized an announcement');

            if (!currentForwardedAnnouncements.includes(msg.body)) {
                await addAnnouncement(msg.body);
                if (msg.hasQuotedMsg) {
                    quotedMsg = await msg.getQuotedMessage();
                    targetChats.forEach(async (chat) => await quotedMsg.forward(chat));
                }
                targetChats.forEach(async (chat) => await msg.forward(chat));
                targetChats.forEach(async (chat) => await chat.sendMessage(`Forwarded announcement from *${currentChat.name}*`));
            } else {
                console.log('[CLIENT] Repeated announcement');
            }
        }


        //* For links
        else if (msg.links.length) {
            const { forwardToUsers, targetChats } = await helperForInit(msg);

            // Don't forward links from chats which receive forwarded links
            for (const user of forwardToUsers) {
                if (currentChat.id.user === user) {
                    console.log("[CLIENT] Link from forwardedUsers, so do nothing")
                    return;
                }
            }

            const links = msg.links;
            // Don't forward a link if it doesn't have https...to avoid letting stuff like "awww...lol",  "hey.me" 
            // and insecure links from leaking through
            for (const singleLink of links) {
                if (!singleLink.link.includes('https')) return;
            }
            // console.log('[CLIENT]', links);
            let currentForwardedLinks = await getAllLinks();
            currentForwardedLinks = currentForwardedLinks.map(link => link.toLowerCase());
            // console.log('[CLIENT]', currentForwardedLinks)
            const blacklistedStuff = LINKS_BLACKLIST.concat(WORDS_IN_LINKS_BLACKLIST);

            // Checking if whatsapp has flagged the link as suspicious
            for (const singleLink of links) {
                if (singleLink.isSuspicious) {
                    console.error("[CLIENT ERROR] Whatsapp flags this link as suspicious:", singleLink.link);
                    return;
                }
            }

            // Using this style of for-loop for performance and in order to "return" and break from this event 
            for (const singleLink of links) {
                for (const item of blacklistedStuff) {
                    if (singleLink.link.includes(item)) {
                        console.log("[CLIENT] Link contains a blacklisted item:", item);
                        return;
                    }
                }
            }

            // console.log('[CLIENT] recognized a link');
            if (!currentForwardedLinks.includes(msg.body.toLowerCase())) {
                await addLink(msg.body);
                targetChats.forEach(async (chat) => await msg.forward(chat));
                targetChats.forEach(async (chat) => await chat.sendMessage(`Forwarded link from *${currentChat.name}*`));
            } else {
                console.log("[CLIENT] Repeated link");
            }
        }
    })


    //? Schedule DM - Will be turned into a custom reminder feature for users like Tatsumaki on Discord
    /*client.on('message', async (msg) => {
    //     if (extractCommand(msg) === '!sdm' && await getMutedStatus() === false) {
    //         const contact = await msg.getContact();
    //         const chatFromContact = await contact.getChat();
    //         const pattern = /!sdm\s+[1-9](h|m|s)\s+("|')[\w\s]+("|')/
    //         if (!pattern.test(msg.body)) {
    //             await msg.reply(`❌ Wrong format\n\n✅ The correct format is:\n*!sdm (1-9)(h|m|s) ("message")*\n\nExample: !sdm 5m "How are you?"\n\nThis sends the message: 'How are you?' in 5 minutes`)
    //         } else {
    //             await msg.reply("✅");
    
    //             const time = msg.body.split(' ')[1];
    //             const timeValue = +time[0];
    //             const timeUnit = time[1].toLowerCase();
    //             let message = null;
    
    //             if (msg.body.includes(`"`)) {
    //                 message = msg.body.split(`"`)[1];
    //             } else if (msg.body.includes(`'`)) {
    //                 message = msg.body.split(`'`)[1];
    //             }
    //             let timeout = null;
    
    //             switch (timeUnit) {
    //                 case 's':
    //                     timeout = timeValue * 1000;
    //                     break;
    //                 case 'm':
    //                     timeout = timeValue * 60 * 1000;
    //                     break;
    //                 default:
    //                     break;
    //             }
    
    //             setTimeout(async () => {
    //                 await chatFromContact.sendMessage(message);
    //             }, timeout);
    //         }
    //     }
    // })
    */

});



// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------

app.get("/", (req, res) => {
    res.send(
        '<h1>This server is powered by ' + BOT_PUSHNAME + ' bot</h1>'
    );
});

app.listen(port, () => console.log(`[SERVER] Server is running on port ${port}`));

// Endpoint to hit in order to restart calculations for class notifications (will be done by a cron-job)
app.get('/reset-notif-calc', async (req, res) => {
    stopAllOngoingNotifications();
    await startNotificationCalculation(client);
    res.send('<h1>Restarting the class notification calculation function...</h1>');
})

// All other pages should be returned as error pages
app.all("*", (req, res) => {
    res.status(404).send("<h1>Sorry, this page does not exist!</h1><br><a href='/'>Back to Home</a>")
})
