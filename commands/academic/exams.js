const { getMutedStatus } = require("../../models/misc");
const { DM_REPLIES, EXAM_TIMETABLE, FOOTNOTES } = require("../../utils/data");
const { pickRandomReply, pickRandomWeightedMessage, currentPrefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const curChat = await msg.getChat();
    const chatFromContact = await contact.getChat();
    let text = "*L400 CS EXAMS TIMETABLE* 📄\n\n";

    if (curChat.isGroup) msg.reply(pickRandomReply(DM_REPLIES));

    EXAM_TIMETABLE.forEach(({ _date, date, time, courseCode, courseTitle, examMode }, index) => {
        const isPast = new Date() - _date > 0 ? true : false; // Check if the exam has already been written
        text += (examMode.toLowerCase().includes('physical') ? "📝" : "🖥") +
            `\n${isPast ? '~' : ''}*Date:* ` + date + `${isPast ? '~' : ''}` +
            `\n${isPast ? '~' : ''}*Time:* ` + time + `${isPast ? '~' : ''}` +
            `\n${isPast ? '~' : ''}*Course code:* ` + courseCode + `${isPast ? '~' : ''}` +
            `\n${isPast ? '~' : ''}*Course title:* ` + courseTitle + `${isPast ? '~' : ''}` +
            `\n${isPast ? '~' : ''}*Exam mode:* ` + examMode + `${isPast ? '~' : ''}` +
            `${index === EXAM_TIMETABLE.length - 1 ? '' : '\n\n'}`;
    });

    await chatFromContact.sendMessage(text);
    setTimeout(async () => await chatFromContact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
}


module.exports = {
    name: "exams",
    description: "Get the current L400 2nd Sem exams timetable 📝",
    alias: ["exam"],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}exams*`,
    execute,
}