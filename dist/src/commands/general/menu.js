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
    const contact = yield msg.getContact();
    const chatFromContact = yield contact.getChat();
    const curChat = yield msg.getChat();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    const isGrandmaster = contact.id.user === process.env.GRANDMASTER;
    if (curChat.isGroup) {
        yield msg.react((0, helpers_1.pickRandomReply)(data_1.REACT_EMOJIS));
    }
    // Have to keep this array here because I want the most updated list of super Admins
    // every time this is needed.
    let startID = 0; // dynamic ID to be used for whatsapp list
    const tempRows = [];
    if (client.commands) {
        client.commands.forEach((value, key) => {
            startID++;
            if (value.name === "notify") {
                tempRows.push({
                    id: `menu-${startID}`,
                    title: helpers_1.currentPrefix + value.name + " enable",
                    description: "Turn on notifications for class",
                });
                startID++;
                tempRows.push({
                    id: `menu-${startID}`,
                    title: helpers_1.currentPrefix + value.name + " disable",
                    description: "Turn off notifications for class",
                });
                return;
            }
            if (!isBotAdmin && value.category === "everyone") {
                tempRows.push({
                    id: `menu-${startID}`,
                    title: helpers_1.currentPrefix + value.name,
                    description: value.description,
                });
            }
            else if (isBotAdmin) {
                if ((value.name === "selfpromote" || value.name === "selfdemote") &&
                    contact.id.user !== process.env.GRANDMASTER) {
                    return; // kinda acts like "continue" I guess
                }
                tempRows.push({
                    id: `menu-${startID}`,
                    title: helpers_1.currentPrefix + value.name,
                    description: value.description,
                });
            }
        });
    }
    tempRows.sort((a, b) => a.title.localeCompare(b.title));
    const list = new whatsapp_web_js_1.List("\nThis is a list of commands the bot can execute", "See commands", [
        {
            title: `Commands available to ${isBotAdmin
                ? isGrandmaster
                    ? "Grandmaster"
                    : "bot admins"
                : "everyone"}`,
            rows: tempRows,
        },
    ], isBotAdmin
        ? (0, helpers_1.pickRandomReply)(data_1.PING_REPLIES.botAdmin.concat(data_1.PING_REPLIES.everyone))
        : (0, helpers_1.pickRandomReply)(data_1.PING_REPLIES.everyone), "Powered by Ethereal bot");
    if (curChat.isGroup) {
        yield chatFromContact.sendMessage(list);
    }
    else if (!curChat.isGroup) {
        yield msg.reply(list);
    }
});
module.exports = {
    name: "menu",
    description: "Get list of commands ⚙",
    alias: ["commands", "command", "coms", "comms", "menus"],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}menu* or ping the bot in a group chat`,
    execute,
};
