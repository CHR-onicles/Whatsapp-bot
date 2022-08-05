import { IArgs, IClient } from "src/custom";
import { List, Message } from "whatsapp-web.js";
import { getMutedStatus } from "../../models/misc";
import { REACT_EMOJIS, PING_REPLIES } from "../../utils/data";
import {
  isUserBotAdmin,
  pickRandomReply,
  currentPrefix,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message, args: IArgs) => {
  if ((await getMutedStatus()) === true) return;

  const contact = await msg.getContact();
  const chatFromContact = await contact.getChat();
  const curChat = await msg.getChat();
  const isBotAdmin = await isUserBotAdmin(contact);
  const isGrandmaster = contact.id.user === process.env.GRANDMASTER;

  if (curChat.isGroup) {
    await msg.react(pickRandomReply(REACT_EMOJIS));
  }

  // Have to keep this array here because I want the most updated list of super Admins
  // every time this is needed.

  let startID = 0; // dynamic ID to be used for whatsapp list
  const tempRows: {
    id: string;
    title: string;
    description: string;
  }[] = [];

  if (client.commands) {
    client.commands.forEach((value, key) => {
      startID++;
      if (value.name === "notify") {
        tempRows.push({
          id: `menu-${startID}`,
          title: currentPrefix + value.name + " enable",
          description: "Turn on notifications for class",
        });
        startID++;
        tempRows.push({
          id: `menu-${startID}`,
          title: currentPrefix + value.name + " disable",
          description: "Turn off notifications for class",
        });
        return;
      }

      if (!isBotAdmin && value.category === "everyone") {
        tempRows.push({
          id: `menu-${startID}`,
          title: currentPrefix + value.name,
          description: value.description,
        });
      } else if (isBotAdmin) {
        if (
          (value.name === "selfpromote" || value.name === "selfdemote") &&
          contact.id.user !== process.env.GRANDMASTER
        ) {
          return; // kinda acts like "continue" I guess
        }
        tempRows.push({
          id: `menu-${startID}`,
          title: currentPrefix + value.name,
          description: value.description,
        });
      }
    });
  }

  tempRows.sort((a, b) => a.title.localeCompare(b.title));

  const list = new List(
    "\nThis is a list of commands the bot can execute",
    "See commands",
    [
      {
        title: `Commands available to ${
          isBotAdmin
            ? isGrandmaster
              ? "Grandmaster"
              : "bot admins"
            : "everyone"
        }`,
        rows: tempRows,
      },
    ],
    isBotAdmin
      ? pickRandomReply(PING_REPLIES.botAdmin.concat(PING_REPLIES.everyone))
      : pickRandomReply(PING_REPLIES.everyone),
    "Powered by Ethereal bot"
  );

  if (curChat.isGroup) {
    await chatFromContact.sendMessage(list);
  } else if (!curChat.isGroup) {
    await msg.reply(list);
  }
};

module.exports = {
  name: "menu",
  description: "Get list of commands ⚙",
  alias: ["commands", "command", "coms", "comms", "menus"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}menu* or ping the bot in a group chat`,
  execute,
};
