import { IClient } from "../../types";
import { Message } from "whatsapp-web.js";
import {
  getMutedStatus,
  removeBlacklistedUser,
  getBlacklistedUsers,
} from "../../models/misc";
import { NOT_BOT_ADMIN_REPLIES } from "../../utils/data";
import {
  isUserBotAdmin,
  pickRandomReply,
  currentPrefix,
  extractCommandArgs,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;

  let userToAcknowledge = extractCommandArgs(msg)[0];
  const allContacts = await client.getContacts();
  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);
  const blacklistedUsers = new Set(await getBlacklistedUsers());

  const foundContact = allContacts.find(
    (con) => con.number === userToAcknowledge
  );

  // Don't do anything if run by a user who is not a bot admin.
  if (!isBotAdmin) {
    await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    return;
  }

  if (!userToAcknowledge) {
    await msg.reply("Please supply a valid user");
    return;
  }

  // Make sure the user is pinging someone
  if (userToAcknowledge[0] !== "@") {
    await msg.reply("Please make sure to ping a valid user");
    return;
  }

  userToAcknowledge = userToAcknowledge.slice(1);
  if (blacklistedUsers.has(userToAcknowledge)) {
    // Prevent trying to acknowledge the bot.
    if (userToAcknowledge === client.info.wid.user) {
      await msg.reply("I'm the one doing the acknowledging here fam 🐦");
      return;
    } else if (userToAcknowledge === process.env.GRANDMASTER) {
      // Prevent trying to blacklist the owner.
      const isGMAdmin = await isUserBotAdmin(userToAcknowledge);
      if (isGMAdmin) {
        await msg.reply("Grandmaster is already acknowledged 🐦");
        return;
      }
    }
    const isFoundUserBotAdmin = await isUserBotAdmin(userToAcknowledge);
    if (isFoundUserBotAdmin) {
      await msg.reply("A bot admin is already acknowledged 😕"); // todo: Add more replies for this later
      return;
    } else {
      await removeBlacklistedUser(userToAcknowledge);
      if (foundContact) await contact.unblock();
      await msg.reply("User will now be acknowledged ✅"); //todo: Add more replies for this later
    }
  } else {
    await msg.reply("This user was not blacklisted 😒");
    return;
  }
};

module.exports = {
  name: "acknowledge",
  description: "Remove a user from blacklist 💫",
  alias: ["ack", "ak"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}acknowledge @user*`,
  execute,
};
