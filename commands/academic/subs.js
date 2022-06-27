const { getMutedStatus, getUsersToNotifyForClass } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, pickRandomReply, currentPrefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const allContacts = await client.getContacts();
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);
    if (isBotAdmin) {
        const { multimedia, expert, concurrent, mobile } = await getUsersToNotifyForClass();
        const [multimediaContacts, expertContacts, concurrentContacts, mobileContacts] = [[], [], [], []];
        for (const con of allContacts) {
            for (const sub of multimedia) {
                if (con.number === sub) multimediaContacts.push(con);
            }
            for (const sub of expert) {
                if (con.number === sub) expertContacts.push(con);
            }
            for (const sub of concurrent) {
                if (con.number === sub) concurrentContacts.push(con);
            }
            for (const sub of mobile) {
                if (con.number === sub) mobileContacts.push(con);
            }
        }
        await msg.reply('The following users have agreed to be notified for class:\n\n' +
            '*Multimedia Applications:*\n' + multimediaContacts.map(user => `→ ${user.number} ~ ${user?.pushname || ''}\n`).join('') + '\n' +
            '*Expert Systems:*\n' + expertContacts.map(user => `→ ${user.number} ~ ${user?.pushname || ''}\n`).join('') + '\n' +
            '*Conc & Dist Systems:*\n' + concurrentContacts.map(user => `→ ${user.number} ~ ${user?.pushname || ''}\n`).join('')) + '\n' +
            '*Mobile Computing:*\n' + mobileContacts.map(user => `→ ${user.number} ~ ${user?.pushname || ''}\n`).join('');
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
    help: `To use this command, type:\n*${currentPrefix}subs*`,
    execute,
}