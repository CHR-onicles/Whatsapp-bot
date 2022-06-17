const { getMutedStatus, getAllClassGroups } = require("../../models/misc");
const { DM_REPLIES } = require("../../utils/data");
const { currentPrefix, pickRandomReply } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const curChat = await msg.getChat();
    const chatFromContact = await contact.getChat();
    const allChats = await client.getChats();
    const classGroupsInDB = new Set(await getAllClassGroups());
    let reply = '▄▀▄▀  ℂ𝕃𝔸𝕊𝕊 𝔾ℝ𝕆𝕌ℙ𝕊  ▀▄▀▄\n\n';

    if (!classGroupsInDB.size) {
        await msg.reply("There are no official class groups stored in the database.");
        return;
    }

    if (curChat.isGroup) {
        await msg.reply(pickRandomReply(DM_REPLIES));
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
        const link = await group.getInviteCode();
        classGroupLinks.push(link);
    }

    // possible emojis to use: 🏫🎒

    classGroups.forEach((chat, index) => {
        reply += `🏫 *${chat.name}*\nhttps://chat.whatsapp.com/${classGroupLinks[index]}${index === classGroups.length-1 ? '' : '\n\n'}`
    })

    await chatFromContact.sendMessage(reply, '', {linkPreview: true}); // link preview not supported in MD, whatsapp fault, not library
}


module.exports = {
    name: "classgroups",
    description: "Get all class group links 📱",
    alias: ["cgs", "clgs"],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}classgroups*`,
    execute,
}