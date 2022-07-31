const { getMutedStatus, muteBot } = require("../../models/misc");
const { MUTE_REPLIES, NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { pickRandomReply, isUserBotAdmin, currentPrefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);

    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }

    await msg.reply(pickRandomReply(MUTE_REPLIES));
    await muteBot();
}


module.exports = {
    name: "mute",
    description: "Mute the bot 🤐",
    alias: ["silence", "quiet"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}mute*`,
    execute,
}