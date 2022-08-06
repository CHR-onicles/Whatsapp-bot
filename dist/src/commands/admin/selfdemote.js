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
    const contact = yield msg.getContact();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    if (contact.id.user !== process.env.GRANDMASTER) {
        yield msg.reply("This is specially reserved for the Grandmaster only 🐦");
        return;
    }
    if (isBotAdmin) {
        yield (0, misc_1.removeBotAdmin)(contact.id.user);
        yield msg.reply("You've successfully demoted yourself to a regular user ✅");
    }
    else {
        yield msg.reply("Err... you're kinda already a regular user 🐦");
    }
});
module.exports = {
    name: "selfdemote",
    description: "Demote yourself(Grandmaster only) to be a regular user 👮🏽‍♂️❌",
    alias: ["sdem"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}selfdemote*`,
    execute,
};
