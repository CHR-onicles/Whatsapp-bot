const { List } = require("whatsapp-web.js");
const { getMutedStatus, getUsersToNotifyForClass } = require("../../models/misc");
const { REACT_EMOJIS, FOOTNOTES, ALL_CLASSES } = require("../../utils/data");
const { pickRandomReply, currentPrefix, pickRandomWeightedMessage, allClassesReply, currentEnv } = require("../../utils/helpers");

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
    const helperForAllClassesReply = async (text, elective) => {
        text += allClassesReply(ALL_CLASSES, elective, text)
        await chatFromContact.sendMessage(text);
        setTimeout(async () => {
            const temp = pickRandomWeightedMessage(FOOTNOTES);
            temp && await chatFromContact.sendMessage(temp);
        }, 2000);
    }

    // if the user has already subscribed to be notified, find his elective and send the timetable based on that.
    if (multimedia.includes(contact.id.user)) {
        helperForAllClassesReply(text, 'MA');
        return;
    } else if (expert.includes(contact.id.user)) {
        helperForAllClassesReply(text, 'E');
        return;
    } else if (concurrent.includes(contact.id.user)) {
        helperForAllClassesReply(text, 'C');
        return;
    } else if (mobile.includes(contact.id.user)) {
        helperForAllClassesReply(text, 'MC');
        return;
    }

    const list = new List(
        '\nMake a choice from the list of electives',
        'See electives',
        [{
            title: 'Commands available to everyone',
            rows: [
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'classes-1_dev' : 'classes-1_prod', title: 'Multimedia Applications', description: 'For those offering Multimedia Applications' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'classes-2_dev' : 'classes-2_prod', title: 'Expert Systems', description: "For those offering Expert Systems" },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'classes-3_dev' : 'classes-3_prod', title: 'Conc & Distributed Systems', description: 'For those offering Concurrent & Distributed Systems' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'classes-4_dev' : 'classes-4_prod', title: 'Mobile Computing', description: 'For those offering Mobile Computing' },
            ]
        }],
        'What elective do you offer?',
        'Powered by Ethereal bot'
    );
    !isListResponse && await chatFromContact.sendMessage(list);

    if (isListResponse) {
        let text = "";
        const selectedRowId = msg.selectedRowId.split('-')[1];


        // helper function for prevent redundancy
        const helperFunc = async (elective) => {
            text += allClassesReply(ALL_CLASSES, elective, text);
            // await msg.reply(text + `\nFrom ${currentEnv} env`);
            await msg.reply(text);
            setTimeout(async () => {
                const temp = pickRandomWeightedMessage(FOOTNOTES);
                temp && await chatFromContact.sendMessage(temp);
            }, 2000);
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
    name: "classes",
    description: "Get the classes for the week 📚",
    alias: [],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}classes*, then select your elective`,
    execute,
}