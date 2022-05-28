const { getMutedStatus } = require("../../models/misc");
const { msToDHMS, current_prefix } = require("../../utils/helpers");
const { totalmem } = require('os');


const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { BOT_START_TIME } = args;
    if (!BOT_START_TIME) throw new Error('Invalid Bot Start Time');

    const all_chats = await client.getChats();
    const blocked_chats = await client.getBlockedContacts();
    const { group_chats, private_chats } = all_chats.reduce((chats, chat) => {
        if (chat.isGroup) chats.group_chats += 1;
        else chats.private_chats += 1;
        return chats;
    }, { group_chats: 0, private_chats: 0 });

    const current_time = new Date();
    const { days, hours, minutes, seconds } = msToDHMS(current_time - BOT_START_TIME);
    let reply = ['▄▀▄▀  𝔹𝕆𝕋 𝕊𝕋𝔸𝕋𝕌𝕊  ▀▄▀▄\n'];

    reply.push(`[🔰] *Platform:* ${process.platform}`);
    reply.push(`[🔰] *Response time:* ${new Date(msg.timestamp * 1000) - new Date()}ms`);
    reply.push(`[🔰] *Uptime:*${days ? ' ' + days : ''}${days ? (days === 1 ? 'day' : 'days') : ''}${hours ? ' ' + hours : ''}${hours ? (hours === 1 ? 'hr' : 'hrs') : ''}${minutes ? ' ' + minutes : ' 0mins'}${minutes ? (minutes === 1 ? 'min' : 'mins') : ''} ${seconds ? seconds : 0}secs`);
    reply.push(`[🔰] *Ram:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(totalmem / 1024 / 1024)} MB`);
    reply.push(`[🔰] *Total chats:* ${all_chats.length}`);
    reply.push(`[🔰] *Group chats:* ${group_chats}`);
    reply.push(`[🔰] *Private chats:* ${private_chats}`);
    reply.push(`[🔰] *Blocked chats:* ${blocked_chats.length}`);

    await msg.reply(reply.join('\n'));
}


module.exports = {
    name: "status",
    description: "Check bot's overall status/diagnostics",
    alias: ["stats", "stat"],
    category: "admin", // admin | everyone
    help: `To use this command, type: ${current_prefix}status`,
    execute,
}