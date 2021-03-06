const { getMutedStatus, getAllBotAdmins } = require("../../models/misc");
const { currentPrefix, isUserBotAdmin, checkForChance } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);
    const allContacts = await client.getContacts();
    const allBotAdmins = await getAllBotAdmins();

    const foundBotAdmins = [];
    for (const con of allContacts) {
        for (const bot_admin of allBotAdmins) {
            if (con.number === bot_admin) foundBotAdmins.push(con);
        }
    }

    const botReply = await msg.reply("ăâȘ đčđ đ„ đđđđđđ€ âȘă\n\n" + foundBotAdmins.map(admin => `âŁ ${admin.number} ~ ${admin?.pushname || ''}\n`).join(''));

    if (!isBotAdmin) {
        if (checkForChance(3)) { // 30% chance this message is sent to non-bot admins
            await botReply.reply("Reach out to any of them if you need any help đŠ"); // It doesn't quote  `botReply` but it still sends the message so I'll take it đąđđ»
        }
    }
}


module.exports = {
    name: "botadmins",
    description: "Get all bot admins đźđœââïžđźđœââïž",
    alias: ["badmins", "badmin", "botadmin"],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n${currentPrefix}botadmins*`,
    execute,
}