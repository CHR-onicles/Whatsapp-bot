import { IClient } from "../../interfaces";
import { Message } from "whatsapp-web.js";
import { getMutedStatus } from "../../models/misc";
import { SOURCE_CODE } from "../../utils/data";
import { currentPrefix } from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;
  await msg.reply("My source code can be found here:\n\n" + SOURCE_CODE, "", {
    linkPreview: true,
  }); // link preview not working on Multi-Device
};

module.exports = {
  name: "sourcecode",
  description: "Get the bot's source code 💻",
  alias: ["sc", "source"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}sourcecode*`,
  execute,
};
