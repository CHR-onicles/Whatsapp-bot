const { getMutedStatus } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, pickRandomReply, currentPrefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    let quotedMsg = null;
    const isBotAdmin = await isUserBotAdmin(contact);

    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }
    
    const chat = await msg.getChat();
    let text = "";
    const mentions = [];

    if (chat.participants) {
        for (const participant of chat.participants) {
            const newContact = await client.getContactById(participant.id._serialized);
            if (newContact.id.user.includes(contact.id.user) || newContact.id.user.includes(client.info.wid.user)) continue;
            mentions.push(newContact);
            text += `@${participant.id.user} `;
        }
        if (!mentions.length) {
            await msg.reply("No other person to ping apart from you and me :(");
            return;
        }
        if (msg.hasQuotedMsg) {
            quotedMsg = await msg.getQuotedMessage();
            await quotedMsg.reply(text, "", { mentions });
        } else await msg.reply(text, "", { mentions });
    } else {
        await msg.reply("Can't do this - This is not a  group chat 😗");
        console.log("Called " + currentPrefix + "everyone in a chat that is not a group chat");
    }
}


module.exports = {
    name: "everyone",
    description: "Ping everyone 🔊",
    alias: ["all", "every", "e"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}everyone*`,
    execute,
}