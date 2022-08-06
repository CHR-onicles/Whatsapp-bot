import { IClient } from "../../interfaces";
import { Message } from "whatsapp-web.js";
import { getMutedStatus, getAllBotAdmins } from "../../models/misc";
import {
  currentPrefix,
  isUserBotAdmin,
  checkForChance,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;

  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);
  const allContacts = await client.getContacts();
  const allBotAdmins = await getAllBotAdmins();

  const foundBotAdmins = [];
  for (const con of allContacts) {
    for (const bot_admin of allBotAdmins) {
      if (con.number === bot_admin) foundBotAdmins.push(con);
    }
  }

  const botReply = await msg.reply(
    "〘✪ 𝔹𝕠𝕥 𝕒𝕕𝕞𝕚𝕟𝕤 ✪〙\n\n" +
      foundBotAdmins
        .map((admin) => `➣ ${admin.number} ~ ${admin?.pushname || ""}\n`)
        .join("")
  );

  if (!isBotAdmin) {
    if (checkForChance(3)) {
      // 30% chance this message is sent to non-bot admins
      await botReply.reply("Reach out to any of them if you need any help 🐦"); // It doesn't quote  `botReply` but it still sends the message so I'll take it 😢👍🏻
    }
  }
};

module.exports = {
  name: "botadmins",
  description: "Get all bot admins 👮🏽‍♂️👮🏽‍♀️",
  alias: ["badmins", "badmin", "botadmin"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n${currentPrefix}botadmins*`,
  execute,
};
