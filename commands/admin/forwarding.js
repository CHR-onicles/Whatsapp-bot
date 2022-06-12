const { getMutedStatus, getForwardingStatus, enableForwarding, disableForwarding } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, currentEnv, pickRandomReply, currentPrefix, extractCommandArgs } = require("../../utils/helpers");

//! THIS COMMAND IS TEMPORARY AND WILL BE REMOVED ONCE 
//! THE LOGIC IS FLESHED OUT PROPERLY FOR USERS

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;
    const msgArgs = extractCommandArgs(msg)[0];

    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    const curForwardingStatus = await getForwardingStatus();

    if (isAdmin) {
        switch (msgArgs) {
            case 'status':
            case 'stats':
            case '-s':
                await msg.reply(`Forwarding of important messages is ${curForwardingStatus ? 'ON ✅' : 'OFF ❌'}`);
                break;

            case 'enable':
            case '-e':
                await enableForwarding();
                await msg.reply("Forwarding of important messages is enabled ✅");
                break;

            case 'disable':
            case '-d':
                await disableForwarding();
                await msg.reply("Forwarding of important messages is disabled ❌");
                break;

            default:
                await msg.reply("Please add valid arguments: \nstatus | enable | disable");
                break;
        }
    } else {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    }
}


module.exports = {
    name: "forwarding",
    description: "Turn on/off forwarding of announcements and links 📲",
    alias: ["fwd"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}forwarding (status | enable | disable)*`,
    execute,
}