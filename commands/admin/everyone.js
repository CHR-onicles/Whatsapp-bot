const { getMutedStatus } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, pickRandomReply, current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    let quoted_msg = null;
    const isAdmin = await isUserBotAdmin(contact);
    if (!isAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    } else {
        const chat = await msg.getChat();
        let text = "";
        const mentions = [];

        if (chat.participants) {
            for (const participant of chat.participants) {
                const new_contact = await client.getContactById(participant.id._serialized);
                if (new_contact.id.user.includes(contact.id.user) || new_contact.id.user.includes(process.env.BOT_NUMBER)) continue;
                mentions.push(new_contact);
                text += `@${participant.id.user} `;
            }
            if (!mentions.length) {
                await msg.reply("No other person to ping apart from you and me :(");
                return;
            }
            if (msg.hasQuotedMsg) {
                quoted_msg = await msg.getQuotedMessage();
                await quoted_msg.reply(text, "", { mentions });
            } else await msg.reply(text, "", { mentions });
        } else {
            await msg.reply("Can't do this - This is not a  group chat 😗");
            console.log("Called " + current_prefix + "everyone in a chat that is not a group chat");
        }
    }
}


module.exports = {
    name: "everyone",
    description: "Ping everyone",
    alias: ["all", "every", "e"],
    category: "admin", // admin | everyone
    help: `To use this command, type: ${current_prefix}everyone`,
    execute,
}