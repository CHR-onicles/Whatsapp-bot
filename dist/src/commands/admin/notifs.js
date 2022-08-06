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
    const args = (0, helpers_1.extractCommandArgs)(msg);
    const contact = yield msg.getContact();
    const isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    if (!isBotAdmin) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    // Helper function to reduce repetition
    const helper = (courseCode, enableStatus) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, misc_1.enableOrDisableNotificationForCourse)(courseCode, enableStatus);
        yield (0, helpers_1.stopAllOngoingNotifications)();
        yield (0, helpers_1.startNotificationCalculation)(client);
        //? Maybe move this to data.js ?
        const courses = {
            CSCD416: "System Programming",
            CSCD418: "Computer Systems Security",
            CSCD422: "Human Computer Interaction",
            CSCD424: "Management Principles",
            CSCD400: "Project",
            CSCD426: "Multimedia Applications",
            CSCD428: "Expert Systems",
            CSCD432: "Concurrent & Distributed Systems",
            CSCD434: "Mobile Computing",
        };
        yield msg.reply(`Notifications for *${courses[courseCode]}* have been turned *${enableStatus ? "ON" : "OFF"}*`);
    });
    switch (args.join(" ").trim()) {
        case "status":
        case "stats":
        case "-s":
            // const response =
            const notifsStatus = yield (0, misc_1.getNotificationStatus)();
            if (notifsStatus) {
                if (notifsStatus &&
                    Object.values(notifsStatus).every((elem) => !elem)) {
                    yield msg.reply("All notifications for today's classes are *OFF* ❌");
                }
                else {
                    let reply = [];
                    const { CSCD416, CSCD418, CSCD422, CSCD424, CSCD426, CSCD428, CSCD432, CSCD434, } = notifsStatus;
                    reply.push(`[🔰] *CSCD416 notification status:* ${CSCD416 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD418 notification status:* ${CSCD418 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD422 notification status:* ${CSCD422 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD424 notification status:* ${CSCD424 ? "✅" : "❌"}`);
                    // reply.push(`[🔰] *CSCD400 notification status:* ${CSCD400 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD426 notification status:* ${CSCD426 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD428 notification status:* ${CSCD428 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD432 notification status:* ${CSCD432 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD434 notification status:* ${CSCD434 ? "✅" : "❌"}`);
                    yield msg.reply(reply.join("\n"));
                }
            }
            break;
        case "enable all":
        case "-e -a":
            yield (0, misc_1.enableOrDisableAllNotifications)(true);
            (0, helpers_1.startNotificationCalculation)(client);
            yield msg.reply("All notifications have been turned *ON* for today.");
            break;
        case "enable CSCD416":
        case "enable cscd416":
        case "-e CSCD416":
        case "-e c416":
        case "-e C416":
            yield helper("CSCD416", true);
            break;
        case "enable CSCD418":
        case "enable cscd418":
        case "-e CSCD418":
        case "-e c418":
        case "-e C418":
            yield helper("CSCD418", true);
            break;
        case "enable CSCD422":
        case "enable cscd422":
        case "-e CSCD422":
        case "-e c422":
        case "-e C422":
            yield helper("CSCD422", true);
            break;
        case "enable CSCD424":
        case "enable cscd424":
        case "-e CSCD424":
        case "-e c424":
        case "-e C424":
            yield helper("CSCD424", true);
            break;
        // case 'enable CSCD400':
        // case 'enable cscd400':
        // case '-e CSCD400':
        // case '-e c400':
        // case '-e C400':
        //     await helper('CSCD400', true);
        //     break;
        case "enable CSCD426":
        case "enable cscd426":
        case "-e CSCD426":
        case "-e c426":
        case "-e C426":
            yield helper("CSCD426", true);
            break;
        case "enable CSCD428":
        case "enable cscd428":
        case "-e CSCD428":
        case "-e c428":
        case "-e C428":
            yield helper("CSCD428", true);
            break;
        case "enable CSCD432":
        case "enable cscd432":
        case "-e CSCD432":
        case "-e c432":
        case "-e C432":
            yield helper("CSCD432", true);
            break;
        case "enable CSCD434":
        case "enable cscd434":
        case "-e CSCD434":
        case "-e c434":
        case "-e C434":
            yield helper("CSCD434", true);
            break;
        // ----------------------------------------------------------
        case "disable all":
        case "-d -a":
            yield (0, misc_1.enableOrDisableAllNotifications)(false);
            (0, helpers_1.stopAllOngoingNotifications)();
            yield msg.reply("All notifications have been turned *OFF* for today.");
            break;
        case "disable CSCD416":
        case "disable cscd416":
        case "-d CSCD416":
        case "-d c416":
        case "-d C416":
            yield helper("CSCD416", false);
            break;
        case "disable CSCD418":
        case "disable cscd418":
        case "-d CSCD418":
        case "-d c418":
        case "-d C418":
            yield helper("CSCD418", false);
            break;
        case "disable CSCD422":
        case "disable cscd422":
        case "-d CSCD422":
        case "-d c422":
        case "-d C422":
            yield helper("CSCD422", false);
            break;
        case "disable CSCD424":
        case "disable cscd424":
        case "-d CSCD424":
        case "-d c424":
        case "-d C424":
            yield helper("CSCD424", false);
            break;
        // case 'disable CSCD400':
        // case 'disable cscd400':
        // case '-d CSCD400':
        // case '-d c400':
        // case '-d C400':
        //     await helper('CSCD400', false);
        //     break;
        case "disable CSCD426":
        case "disable cscd426":
        case "-d CSCD426":
        case "-d c426":
        case "-d C426":
            yield helper("CSCD426", false);
            break;
        case "disable CSCD428":
        case "disable cscd428":
        case "-d CSCD428":
        case "-d c428":
        case "-d C428":
            yield helper("CSCD428", false);
            break;
        case "disable CSCD432":
        case "disable cscd432":
        case "-d CSCD432":
        case "-d c432":
        case "-d C432":
            yield helper("CSCD432", false);
            break;
        case "disable CSCD434":
        case "disable cscd434":
        case "-d CSCD434":
        case "-d c434":
        case "-d C434":
            yield helper("CSCD434", false);
            break;
        default:
            yield msg.reply(`Please add valid arguments: \nEg:\n*${helpers_1.currentPrefix}notifs status*\n*${helpers_1.currentPrefix}notifs enable CSCD416*\n*${helpers_1.currentPrefix}notifs disable CSCD416*\n*${helpers_1.currentPrefix}notifs enable all*\n*${helpers_1.currentPrefix}notifs disable all*`);
            break;
    }
});
module.exports = {
    name: "notifs",
    description: "Get status or turn on/off class notifications 🔈",
    alias: [],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}notifs status* or\n*${helpers_1.currentPrefix}notifs enable CSCD416* or\n*${helpers_1.currentPrefix}notifs disable CSCD416* or\n*${helpers_1.currentPrefix}notifs enable all* or\n*${helpers_1.currentPrefix}notifs disable all*`,
    execute,
};
