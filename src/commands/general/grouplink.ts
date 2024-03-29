import { IClient } from "../../types";
import { GroupChat, Message } from "whatsapp-web.js";
import { getMutedStatus } from "../../models/misc";
import { currentPrefix } from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;

  const groupChat = await msg.getChat() as GroupChat;
  // console.log([GROUPLINK CMD] groupChat.participants);

  if (!groupChat.isGroup) {
    await msg.reply("This is not a group chat!");
    return;
  }

  const botChatObj = groupChat.participants.find(
    (chatObj) => chatObj.id.user === client.info.wid.user
  );
  if (botChatObj && !botChatObj.isAdmin) {
    await msg.reply("I am not an admin in this group, so I can't do this");
    return;
  }

  const invite =
    "https://chat.whatsapp.com/" + (await groupChat.getInviteCode());
  await msg.reply(invite, "", { linkPreview: true }); // link preview is not supported on Multi-Device...whatsapp fault, not whatsapp-web.js library
};

module.exports = {
  name: "grouplink",
  description: "Get the current group's invite link 📱",
  alias: ["gl", "glink"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}grouplink*`,
  execute,
};
