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
    let userToIgnore = (0, helpers_1.extractCommandArgs)(msg)[0];
    const allContacts = yield client.getContacts();
    const contact = yield msg.getContact();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    const blacklistedUsers = new Set(yield (0, misc_1.getBlacklistedUsers)());
    // Don't do anything if run by a user who is not a bot admin.
    if (!isBotAdmin) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    if (!userToIgnore) {
        yield msg.reply("Please supply a valid user");
        return;
    }
    // Make sure the user is pinging someone
    if (userToIgnore[0] !== "@") {
        yield msg.reply("Please make sure to ping a valid user");
        return;
    }
    const foundContact = allContacts.find((con) => con.number === userToIgnore);
    userToIgnore = userToIgnore.slice(1);
    if (blacklistedUsers.has(userToIgnore)) {
        yield msg.reply("This user is already blacklisted 😒");
        return;
    }
    else {
        // Prevent trying to blacklist the bot.
        if (userToIgnore === client.info.wid.user) {
            yield msg.reply("I'm the one doing the ignoring here fam 🐦");
            return;
        }
        else if (userToIgnore === process.env.GRANDMASTER) {
            // Prevent trying to blacklist the owner.
            const isGMAdmin = yield (0, helpers_1.isUserBotAdmin)(userToIgnore);
            if (isGMAdmin) {
                yield msg.reply("Grandmaster cannot be blacklisted 🐦");
                return;
            }
        }
        const isFoundUserBotAdmin = yield (0, helpers_1.isUserBotAdmin)(userToIgnore);
        if (isFoundUserBotAdmin) {
            yield msg.reply("A bot admin cannot be blacklisted 😕"); // todo: Add more replies for this later
            return;
        }
        else {
            yield (0, misc_1.addBlacklistedUser)(userToIgnore);
            if (foundContact)
                yield contact.block();
            yield msg.reply("User will now be ignored for eternity ✅"); //todo: Add more replies for this later
        }
    }
});
module.exports = {
    name: "ignore",
    description: "Blacklist a user ☠",
    alias: ["ig"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}ignore @user*`,
    execute,
};
