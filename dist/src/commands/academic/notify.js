"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../interfaces");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const misc_1 = require("../../models/misc");
const data_1 = require("../../utils/data");
const helpers_1 = require("../../utils/helpers");
const execute = (client, msg, args) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const { isListResponse, lastPrefixUsed } = args;
    const msgArgs = (0, helpers_1.extractCommandArgs)(msg)[0];
    const contact = yield msg.getContact();
    const curChat = yield msg.getChat();
    const chatFromContact = yield contact.getChat();
    const response = yield (0, misc_1.getUsersToNotifyForClass)();
    if (response) {
        const { multimedia, expert, concurrent, mobile } = response;
        const totalUsers = [...multimedia, ...expert, ...concurrent, ...mobile];
        if (isListResponse) {
            if (msg.selectedRowId) {
                const selectedRowId = msg.selectedRowId.split("-")[1];
                // console.log('[NOTIFY CMD] selected row id:', selectedRowId)
                // Helper function to solely for refactoring
                const helper = () => __awaiter(void 0, void 0, void 0, function* () {
                    if (totalUsers.includes(contact.id.user)) {
                        yield msg.reply("You are already being notified for class🐦");
                        console.log("[NOTIFY CMD] Already subscribed, from List Response");
                        return;
                    }
                    if (curChat.isGroup) {
                        yield msg.react((0, helpers_1.pickRandomReply)(data_1.REACT_EMOJIS));
                    }
                    yield chatFromContact.sendMessage(`🔔 You will now be notified periodically for class, using *${selectedRowId[0] === "1"
                        ? "Multimedia Applications"
                        : selectedRowId[0] === "2"
                            ? "Expert Systems"
                            : selectedRowId[0] === "3"
                                ? "Concurrent & Distributed Systems"
                                : "Mobile Computing"}* as your elective.\n\nExpect me🐦`);
                    yield (0, misc_1.addUserToBeNotified)(contact.id.user, selectedRowId[0]);
                    (0, helpers_1.stopAllOngoingNotifications)();
                    yield (0, helpers_1.startNotificationCalculation)(client);
                });
                switch (selectedRowId) {
                    case "1_dev":
                        if (helpers_1.currentEnv !== "development")
                            break;
                        helper();
                        // console.log([NOTIFY CMD] 'add user to be notified from 1_dev');
                        break;
                    case "1_prod":
                        if (helpers_1.currentEnv !== "production")
                            break;
                        helper();
                        // console.log('[NOTIFY CMD] add user to be notified from 1_prod');
                        break;
                    case "2_dev":
                        if (helpers_1.currentEnv !== "development")
                            break;
                        helper();
                        // console.log('[NOTIFY CMD] add user to be notified from 2_dev');
                        break;
                    case "2_prod":
                        if (helpers_1.currentEnv !== "production")
                            break;
                        helper();
                        // console.log('[NOTIFY CMD] add user to be notified from 2_prod');
                        break;
                    case "3_dev":
                        if (helpers_1.currentEnv !== "development")
                            break;
                        helper();
                        // console.log('[NOTIFY CMD] add user to be notified from 3_dev');
                        break;
                    case "3_prod":
                        if (helpers_1.currentEnv !== "production")
                            break;
                        helper();
                        // console.log('[NOTIFY CMD] add user to be notified from 3_prod');
                        break;
                    case "4_dev":
                        if (helpers_1.currentEnv !== "development")
                            break;
                        helper();
                        // console.log('[NOTIFY CMD] add user to be notified from 3_dev');
                        break;
                    case "4_prod":
                        if (helpers_1.currentEnv !== "production")
                            break;
                        helper();
                        // console.log('[NOTIFY CMD] add user to be notified from 3_prod');
                        break;
                    default:
                        break;
                }
            }
            args.isListResponse = false;
            return;
        }
        console.log("[NOTIFY CMD] msg args:", msgArgs);
        switch (msgArgs) {
            case "enable":
            case "-e":
                if (totalUsers.includes(contact.id.user)) {
                    yield msg.reply("You are already being notified for class🐦");
                    console.log("[NOTIFY CMD] Already subscribed from case enable");
                    return;
                }
                const list = new whatsapp_web_js_1.List("\nMake a choice from the list of electives", "See electives", [
                    {
                        title: "Commands available to everyone",
                        rows: [
                            {
                                id: lastPrefixUsed === process.env.DEV_PREFIX
                                    ? "notify-1_dev"
                                    : "notify-1_prod",
                                title: "Multimedia Applications",
                                description: "For those offering Multimedia Applications",
                            },
                            {
                                id: lastPrefixUsed === process.env.DEV_PREFIX
                                    ? "notify-2_dev"
                                    : "notify-2_prod",
                                title: "Expert Systems",
                                description: "For those offering Expert Systems",
                            },
                            {
                                id: lastPrefixUsed === process.env.DEV_PREFIX
                                    ? "notify-3_dev"
                                    : "notify-3_prod",
                                title: "Conc & Distributed Systems",
                                description: "For those offering Concurrent & Distributed Systems",
                            },
                            {
                                id: lastPrefixUsed === process.env.DEV_PREFIX
                                    ? "notify-4_dev"
                                    : "notify-4_prod",
                                title: "Mobile Computing",
                                description: "For those offering Mobile Computing",
                            },
                        ],
                    },
                ], "What elective do you offer?", "Powered by Ethereal bot");
                !isListResponse && (yield msg.reply(list));
                break;
            case "disable":
            case "-d":
                if (totalUsers.includes(contact.id.user)) {
                    if (multimedia.includes(contact.id.user)) {
                        yield (0, misc_1.removeUserToBeNotified)(contact.id.user, "MA");
                    }
                    else if (expert.includes(contact.id.user)) {
                        yield (0, misc_1.removeUserToBeNotified)(contact.id.user, "E");
                    }
                    else if (concurrent.includes(contact.id.user)) {
                        yield (0, misc_1.removeUserToBeNotified)(contact.id.user, "C");
                    }
                    else if (mobile.includes(contact.id.user)) {
                        yield (0, misc_1.removeUserToBeNotified)(contact.id.user, "MC");
                    }
                    msg.reply("I won't remind you to go to class anymore ✅");
                    (0, helpers_1.stopAllOngoingNotifications)();
                    yield (0, helpers_1.startNotificationCalculation)(client);
                }
                else {
                    yield msg.reply("You weren't subscribed in the first place 🤔");
                }
                break;
            default:
                yield msg.reply(`You missed some arguments!\nCorrect syntax:\n*${helpers_1.currentPrefix}notify enable* or\n*${helpers_1.currentPrefix}notify disable*`);
                break;
        }
    }
});
module.exports = {
    name: "notify",
    description: "Turn on/off reminders for class 🔔",
    alias: [],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}notify enable* or\n*${helpers_1.currentPrefix}notify disable*`,
    execute,
};
