const { getMutedStatus, unmuteBot } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES, UNMUTE_REPLIES } = require("../../utils/data");
const { pickRandomReply, isUserBotAdmin, currentPrefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    
    if (await getMutedStatus() === true) {
        if (isAdmin) {
            await msg.reply(pickRandomReply(UNMUTE_REPLIES));
            await unmuteBot();
        }
    } else {
        if (!isAdmin) {
            await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
            return;
        }
        await msg.reply(`Haven't been muted yet 🐦`);
    }
}


module.exports = {
    name: "unmute",
    description: "Unmute the bot 🙂",
    alias: ["speak", "talk"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}unmute*`,
    execute,
}