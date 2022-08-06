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
const execute = (client, msg, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const msgArgs = (0, helpers_1.extractCommandArgs)(msg);
    const curChat = yield msg.getChat();
    const contact = yield msg.getContact();
    const chatFromContact = yield contact.getChat();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    let text = `Hello there I'm *${helpers_1.BOT_PUSHNAME}*🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n`;
    if (curChat.isGroup) {
        yield msg.react((0, helpers_1.pickRandomReply)(data_1.REACT_EMOJIS));
    }
    // If user just types help with no arguments, show all commands
    if (!msgArgs.length) {
        client.commands && ((_a = client.commands.get("menu")) === null || _a === void 0 ? void 0 : _a.execute(client, msg, args));
    }
    // If user types help with a command as an argument show info for that command
    if (msgArgs.length) {
        const commandName = msgArgs[0];
        if (client.commands && !client.commands.has(commandName)) {
            yield chatFromContact.sendMessage("That command does not exist.");
            return;
        }
        let command = null;
        try {
            command = client.commands && client.commands.get(commandName);
        }
        catch (error) {
            console.error(error);
        }
        if (!isBotAdmin && (command === null || command === void 0 ? void 0 : command.category) === "admin") {
            yield chatFromContact.sendMessage((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
            return;
        }
        else {
            yield chatFromContact.sendMessage(`*Command:* ${helpers_1.currentPrefix}${command === null || command === void 0 ? void 0 : command.name}\n\n` +
                `*Aliases:* ${(command === null || command === void 0 ? void 0 : command.alias.length)
                    ? command === null || command === void 0 ? void 0 : command.alias.map((alias) => alias).join(", ")
                    : "None"}\n\n` +
                `*Description:* ${command === null || command === void 0 ? void 0 : command.description}\n\n` +
                `*Usage:*\n${command === null || command === void 0 ? void 0 : command.help}`);
        }
    }
    if (isBotAdmin) {
        text +=
            "\n\nPS:  You're a *bot admin*, so you have access to _special_ commands 🤫";
    }
});
module.exports = {
    name: "help",
    description: "Give more information about specific commands 💡",
    alias: ["h"],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}help* or\n*${helpers_1.currentPrefix}help <command>*`,
    execute,
};
