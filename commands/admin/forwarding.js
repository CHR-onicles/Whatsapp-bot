const { getMutedStatus, getForwardingStatus, enableForwarding, disableForwarding } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, current_env, pickRandomReply, current_prefix, extractCommandArgs } = require("../../utils/helpers");

//! THIS COMMAND IS TEMPORARY AND WILL BE REMOVED ONCE 
//! THE LOGIC IS FLESHED OUT PROPERLY FOR USERS

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;
    const msg_args = extractCommandArgs(msg)[0];

    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    const current_forwarding_status = await getForwardingStatus();

    if (isAdmin) {
        switch (msg_args) {
            case 'status':
            case 'stats':
            case '-s':
                await msg.reply(`Forwarding of important messages is ${current_forwarding_status ? 'ON ✅' : 'OFF ❌'}`);
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
    help: `To use this command, type: ${current_prefix}forwarding (enable | disable | status)`,
    execute,
}