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
const misc_1 = require("../../models/misc");
const helpers_1 = require("../../utils/helpers");
const os_1 = require("os");
const data_1 = require("../../utils/data");
require("../../interfaces");
require("whatsapp-web.js");
const execute = (client, msg, args) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const { BOT_START_TIME, RUN_FIRST_TIME } = args;
    if (!BOT_START_TIME)
        throw new Error("[STATUS CMD] Invalid Bot Start Time");
    let isBotAdmin = null;
    if (!RUN_FIRST_TIME) {
        // to prevent getting an error when running for the first time
        const contact = yield msg.getContact();
        isBotAdmin = yield (0, helpers_1.isUserBotAdmin)(contact);
    }
    if (!isBotAdmin && !RUN_FIRST_TIME) {
        yield msg.reply((0, helpers_1.pickRandomReply)(data_1.NOT_BOT_ADMIN_REPLIES));
        return;
    }
    // Helper function to run this piece of code on special occasions
    const generateReplies = () => __awaiter(void 0, void 0, void 0, function* () {
        const notifsStatus = yield (0, misc_1.getNotificationStatus)();
        if (notifsStatus) {
            const { CSCD416, CSCD418, CSCD422, CSCD424, CSCD426, CSCD428, CSCD432, CSCD434, } = notifsStatus;
            const isForwardingOn = yield (0, misc_1.getForwardingStatus)();
            const allChats = yield client.getChats();
            const blocked_chats = yield client.getBlockedContacts();
            const { groupChats, private_chats } = allChats.reduce((chats, chat) => {
                if (chat.isGroup)
                    chats.groupChats += 1;
                else
                    chats.private_chats += 1;
                return chats;
            }, { groupChats: 0, private_chats: 0 });
            const allAnnouncements = yield (0, misc_1.getAllAnnouncements)();
            const allLinks = yield (0, misc_1.getAllLinks)();
            const currentTime = new Date();
            const { days, hours, minutes, seconds } = (0, helpers_1.msToDHMS)(currentTime.getTime() - BOT_START_TIME.getTime());
            let reply = ["▄▀▄▀  𝔹𝕆𝕋 𝕊𝕋𝔸𝕋𝕌𝕊  ▀▄▀▄\n"];
            reply.push(`[🔰] *Environment:* ${helpers_1.currentEnv}`);
            reply.push(`[🔰] *Platform:* ${process.platform}`);
            if (!RUN_FIRST_TIME) {
                reply.push(`[🔰] *Response time:* ${Math.abs(new Date().getTime() - new Date(msg.timestamp * 1000).getTime())}ms`);
            }
            reply.push(`[🔰] *Uptime:*${days ? " " + days : ""}${days ? (days === 1 ? "day" : "days") : ""}${hours ? " " + hours : ""}${hours ? (hours === 1 ? "hr" : "hrs") : ""}${minutes ? " " + minutes : " 0mins"}${minutes ? (minutes === 1 ? "min" : "mins") : ""} ${seconds ? seconds : 0}secs`);
            reply.push(`[🔰] *Ram:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(Number(os_1.totalmem) / 1024 / 1024)} MB`);
            reply.push(`[🔰] *Total chats:* ${allChats.length}`);
            reply.push(`[🔰] *Group chats:* ${groupChats}`);
            reply.push(`[🔰] *Private chats:* ${private_chats}`);
            reply.push(`[🔰] *Blocked chats:* ${blocked_chats.length}`);
            reply.push(`[🔰] *Announcements stored:* ${allAnnouncements && allAnnouncements.length}`);
            reply.push(`[🔰] *Links stored:* ${allLinks && allLinks.length}`);
            reply.push(`[🔰] *Forwarding stuff status:* ${isForwardingOn ? "✅" : "❌"}\n`); // temporary - will be removed soon
            reply.push(`[🔰] *CSCD416 notification status:* ${CSCD416 ? "✅" : "❌"}`);
            reply.push(`[🔰] *CSCD418 notification status:* ${CSCD418 ? "✅" : "❌"}`);
            reply.push(`[🔰] *CSCD422 notification status:* ${CSCD422 ? "✅" : "❌"}`);
            reply.push(`[🔰] *CSCD424 notification status:* ${CSCD424 ? "✅" : "❌"}`);
            // reply.push(`[🔰] *CSCD400 notification status:* ${CSCD400 ? "✅" : "❌"}`);
            reply.push(`[🔰] *CSCD426 notification status:* ${CSCD426 ? "✅" : "❌"}`);
            reply.push(`[🔰] *CSCD428 notification status:* ${CSCD428 ? "✅" : "❌"}`);
            reply.push(`[🔰] *CSCD432 notification status:* ${CSCD432 ? "✅" : "❌"}`);
            reply.push(`[🔰] *CSCD434 notification status:* ${CSCD434 ? "✅" : "❌"}`);
            return reply.join("\n");
        }
    });
    const logger = () => __awaiter(void 0, void 0, void 0, function* () {
        const chats = yield client.getChats();
        const BOT_LOG_GROUP = process.env.BOT_LOG_GROUP;
        const botLogGroup = chats.find((chat) => chat.id.user === BOT_LOG_GROUP);
        if (botLogGroup) {
            yield botLogGroup.sendMessage(yield generateReplies()); // send status once before the 1hour interval starts
            setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
                yield botLogGroup.sendMessage(yield generateReplies());
            }), 3600000);
        }
        if (RUN_FIRST_TIME && helpers_1.currentEnv === "production") {
            logger();
            args.RUN_FIRST_TIME = false;
        }
        else {
            yield msg.reply(yield generateReplies());
        }
    });
});
module.exports = {
    name: "status",
    description: "Check bot's overall status/diagnostics 🩺",
    alias: ["st", "stats", "stat"],
    category: "admin",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}status*`,
    execute,
};
