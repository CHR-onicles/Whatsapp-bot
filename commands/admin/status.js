const { getMutedStatus, getAllAnnouncements, getAllLinks, getNotificationStatus, getForwardingStatus } = require("../../models/misc");
const { msToDHMS, currentPrefix, currentEnv, pickRandomReply, isUserBotAdmin } = require("../../utils/helpers");
const { totalmem } = require('os');
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");


const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { BOT_START_TIME } = args;
    if (!BOT_START_TIME) throw new Error('Invalid Bot Start Time');
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);
    const { CSCD416, CSCD418, CSCD422, CSCD424, CSCD400, CSCD426, CSCD428, CSCD432, CSCD434 } = await getNotificationStatus();
    const isForwardingOn = await getForwardingStatus();

    if (isBotAdmin) {
        const allChats = await client.getChats();
        const blocked_chats = await client.getBlockedContacts();
        const { groupChats, private_chats } = allChats.reduce((chats, chat) => {
            if (chat.isGroup) chats.groupChats += 1;
            else chats.private_chats += 1;
            return chats;
        }, { groupChats: 0, private_chats: 0 });
        const allAnnouncements = await getAllAnnouncements();
        const allLinks = await getAllLinks();

        const currentTime = new Date();
        const { days, hours, minutes, seconds } = msToDHMS(currentTime - BOT_START_TIME);
        let reply = ['▄▀▄▀  𝔹𝕆𝕋 𝕊𝕋𝔸𝕋𝕌𝕊  ▀▄▀▄\n'];

        reply.push(`[🔰] *Environment:* ${currentEnv}`);
        reply.push(`[🔰] *Platform:* ${process.platform}`);
        reply.push(`[🔰] *Response time:* ${Math.abs(new Date() - new Date(msg.timestamp * 1000))}ms`);
        reply.push(`[🔰] *Uptime:*${days ? ' ' + days : ''}${days ? (days === 1 ? 'day' : 'days') : ''}${hours ? ' ' + hours : ''}${hours ? (hours === 1 ? 'hr' : 'hrs') : ''}${minutes ? ' ' + minutes : ' 0mins'}${minutes ? (minutes === 1 ? 'min' : 'mins') : ''} ${seconds ? seconds : 0}secs`);
        reply.push(`[🔰] *Ram:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(totalmem / 1024 / 1024)} MB`);
        reply.push(`[🔰] *Total chats:* ${allChats.length}`);
        reply.push(`[🔰] *Group chats:* ${groupChats}`);
        reply.push(`[🔰] *Private chats:* ${private_chats}`);
        reply.push(`[🔰] *Blocked chats:* ${blocked_chats.length}`);
        reply.push(`[🔰] *Announcements stored:* ${allAnnouncements.length}`);
        reply.push(`[🔰] *Links stored:* ${allLinks.length}`);
        reply.push(`[🔰] *Forwarding stuff status:* ${isForwardingOn ? "✅" : "❌"}\n`); // temporary - will be removed soon

        reply.push(`[🔰] *CSCD416 notification status:* ${CSCD416 ? "✅" : "❌"}`);
        reply.push(`[🔰] *CSCD418 notification status:* ${CSCD418 ? "✅" : "❌"}`);
        reply.push(`[🔰] *CSCD422 notification status:* ${CSCD422 ? "✅" : "❌"}`);
        reply.push(`[🔰] *CSCD424 notification status:* ${CSCD424 ? "✅" : "❌"}`);
        reply.push(`[🔰] *CSCD400 notification status:* ${CSCD400 ? "✅" : "❌"}`);
        reply.push(`[🔰] *CSCD426 notification status:* ${CSCD426 ? "✅" : "❌"}`);
        reply.push(`[🔰] *CSCD428 notification status:* ${CSCD428 ? "✅" : "❌"}`);
        reply.push(`[🔰] *CSCD432 notification status:* ${CSCD432 ? "✅" : "❌"}`);
        reply.push(`[🔰] *CSCD434 notification status:* ${CSCD434 ? "✅" : "❌"}`);

        await msg.reply(reply.join('\n'));
    } else {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }
}


module.exports = {
    name: "status",
    description: "Check bot's overall status/diagnostics 🩺",
    alias: ["st", "stats", "stat"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}status*`,
    execute,
}