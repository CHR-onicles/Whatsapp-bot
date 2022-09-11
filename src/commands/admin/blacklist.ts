import { IClient } from "../../types";
import { Message } from "whatsapp-web.js";
import { getMutedStatus, getBlacklistedUsers } from "../../models/misc";
import { NOT_BOT_ADMIN_REPLIES } from "../../utils/data";
import {
  isUserBotAdmin,
  pickRandomReply,
  currentPrefix,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;

  const allContacts = await client.getContacts();
  const contact = await msg.getContact();
  const isBotAdmin = await isUserBotAdmin(contact);
  const blacklistedUsers = await getBlacklistedUsers();

  if (!isBotAdmin) {
    await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    return;
  }

  if (blacklistedUsers && !blacklistedUsers.length) {
    await msg.reply("There are currently no blacklisted users");
    return;
  }

  const foundBlacklistedUsers = [];
  if (blacklistedUsers) {
    for (const con of allContacts) {
      for (const black of blacklistedUsers) {
        if (con.number === black) foundBlacklistedUsers.push(con);
      }
    }
  }

  await msg.reply(
    "〘💀 𝔹𝕝𝕒𝕔𝕜𝕝𝕚𝕤𝕥𝕖𝕕 𝕦𝕤𝕖𝕣𝕤 💀〙\n\n" +
      foundBlacklistedUsers
        .map(
          (blackUser) =>
            `➣ ${blackUser.number} ~ ${blackUser?.pushname || ""}\n`
        )
        .join("")
  );
};

module.exports = {
  name: "blacklist",
  description: "Get users who have been blacklisted ☠☠",
  alias: ["black", "bl"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}blacklist*`,
  execute,
};
