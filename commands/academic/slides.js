const { List } = require("whatsapp-web.js");
const { getMutedStatus } = require("../../models/misc");
const { COURSE_MATERIALS_REPLIES, WAIT_REPLIES, REACT_EMOJIS } = require("../../utils/data");
const { currentEnv, pickRandomReply, currentPrefix, sendSlides } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { isListResponse, lastPrefixUsed } = args;
    // if (currentEnv === 'production') {
    const contact = await msg.getContact();
    const curChat = await msg.getChat();
    const chatFromContact = await contact.getChat();

    if (curChat.isGroup) await msg.react(pickRandomReply(REACT_EMOJIS));

    const list = new List(
        '\nThis is a list of courses with available materials',
        'See courses',
        [{
            title: '',
            rows: [
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-415_dev' : 'slides-415_prod', title: 'Compilers', description: 'CSCD 415' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-417_dev' : 'slides-417_prod', title: 'Theory & Survey of Programming Languages', description: 'CSCD 417' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-419_dev' : 'slides-419_prod', title: 'Formal Methods', description: 'CSCD 419' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-421_dev' : 'slides-421_prod', title: 'Accounting', description: 'CSCD 421' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-423_dev' : 'slides-423_prod', title: 'Software Modelling & Simulation', description: 'CSCD 423' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-409_dev' : 'slides-409_prod', title: 'Data Mining', description: 'CSCD 409' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'slides-427_dev' : 'slides-427_prod', title: 'Networking', description: 'CSCD 427' },
            ]
        }],
        pickRandomReply(COURSE_MATERIALS_REPLIES),
        'Powered by Ethereal bot'
    );

    !isListResponse && await chatFromContact.sendMessage(list);
    // } else {
    // await msg.reply("The bot is currently hosted locally, so this operation cannot be performed.\n\nThe Grandmaster's data is at stake🐦")
    // }

    if (isListResponse) {
        const selectedRowId = msg.selectedRowId.split('-')[1];
        console.log(`Slides from ${currentEnv} env`)

        switch (selectedRowId) {
            case '415_dev':
                if (currentEnv !== 'development') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES)); // have to repeat this to avoid it leaking when bot environments are running simultaneously
                sendSlides(msg, 'CSCD 415');
                break;

            case '415_prod':
                if (currentEnv !== 'production') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 415');
                break;

            case '417_dev':
                if (currentEnv !== 'development') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 417');
                break;

            case '417_prod':
                if (currentEnv !== 'production') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 417');
                break;

            case '419_dev':
                if (currentEnv !== 'development') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 419');
                break;

            case '419_prod':
                if (currentEnv !== 'production') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 419');
                break;

            case '421_dev':
                if (currentEnv !== 'development') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 421');
                break;

            case '421_prod':
                if (currentEnv !== 'production') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 421');
                break;

            case '409_dev':
                if (currentEnv !== 'development') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 409');
                break;

            case '409_prod':
                if (currentEnv !== 'production') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 409');
                break;

            case '423_dev':
                if (currentEnv !== 'development') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 423');
                break;

            case '423_prod':
                if (currentEnv !== 'production') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 423');
                break;

            case '427_dev':
                if (currentEnv !== 'development') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 427');
                break;

            case '427_prod':
                if (currentEnv !== 'production') break;
                await msg.reply(pickRandomReply(WAIT_REPLIES));
                sendSlides(msg, 'CSCD 427');
                break;

            default:
                break;
        }

        args.isListResponse = false;
    }
}


module.exports = {
    name: "slides",
    description: "Get course materials for all courses 📚",
    alias: ["slide", "res", "resources"],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}slides*, then choose a course from the list provided`,
    execute,
}