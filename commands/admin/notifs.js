const { getMutedStatus, getNotificationStatus, enableAllNotifications, disableAllNotifications } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, current_env, pickRandomReply, current_prefix, extractCommandArgs, startNotificationCalculation, stopOngoingNotifications } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const args = extractCommandArgs(msg);
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);

    switch (args.join(' ').trim()) {
        case 'status':
        case 'stats':
        case '-s':
            if (isBotAdmin) {
                const notifs_status = await getNotificationStatus();
                await msg.reply(`All notifications for today's classes are *${notifs_status ? 'ON ✅' : 'OFF ❌'}*`);
            } else {
                await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
            }
            break;

        case 'enable all':
        case '-e -a':
            if (isBotAdmin) {
                await enableAllNotifications();
                startNotificationCalculation(client);
                await msg.reply("All notifications have been turned *ON* for today.");
            } else {
                await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
            }
            break;

        case 'disable all':
        case '-d -a':
            if (isBotAdmin) {
                await disableAllNotifications();
                stopOngoingNotifications();
                await msg.reply("All notifications have been turned *OFF* for today.");
            } else {
                await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
            }
            break;

        default:
            if (isBotAdmin) {
                await msg.reply("Please add valid arguments: \nstatus | enable all | disable all");
            } else {
                await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
            }
            break;
    }
}


module.exports = {
    name: "notifs",
    description: "Get status or turn on/off class notifications 🔈",
    alias: [],
    category: "admin", // admin | everyone
    help: `To use this command, type: ${current_prefix}notifs (status | enable all | disable all)`,
    execute,
}