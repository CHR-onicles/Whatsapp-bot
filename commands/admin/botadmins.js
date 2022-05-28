const { getMutedStatus, getAllSuperAdmins } = require("models/misc");
const { NOT_ADMIN_REPLIES } = require("utils/data");
const { pickRandomReply, isUserBotAdmin, current_prefix } = require("utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const isAdmin = await isUserBotAdmin(contact);
    const allAdmins = await getAllSuperAdmins();

    if (!isAdmin) {
        await msg.reply(pickRandomReply(NOT_ADMIN_REPLIES));
        return;
    }
    await msg.reply("〘✪ 𝔹𝕠𝕥 𝕒𝕕𝕞𝕚𝕟𝕤 ✪〙\n\n" + allAdmins.map(admin => "✪ +" + admin + "\n").join(''));

}


module.exports = {
    name: "botadmins",
    description: "Get all bot admins",
    alias: ["badmins", "botadmin"],
    category: "admin", // admin | everyone
    help: `To use this command, type: ${current_prefix}botadmins`,
    execute,
}