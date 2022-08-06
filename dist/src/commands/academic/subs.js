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
    const allContacts = yield client.getContacts();
    const contact = yield msg.getContact();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    if (!isBotAdmin) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    const response = yield (0, misc_1.getUsersToNotifyForClass)();
    if (response) {
        const { multimedia, expert, concurrent, mobile } = response;
        // const [multimediaContacts, expertContacts, concurrentContacts, mobileContacts] = [[], [], [], []];
        const multimediaContacts = [];
        const expertContacts = [];
        const concurrentContacts = [];
        const mobileContacts = [];
        for (const con of allContacts) {
            for (const sub of multimedia) {
                if (con.number === sub)
                    multimediaContacts.push(con);
            }
            for (const sub of expert) {
                if (con.number === sub)
                    expertContacts.push(con);
            }
            for (const sub of concurrent) {
                if (con.number === sub)
                    concurrentContacts.push(con);
            }
            for (const sub of mobile) {
                if (con.number === sub)
                    mobileContacts.push(con);
            }
        }
        yield msg.reply("The following users have agreed to be notified for class:\n\n" +
            "*Multimedia Applications:*\n" +
            (multimediaContacts.length
                ? multimediaContacts
                    .map((user) => `→ ${user.number} ~ ${(user === null || user === void 0 ? void 0 : user.pushname) || ""}\n`)
                    .join("")
                : "_None_\n") +
            "\n" +
            "*Expert Systems:*\n" +
            (expertContacts.length
                ? expertContacts
                    .map((user) => `→ ${user.number} ~ ${(user === null || user === void 0 ? void 0 : user.pushname) || ""}\n`)
                    .join("")
                : "_None_\n") +
            "\n" +
            "*Conc & Dist Systems:*\n" +
            (concurrentContacts.length
                ? concurrentContacts
                    .map((user) => `→ ${user.number} ~ ${(user === null || user === void 0 ? void 0 : user.pushname) || ""}\n`)
                    .join("")
                : "_None_\n") +
            "\n" +
            "*Mobile Computing:*\n" +
            (mobileContacts.length
                ? mobileContacts
                    .map((user) => `→ ${user.number} ~ ${(user === null || user === void 0 ? void 0 : user.pushname) || ""}\n`)
                    .join("")
                : "_None_\n"));
    }
});
module.exports = {
    name: "subs",
    description: "Get users subscribed for class notifications 👯‍♂️",
    alias: ["sub"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}subs*`,
    execute,
};
