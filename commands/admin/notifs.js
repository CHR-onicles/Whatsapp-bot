const { getMutedStatus, getNotificationStatus, enableOrDisableAllNotifications, disableAllNotifications, enableOrDisableNotificationForCourse } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, currentEnv, pickRandomReply, currentPrefix, extractCommandArgs, startNotificationCalculation, stopAllOngoingNotifications } = require("../../utils/helpers");

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
                if (Object.values(notifsStatus).every(elem => !elem)) {
                    await msg.reply("All notifications for today's classes are *OFF* ❌");
                } else {
                    let reply = [];
                    const { CSCD416, CSCD418, CSCD422, CSCD424, CSCD400, CSCD426, CSCD428, CSCD432, CSCD434 } = notifsStatus;
                    reply.push(`[🔰] *CSCD416 notification status:* ${CSCD416 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD418 notification status:* ${CSCD418 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD422 notification status:* ${CSCD422 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD424 notification status:* ${CSCD424 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD400 notification status:* ${CSCD400 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD426 notification status:* ${CSCD426 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD428 notification status:* ${CSCD428 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD432 notification status:* ${CSCD432 ? "✅" : "❌"}`);
                    reply.push(`[🔰] *CSCD434 notification status:* ${CSCD434 ? "✅" : "❌"}`);
                    await msg.reply(reply.join("\n"));
                }
                break;

            case 'enable all':
            case '-e -a':
                await enableOrDisableAllNotifications(true);
                startNotificationCalculation(client);
                await msg.reply("All notifications have been turned *ON* for today.");
                break;

            case 'enable CSCD416':
            case 'enable cscd416':
            case '-e CSCD416':
            case '-e c416':
            case '-e C416':
                await enableOrDisableNotificationForCourse('CSCD416', true);
                await msg.reply("Notifications for *Systems Programming* have been turned *ON*");
                break;

            case 'enable CSCD418':
            case 'enable cscd418':
            case '-e CSCD418':
            case '-e c418':
            case '-e C418':
                await enableOrDisableNotificationForCourse('CSCD418', true);
                await msg.reply("Notifications for *Computer Systems Security* have been turned *ON*");
                break;

            case 'enable CSCD422':
            case 'enable cscd422':
            case '-e CSCD422':
            case '-e c422':
            case '-e C422':
                await enableOrDisableNotificationForCourse('CSCD422', true);
                await msg.reply("Notifications for *Human Computer Interaction* have been turned *ON*");
                break;

            case 'enable CSCD424':
            case 'enable cscd424':
            case '-e CSCD424':
            case '-e c424':
            case '-e C424':
                await enableOrDisableNotificationForCourse('CSCD424', true);
                await msg.reply("Notifications for *Management Principles in Computing* have been turned *ON*");
                break;

            case 'enable CSCD400':
            case 'enable cscd400':
            case '-e CSCD400':
            case '-e c400':
            case '-e C400':
                await enableOrDisableNotificationForCourse('CSCD400', true);
                await msg.reply("Notifications for *Project* have been turned *ON*");
                break;

            case 'enable CSCD426':
            case 'enable cscd426':
            case '-e CSCD426':
            case '-e c426':
            case '-e C426':
                await enableOrDisableNotificationForCourse('CSCD426', true);
                await msg.reply("Notifications for *Multimedia Applications* have been turned *ON*");
                break;

            case 'enable CSCD428':
            case 'enable cscd428':
            case '-e CSCD428':
            case '-e c428':
            case '-e C428':
                await enableOrDisableNotificationForCourse('CSCD428', true);
                await msg.reply("Notifications for *Expert Systems* have been turned *ON*");
                break;

            case 'enable CSCD432':
            case 'enable cscd432':
            case '-e CSCD432':
            case '-e c432':
            case '-e C432':
                await enableOrDisableNotificationForCourse('CSCD432', true);
                await msg.reply("Notifications for *Concurrent & Distributed Systems* have been turned *ON*");
                break;

            case 'enable CSCD434':
            case 'enable cscd434':
            case '-e CSCD434':
            case '-e c434':
            case '-e C434':
                await enableOrDisableNotificationForCourse('CSCD434', true);
                await msg.reply("Notifications for *Mobile Computing* have been turned *ON*");
                break;


            // ----------------------------------------------------------

            case 'disable all':
            case '-d -a':
                await enableOrDisableAllNotifications(false);
                stopAllOngoingNotifications();
                await msg.reply("All notifications have been turned *OFF* for today.");
                break;

            case 'disable CSCD416':
            case 'disable cscd416':
            case '-d CSCD416':
            case '-d c416':
            case '-d C416':
                await enableOrDisableNotificationForCourse('CSCD416', false);
                await msg.reply("Notifications for *Systems Programming* have been turned *OFF*");
                break;

            case 'disable CSCD418':
            case 'disable cscd418':
            case '-d CSCD418':
            case '-d c418':
            case '-d C418':
                await enableOrDisableNotificationForCourse('CSCD418', false);
                await msg.reply("Notifications for *Computer Systems Security* have been turned *OFF*");
                break;

            case 'disable CSCD422':
            case 'disable cscd422':
            case '-d CSCD422':
            case '-d c422':
            case '-d C422':
                await enableOrDisableNotificationForCourse('CSCD422', false);
                await msg.reply("Notifications for *Human Computer Interaction* have been turned *OFF*");
                break;

            case 'disable CSCD424':
            case 'disable cscd424':
            case '-d CSCD424':
            case '-d c424':
            case '-d C424':
                await enableOrDisableNotificationForCourse('CSCD424', false);
                await msg.reply("Notifications for *Management Principles in Computing* have been turned *OFF*");
                break;

            case 'disable CSCD400':
            case 'disable cscd400':
            case '-d CSCD400':
            case '-d c400':
            case '-d C400':
                await enableOrDisableNotificationForCourse('CSCD400', false);
                await msg.reply("Notifications for *Project* have been turned *OFF*");
                break;

            case 'disable CSCD426':
            case 'disable cscd426':
            case '-d CSCD426':
            case '-d c426':
            case '-d C426':
                await enableOrDisableNotificationForCourse('CSCD426', false);
                await msg.reply("Notifications for *Multimedia Applications* have been turned *OFF*");
                break;

            case 'disable CSCD428':
            case 'disable cscd428':
            case '-d CSCD428':
            case '-d c428':
            case '-d C428':
                await enableOrDisableNotificationForCourse('CSCD428', false);
                await msg.reply("Notifications for *Expert Systems* have been turned *OFF*");
                break;

            case 'disable CSCD432':
            case 'disable cscd432':
            case '-d CSCD432':
            case '-d c432':
            case '-d C432':
                await enableOrDisableNotificationForCourse('CSCD432', false);
                await msg.reply("Notifications for *Concurrent & Distributed Systems* have been turned *OFF*");
                break;

            case 'disable CSCD434':
            case 'disable cscd434':
            case '-d CSCD434':
            case '-d c434':
            case '-d C434':
                await enableOrDisableNotificationForCourse('CSCD434', false);
                await msg.reply("Notifications for *Mobile Computing* have been turned *OFF*");
                break;

            default:
                await msg.reply("Please add valid arguments: \nEg: status | enable <course code> | disable <course code> | enable all | disable all ");
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
    help: `To use this command, type:\n*${currentPrefix}notifs (status | enable <course code> | disable <course code> | enable all | disable all)*`,
    execute,
}