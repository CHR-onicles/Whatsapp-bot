import { IClient } from "../../types";
import { Message } from "whatsapp-web.js";
import { getMutedStatus, addBotAdmin } from "../../models/misc";
import { isUserBotAdmin, currentPrefix } from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;

  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);

  if (contact.id.user !== process.env.GRANDMASTER) {
    await msg.reply("This is specially reserved for the Grandmaster only 🐦");
    return;
  }

  if (isBotAdmin) {
    await msg.reply("Err... you're kinda already a bot admin 🐦");
    return;
  } else {
    await addBotAdmin(contact.id.user);
    await msg.reply("You've successfully added yourself as a bot admin ✅");
  }
};

module.exports = {
  name: "selfpromote",
  description: "Promote yourself(Grandmaster only) to be a bot admin 👮🏽‍♂️♻",
  alias: ["sprom"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}selfpromote*`,
  execute,
};
