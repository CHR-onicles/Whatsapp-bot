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
    let userToAcknowledge = (0, helpers_1.extractCommandArgs)(msg)[0];
    const allContacts = yield client.getContacts();
    const contact = yield msg.getContact();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    const blacklistedUsers = new Set(yield (0, misc_1.getBlacklistedUsers)());
    const foundContact = allContacts.find((con) => con.number === userToAcknowledge);
    // Don't do anything if run by a user who is not a bot admin.
    if (!isBotAdmin) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    if (!userToAcknowledge) {
        yield msg.reply("Please supply a valid user");
        return;
    }
    // Make sure the user is pinging someone
    if (userToAcknowledge[0] !== "@") {
        yield msg.reply("Please make sure to ping a valid user");
        return;
    }
    userToAcknowledge = userToAcknowledge.slice(1);
    if (blacklistedUsers.has(userToAcknowledge)) {
        // Prevent trying to acknowledge the bot.
        if (userToAcknowledge === client.info.wid.user) {
            yield msg.reply("I'm the one doing the acknowledging here fam 🐦");
            return;
        }
        else if (userToAcknowledge === process.env.GRANDMASTER) {
            // Prevent trying to blacklist the owner.
            const isGMAdmin = yield (0, helpers_1.isUserBotAdmin)(userToAcknowledge);
            if (isGMAdmin) {
                yield msg.reply("Grandmaster is already acknowledged 🐦");
                return;
            }
        }
        const isFoundUserBotAdmin = yield (0, helpers_1.isUserBotAdmin)(userToAcknowledge);
        if (isFoundUserBotAdmin) {
            yield msg.reply("A bot admin is already acknowledged 😕"); // todo: Add more replies for this later
            return;
        }
        else {
            yield (0, misc_1.removeBlacklistedUser)(userToAcknowledge);
            if (foundContact)
                yield contact.unblock();
            yield msg.reply("User will now be acknowledged ✅"); //todo: Add more replies for this later
        }
    }
    else {
        yield msg.reply("This user was not blacklisted 😒");
        return;
    }
});
module.exports = {
    name: "acknowledge",
    description: "Remove a user from blacklist 💫",
    alias: ["ack", "ak"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}acknowledge @user*`,
    execute,
};
