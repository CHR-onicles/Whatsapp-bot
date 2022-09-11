import { IClient } from "../../types";
import { Message } from "whatsapp-web.js";
import { getMutedStatus, muteBot } from "../../models/misc";
import { MUTE_REPLIES, NOT_BOT_ADMIN_REPLIES } from "../../utils/data";
import {
  pickRandomReply,
  isUserBotAdmin,
  currentPrefix,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;

  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);

  if (!isBotAdmin) {
    await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    return;
  }

  await msg.reply(pickRandomReply(MUTE_REPLIES));
  await muteBot();
};

module.exports = {
  name: "mute",
  description: "Mute the bot 🤐",
  alias: ["silence", "quiet"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}mute*`,
  execute,
};
