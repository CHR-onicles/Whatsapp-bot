const { getMutedStatus, getAllClassGroups, addClassGroup, removeClassGroup } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { currentPrefix, pickRandomReply, extractCommandArgs, isUserBotAdmin } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const msgArg = extractCommandArgs(msg)[0];
    const contact = await msg.getContact();
    const curChat = await msg.getChat();
    const isBotAdmin = await isUserBotAdmin(contact);
    const classGroupsInDB = new Set(await getAllClassGroups());

    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }

    // Make sure only a valid group can be added as a class group
    if (!curChat.isGroup) {
        await msg.reply("Sorry can't do this in a chat that is not a group");
        return;
    }

    switch (msgArg) {
        case 'add':
        case '-a':
            if (classGroupsInDB.has(curChat.id.user)) {
                await msg.reply("This group has already been added as an official class group.\n\nNow make me group admin🐦");
                return;
            }
            await addClassGroup(curChat.id.user);
            await msg.reply("This group has been successfully added as an official class group ✅");
            break;

        case 'remove':
        case '-r':
            if (!classGroupsInDB.has(curChat.id.user)) {
                await msg.reply("This group was not added as an official class group in the first place 😕");
                return;
            }
            await removeClassGroup(curChat.id.user);
            await msg.reply("This group is no longer recognized as a class group ✅");
            break;

        default:
            await msg.reply("Please add valid arguments: \nadd | remove");
            break;
    }
}


module.exports = {
    name: "classgroup",
    description: "Add/remove a class group 🏫",
    alias: ["cg", "clg"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}classgroup (add | remove)*`,
    execute,
}