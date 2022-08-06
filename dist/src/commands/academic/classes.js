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
    const contact = yield msg.getContact();
    const chatFromContact = yield contact.getChat();
    const curChat = yield msg.getChat();
    const response = yield (0, misc_1.getUsersToNotifyForClass)();
    let text = "";
    if (curChat.isGroup) {
        yield msg.react((0, helpers_1.pickRandomReply)(data_1.REACT_EMOJIS));
    }
    // refactored repeated code into local function
    const helperForAllClassesReply = (text, elective) => __awaiter(void 0, void 0, void 0, function* () {
        text += (0, helpers_1.allClassesReply)(data_1.ALL_CLASSES, elective, text);
        yield chatFromContact.sendMessage(text);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            const temp = (0, helpers_1.pickRandomWeightedMessage)(data_1.FOOTNOTES);
            temp && (yield chatFromContact.sendMessage(temp));
        }), 2000);
    });
    // if the user has already subscribed to be notified, find his elective and send the timetable based on that.
    if (response) {
        const { multimedia, expert, concurrent, mobile } = response;
        if (multimedia.includes(contact.id.user)) {
            helperForAllClassesReply(text, "MA");
            return;
        }
        else if (expert.includes(contact.id.user)) {
            helperForAllClassesReply(text, "E");
            return;
        }
        else if (concurrent.includes(contact.id.user)) {
            helperForAllClassesReply(text, "C");
            return;
        }
        else if (mobile.includes(contact.id.user)) {
            helperForAllClassesReply(text, "MC");
            return;
        }
    }
    const list = new whatsapp_web_js_1.List("\nMake a choice from the list of electives", "See electives", [
        {
            title: "Commands available to everyone",
            rows: [
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "classes-1_dev"
                        : "classes-1_prod",
                    title: "Multimedia Applications",
                    description: "For those offering Multimedia Applications",
                },
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "classes-2_dev"
                        : "classes-2_prod",
                    title: "Expert Systems",
                    description: "For those offering Expert Systems",
                },
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "classes-3_dev"
                        : "classes-3_prod",
                    title: "Conc & Distributed Systems",
                    description: "For those offering Concurrent & Distributed Systems",
                },
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "classes-4_dev"
                        : "classes-4_prod",
                    title: "Mobile Computing",
                    description: "For those offering Mobile Computing",
                },
            ],
        },
    ], "What elective do you offer?", "Powered by Ethereal bot");
    !isListResponse && (yield chatFromContact.sendMessage(list));
    if (isListResponse) {
        let text = "";
        if (msg.selectedRowId) {
            const selectedRowId = msg.selectedRowId.split("-")[1];
            // helper function for prevent redundancy
            const helperFunc = (elective) => __awaiter(void 0, void 0, void 0, function* () {
                text += (0, helpers_1.allClassesReply)(data_1.ALL_CLASSES, elective, text);
                // await msg.reply(text + `\nFrom ${currentEnv} env`);
                yield msg.reply(text);
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    const temp = (0, helpers_1.pickRandomWeightedMessage)(data_1.FOOTNOTES);
                    temp && (yield chatFromContact.sendMessage(temp));
                }), 2000);
            });
            switch (selectedRowId) {
                case "1_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    helperFunc("MA");
                    break;
                case "1_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    helperFunc("MA");
                    break;
                case "2_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    helperFunc("E");
                    break;
                case "2_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    helperFunc("E");
                    break;
                case "3_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    helperFunc("C");
                    break;
                case "3_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    helperFunc("C");
                    break;
                case "4_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    helperFunc("MC");
                    break;
                case "4_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    helperFunc("MC");
                    break;
                default:
                    break;
            }
        }
        args.isListResponse = false; // to prevent evaluating list response when message type is text
    }
});
module.exports = {
    name: "classes",
    description: "Get the classes for the week 📚",
    alias: [],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}classes*, then select your elective`,
    execute,
};
