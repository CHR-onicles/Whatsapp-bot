import { IArgs, IClient } from "../../types";
import { List, Message } from "whatsapp-web.js";
import { getMutedStatus } from "../../models/misc";
import {
  COURSE_MATERIALS_REPLIES,
  WAIT_REPLIES,
  REACT_EMOJIS,
} from "../../utils/data";
import {
  currentEnv,
  pickRandomReply,
  currentPrefix,
  sendSlides,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message, args: IArgs) => {
  if ((await getMutedStatus()) === true) return;

  const { isListResponse, lastPrefixUsed } = args;
  // if (currentEnv === 'production') {
  const contact = await msg.getContact();
  const curChat = await msg.getChat();
  const chatFromContact = await contact.getChat();

  if (curChat.isGroup) await msg.react(pickRandomReply(REACT_EMOJIS));

  const list = new List(
    "\nThis is a list of courses with available materials",
    "See courses",
    [
      {
        title: "",
        rows: [
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "slides-416_dev"
                : "slides-416_prod",
            title: "System Programming",
            description: "CSCD 416",
          },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "slides-418_dev"
                : "slides-418_prod",
            title: "Computer Systems Security",
            description: "CSCD 418",
          },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "slides-422_dev"
                : "slides-422_prod",
            title: "Human Computer Interaction",
            description: "CSCD 422",
          },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "slides-424_dev"
                : "slides-424_prod",
            title: "Management Principles",
            description: "CSCD 424",
          },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "slides-400_dev"
                : "slides-400_prod",
            title: "Project",
            description: "CSCD 400",
          },
          // { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-426_dev' : 'slides-426_prod', title: 'Multimedia Applications', description: 'CSCD 426' },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "slides-428_dev"
                : "slides-428_prod",
            title: "Expert Systems",
            description: "CSCD 428",
          },
          // { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-432_dev' : 'slides-432_prod', title: 'Concurrent & Distributed Systems', description: 'CSCD 432' },
          // { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-434_dev' : 'slides-434_prod', title: 'Mobile Computing', description: 'CSCD 434' },
        ],
      },
    ],
    pickRandomReply(COURSE_MATERIALS_REPLIES),
    "Powered by Ethereal bot"
  );

  !isListResponse && (await chatFromContact.sendMessage(list));
  // } else {
  // await msg.reply("The bot is currently hosted locally, so this operation cannot be performed.\n\nThe Grandmaster's data is at stake🐦")
  // }

  if (isListResponse) {
    if (msg.selectedRowId) {
      const selectedRowId = msg.selectedRowId.split("-")[1];

      console.log(`[SLIDES CMD] Slides from ${currentEnv} env`);

      switch (selectedRowId) {
        case "416_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES)); // have to repeat this to avoid it leaking when bot environments are running simultaneously
          sendSlides(msg, "CSCD 416");
          break;

        case "416_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 416");
          break;

        case "418_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 418");
          break;

        case "418_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 418");
          break;

        case "422_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 422");
          break;

        case "422_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 422");
          break;

        case "424_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 424");
          break;

        case "424_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 424");
          break;

        case "400_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 400");
          break;

        case "400_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 400");
          break;

        case "426_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 426");
          break;

        case "426_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 426");
          break;

        case "428_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 428");
          break;

        case "428_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 428");
          break;

        case "432_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 432");
          break;

        case "432_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 432");
          break;

        case "434_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 434");
          break;

        case "434_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendSlides(msg, "CSCD 434");
          break;

        default:
          break;
      }
    }

    args.isListResponse = false;
  }
};

module.exports = {
  name: "slides",
  description: "Get course materials for all courses 📚",
  alias: ["slide", "res", "resources"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}slides*, then choose a course from the list provided`,
  execute,
};
