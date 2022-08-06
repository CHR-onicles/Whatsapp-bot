import {
  getMutedStatus,
  getAllAnnouncements,
  getAllLinks,
  getNotificationStatus,
  getForwardingStatus,
} from "../../models/misc";
import {
  msToDHMS,
  currentPrefix,
  currentEnv,
  pickRandomReply,
  isUserBotAdmin,
} from "../../utils/helpers";
import { totalmem } from "os";
import { NOT_BOT_ADMIN_REPLIES } from "../../utils/data";
import { IArgs, IClient } from "src/custom";
import { Message, MessageContent } from "whatsapp-web.js";

const execute = async (client: IClient, msg: Message, args: IArgs) => {
  if ((await getMutedStatus()) === true) return;

  const { BOT_START_TIME, RUN_FIRST_TIME } = args;
  if (!BOT_START_TIME) throw new Error("[STATUS CMD] Invalid Bot Start Time");
  let isBotAdmin = null;
  if (!RUN_FIRST_TIME) {
    // to prevent getting an error when running for the first time
    const contact = await msg.getContact();
    isBotAdmin = await isUserBotAdmin(contact);
  }

  if (!isBotAdmin && !RUN_FIRST_TIME) {
    await msg.reply(pickRandomReply(NOT_BOT_ADMIN_REPLIES));
    return;
  }

  // Helper function to run this piece of code on special occasions
  const generateReplies = async () => {
    const notifsStatus = await getNotificationStatus();
    if (notifsStatus) {
      const {
        CSCD416,
        CSCD418,
        CSCD422,
        CSCD424,
        CSCD426,
        CSCD428,
        CSCD432,
        CSCD434,
      } = notifsStatus;
      const isForwardingOn = await getForwardingStatus();
      const allChats = await client.getChats();
      const blocked_chats = await client.getBlockedContacts();
      const { groupChats, private_chats } = allChats.reduce(
        (chats, chat) => {
          if (chat.isGroup) chats.groupChats += 1;
          else chats.private_chats += 1;
          return chats;
        },
        { groupChats: 0, private_chats: 0 }
      );
      const allAnnouncements = await getAllAnnouncements();
      const allLinks = await getAllLinks();

      const currentTime = new Date();
      const { days, hours, minutes, seconds } = msToDHMS(
        currentTime.getTime() - BOT_START_TIME.getTime()
      );

      let reply = ["▄▀▄▀  𝔹𝕆𝕋 𝕊𝕋𝔸𝕋𝕌𝕊  ▀▄▀▄\n"];
      reply.push(`[🔰] *Environment:* ${currentEnv}`);
      reply.push(`[🔰] *Platform:* ${process.platform}`);
      if (!RUN_FIRST_TIME) {
        reply.push(
          `[🔰] *Response time:* ${Math.abs(
            new Date().getTime() - new Date(msg.timestamp * 1000).getTime()
          )}ms`
        );
      }
      reply.push(
        `[🔰] *Uptime:*${days ? " " + days : ""}${
          days ? (days === 1 ? "day" : "days") : ""
        }${hours ? " " + hours : ""}${
          hours ? (hours === 1 ? "hr" : "hrs") : ""
        }${minutes ? " " + minutes : " 0mins"}${
          minutes ? (minutes === 1 ? "min" : "mins") : ""
        } ${seconds ? seconds : 0}secs`
      );
      reply.push(
        `[🔰] *Ram:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )} MB / ${Math.round(Number(totalmem) / 1024 / 1024)} MB`
      );
      reply.push(`[🔰] *Total chats:* ${allChats.length}`);
      reply.push(`[🔰] *Group chats:* ${groupChats}`);
      reply.push(`[🔰] *Private chats:* ${private_chats}`);
      reply.push(`[🔰] *Blocked chats:* ${blocked_chats.length}`);
      reply.push(
        `[🔰] *Announcements stored:* ${
          allAnnouncements && allAnnouncements.length
        }`
      );
      reply.push(`[🔰] *Links stored:* ${allLinks && allLinks.length}`);
      reply.push(
        `[🔰] *Forwarding stuff status:* ${isForwardingOn ? "✅" : "❌"}\n`
      ); // temporary - will be removed soon

      reply.push(
        `[🔰] *CSCD416 notification status:* ${CSCD416 ? "✅" : "❌"}`
      );
      reply.push(
        `[🔰] *CSCD418 notification status:* ${CSCD418 ? "✅" : "❌"}`
      );
      reply.push(
        `[🔰] *CSCD422 notification status:* ${CSCD422 ? "✅" : "❌"}`
      );
      reply.push(
        `[🔰] *CSCD424 notification status:* ${CSCD424 ? "✅" : "❌"}`
      );
      // reply.push(`[🔰] *CSCD400 notification status:* ${CSCD400 ? "✅" : "❌"}`);
      reply.push(
        `[🔰] *CSCD426 notification status:* ${CSCD426 ? "✅" : "❌"}`
      );
      reply.push(
        `[🔰] *CSCD428 notification status:* ${CSCD428 ? "✅" : "❌"}`
      );
      reply.push(
        `[🔰] *CSCD432 notification status:* ${CSCD432 ? "✅" : "❌"}`
      );
      reply.push(
        `[🔰] *CSCD434 notification status:* ${CSCD434 ? "✅" : "❌"}`
      );
      return reply.join("\n");
    }
  };

  const logger = async () => {
    const chats = await client.getChats();
    const BOT_LOG_GROUP = process.env.BOT_LOG_GROUP;
    const botLogGroup = chats.find((chat) => chat.id.user === BOT_LOG_GROUP);
    if (botLogGroup) {
      await botLogGroup.sendMessage(await generateReplies() as MessageContent); // send status once before the 1hour interval starts
      setInterval(async () => {
        await botLogGroup.sendMessage(await generateReplies() as MessageContent);
      }, 3600_000);
    }

    if (RUN_FIRST_TIME && currentEnv === "production") {
      logger();
      args.RUN_FIRST_TIME = false;
    } else {
      await msg.reply(await generateReplies() as MessageContent);
    }
  };
};

module.exports = {
  name: "status",
  description: "Check bot's overall status/diagnostics 🩺",
  alias: ["st", "stats", "stat"],
  category: "admin", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}status*`,
  execute,
};
