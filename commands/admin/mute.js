const { getMutedStatus, muteBot } = require("../../models/misc");
const { MUTE_REPLIES, NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { pickRandomReply, isUserBotAdmin, current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    if (isAdmin) {
        await msg.reply(pickRandomReply(MUTE_REPLIES));
        await muteBot();
    } else {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    }
}


module.exports = {
    name: "mute",
    description: "Mute the bot 🤐",
    alias: ["silence", "quiet"],
    category: "admin", // admin | everyone
    help: `To use this command, type: ${current_prefix}mute`,
    execute,
}