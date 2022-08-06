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
    const contact = yield msg.getContact();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    if ((yield (0, misc_1.getMutedStatus)()) === true) {
        if (isBotAdmin) {
            yield msg.reply((0, helpers_1.pickRandomReply)(data_1.UNMUTE_REPLIES));
            yield (0, misc_1.unmuteBot)();
        }
    }
    else {
        if (!isBotAdmin) {
            yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
            return;
        }
        yield msg.reply(`Haven't been muted yet 🐦`);
    }
});
module.exports = {
    name: "unmute",
    description: "Unmute the bot 🙂",
    alias: ["speak", "talk"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}unmute*`,
    execute,
};
