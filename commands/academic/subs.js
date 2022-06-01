const { getMutedStatus, getUsersToNotifyForClass } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, pickRandomReply, current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const all_contacts = await client.getContacts();
    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    if (isAdmin) {
        const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
        const [dataMiningContacts, networkingContacts, softModellingContacts] = [[], [], []];
        for (const con of all_contacts) {
            for (const sub of dataMining) {
                if (con.number === sub) dataMiningContacts.push(con);
            }
            for (const sub of networking) {
                if (con.number === sub) networkingContacts.push(con);
            }
            for (const sub of softModelling) {
                if (con.number === sub) softModellingContacts.push(con);
            }
        }
        await msg.reply('The following users have agreed to be notified for class:\n\n' +
            '*Data Mining:*\n' + dataMiningContacts.map(user => `→ ${user.number} ~ ${user?.pushname || ''}\n`).join('') + '\n' +
            '*Networking:*\n' + networkingContacts.map(user => `→ ${user.number} ~ ${user?.pushname || ''}\n`).join('') + '\n' +
            '*Software Modelling:*\n' + softModellingContacts.map(user => `→ ${user.number} ~ ${user?.pushname || ''}\n`).join(''));
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