const { getMutedStatus, getAllClassGroups } = require("../../models/misc");
const { REACT_EMOJIS } = require("../../utils/data");
const { currentPrefix, pickRandomReply } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const curChat = await msg.getChat();
    const chatFromContact = await contact.getChat();
    const allChats = await client.getChats();
    const classGroupsInDB = new Set(await getAllClassGroups());
    let reply = '▄▀▄  ℂ𝕃𝔸𝕊𝕊 𝔾ℝ𝕆𝕌ℙ𝕊  ▄▀▄\n\n';

    if (!classGroupsInDB.size) {
        await msg.reply("There are no official class groups stored in the database.");
        return;
    }

    if (curChat.isGroup) {
        await msg.react(pickRandomReply(REACT_EMOJIS));
    }

    const classGroups = [];
    const classGroupLinks = [];
    allChats.forEach(chat => {
        if (chat.isGroup && classGroupsInDB.has(chat.id.user)) {
            classGroups.push(chat);
        }
    });

    for (const group of classGroups) {
        // Can't do this in forEach because it returns nothing for some reason.
        const botChat = group.participants.find((chat) => chat.id.user === client.info.wid.user);
        if (botChat.isAdmin) {
            const link = await group.getInviteCode();
            classGroupLinks.push(link);
        } else {
            classGroupLinks.push(null);
        }
    }

    // possible emojis to use: 🏫🎒

    classGroups.forEach((chat, index) => {
        if (!classGroupLinks[index]) {
            // If bot is not admin send different reply
            reply += `🏫 *${chat.name}*\n_Can't generate group link because I am not an admin here_${index === classGroups.length - 1 ? '' : '\n\n'}`
        } else {
            reply += `🏫 *${chat.name}*\nhttps://chat.whatsapp.com/${classGroupLinks[index]}${index === classGroups.length - 1 ? '' : '\n\n'}`
        }
    })

    await chatFromContact.sendMessage(reply, '', { linkPreview: true }); // link preview not supported in MD, whatsapp fault, not library
}


module.exports = {
    name: "classgroups",
    description: "Get all class group links 📱",
    alias: ["cgs", "clgs"],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}classgroups*`,
    execute,
}