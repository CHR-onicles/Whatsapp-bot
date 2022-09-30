import { IArgs, IClient } from "../../types";
import { List, Message } from "whatsapp-web.js";
import { getMutedStatus } from "../../models/misc";
import {
  PAST_QUESTIONS_REPLIES,
  WAIT_REPLIES,
  REACT_EMOJIS,
} from "../../utils/data";
import {
  currentEnv,
  pickRandomReply,
  currentPrefix,
  sendPastQuestions,
} from "../../utils/helpers";

// Past Questions are referred to as "pasco"

const execute = async (client: IClient, msg: Message, args: IArgs) => {
  if ((await getMutedStatus()) === true) return;

  const { isListResponse, lastPrefixUsed } = args;
  // if (currentEnv === 'production') {
  const contact = await msg.getContact();
  const curChat = await msg.getChat();
  const chatFromContact = await contact.getChat();

  if (curChat.isGroup) await msg.react(pickRandomReply(REACT_EMOJIS));

  const list = new List(
    "\nThis is a list of courses with available past questions",
    "See courses",
    [
      {
        title: "",
        rows: [
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "pasco-416_dev"
                : "pasco-416_prod",
            title: "System Programming",
            description: "CSCD 416",
          },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "pasco-418_dev"
                : "pasco-418_prod",
            title: "Computer Systems Security",
            description: "CSCD 418",
          },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "pasco-422_dev"
                : "pasco-422_prod",
            title: "Human Computer Interaction",
            description: "CSCD 422",
          },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "pasco-424_dev"
                : "pasco-424_prod",
            title: "Management Principles",
            description: "CSCD 424",
          },
          // { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'pasco-426_dev' : 'pasco-426_prod', title: 'Multimedia Applications', description: 'CSCD 426' },
          {
            id:
              lastPrefixUsed === process.env.DEV_PREFIX
                ? "pasco-428_dev"
                : "pasco-428_prod",
            title: "Expert Systems",
            description: "CSCD 428",
          },
          // { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'pasco-434_dev' : 'pasco-434_prod', title: 'Mobile Computing', description: 'CSCD 434' },
        ],
      },
    ],
    pickRandomReply(PAST_QUESTIONS_REPLIES),
    "Powered by Ethereal bot"
  );

  !isListResponse && (await chatFromContact.sendMessage(list));
  // } else {
  // await msg.reply("The bot is currently hosted locally, so this operation cannot be performed.\n\nThe Grandmaster's data is at stake🐦")
  // }

  if (isListResponse) {
    if (msg.selectedRowId) {
      const selectedRowId = msg.selectedRowId.split("-")[1];

      console.log(`[PASCO CMD] Past Questions from ${currentEnv} env`);

      switch (selectedRowId) {
        case "416_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES)); // have to repeat this to avoid it leaking when bot environments are running simultaneously
          sendPastQuestions(msg, "CSCD 416");
          break;

        case "416_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 416");
          break;

        case "418_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 418");
          break;

        case "418_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 418");
          break;

        case "422_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 422");
          break;

        case "422_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 422");
          break;

        case "424_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 424");
          break;

        case "424_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 424");
          break;

        case "426_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 426");
          break;

        case "426_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 426");
          break;

        case "428_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 428");
          break;

        case "428_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 428");
          break;

        case "434_dev":
          if (currentEnv !== "development") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 434");
          break;

        case "434_prod":
          if (currentEnv !== "production") break;
          await msg.reply(pickRandomReply(WAIT_REPLIES));
          sendPastQuestions(msg, "CSCD 434");
          break;

        default:
          break;
      }
    }

    args.isListResponse = false;
  }
};

module.exports = {
  name: "pasco",
  description: "Get past questions for all courses 📚",
  alias: ["pascos", "pq", "passco"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}pasco*, then choose a course from the list provided`,
  execute,
};
