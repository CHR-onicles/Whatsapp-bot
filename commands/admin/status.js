const { getMutedStatus, getAllAnnouncements, getAllLinks, getNotificationStatus, getForwardingStatus } = require("../../models/misc");
const { msToDHMS, currentPrefix, currentEnv, pickRandomReply, isUserBotAdmin } = require("../../utils/helpers");
const { totalmem } = require('os');
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");


const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { BOT_START_TIME, RUN_FIRST_TIME } = args;
    if (!BOT_START_TIME) throw new Error('[STATUS CMD] Invalid Bot Start Time');
    let isBotAdmin = null;
    if (!RUN_FIRST_TIME) {
        // to prevent getting an error when running for the first time
        const contact = await msg.getContact();
        isBotAdmin = await isUserBotAdmin(contact);
    }

    if (!isBotAdmin && !RUN_FIRST_TIME) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }

    // Helper function to run this piece of code on special occasions
    const generateReplies = async () => {
        const { CSCD416, CSCD418, CSCD422, CSCD424, CSCD426, CSCD428, CSCD432, CSCD434 } = await getNotificationStatus();
        const isForwardingOn = await getForwardingStatus();
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

        let reply = ['ββββ  πΉππ πππΈπππ  ββββ\n'];
        reply.push(`[π°] *Environment:* ${currentEnv}`);
        reply.push(`[π°] *Platform:* ${process.platform}`);
        if (!RUN_FIRST_TIME) {
            reply.push(`[π°] *Response time:* ${Math.abs(new Date() - new Date(msg.timestamp * 1000))}ms`);
        }
        reply.push(`[π°] *Uptime:*${days ? ' ' + days : ''}${days ? (days === 1 ? 'day' : 'days') : ''}${hours ? ' ' + hours : ''}${hours ? (hours === 1 ? 'hr' : 'hrs') : ''}${minutes ? ' ' + minutes : ' 0mins'}${minutes ? (minutes === 1 ? 'min' : 'mins') : ''} ${seconds ? seconds : 0}secs`);
        reply.push(`[π°] *Ram:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(totalmem / 1024 / 1024)} MB`);
        reply.push(`[π°] *Total chats:* ${allChats.length}`);
        reply.push(`[π°] *Group chats:* ${groupChats}`);
        reply.push(`[π°] *Private chats:* ${private_chats}`);
        reply.push(`[π°] *Blocked chats:* ${blocked_chats.length}`);
        reply.push(`[π°] *Announcements stored:* ${allAnnouncements.length}`);
        reply.push(`[π°] *Links stored:* ${allLinks.length}`);
        reply.push(`[π°] *Forwarding stuff status:* ${isForwardingOn ? "β" : "β"}\n`); // temporary - will be removed soon

        reply.push(`[π°] *CSCD416 notification status:* ${CSCD416 ? "β" : "β"}`);
        reply.push(`[π°] *CSCD418 notification status:* ${CSCD418 ? "β" : "β"}`);
        reply.push(`[π°] *CSCD422 notification status:* ${CSCD422 ? "β" : "β"}`);
        reply.push(`[π°] *CSCD424 notification status:* ${CSCD424 ? "β" : "β"}`);
        // reply.push(`[π°] *CSCD400 notification status:* ${CSCD400 ? "β" : "β"}`);
        reply.push(`[π°] *CSCD426 notification status:* ${CSCD426 ? "β" : "β"}`);
        reply.push(`[π°] *CSCD428 notification status:* ${CSCD428 ? "β" : "β"}`);
        reply.push(`[π°] *CSCD432 notification status:* ${CSCD432 ? "β" : "β"}`);
        reply.push(`[π°] *CSCD434 notification status:* ${CSCD434 ? "β" : "β"}`);
        return reply.join('\n');
    }


    const logger = async () => {
        const chats = await client.getChats();
        const BOT_LOG_GROUP = process.env.BOT_LOG_GROUP;
        const botLogGroup = chats.find(chat => chat.id.user === BOT_LOG_GROUP);
        await botLogGroup.sendMessage(await generateReplies()); // send status once before the 1hour interval starts
        setInterval(async () => {
            await botLogGroup.sendMessage(await generateReplies());
        }, 3600_000);
    }

    if (RUN_FIRST_TIME && currentEnv === 'production') {
        logger();
        args.RUN_FIRST_TIME = false;
    } else {
        await msg.reply(await generateReplies());
    }
}


module.exports = {
    name: "status",
    description: "Check bot's overall status/diagnostics π©Ί",
    alias: ["st", "stats", "stat"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}status*`,
    execute,
}