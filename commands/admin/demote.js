const { getMutedStatus, removeBotAdmin } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES, DEMOTE_BOT_REPLIES, DEMOTE_GRANDMASTER_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, currentEnv, pickRandomReply, currentPrefix, extractCommandArgs } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const userToDemote = extractCommandArgs(msg)[0];
    const curChat = await msg.getChat();
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);
    
    // Don't do anything if run by a user who is not a bot admin.
    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }

    if (!userToDemote) {
        await msg.reply("Please supply a valid user");
        return;
    }

    // Make sure the user is using this command in a group chat in order 
    // to be able to ping another user.
    if (!curChat.isGroup) {
        await msg.reply("Sorry can't do this in a chat that is not a group.");
        return;
    }

    // Make sure the user is pinging someone
    if (userToDemote[0] !== '@') {
        await msg.reply("Please make sure to ping a valid user");
        return;
    }

    const foundUser = curChat.participants.find((user) => user.id.user === userToDemote.slice(1));

    if (foundUser) {
        // The bot shouldn't be demoted.
        if (foundUser.id.user === process.env.BOT_NUMBER) {
            await msg.reply(pickRandomReply(DEMOTE_BOT_REPLIES));
            return;
        } else if (foundUser.id.user === process.env.GRANDMASTER) {
            await msg.reply(pickRandomReply(DEMOTE_GRANDMASTER_REPLIES));
            return;
        }
        const isFoundUserBotAdmin = await isUserBotAdmin(foundUser);
        if (isFoundUserBotAdmin) {
            await removeBotAdmin(foundUser.id.user);
            await msg.reply('Bot admin dismissed successfully! ✅'); //todo: Add more replies for this later
            return;
        } else {
            await msg.reply('This user is not a bot admin 🤦🏽‍♂️'); // todo: Add more replies for this later
        }
    } else {
        await msg.reply("Sorry, I couldn't find that user ☹");
        return;
    }
}


module.exports = {
    name: "demote",
    description: "Demote a bot admin 👮🏽‍♂️❌",
    alias: ["dem"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}demote <user>*`,
    execute,
}