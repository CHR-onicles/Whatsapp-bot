import { IClient } from "../../types";
import { GroupChat, Message } from "whatsapp-web.js";
import { getMutedStatus, addBotAdmin } from "../../models/misc";
import {
  NOT_BOT_ADMIN_REPLIES,
  PROMOTE_BOT_REPLIES,
  PROMOTE_GRANDMASTER_REPLIES,
} from "../../utils/data";
import {
  isUserBotAdmin,
  pickRandomReply,
  currentPrefix,
  extractCommandArgs,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;

  const userToPromote = extractCommandArgs(msg)[0];
  const curChat = await msg.getChat() as GroupChat;
  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);

  // Don't do anything if run by a user who is not a bot admin.
  if (!isBotAdmin) {
    await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    return;
  }

  if (!userToPromote) {
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
  if (userToPromote[0] !== "@") {
    await msg.reply("Please make sure to ping a valid user");
    return;
  }

  const foundUser = curChat.participants.find(
    (user) => user.id.user === userToPromote.slice(1)
  );

  if (foundUser) {
    // The bot shouldn't be promoted lol.
    if (foundUser.id.user === client.info.wid.user) {
      await msg.reply(pickRandomReply(PROMOTE_BOT_REPLIES));
      return;
    } else if (foundUser.id.user === process.env.GRANDMASTER) {
      const isGMAdmin = await isUserBotAdmin(foundUser);
      if (isGMAdmin) {
        await msg.reply(pickRandomReply(PROMOTE_GRANDMASTER_REPLIES));
        return;
      }
    }
    const isFoundUserBotAdmin = await isUserBotAdmin(foundUser);
    if (isFoundUserBotAdmin) {
      await msg.reply("This user is already a bot admin 😕"); // todo: Add more replies for this later
      return;
    } else {
      await addBotAdmin(foundUser.id.user);
      await msg.reply("Bot admin successfully added! ✅"); //todo: Add more replies for this later
    }
  } else {
    await msg.reply("Sorry, I couldn't find that user ☹");
    return;
  }
};

module.exports = {
  name: "promote",
  description: "Promote a user to be a bot admin 👮🏽‍♂️",
  alias: ["prom"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}promote @user*`,
  execute,
};
