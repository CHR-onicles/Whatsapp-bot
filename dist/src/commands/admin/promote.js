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
    const userToPromote = (0, helpers_1.extractCommandArgs)(msg)[0];
    const curChat = yield msg.getChat();
    const contact = yield msg.getContact();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    // Don't do anything if run by a user who is not a bot admin.
    if (!isBotAdmin) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    if (!userToPromote) {
        yield msg.reply("Please supply a valid user");
        return;
    }
    // Make sure the user is using this command in a group chat in order
    // to be able to ping another user.
    if (!curChat.isGroup) {
        yield msg.reply("Sorry can't do this in a chat that is not a group.");
        return;
    }
    // Make sure the user is pinging someone
    if (userToPromote[0] !== "@") {
        yield msg.reply("Please make sure to ping a valid user");
        return;
    }
    const foundUser = curChat.participants.find((user) => user.id.user === userToPromote.slice(1));
    if (foundUser) {
        // The bot shouldn't be promoted lol.
        if (foundUser.id.user === client.info.wid.user) {
            yield msg.reply((0, helpers_1.pickRandomReply)(data_1.PROMOTE_BOT_REPLIES));
            return;
        }
        else if (foundUser.id.user === process.env.GRANDMASTER) {
            const isGMAdmin = yield (0, helpers_1.isUserBotAdmin)(foundUser);
            if (isGMAdmin) {
                yield msg.reply((0, helpers_1.pickRandomReply)(data_1.PROMOTE_GRANDMASTER_REPLIES));
                return;
            }
        }
        const isFoundUserBotAdmin = yield (0, helpers_1.isUserBotAdmin)(foundUser);
        if (isFoundUserBotAdmin) {
            yield msg.reply("This user is already a bot admin 😕"); // todo: Add more replies for this later
            return;
        }
        else {
            yield (0, misc_1.addBotAdmin)(foundUser.id.user);
            yield msg.reply("Bot admin successfully added! ✅"); //todo: Add more replies for this later
        }
    }
    else {
        yield msg.reply("Sorry, I couldn't find that user ☹");
        return;
    }
});
module.exports = {
    name: "promote",
    description: "Promote a user to be a bot admin 👮🏽‍♂️",
    alias: ["prom"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}promote @user*`,
    execute,
};
