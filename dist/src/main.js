"use strict";
// --------------------------------------------------
// main.js contains the primary bot logic
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// --------------------------------------------------
const express_1 = __importDefault(require("express"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const wwebjs_mongo_1 = require("wwebjs-mongo");
const mongoose_1 = __importDefault(require("mongoose"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
require("./utils/db");
const helpers_1 = require("./utils/helpers");
const data_1 = require("./utils/data");
const misc_1 = require("./models/misc");
require("./interfaces");
// --------------------------------------------------
// Global variables
// --------------------------------------------------
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
let BOT_START_TIME;
const args = {};
let isDoneReadingCommands = false;
let isMention = false;
let lastPrefixUsed;
console.log(`[PREFIX] Current prefix: \"${helpers_1.currentPrefix}\"`);
// console.log(process[Symbol.for('ts-node.register.instance') as unknown as keyof typeof process]?.toLocaleString().length)
// const sourceFilesExtension = process[
//   Symbol.for("ts-node.register.instance") as unknown as keyof typeof process
// ]?.toLocaleString().length
//   ? ".ts"
//   : ".js";
// --------------------------------------------------
// Configurations
// --------------------------------------------------
if (process.env.MONGO_URL) {
    mongoose_1.default.connect(process.env.MONGO_URL).then(() => {
        let client;
        if (helpers_1.currentEnv === "development") {
            client = new whatsapp_web_js_1.Client({
                puppeteer: {
                    headless: true,
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                },
                authStrategy: new whatsapp_web_js_1.LocalAuth(),
            });
        }
        else {
            const store = new wwebjs_mongo_1.MongoStore({ mongoose: mongoose_1.default });
            client = new whatsapp_web_js_1.Client({
                puppeteer: {
                    headless: true,
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                },
                authStrategy: new whatsapp_web_js_1.RemoteAuth({
                    store: store,
                    backupSyncIntervalMs: 300000,
                }),
            });
        }
        client.setMaxListeners(0); // for an infinite number of event listeners
        client.initialize();
        client.on("remote_session_saved", () => {
            console.log("[CLIENT] Remote auth session saved");
        });
        client.on("qr", (qr) => {
            qrcode_terminal_1.default.generate(qr, { small: true });
        });
        client.on("disconnected", () => {
            console.error("[CLIENT ERROR] Oh no! Client got disconnected!");
        });
        // Continuously ping the server to prevent it from becoming idle
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            yield axios_1.default.get("https://dana-whatsapp-bot.herokuapp.com/");
            console.log("[SERVER] Pinged server");
        }), 15 * 60 * 1000); // every 15 minutes
        // --------------------------------------------------
        // BOT LOGIC
        // --------------------------------------------------
        // Bot initialization
        client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            console.log("[CLIENT] Client is ready!", helpers_1.currentEnv === "development" ? "\n" : "");
            BOT_START_TIME = new Date();
            args.BOT_START_TIME = BOT_START_TIME;
            // Run status command here first to start logging to group chat chain reaction
            try {
                args.RUN_FIRST_TIME = true;
                console.log("[CLIENT] Starting logs...");
                client.commands &&
                    ((_a = client.commands.get("status")) === null || _a === void 0 ? void 0 : _a.execute(client, null, args));
            }
            catch (error) {
                console.error("[CLIENT ERROR]", error);
            }
            if (helpers_1.currentEnv === "production") {
                yield (0, helpers_1.startNotificationCalculation)(client);
                // Reset notifications everyday
                const curTime = new Date();
                const midnightTime = new Date();
                midnightTime.setDate(curTime.getDate() + 1);
                midnightTime.setHours(0, 1, 0);
                console.log("[CLIENT] Time for next notification reset:", midnightTime);
                // Helper function to avoid repetition
                const resetNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
                    (0, helpers_1.stopAllOngoingNotifications)();
                    yield (0, helpers_1.startNotificationCalculation)(client);
                    console.log("[CLIENT] Reset all notifications");
                });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield resetNotifications();
                    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield resetNotifications();
                        yield (0, misc_1.enableOrDisableAllNotifications)(true);
                    }), 24 * 60 * 60 * 1000); // Repeat every 24 hours
                }), midnightTime.getTime() - curTime.getTime()); // Time left till midnight in milliseconds
                // }, 30 * 1000); // For testing
                // }, 10_000); // For testing
            }
        }));
        // Using the client object since it's available to *almost* all parts of the codebase
        // especially the command files...trying to avoid using a global variable. 👍🏽
        client.commands = new Map();
        client.usedCommandRecently = new Set();
        client.potentialSoftBanUsers = new Map();
        // Read commands into memory
        const rootDir = path_1.default.join(__dirname, "./commands");
        fs_1.default.readdir(rootDir, (err, folders) => {
            var _a;
            if (err)
                return console.error("[CLIENT ERROR]", err);
            folders.forEach((folder) => {
                const commands = fs_1.default
                    .readdirSync(`${rootDir}/${folder}`)
                    .filter((file) => file.endsWith(".ts"));
                for (let file of commands) {
                    const command = require(`${rootDir}/${folder}/${file}`);
                    client.commands && client.commands.set(command.name, command);
                    // console.log('[CLIENT] done')
                }
            });
            console.log("[CLIENT] Number of commands read successfully:", (_a = client.commands) === null || _a === void 0 ? void 0 : _a.size);
            isDoneReadingCommands = true;
        });
        //* Handle all message events
        // todo: Transfer to separate file later
        client.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
            var _b, _c, _d, _e, _f, _g;
            yield (0, helpers_1.sleep)(500); // Might help with performance slightly maybe?
            if (!isDoneReadingCommands) {
                console.error("[CLIENT ERROR] Not done reading commands");
                return;
            }
            const contact = yield msg.getContact();
            const chatFromContact = yield contact.getChat();
            // Handle list responses for certain commands
            if (msg.type === "list_response") {
                if ((yield (0, helpers_1.checkForSpam)(client, contact, chatFromContact, msg)) === true)
                    return;
                args.isListResponse = true;
                args.lastPrefixUsed = lastPrefixUsed;
                if (msg.selectedRowId) {
                    const selectedRowId = msg.selectedRowId.split("-")[0];
                    switch (selectedRowId) {
                        case "slides":
                            client.commands &&
                                ((_b = client.commands.get("slides")) === null || _b === void 0 ? void 0 : _b.execute(client, msg, args));
                            break;
                        case "class":
                            client.commands &&
                                ((_c = client.commands.get("class")) === null || _c === void 0 ? void 0 : _c.execute(client, msg, args));
                            break;
                        case "classes":
                            client.commands &&
                                ((_d = client.commands.get("classes")) === null || _d === void 0 ? void 0 : _d.execute(client, msg, args));
                            break;
                        case "notify":
                            client.commands &&
                                ((_e = client.commands.get("notify")) === null || _e === void 0 ? void 0 : _e.execute(client, msg, args));
                            break;
                        default:
                            const command = (0, helpers_1.extractCommand)(msg);
                            const isValidCommand = command === null || command === void 0 ? void 0 : command.startsWith(helpers_1.currentPrefix);
                            if (!isValidCommand)
                                break;
                            args.isListResponse = false;
                            if (command) {
                                client.commands &&
                                    ((_f = client.commands
                                        .get(command.slice(1))) === null || _f === void 0 ? void 0 : _f.execute(client, msg, args));
                            }
                            break;
                    }
                }
                (0, helpers_1.addToUsedCommandRecently)(client, contact.id.user);
                if (client.potentialSoftBanUsers) {
                    client.potentialSoftBanUsers.set(contact.id.user, {
                        isQualifiedForSoftBan: false,
                        numOfCommandsUsed: 0,
                        hasSentWarningMessage: false,
                        timeout: null,
                    });
                }
                return;
            }
            //* Handle text messages for commands
            if (msg.type === "chat") {
                // Message type is no longer "text" as stated in the library's docs
                args.isListResponse = false;
                const possibleCommand = (0, helpers_1.extractCommand)(msg);
                const isValidCommand = possibleCommand === null || possibleCommand === void 0 ? void 0 : possibleCommand.startsWith(helpers_1.currentPrefix);
                isMention = msg.body.startsWith("@");
                if (!isValidCommand && !isMention)
                    return; // stop processing if message doesn't start with a valid command syntax or a mention
                if ((yield (0, helpers_1.checkForSpam)(client, contact, chatFromContact, msg)) === true)
                    return;
                if (possibleCommand)
                    lastPrefixUsed = possibleCommand[0];
                args.lastPrefixUsed = lastPrefixUsed;
                // Check if mention is for bot
                if (isMention) {
                    if (helpers_1.currentEnv === "development")
                        return; // To prevent 2 replies when the bot is mentioned while both environments are running simultaneously
                    const firstWord = msg.body.toLowerCase().split(" ").shift() || "";
                    if (!(firstWord.slice(1) === client.info.wid.user))
                        return; // Stop processing if the bot is not the one mentioned
                    args.isMention = isMention;
                    try {
                        client.commands &&
                            ((_g = client.commands.get("menu")) === null || _g === void 0 ? void 0 : _g.execute(client, msg, args));
                    }
                    catch (error) {
                        console.error("[CLIENT ERROR]", error);
                    }
                    return;
                }
                // Execute command called
                if (possibleCommand) {
                    const cmd = (client.commands &&
                        client.commands.get(possibleCommand.slice(1))) ||
                        (client.commands &&
                            client.commands.get(
                            //@ts-ignore
                            (0, helpers_1.checkForAlias)(client.commands, possibleCommand.slice(1))));
                    console.log("\n[CLIENT] Possible cmd:", possibleCommand, "\nCmd:", cmd, "\nArgs:", args);
                    if (!cmd) {
                        //! Do not always respond to commands as this can be an exploit to spam and crash the bot
                        if ((0, helpers_1.checkForChance)(1)) {
                            // 10% chance of sending this message to users who type wrong commands
                            yield msg.reply("Do you need help with commands?\n\nType *!help* or *!menu* to get started 👍🏻");
                        }
                        return;
                    }
                    try {
                        cmd.execute(client, msg, args);
                        (0, helpers_1.addToUsedCommandRecently)(client, contact.id.user);
                        if (client.potentialSoftBanUsers) {
                            client.potentialSoftBanUsers.set(contact.id.user, {
                                isQualifiedForSoftBan: false,
                                numOfCommandsUsed: 0,
                                hasSentWarningMessage: false,
                                timeout: null,
                            });
                        }
                    }
                    catch (error) {
                        console.error("[CLIENT ERROR]", error);
                    }
                }
            }
        }));
        // Forward messages with links/announcements (in other groups) to EPiC Devs for now
        // Not a command so needs to be here
        client.on("message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
            if ((yield (0, misc_1.getMutedStatus)()) === true)
                return;
            if ((yield (0, misc_1.getForwardingStatus)()) === false)
                return;
            const currentChat = yield msg.getChat();
            if (!currentChat.isGroup)
                return; // to prevent forwarding stuff from private chats
            // local helper function to initialize stuff
            const helperForInit = (msg) => __awaiter(void 0, void 0, void 0, function* () {
                const chats = yield client.getChats();
                const forwardToUsers = yield (0, misc_1.getForwardToUsers)();
                if (forwardToUsers) {
                    const targetChats = [];
                    for (const chat of chats) {
                        for (const ftu of forwardToUsers) {
                            if (chat.id.user === ftu)
                                targetChats.push(chat);
                        }
                    }
                    return { forwardToUsers, targetChats };
                }
            });
            //* For Announcements
            if ((msg.body.includes("❗") || msg.body.includes("‼")) &&
                msg.body.length > 1) {
                // If length of message is less than 20 characters and all the characters
                // are the same(announcement emojis), don't forward the announcement. To prevent forwarding just announcement emojis
                //? Can't fetch messages in order properly so I won't attempt to check for the message
                //? just  before this one since it most likely will be the announcement
                if (msg.body.length < 20) {
                    if ((0, helpers_1.areAllItemsEqual)([...msg.body]))
                        return;
                }
                const response = yield helperForInit(msg);
                if (response) {
                    const { forwardToUsers, targetChats } = response;
                    // Don't forward announcements from chats which receive forwarded announcements
                    for (const user of forwardToUsers) {
                        if (currentChat.id.user === user) {
                            console.log("[CLIENT] Announcement from forwardedUsers, so do nothing");
                            return;
                        }
                    }
                    let quotedMsg;
                    const currentForwardedAnnouncements = yield (0, misc_1.getAllAnnouncements)();
                    // console.log('[CLIENT] Recognized an announcement');
                    if (currentForwardedAnnouncements &&
                        !currentForwardedAnnouncements.includes(msg.body)) {
                        yield (0, misc_1.addAnnouncement)(msg.body);
                        if (msg.hasQuotedMsg) {
                            quotedMsg = yield msg.getQuotedMessage();
                            targetChats.forEach((chat) => __awaiter(void 0, void 0, void 0, function* () { return yield quotedMsg.forward(chat); }));
                        }
                        targetChats.forEach((chat) => __awaiter(void 0, void 0, void 0, function* () { return yield msg.forward(chat); }));
                        targetChats.forEach((chat) => __awaiter(void 0, void 0, void 0, function* () {
                            return yield chat.sendMessage(`Forwarded announcement from *${currentChat.name}*`);
                        }));
                    }
                    else {
                        console.log("[CLIENT] Repeated announcement");
                    }
                }
            }
            //* For links
            else if (msg.links.length) {
                const response = yield helperForInit(msg);
                if (response) {
                    const { forwardToUsers, targetChats } = response;
                    // Don't forward links from chats which receive forwarded links
                    for (const user of forwardToUsers) {
                        if (currentChat.id.user === user) {
                            console.log("[CLIENT] Link from forwardedUsers, so do nothing");
                            return;
                        }
                    }
                    const links = msg.links;
                    // Don't forward a link if it doesn't have https...to avoid letting stuff like "awww...lol",  "hey.me"
                    // and insecure links from leaking through
                    for (const singleLink of links) {
                        if (!singleLink.link.includes("https"))
                            return;
                    }
                    // console.log('[CLIENT]', links);
                    let currentForwardedLinks = yield (0, misc_1.getAllLinks)();
                    currentForwardedLinks =
                        currentForwardedLinks &&
                            currentForwardedLinks.map((link) => link.toLowerCase());
                    // console.log('[CLIENT]', currentForwardedLinks)
                    const blacklistedStuff = data_1.LINKS_BLACKLIST.concat(data_1.WORDS_IN_LINKS_BLACKLIST);
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
                    if (currentForwardedLinks &&
                        !currentForwardedLinks.includes(msg.body.toLowerCase())) {
                        yield (0, misc_1.addLink)(msg.body);
                        targetChats.forEach((chat) => __awaiter(void 0, void 0, void 0, function* () { return yield msg.forward(chat); }));
                        targetChats.forEach((chat) => __awaiter(void 0, void 0, void 0, function* () {
                            return yield chat.sendMessage(`Forwarded link from *${currentChat.name}*`);
                        }));
                    }
                    else {
                        console.log("[CLIENT] Repeated link");
                    }
                }
            }
        }));
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
}
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.send("<h1>This server is powered by " + helpers_1.BOT_PUSHNAME + " bot</h1>");
});
app.listen(port, () => console.log(`[SERVER] Server is running on port ${port}`));
// All other pages should be returned as error pages
app.all("*", (req, res) => {
    res
        .status(404)
        .send("<h1>Sorry, this page does not exist!</h1><br><a href='/'>Back to Home</a>");
});
