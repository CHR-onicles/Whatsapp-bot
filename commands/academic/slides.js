const { List } = require("whatsapp-web.js");
const { getMutedStatus } = require("../../models/misc");
const { COURSE_MATERIALS_REPLIES, WAIT_REPLIES, DM_REPLIES } = require("../../utils/data");
const { current_env, pickRandomReply, current_prefix, sendSlides } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { isListResponse, lastPrefixUsed } = args;
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
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-415-dev' : 'slides-415-prod', title: 'Compilers', description: 'CSCD 415' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-417-dev' : 'slides-417-prod', title: 'Theory & Survey of Programming Languages', description: 'CSCD 417' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-419-dev' : 'slides-419-prod', title: 'Formal Methods', description: 'CSCD 419' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-421-dev' : 'slides-421-prod', title: 'Accounting', description: 'CSCD 421' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-423-dev' : 'slides-423-prod', title: 'Software Modelling & Simulation', description: 'CSCD 423' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-409-dev' : 'slides-409-prod', title: 'Data Mining', description: 'CSCD 409' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-427-dev' : 'slides-427-prod', title: 'Networking', description: 'CSCD 427' },
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
            case '415_dev':
                if (current_env !== 'development') break;
                sendSlides(msg, 'CSCD 415');
                break;

            case '415_prod':
                if (current_env !== 'production') break;
                sendSlides(msg, 'CSCD 415');
                break;

            case '417_dev':
                if (current_env !== 'development') break;
                sendSlides(msg, 'CSCD 417');
                break;

            case '417_prod':
                if (current_env !== 'production') break;
                sendSlides(msg, 'CSCD 417');
                break;

            case '419_dev':
                if (current_env !== 'development') break;
                sendSlides(msg, 'CSCD 419');
                break;

            case '419_prod':
                if (current_env !== 'production') break;
                sendSlides(msg, 'CSCD 419');
                break;

            case '421_dev':
                if (current_env !== 'development') break;
                sendSlides(msg, 'CSCD 421');
                break;

            case '421_prod':
                if (current_env !== 'production') break;
                sendSlides(msg, 'CSCD 421');
                break;

            case '409_dev':
                if (current_env !== 'development') break;
                sendSlides(msg, 'CSCD 409');
                break;

            case '409_prod':
                if (current_env !== 'production') break;
                sendSlides(msg, 'CSCD 409');
                break;

            case '423_dev':
                if (current_env !== 'development') break;
                sendSlides(msg, 'CSCD 423');
                break;

            case '423_prod':
                if (current_env !== 'production') break;
                sendSlides(msg, 'CSCD 423');
                break;

            case '427_dev':
                if (current_env !== 'development') break;
                sendSlides(msg, 'CSCD 427');
                break;

            case '427_prod':
                if (current_env !== 'production') break;
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