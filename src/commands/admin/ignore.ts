import { IClient } from "../../types";
import { Message } from "whatsapp-web.js";
import {
  getMutedStatus,
  getBlacklistedUsers,
  addBlacklistedUser,
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

  let userToIgnore = extractCommandArgs(msg)[0];
  const allContacts = await client.getContacts();
  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);
  const blacklistedUsers = new Set(await getBlacklistedUsers());

  // Don't do anything if run by a user who is not a bot admin.
  if (!isBotAdmin) {
    await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    return;
  }

  if (!userToIgnore) {
    await msg.reply("Please supply a valid user");
    return;
  }

  // Make sure the user is pinging someone
  if (userToIgnore[0] !== "@") {
    await msg.reply("Please make sure to ping a valid user");
    return;
  }

  const foundContact = allContacts.find((con) => con.number === userToIgnore);
  userToIgnore = userToIgnore.slice(1);
  if (blacklistedUsers.has(userToIgnore)) {
    await msg.reply("This user is already blacklisted 😒");
    return;
  } else {
    // Prevent trying to blacklist the bot.
    if (userToIgnore === client.info.wid.user) {
      await msg.reply("I'm the one doing the ignoring here fam 🐦");
      return;
    } else if (userToIgnore === process.env.GRANDMASTER) {
      // Prevent trying to blacklist the owner.
      const isGMAdmin = await isUserBotAdmin(userToIgnore);
      if (isGMAdmin) {
        await msg.reply("Grandmaster cannot be blacklisted 🐦");
        return;
      }
    }
    const isFoundUserBotAdmin = await isUserBotAdmin(userToIgnore);
    if (isFoundUserBotAdmin) {
      await msg.reply("A bot admin cannot be blacklisted 😕"); // todo: Add more replies for this later
      return;
    } else {
      await addBlacklistedUser(userToIgnore);
      if (foundContact) await contact.block();
      await msg.reply("User will now be ignored for eternity ✅"); //todo: Add more replies for this later
    }
  }
};

module.exports = {
  name: "ignore",
  description: "Blacklist a user ☠",
  alias: ["ig"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}ignore @user*`,
  execute,
};
