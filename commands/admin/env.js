const { getMutedStatus } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, currentEnv, pickRandomReply, currentPrefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);

    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }

    await msg.reply(`Bot is currently running in *${currentEnv}* environment`)
}


module.exports = {
    name: "env",
    description: "Get the environment the bot is running in currently 🦺",
    alias: [],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}env*`,
    execute,
}