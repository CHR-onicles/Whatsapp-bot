const { getMutedStatus, removeBotAdmin } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES, DEMOTE_BOT_REPLIES, DEMOTE_GRANDMASTER_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, current_env, pickRandomReply, current_prefix, extractCommandArgs } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const user_to_demote = extractCommandArgs(msg)[0];
    const cur_chat = await msg.getChat();
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);

    if (!user_to_demote) {
        await msg.reply("Please supply a valid user");
        return;
    }

    // Don't do anything if run by a user who is not a bot admin.
    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }

    // Make sure the user is using this command in a group chat in order 
    // to be able to ping another user.
    if (!cur_chat.isGroup) {
        await msg.reply("Sorry can't do this in a chat that is not a group.");
        return;
    }

    // Make sure the user is pinging someone
    if (user_to_demote[0] !== '@') {
        await msg.reply("Please make sure to ping a valid user");
        return;
    }

    const found_user = cur_chat.participants.find((user) => user.id.user === user_to_demote.slice(1));

    if (found_user) {
        // The bot shouldn't be demoted.
        if (found_user.id.user === process.env.BOT_NUMBER) {
            await msg.reply(pickRandomReply(DEMOTE_BOT_REPLIES));
            return;
        } else if (found_user.id.user === process.env.GRANDMASTER) {
            await msg.reply(pickRandomReply(DEMOTE_GRANDMASTER_REPLIES));
            return;
        }
        const is_found_user_bot_admin = await isUserBotAdmin(found_user);
        if (is_found_user_bot_admin) {
            await removeBotAdmin(found_user.id.user);
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
    help: `To use this command, type:\n*${current_prefix}demote <user>*`,
    execute,
}