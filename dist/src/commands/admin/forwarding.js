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
//! THIS COMMAND IS TEMPORARY AND WILL BE REMOVED ONCE
//! THE LOGIC IS FLESHED OUT PROPERLY FOR USERS
const execute = (client, msg, args) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const msgArgs = (0, helpers_1.extractCommandArgs)(msg)[0];
    const contact = yield msg.getContact();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    const curForwardingStatus = yield (0, misc_1.getForwardingStatus)();
    if (!isBotAdmin) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    switch (msgArgs) {
        case "status":
        case "stats":
        case "-s":
            yield msg.reply(`Forwarding of important messages is ${curForwardingStatus ? "ON ✅" : "OFF ❌"}`);
            break;
        case "enable":
        case "-e":
            yield (0, misc_1.enableForwarding)();
            yield msg.reply("Forwarding of important messages is enabled ✅");
            break;
        case "disable":
        case "-d":
            yield (0, misc_1.disableForwarding)();
            yield msg.reply("Forwarding of important messages is disabled ❌");
            break;
        default:
            yield msg.reply(`Please add valid arguments:\nEg:\n*${helpers_1.currentPrefix}forwarding status*\n*${helpers_1.currentPrefix}forwarding enable*\n*${helpers_1.currentPrefix}forwarding disable*`);
            break;
    }
});
module.exports = {
    name: "forwarding",
    description: "Turn on/off forwarding of announcements and links 📲",
    alias: ["fwd"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}forwarding status*\n*${helpers_1.currentPrefix}forwarding enable* or\n*${helpers_1.currentPrefix}forwarding disable*`,
    execute,
};
