const { getMutedStatus, getUsersToNotifyForClass } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, pickRandomReply, current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    if (isAdmin) {
        const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
        await msg.reply('The following users have agreed to be notified for class:\n\n' + '*Data Mining:*\n' + dataMining.map(user => '→ ' + user + '\n').join('') + '\n'
            + '*Networking:*\n' + networking.map(user => '→ ' + user + '\n').join('') + '\n' + '*Software Modelling:*\n' + softModelling.map(user => '→ ' + user + '\n').join(''));
    } else {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }
}


module.exports = {
    name: "subs",
    description: "Get users subscribed for class notifications 👯‍♂️",
    alias: ["sub"],
    category: "admin", // admin | everyone
    help: `To use this command, type: ${current_prefix}subs`,
    execute,
}