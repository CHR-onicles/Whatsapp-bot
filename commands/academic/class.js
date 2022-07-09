const { List } = require("whatsapp-web.js");
const { getMutedStatus, getUsersToNotifyForClass } = require("../../models/misc");
const { FOOTNOTES, REACT_EMOJIS } = require("../../utils/data");
const { currentPrefix, todayClassReply, pickRandomWeightedMessage, pickRandomReply, currentEnv, PROD_PREFIX } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { isListResponse, lastPrefixUsed } = args;
    const contact = await msg.getContact();
    const chatFromContact = await contact.getChat();
    const curChat = await msg.getChat();
    const { multimedia, expert, concurrent, mobile } = await getUsersToNotifyForClass();
    let text = "";

    if (curChat.isGroup) {
        await msg.react(pickRandomReply(REACT_EMOJIS));
    }

    // refactored repeated code into local function
    const helperForClassesToday = async (text, elective) => {
        text += await todayClassReply(text, elective);
        await chatFromContact.sendMessage(text);
        setTimeout(async () => await chatFromContact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
    }

    // if user has already subscribed to be notified for class, get his elective and send the current day's
    // timetable based on the elective.
    if (multimedia.includes(contact.id.user)) {
        helperForClassesToday(text, 'MA');
        return;
    } else if (expert.includes(contact.id.user)) {
        helperForClassesToday(text, 'E');
        return;
    } else if (concurrent.includes(contact.id.user)) {
        helperForClassesToday(text, 'C');
        return;
    } else if (mobile.includes(contact.id.user)) {
        helperForClassesToday(text, 'MC');
        return;
    }

    const list = new List(
        '\nMake a choice from the list of electives',
        'See electives',
        [{
            title: 'Commands available to everyone',
            rows: [
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'class-1_dev' : 'class-1_prod', title: 'Multimedia Applications', description: 'For those offering Multimedia Applications' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'class-2_dev' : 'class-2_prod', title: 'Expert Systems', description: "For those offering Expert Systems" },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'class-3_dev' : 'class-3_prod', title: 'Conc & Distributed Systems', description: 'For those offering Concurrent & Distributed Systems' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'class-4_dev' : 'class-4_prod', title: 'Mobile Computing', description: 'For those offering Mobile Computing' },
            ]
        }],
        'What elective do you offer?',
        'Powered by Ethereal bot'
    );
    // console.log("[CLASS CMD] After creating list, lastPrefixedUsed:", lastPrefixUsed)

    !isListResponse && await chatFromContact.sendMessage(list);

    if (isListResponse) {
        let text = "";
        // console.log('[CLASS CMD] From class:', msg.selectedRowId);
        // console.log('[CLASS CMD] Last prefix used in LR:', lastPrefixUsed)
        const selectedRowId = msg.selectedRowId.split('-')[1];

        // helper function for prevent redundancy
        const helperFunc = async (elective) => {
            text += await todayClassReply(text, elective);
            // await msg.reply(text + `\nFrom ${currentEnv} env`);
            await msg.reply(text);
            setTimeout(async () => await chatFromContact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
        }

        switch (selectedRowId) {
            case '1_dev':
                if (currentEnv !== 'development') break;
                helperFunc('MA');
                break;

            case '1_prod':
                if (currentEnv !== 'production') break;
                helperFunc('MA');
                break;

            case '2_dev':
                if (currentEnv !== 'development') break;
                helperFunc('E');
                break;

            case '2_prod':
                if (currentEnv !== 'production') break;
                helperFunc('E');
                break;

            case '3_dev':
                if (currentEnv !== 'development') break;
                helperFunc('C');
                break;

            case '3_prod':
                if (currentEnv !== 'production') break;
                helperFunc('C');
                break;

            case '4_dev':
                if (currentEnv !== 'development') break;
                helperFunc('MC');
                break;

            case '4_prod':
                if (currentEnv !== 'production') break;
                helperFunc('MC');
                break;

            default:
                break;
        }

        args.isListResponse = false; // to prevent evaluating list response when message type is text
    }
}


module.exports = {
    name: "class",
    description: "Get today's classes depending on your elective 📕",
    alias: [],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}class*, then select an elective`,
    execute,
}