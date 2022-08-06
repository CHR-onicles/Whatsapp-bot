import { IClient } from "../../interfaces";
import { Message } from "whatsapp-web.js";
import { getMutedStatus } from "../../models/misc";
import { REACT_EMOJIS, EXAM_TIMETABLE, FOOTNOTES } from "../../utils/data";
import {
  pickRandomReply,
  pickRandomWeightedMessage,
  currentPrefix,
} from "../../utils/helpers";

const execute = async (client: IClient, msg: Message) => {
  if ((await getMutedStatus()) === true) return;

  const contact = await msg.getContact();
  const curChat = await msg.getChat();
  const chatFromContact = await contact.getChat();
  let text = "*L400 CS EXAMS TIMETABLE* 📄\n\n";

  if (curChat.isGroup) await msg.react(pickRandomReply(REACT_EMOJIS));
  if (!EXAM_TIMETABLE.length) {
    await msg.reply("There is NO exam timetable currently 🐦");
    return;
  }

  EXAM_TIMETABLE.forEach(
    ({ _date, date, time, courseCode, courseTitle, examMode }, index) => {
      if (_date) {
        const isPast =
          new Date().getTime() - _date?.getTime() > 0 ? true : false; // Check if the exam has already been written
        text +=
          (examMode?.toLowerCase().includes("physical") ? "📝" : "🖥") +
          `\n${isPast ? "~" : ""}*Date:* ` +
          date +
          `${isPast ? "~" : ""}` +
          `\n${isPast ? "~" : ""}*Time:* ` +
          time +
          `${isPast ? "~" : ""}` +
          `\n${isPast ? "~" : ""}*Course code:* ` +
          courseCode +
          `${isPast ? "~" : ""}` +
          `\n${isPast ? "~" : ""}*Course title:* ` +
          courseTitle +
          `${isPast ? "~" : ""}` +
          `\n${isPast ? "~" : ""}*Exam mode:* ` +
          examMode +
          `${isPast ? "~" : ""}` +
          `${index === EXAM_TIMETABLE.length - 1 ? "" : "\n\n"}`;
      }
    }
  );

  await chatFromContact.sendMessage(text);
  setTimeout(async () => {
    const temp = pickRandomWeightedMessage(FOOTNOTES);
    temp && (await chatFromContact.sendMessage(temp));
  }, 2000);
};

module.exports = {
  name: "exams",
  description: "Get the current L400 2nd Sem exams timetable 📝",
  alias: ["exam"],
  category: "everyone", // admin | everyone
  help: `To use this command, type:\n*${currentPrefix}exams*`,
  execute,
};
