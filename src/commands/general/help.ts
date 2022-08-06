import { IArgs, IClient } from "src/custom";
import { Message } from "whatsapp-web.js";
import { getMutedStatus } from "../../models/misc";
import { REACT_EMOJIS, NOT_BOT_ADMIN_REPLIES } from "../../utils/data";
import {
  currentPrefix,
  isUserBotAdmin,
  pickRandomReply,
  extractCommandArgs,
  BOT_PUSHNAME,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message, args: IArgs) => {
  if ((await getMutedStatus()) === true) return;

  const msgArgs = extractCommandArgs(msg);
  const curChat = await msg.getChat();
  const contact = await msg.getContact();
  const chatFromContact = await contact.getChat();
  const isBotAdmin = await isUserBotAdmin(contact);
  let text = `Hello there I'm *${BOT_PUSHNAME}*🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n`;

  if (curChat.isGroup) {
    await msg.react(pickRandomReply(REACT_EMOJIS));
  }

  // If user just types help with no arguments, show all commands
  if (!msgArgs.length) {
    client.commands && client.commands.get("menu")?.execute(client, msg, args);
  }

  // If user types help with a command as an argument show info for that command
  if (msgArgs.length) {
    const commandName = msgArgs[0];
    if (client.commands && !client.commands.has(commandName)) {
      await chatFromContact.sendMessage("That command does not exist.");
      return;
    }
    let command = null;
    try {
      command = client.commands && client.commands.get(commandName);
    } catch (error) {
      console.error(error);
    }

    if (!isBotAdmin && command?.category === "admin") {
      await chatFromContact.sendMessage(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
      return;
    } else {
      await chatFromContact.sendMessage(
        `*Command:* ${currentPrefix}${command?.name}\n\n` +
          `*Aliases:* ${
            command?.alias.length
              ? command?.alias.map((alias: string) => alias).join(", ")
              : "None"
          }\n\n` +
          `*Description:* ${command?.description}\n\n` +
          `*Usage:*\n${command?.help}`
      );
    }
  }

  if (isBotAdmin) {
    text +=
      "\n\nPS:  You're a *bot admin*, so you have access to _special_ commands 🤫";
  }
};

module.exports = {
  name: "help",
  description: "Give more information about specific commands 💡",
  alias: ["h"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}help* or\n*${currentPrefix}help <command>*`,
  execute,
};
