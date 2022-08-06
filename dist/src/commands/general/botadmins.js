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
    const allContacts = yield client.getContacts();
    const allBotAdmins = yield (0, misc_1.getAllBotAdmins)();
    const foundBotAdmins = [];
    for (const con of allContacts) {
        for (const bot_admin of allBotAdmins) {
            if (con.number === bot_admin)
                foundBotAdmins.push(con);
        }
    }
    const botReply = yield msg.reply("〘✪ 𝔹𝕠𝕥 𝕒𝕕𝕞𝕚𝕟𝕤 ✪〙\n\n" +
        foundBotAdmins
            .map((admin) => `➣ ${admin.number} ~ ${(admin === null || admin === void 0 ? void 0 : admin.pushname) || ""}\n`)
            .join(""));
    if (!isBotAdmin) {
        if ((0, helpers_1.checkForChance)(3)) {
            // 30% chance this message is sent to non-bot admins
            yield botReply.reply("Reach out to any of them if you need any help 🐦"); // It doesn't quote  `botReply` but it still sends the message so I'll take it 😢👍🏻
        }
    }
});
module.exports = {
    name: "botadmins",
    description: "Get all bot admins 👮🏽‍♂️👮🏽‍♀️",
    alias: ["badmins", "badmin", "botadmin"],
    category: "everyone",
    help: `To use this command, type:\n${helpers_1.currentPrefix}botadmins*`,
    execute,
};
