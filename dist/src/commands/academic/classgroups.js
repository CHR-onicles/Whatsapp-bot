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
require("whatsapp-web.js");
const misc_1 = require("../../models/misc");
const data_1 = require("../../utils/data");
const helpers_1 = require("../../utils/helpers");
const execute = (client, msg) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const contact = yield msg.getContact();
    const curChat = yield msg.getChat();
    const chatFromContact = yield contact.getChat();
    const allChats = yield client.getChats();
    const classGroupsInDB = new Set(yield (0, misc_1.getAllClassGroups)());
    let reply = "▄▀▄  ℂ𝕃𝔸𝕊𝕊 𝔾ℝ𝕆𝕌ℙ𝕊  ▄▀▄\n\n";
    if (!classGroupsInDB.size) {
        yield msg.reply("There are no official class groups stored in the database.");
        return;
    }
    if (curChat.isGroup) {
        yield msg.react((0, helpers_1.pickRandomReply)(data_1.REACT_EMOJIS));
    }
    const classGroups = [];
    const classGroupLinks = [];
    allChats.forEach((chat) => {
        if (chat.isGroup && classGroupsInDB.has(chat.id.user)) {
            classGroups.push(chat);
        }
    });
    for (const group of classGroups) {
        // Can't do this in forEach because it returns nothing for some reason.
        const botChat = group.participants.find((chat) => chat.id.user === client.info.wid.user);
        if (botChat && botChat.isAdmin) {
            const link = yield group.getInviteCode();
            classGroupLinks.push(link);
        }
        else {
            classGroupLinks.push("");
        }
    }
    // possible emojis to use: 🏫🎒
    classGroups.forEach((chat, index) => {
        if (!classGroupLinks[index]) {
            // If bot is not admin send different reply
            reply += `🏫 *${chat.name}*\n_Can't generate group link because I am not an admin here_${index === classGroups.length - 1 ? "" : "\n\n"}`;
        }
        else {
            reply += `🏫 *${chat.name}*\nhttps://chat.whatsapp.com/${classGroupLinks[index]}${index === classGroups.length - 1 ? "" : "\n\n"}`;
        }
    });
    yield chatFromContact.sendMessage(reply); // link preview not supported in MD, whatsapp fault, not library
});
module.exports = {
    name: "classgroups",
    description: "Get all class group links 📱",
    alias: ["cgs", "clgs", "groups"],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}classgroups*`,
    execute,
};
