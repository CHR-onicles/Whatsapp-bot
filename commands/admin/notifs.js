const { getMutedStatus, getNotificationStatus, enableAllNotifications, disableAllNotifications } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, currentEnv, pickRandomReply, currentPrefix, extractCommandArgs, startNotificationCalculation, stopOngoingNotifications } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const args = extractCommandArgs(msg);
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);

    if (isBotAdmin) {
        switch (args.join(' ').trim()) {
            case 'status':
            case 'stats':
            case '-s':
                const notifsStatus = await getNotificationStatus();
                await msg.reply(`All notifications for today's classes are *${notifsStatus ? 'ON ✅' : 'OFF ❌'}*`);
                break;

            case 'enable all':
            case '-e -a':
                await enableAllNotifications();
                startNotificationCalculation(client);
                await msg.reply("All notifications have been turned *ON* for today.");
                break;

            case 'disable all':
            case '-d -a':
                await disableAllNotifications();
                stopOngoingNotifications();
                await msg.reply("All notifications have been turned *OFF* for today.");
                break;

            default:
                await msg.reply("Please add valid arguments: \nstatus | enable all | disable all");
                break;
        }
    } else {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    }
}


module.exports = {
    name: "notifs",
    description: "Get status or turn on/off class notifications 🔈",
    alias: [],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}notifs (status | enable all | disable all)*`,
    execute,
}