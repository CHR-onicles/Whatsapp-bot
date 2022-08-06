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
const helpers_1 = require("../../utils/helpers");
const execute = (client, msg) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const groupChat = yield msg.getChat();
    // console.log([GROUPLINK CMD] groupChat.participants);
    if (!groupChat.isGroup) {
        yield msg.reply("This is not a group chat!");
        return;
    }
    const botChatObj = groupChat.participants.find((chatObj) => chatObj.id.user === client.info.wid.user);
    if (botChatObj && !botChatObj.isAdmin) {
        yield msg.reply("I am not an admin in this group, so I can't do this");
        return;
    }
    const invite = "https://chat.whatsapp.com/" + (yield groupChat.getInviteCode());
    yield msg.reply(invite, "", { linkPreview: true }); // link preview is not supported on Multi-Device...whatsapp fault, not whatsapp-web.js library
});
module.exports = {
    name: "grouplink",
    description: "Get the current group's invite link 📱",
    alias: ["gl", "glink"],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}grouplink*`,
    execute,
};
