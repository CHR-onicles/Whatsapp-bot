const { getMutedStatus, getBlacklistedUsers } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, pickRandomReply, current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const all_contacts = await client.getContacts();
    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    const blacklistedUsers = await getBlacklistedUsers();

    if (!blacklistedUsers.length) {
        await msg.reply("There are currently no blacklisted users");
        return;
    }

    const foundBlacklistedUsers = [];
    for (const con of all_contacts) {
        for (const black of blacklistedUsers) {
            if (con.number === black) foundBlacklistedUsers.push(con);
        }
    }

    if (isAdmin) {
        await msg.reply("〘💀 𝔹𝕝𝕒𝕔𝕜𝕝𝕚𝕤𝕥𝕖𝕕 𝕦𝕤𝕖𝕣𝕤 💀〙\n\n" + foundBlacklistedUsers.map(blackUser => `➣ ${blackUser.number} ~ ${blackUser?.pushname || ''}\n`).join(''));
    } else {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    }
}


module.exports = {
    name: "blacklist",
    description: "Get users who have been blacklisted ☠☠",
    alias: ["black", "bl"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${current_prefix}blacklist*`,
    execute,
}