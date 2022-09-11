import { IClient } from "../../types";
import { Message } from "whatsapp-web.js";
import { getMutedStatus, unmuteBot } from "../../models/misc";
import { NOT_BOT_ADMIN_REPLIES, UNMUTE_REPLIES } from "../../utils/data";
import {
  pickRandomReply,
  isUserBotAdmin,
  currentPrefix,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);

  if ((await getMutedStatus()) === true) {
    if (isBotAdmin) {
      await msg.reply(pickRandomReply(UNMUTE_REPLIES));
      await unmuteBot();
    }
  } else {
    if (!isBotAdmin) {
      await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
      return;
    }
    await msg.reply(`Haven't been muted yet 🐦`);
  }
};

module.exports = {
  name: "unmute",
  description: "Unmute the bot 🙂",
  alias: ["speak", "talk"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}unmute*`,
  execute,
};
