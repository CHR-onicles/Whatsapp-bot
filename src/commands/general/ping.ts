import { IClient } from "src/custom";
import { Message } from "whatsapp-web.js";
import { getMutedStatus } from "../../models/misc";
import { currentPrefix } from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;
  const msgTimestamp = new Date(msg.timestamp * 1000);
  const curTime = new Date();
  const actualPing = Math.abs(curTime.getTime() - msgTimestamp.getTime());
  // console.log('[PING CMD] Msg timestamp:', msgTimestamp, ' | Current time:', curTime)
  // console.log(`[PING CMD] Actual ping: ${actualPing}ms`)
  await msg.reply(`Response in _${actualPing}ms_`);
};

module.exports = {
  name: "ping",
  description: "Get response time of the bot in milliseconds 🙋🏽‍♂️",
  alias: ["p"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}ping*`,
  execute,
};
