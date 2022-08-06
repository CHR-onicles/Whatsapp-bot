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
    let quotedMsg = null;
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    if (!isBotAdmin) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    const chat = (yield msg.getChat());
    let text = "";
    const mentions = [];
    if (chat.participants) {
        for (const participant of chat.participants) {
            const newContact = yield client.getContactById(participant.id._serialized);
            if (newContact.id.user.includes(contact.id.user) ||
                newContact.id.user.includes(client.info.wid.user))
                continue;
            mentions.push(newContact);
            text += `@${participant.id.user} `;
        }
        if (!mentions.length) {
            yield msg.reply("No other person to ping apart from you and me :(");
            return;
        }
        if (msg.hasQuotedMsg) {
            quotedMsg = yield msg.getQuotedMessage();
            yield quotedMsg.reply(text, "", { mentions });
        }
        else
            yield msg.reply(text, "", { mentions });
    }
    else {
        yield msg.reply("Can't do this - This is not a  group chat 😗");
        console.log("[EVERYONE CMD] Called " +
            helpers_1.currentPrefix +
            "everyone in a chat that is not a group chat");
    }
});
module.exports = {
    name: "everyone",
    description: "Ping everyone 🔊",
    alias: ["all", "every", "e"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}everyone*`,
    execute,
};
