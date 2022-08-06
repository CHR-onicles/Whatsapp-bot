import { IClient } from "../../interfaces";
import { Message } from "whatsapp-web.js";
import { getMutedStatus, removeBotAdmin } from "../../models/misc";
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
    await removeBotAdmin(contact.id.user);
    await msg.reply(
      "You've successfully demoted yourself to a regular user ✅"
    );
  } else {
    await msg.reply("Err... you're kinda already a regular user 🐦");
  }
};

module.exports = {
  name: "selfdemote",
  description: "Demote yourself(Grandmaster only) to be a regular user 👮🏽‍♂️❌",
  alias: ["sdem"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}selfdemote*`,
  execute,
};
