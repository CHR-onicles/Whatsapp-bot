const { List } = require("whatsapp-web.js");
const { getMutedStatus } = require("../../models/misc");
const { COURSE_MATERIALS_REPLIES, WAIT_REPLIES, DM_REPLIES } = require("../../utils/data");
const { current_env, pickRandomReply, current_prefix, sendSlides } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;
    const { isListResponse } = args;

    // if (current_env === 'production') {
    const contact = await msg.getContact();
    const cur_chat = await msg.getChat();
    const chat_from_contact = await contact.getChat();

    if (cur_chat.isGroup) await msg.reply(pickRandomReply(DM_REPLIES));

    const list = new List(
        '\nThis is a list of courses with available materials',
        'See courses',
        [{
            title: '',
            rows: [
                { id: 'slides-415', title: 'Compilers', description: 'CSCD 415' },
                { id: 'slides-417', title: 'Theory & Survey of Programming Languages', description: 'CSCD 417' },
                { id: 'slides-419', title: 'Formal Methods', description: 'CSCD 419' },
                { id: 'slides-421', title: 'Accounting', description: 'CSCD 421' },
                { id: 'slides-423', title: 'Software Modelling & Simulation', description: 'CSCD 423' },
                { id: 'slides-409', title: 'Data Mining', description: 'CSCD 409' },
                { id: 'slides-427', title: 'Networking', description: 'CSCD 427' },
            ]
        }],
        pickRandomReply(COURSE_MATERIALS_REPLIES),
        'Powered by Ethereal bot'
    );

    await chat_from_contact.sendMessage(list);
    // } else {
    // await msg.reply("The bot is currently hosted locally, so this operation cannot be performed.\n\nThe Grandmaster's data is at stake🐦")
    // }

    if (isListResponse) {
        await msg.reply(pickRandomReply(WAIT_REPLIES));
        const selectedRowId = msg.selectedRowId.split('-')[1];

        switch (selectedRowId) {
            case '415':
                sendSlides(msg, 'CSCD 415');
                break;
            case '417':
                sendSlides(msg, 'CSCD 417');
                break;
            case '419':
                sendSlides(msg, 'CSCD 419');
                break;
            case '421':
                sendSlides(msg, 'CSCD 421');
                break;
            case '409':
                sendSlides(msg, 'CSCD 409');
                break;
            case '423':
                sendSlides(msg, 'CSCD 423');
                break;
            case '427':
                sendSlides(msg, 'CSCD 427');
                break;
            default:
                break;
        }
    }
}


module.exports = {
    name: "slides",
    description: "Get course materials for all courses 📚",
    alias: ["slide", "res", "resources"],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}slides, then choose a course from the list provided`,
    execute,
}