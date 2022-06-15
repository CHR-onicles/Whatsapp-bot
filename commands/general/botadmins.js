const { getMutedStatus, getAllBotAdmins } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { pickRandomReply, isUserBotAdmin, currentPrefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const allContacts = await client.getContacts();
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);
    const allBotAdmins = await getAllBotAdmins();

    const foundBotAdmins = [];
    for (const con of allContacts) {
        for (const bot_admin of allBotAdmins) {
            if (con.number === bot_admin) foundBotAdmins.push(con);
        }
    }

    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    }
    await msg.reply("〘✪ 𝔹𝕠𝕥 𝕒𝕕𝕞𝕚𝕟𝕤 ✪〙\n\n" + foundBotAdmins.map(admin => `➣ ${admin.number} ~ ${admin?.pushname || ''}\n`).join(''));
}


module.exports = {
    name: "botadmins",
    description: "Get all bot admins 👮🏽‍♂️👮🏽‍♀️",
    alias: ["badmins", "badmin", "botadmin"],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n${currentPrefix}botadmins*`,
    execute,
}