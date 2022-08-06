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
    const msgArg = (0, helpers_1.extractCommandArgs)(msg)[0];
    const contact = yield msg.getContact();
    const curChat = yield msg.getChat();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    const classGroupsInDB = new Set(yield (0, misc_1.getAllClassGroups)());
    if (!isBotAdmin) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    // Make sure only a valid group can be added as a class group
    if (!curChat.isGroup) {
        yield msg.reply("Sorry can't do this in a chat that is not a group");
        return;
    }
    switch (msgArg) {
        case "add":
        case "-a":
            if (classGroupsInDB.has(curChat.id.user)) {
                yield msg.reply("This group has already been added as an official class group.\n\nNow make me group admin🐦");
                return;
            }
            yield (0, misc_1.addClassGroup)(curChat.id.user);
            yield msg.reply("This group has been successfully added as an official class group ✅");
            break;
        case "remove":
        case "-r":
            if (!classGroupsInDB.has(curChat.id.user)) {
                yield msg.reply("This group was not added as an official class group in the first place 😕");
                return;
            }
            yield (0, misc_1.removeClassGroup)(curChat.id.user);
            yield msg.reply("This group is no longer recognized as a class group ✅");
            break;
        default:
            yield msg.reply(`Please add valid arguments: \nEg:\n*${helpers_1.currentPrefix}classgroup add*\n*${helpers_1.currentPrefix}classgroup remove*`);
            break;
    }
});
module.exports = {
    name: "classgroup",
    description: "Add/remove a class group 🏫",
    alias: ["cg", "clg"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}classgroup add* or\n*${helpers_1.currentPrefix}classgroup remove*`,
    execute,
};
