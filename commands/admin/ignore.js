const { getMutedStatus, getBlacklistedUsers, addBlacklistedUser } = require("../../models/misc");
const { NOT_BOT_ADMIN_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, current_env, pickRandomReply, current_prefix, extractCommandArgs } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    let user_to_ignore = extractCommandArgs(msg)[0];
    const all_contacts = await client.getContacts();
    const contact = await msg.getContact();
    const isBotAdmin = await isUserBotAdmin(contact);
    const blacklistedUsers = new Set(await getBlacklistedUsers());

    const foundContact = all_contacts.find((con) => con.number === user_to_ignore);

    // Don't do anything if run by a user who is not a bot admin.
    if (!isBotAdmin) {
        await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
        return;
    }

    if (!user_to_ignore) {
        await msg.reply("Please supply a valid user");
        return;
    }

    // Make sure the user is pinging someone
    if (user_to_ignore[0] !== '@') {
        await msg.reply("Please make sure to ping a valid user");
        return;
    }

    user_to_ignore = user_to_ignore.slice(1);
    if (blacklistedUsers.has(user_to_ignore)) {
        await msg.reply("This user is already blacklisted 😒");
        return;
    } else {
        // Prevent trying to blacklist the bot.
        if (user_to_ignore === process.env.BOT_NUMBER) {
            await msg.reply("I'm the one doing the ignoring here fam 🐦");
            return;
        } else if (user_to_ignore === process.env.GRANDMASTER) {
            // Prevent trying to blacklist the owner.
            const isGMAdmin = await isUserBotAdmin(user_to_ignore);
            if (isGMAdmin) {
                await msg.reply("Grandmaster cannot be blacklisted 🐦");
                return;
            }
        }
        const is_found_user_bot_admin = await isUserBotAdmin(user_to_ignore);
        if (is_found_user_bot_admin) {
            await msg.reply('A bot admin cannot be blacklisted 😕'); // todo: Add more replies for this later
            return;
        } else {
            await addBlacklistedUser(user_to_ignore);
            if (foundContact) await contact.block();
            await msg.reply('User will now be ignored for eternity ✅'); //todo: Add more replies for this later
        }
    }
}


module.exports = {
    name: "ignore",
    description: "Blacklist a user ☠",
    alias: ["ig"],
    category: "admin", // admin | everyone
    help: `To use this command, type:\n*${current_prefix}ignore <@user>*`,
    execute,
}