"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../interfaces");
require("whatsapp-web.js");
const misc_1 = require("../../models/misc");
const data_1 = require("../../utils/data");
const helpers_1 = require("../../utils/helpers");
const execute = (client, msg) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const contact = yield msg.getContact();
    const curChat = yield msg.getChat();
    const chatFromContact = yield contact.getChat();
    let text = "*L400 CS EXAMS TIMETABLE* 📄\n\n";
    if (curChat.isGroup)
        yield msg.react((0, helpers_1.pickRandomReply)(data_1.REACT_EMOJIS));
    if (!data_1.EXAM_TIMETABLE.length) {
        yield msg.reply("There is NO exam timetable currently 🐦");
        return;
    }
    data_1.EXAM_TIMETABLE.forEach(({ _date, date, time, courseCode, courseTitle, examMode }, index) => {
        if (_date) {
            const isPast = new Date().getTime() - (_date === null || _date === void 0 ? void 0 : _date.getTime()) > 0 ? true : false; // Check if the exam has already been written
            text +=
                ((examMode === null || examMode === void 0 ? void 0 : examMode.toLowerCase().includes("physical")) ? "📝" : "🖥") +
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
                    `${index === data_1.EXAM_TIMETABLE.length - 1 ? "" : "\n\n"}`;
        }
    });
    yield chatFromContact.sendMessage(text);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const temp = (0, helpers_1.pickRandomWeightedMessage)(data_1.FOOTNOTES);
        temp && (yield chatFromContact.sendMessage(temp));
    }), 2000);
});
module.exports = {
    name: "exams",
    description: "Get the current L400 2nd Sem exams timetable 📝",
    alias: ["exam"],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}exams*`,
    execute,
};
