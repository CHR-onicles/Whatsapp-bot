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
const whatsapp_web_js_1 = require("whatsapp-web.js");
const misc_1 = require("../../models/misc");
const data_1 = require("../../utils/data");
const helpers_1 = require("../../utils/helpers");
const execute = (client, msg, args) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const { isListResponse, lastPrefixUsed } = args;
    // if (currentEnv === 'production') {
    const contact = yield msg.getContact();
    const curChat = yield msg.getChat();
    const chatFromContact = yield contact.getChat();
    if (curChat.isGroup)
        yield msg.react((0, helpers_1.pickRandomReply)(data_1.REACT_EMOJIS));
    const list = new whatsapp_web_js_1.List("\nThis is a list of courses with available materials", "See courses", [
        {
            title: "",
            rows: [
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "slides-416_dev"
                        : "slides-416_prod",
                    title: "System Programming",
                    description: "CSCD 416",
                },
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "slides-418_dev"
                        : "slides-418_prod",
                    title: "Computer Systems Security",
                    description: "CSCD 418",
                },
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "slides-422_dev"
                        : "slides-422_prod",
                    title: "Human Computer Interaction",
                    description: "CSCD 422",
                },
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "slides-424_dev"
                        : "slides-424_prod",
                    title: "Management Principles",
                    description: "CSCD 424",
                },
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "slides-400_dev"
                        : "slides-400_prod",
                    title: "Project",
                    description: "CSCD 400",
                },
                // { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-426_dev' : 'slides-426_prod', title: 'Multimedia Applications', description: 'CSCD 426' },
                {
                    id: lastPrefixUsed === process.env.DEV_PREFIX
                        ? "slides-428_dev"
                        : "slides-428_prod",
                    title: "Expert Systems",
                    description: "CSCD 428",
                },
                // { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-432_dev' : 'slides-432_prod', title: 'Concurrent & Distributed Systems', description: 'CSCD 432' },
                // { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-434_dev' : 'slides-434_prod', title: 'Mobile Computing', description: 'CSCD 434' },
            ],
        },
    ], (0, helpers_1.pickRandomReply)(data_1.COURSE_MATERIALS_REPLIES), "Powered by Ethereal bot");
    !isListResponse && (yield chatFromContact.sendMessage(list));
    // } else {
    // await msg.reply("The bot is currently hosted locally, so this operation cannot be performed.\n\nThe Grandmaster's data is at stake🐦")
    // }
    if (isListResponse) {
        if (msg.selectedRowId) {
            const selectedRowId = msg.selectedRowId.split("-")[1];
            console.log(`[SLIDES CMD] Slides from ${helpers_1.currentEnv} env`);
            switch (selectedRowId) {
                case "416_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES)); // have to repeat this to avoid it leaking when bot environments are running simultaneously
                    (0, helpers_1.sendSlides)(msg, "CSCD 416");
                    break;
                case "416_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 416");
                    break;
                case "418_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 418");
                    break;
                case "418_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 418");
                    break;
                case "422_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 422");
                    break;
                case "422_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 422");
                    break;
                case "424_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 424");
                    break;
                case "424_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 424");
                    break;
                case "400_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 400");
                    break;
                case "400_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 400");
                    break;
                case "426_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 426");
                    break;
                case "426_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 426");
                    break;
                case "428_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 428");
                    break;
                case "428_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 428");
                    break;
                case "432_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 432");
                    break;
                case "432_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 432");
                    break;
                case "434_dev":
                    if (helpers_1.currentEnv !== "development")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 434");
                    break;
                case "434_prod":
                    if (helpers_1.currentEnv !== "production")
                        break;
                    yield msg.reply((0, helpers_1.pickRandomReply)(data_1.WAIT_REPLIES));
                    (0, helpers_1.sendSlides)(msg, "CSCD 434");
                    break;
                default:
                    break;
            }
        }
        args.isListResponse = false;
    }
});
module.exports = {
    name: "slides",
    description: "Get course materials for all courses 📚",
    alias: ["slide", "res", "resources"],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}slides*, then choose a course from the list provided`,
    execute,
};
