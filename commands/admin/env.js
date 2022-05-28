const { getMutedStatus } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, current_env, pickRandomReply, current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    if (isAdmin) {
        await msg.reply(`Bot is currently running in *${current_env}* environment`)
    } else {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }
}


module.exports = {
    name: "env",
    description: "Get the environment the bot is running in currently",
    alias: [],
    category: "admin", // admin | everyone
    help: `To use this command, type: ${current_prefix}env`,
    execute,
}