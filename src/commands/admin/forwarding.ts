import { IArgs, IClient } from "../../types";
import { Message } from "whatsapp-web.js";
import {
  getMutedStatus,
  getForwardingStatus,
  enableForwarding,
  disableForwarding,
} from "../../models/misc";
import { NOT_BOT_ADMIN_REPLIES } from "../../utils/data";
import {
  isUserBotAdmin,
  pickRandomReply,
  currentPrefix,
  extractCommandArgs,
} from "../../utils/helpers";

//! THIS COMMAND IS TEMPORARY AND WILL BE REMOVED ONCE
//! THE LOGIC IS FLESHED OUT PROPERLY FOR USERS

const execute = async (client: IClient, msg: Message, args: IArgs) => {
  if ((await getMutedStatus()) === true) return;
  const msgArgs = extractCommandArgs(msg)[0];

  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);
  const curForwardingStatus = await getForwardingStatus();

  if (!isBotAdmin) {
    await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    return;
  }

  switch (msgArgs) {
    case "status":
    case "stats":
    case "-s":
      await msg.reply(
        `Forwarding of important messages is ${
          curForwardingStatus ? "ON ✅" : "OFF ❌"
        }`
      );
      break;

    case "enable":
    case "-e":
      await enableForwarding();
      await msg.reply("Forwarding of important messages is enabled ✅");
      break;

    case "disable":
    case "-d":
      await disableForwarding();
      await msg.reply("Forwarding of important messages is disabled ❌");
      break;

    default:
      await msg.reply(
        `Please add valid arguments:\nEg:\n*${currentPrefix}forwarding status*\n*${currentPrefix}forwarding enable*\n*${currentPrefix}forwarding disable*`
      );
      break;
  }
};

module.exports = {
  name: "forwarding",
  description: "Turn on/off forwarding of announcements and links 📲",
  alias: ["fwd"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}forwarding status*\n*${currentPrefix}forwarding enable* or\n*${currentPrefix}forwarding disable*`,
  execute,
};
