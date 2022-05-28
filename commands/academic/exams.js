const { getMutedStatus } = require("../../models/misc");
const { DM_REPLIES, EXAM_TIMETABLE, FOOTNOTES } = require("../../utils/data");
const { pickRandomReply, pickRandomWeightedMessage, current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const cur_chat = await msg.getChat();
    const chat_from_contact = await contact.getChat();
    let text = "*L400 CS EXAMS TIMETABLE* 📄\n\n";

    if (cur_chat.isGroup) msg.reply(pickRandomReply(DM_REPLIES));

    EXAM_TIMETABLE.forEach(({ _date, date, time, courseCode, courseTitle, examMode }, index) => {
        const is_passed = new Date() - _date > 0 ? true : false; // Check if the exam has already been written
        text += (examMode.toLowerCase().includes('physical') ? "📝" : "🖥") +
            `\n${is_passed ? '~' : ''}*Date:* ` + date + `${is_passed ? '~' : ''}` +
            `\n${is_passed ? '~' : ''}*Time:* ` + time + `${is_passed ? '~' : ''}` +
            `\n${is_passed ? '~' : ''}*Course code:* ` + courseCode + `${is_passed ? '~' : ''}` +
            `\n${is_passed ? '~' : ''}*Course title:* ` + courseTitle + `${is_passed ? '~' : ''}` +
            `\n${is_passed ? '~' : ''}*Exam mode:* ` + examMode + `${is_passed ? '~' : ''}` +
            `${index === EXAM_TIMETABLE.length - 1 ? '' : '\n\n'}`;
    });

    await chat_from_contact.sendMessage(text);
    setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
}


module.exports = {
    name: "exams",
    description: "Get the current L400 2nd Sem exams timetable",
    alias: ["exam"],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}exams`,
    execute,
}