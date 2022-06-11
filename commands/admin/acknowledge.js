const { getMutedStatus, removeBlacklistedUser, getBlacklistedUsers } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, current_env, pickRandomReply, current_prefix, extractCommandArgs } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    let user_to_acknowledge = extractCommandArgs(msg)[0];
    const all_contacts = await client.getContacts();
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);
    const blacklistedUsers = new Set(await getBlacklistedUsers());

    const foundContact = all_contacts.find((con) => con.number === user_to_acknowledge);

    if (!user_to_acknowledge) {
        await msg.reply("Please supply a valid user");
        return;
    }

    // Don't do anything if run by a user who is not a bot admin.
    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }

    // Make sure the user is pinging someone
    if (user_to_acknowledge[0] !== '@') {
        await msg.reply("Please make sure to ping a valid user");
        return;
    }

    user_to_acknowledge = user_to_acknowledge.slice(1);
    if (blacklistedUsers.has(user_to_acknowledge)) {

        // Prevent trying to acknowledge the bot.
        if (user_to_acknowledge === process.env.BOT_NUMBER) {
            await msg.reply("I'm the one doing the acknowledging here fam 🐦");
            return;
        } else if (user_to_acknowledge === process.env.GRANDMASTER) {
            // Prevent trying to blacklist the owner.
            const isGMAdmin = await isUserBotAdmin(user_to_acknowledge);
            if (isGMAdmin) {
                await msg.reply("Grandmaster is already acknowledged 🐦");
                return;
            }
        }
        const is_found_user_bot_admin = await isUserBotAdmin(user_to_acknowledge);
        if (is_found_user_bot_admin) {
            await msg.reply('A bot admin is already acknowledged 😕'); // todo: Add more replies for this later
            return;
        } else {
            await removeBlacklistedUser(user_to_acknowledge);
            if (foundContact) await contact.unblock();
            await msg.reply('User will now be acknowledged ✅'); //todo: Add more replies for this later
        }
    } else {
        await msg.reply("This user was not blacklisted 😒")
        return;
    }
}


module.exports = {
    name: "acknowledge",
    description: "Remove a user from blacklist 💫",
    alias: ["ack", "ak"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${current_prefix}acknowledge <@user>*`,
    execute,
}