const { getMutedStatus } = require("../../models/misc");
const { current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const group_chat = await msg.getChat();
    // console.log(group_chat.participants);

    if (!group_chat.isGroup) {
        await msg.reply('This is not a group chat!');
        return;
    }

    const bot_chat_obj = group_chat.participants.find(chat_obj => chat_obj.id.user === process.env.BOT_NUMBER);
    if (!bot_chat_obj.isAdmin) {
        await msg.reply("I am not an admin in this group, so I can't do this");
        return;
    }

    const invite = 'https://chat.whatsapp.com/' + await group_chat.getInviteCode();
    await msg.reply(invite, '', { linkPreview: true }); // link preview is not supported on Multi-Device...whatsapp fault, not whatsapp-web.js library
}


module.exports = {
    name: "grouplink",
    description: "Get the current group's invite link 📱",
    alias: ["gl", "glink"],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}grouplink`,
    execute,
}