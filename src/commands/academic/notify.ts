import { IArgs, IClient } from "../../interfaces";
import { List, Message } from "whatsapp-web.js";
import {
  getMutedStatus,
  removeUserToBeNotified,
  getUsersToNotifyForClass,
  addUserToBeNotified,
} from "../../models/misc";
import { REACT_EMOJIS } from "../../utils/data";
import {
  currentEnv,
  pickRandomReply,
  currentPrefix,
  extractCommandArgs,
  stopAllOngoingNotifications,
  startNotificationCalculation,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message, args: IArgs) => {
  if ((await getMutedStatus()) === true) return;

  const { isListResponse, lastPrefixUsed } = args;
  const msgArgs = extractCommandArgs(msg)[0];
  const contact = await msg.getContact();
  const curChat = await msg.getChat();
  const chatFromContact = await contact.getChat();
  const response = await getUsersToNotifyForClass();
  if (response) {
    const { multimedia, expert, concurrent, mobile } = response;
    const totalUsers = [...multimedia, ...expert, ...concurrent, ...mobile];

    if (isListResponse) {
      if (msg.selectedRowId) {
        const selectedRowId = msg.selectedRowId.split("-")[1];

        // console.log('[NOTIFY CMD] selected row id:', selectedRowId)

        // Helper function to solely for refactoring
        const helper = async () => {
          if (totalUsers.includes(contact.id.user)) {
            await msg.reply("You are already being notified for class🐦");
            console.log("[NOTIFY CMD] Already subscribed, from List Response");
            return;
          }

          if (curChat.isGroup) {
            await msg.react(pickRandomReply(REACT_EMOJIS));
          }

          await chatFromContact.sendMessage(
            `🔔 You will now be notified periodically for class, using *${
              selectedRowId[0] === "1"
                ? "Multimedia Applications"
                : selectedRowId[0] === "2"
                ? "Expert Systems"
                : selectedRowId[0] === "3"
                ? "Concurrent & Distributed Systems"
                : "Mobile Computing"
            }* as your elective.\n\nExpect me🐦`
          );
          await addUserToBeNotified(contact.id.user, selectedRowId[0]);
          stopAllOngoingNotifications();
          await startNotificationCalculation(client);
        };

        switch (selectedRowId) {
          case "1_dev":
            if (currentEnv !== "development") break;
            helper();
            // console.log([NOTIFY CMD] 'add user to be notified from 1_dev');
            break;

          case "1_prod":
            if (currentEnv !== "production") break;
            helper();
            // console.log('[NOTIFY CMD] add user to be notified from 1_prod');
            break;

          case "2_dev":
            if (currentEnv !== "development") break;
            helper();
            // console.log('[NOTIFY CMD] add user to be notified from 2_dev');
            break;

          case "2_prod":
            if (currentEnv !== "production") break;
            helper();
            // console.log('[NOTIFY CMD] add user to be notified from 2_prod');
            break;

          case "3_dev":
            if (currentEnv !== "development") break;
            helper();
            // console.log('[NOTIFY CMD] add user to be notified from 3_dev');
            break;

          case "3_prod":
            if (currentEnv !== "production") break;
            helper();
            // console.log('[NOTIFY CMD] add user to be notified from 3_prod');
            break;

          case "4_dev":
            if (currentEnv !== "development") break;
            helper();
            // console.log('[NOTIFY CMD] add user to be notified from 3_dev');
            break;

          case "4_prod":
            if (currentEnv !== "production") break;
            helper();
            // console.log('[NOTIFY CMD] add user to be notified from 3_prod');
            break;

          default:
            break;
        }
      }

      args.isListResponse = false;
      return;
    }

    console.log("[NOTIFY CMD] msg args:", msgArgs);
    switch (msgArgs) {
      case "enable":
      case "-e":
        if (totalUsers.includes(contact.id.user)) {
          await msg.reply("You are already being notified for class🐦");
          console.log("[NOTIFY CMD] Already subscribed from case enable");
          return;
        }

        const list = new List(
          "\nMake a choice from the list of electives",
          "See electives",
          [
            {
              title: "Commands available to everyone",
              rows: [
                {
                  id:
                    lastPrefixUsed === process.env.DEV_PREFIX
                      ? "notify-1_dev"
                      : "notify-1_prod",
                  title: "Multimedia Applications",
                  description: "For those offering Multimedia Applications",
                },
                {
                  id:
                    lastPrefixUsed === process.env.DEV_PREFIX
                      ? "notify-2_dev"
                      : "notify-2_prod",
                  title: "Expert Systems",
                  description: "For those offering Expert Systems",
                },
                {
                  id:
                    lastPrefixUsed === process.env.DEV_PREFIX
                      ? "notify-3_dev"
                      : "notify-3_prod",
                  title: "Conc & Distributed Systems",
                  description:
                    "For those offering Concurrent & Distributed Systems",
                },
                {
                  id:
                    lastPrefixUsed === process.env.DEV_PREFIX
                      ? "notify-4_dev"
                      : "notify-4_prod",
                  title: "Mobile Computing",
                  description: "For those offering Mobile Computing",
                },
              ],
            },
          ],
          "What elective do you offer?",
          "Powered by Ethereal bot"
        );

        !isListResponse && (await msg.reply(list));
        break;

      case "disable":
      case "-d":
        if (totalUsers.includes(contact.id.user)) {
          if (multimedia.includes(contact.id.user)) {
            await removeUserToBeNotified(contact.id.user, "MA");
          } else if (expert.includes(contact.id.user)) {
            await removeUserToBeNotified(contact.id.user, "E");
          } else if (concurrent.includes(contact.id.user)) {
            await removeUserToBeNotified(contact.id.user, "C");
          } else if (mobile.includes(contact.id.user)) {
            await removeUserToBeNotified(contact.id.user, "MC");
          }
          msg.reply("I won't remind you to go to class anymore ✅");
          stopAllOngoingNotifications();
          await startNotificationCalculation(client);
        } else {
          await msg.reply("You weren't subscribed in the first place 🤔");
        }
        break;

      default:
        await msg.reply(
          `You missed some arguments!\nCorrect syntax:\n*${currentPrefix}notify enable* or\n*${currentPrefix}notify disable*`
        );
        break;
    }
  }
};

module.exports = {
  name: "notify",
  description: "Turn on/off reminders for class 🔔",
  alias: [],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}notify enable* or\n*${currentPrefix}notify disable*`,
  execute,
};
