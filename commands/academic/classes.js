const { List } = require("whatsapp-web.js");
const { getMutedStatus, getUsersToNotifyForClass } = require("../../models/misc");
const { DM_REPLIES, FOOTNOTES, ALL_CLASSES } = require("../../utils/data");
const { pickRandomReply, current_prefix, pickRandomWeightedMessage, allClassesReply, current_env } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { isListResponse, lastPrefixUsed } = args;
    const contact = await msg.getContact();
    const chat_from_contact = await contact.getChat();
    const cur_chat = await msg.getChat();
    const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
    let text = "";

    if (cur_chat.isGroup) {
        await msg.reply(pickRandomReply(DM_REPLIES));
    }

    // refactored repeated code into local function
    const helperForAllClassesReply = async (text, elective) => {
        text += allClassesReply(ALL_CLASSES, elective, text)
        await chat_from_contact.sendMessage(text);
        setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
    }

    // if the user has already subscribed to be notified, find his elective and send the timetable based on that.
    if (dataMining.includes(contact.id.user)) {
        helperForAllClassesReply(text, 'D');
        return;
    } else if (networking.includes(contact.id.user)) {
        helperForAllClassesReply(text, 'N');
        return;
    } else if (softModelling.includes(contact.id.user)) {
        helperForAllClassesReply(text, 'S');
        return;
    }

    const list = new List(
        '\nMake a choice from the list of electives',
        'See electives',
        [{
            title: 'Commands available to everyone',
            rows: [
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'classes-1_dev' : 'classes-1_prod', title: 'Data Mining', description: 'For those offering Data Mining' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'classes-2_dev' : 'classes-2_prod', title: 'Networking', description: "For those offering Networking" },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'classes-3_dev' : 'classes-3_prod', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
            ]
        }],
        'What elective do you offer?',
        'Powered by Ethereal bot'
    );
    !isListResponse && await chat_from_contact.sendMessage(list);

    if (isListResponse) {
        let text = "";
        const selectedRowId = msg.selectedRowId.split('-')[1];


        // helper function for prevent redundancy
        const helperFunc = async (elective) => {
            text += allClassesReply(ALL_CLASSES, elective, text);
            // await msg.reply(text + `\nFrom ${current_env} env`);
            await msg.reply(text);
            setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
        }

        switch (selectedRowId) {
            case '1_dev':
                if (current_env !== 'development') break;
                helperFunc('D');
                break;

            case '1_prod':
                if (current_env !== 'production') break;
                helperFunc('D');
                break;

            case '2_dev':
                if (current_env !== 'development') break;
                helperFunc('N');
                break;

            case '2_prod':
                if (current_env !== 'production') break;
                helperFunc('N');
                break;

            case '3_dev':
                if (current_env !== 'development') break;
                helperFunc('S');
                break;

            case '3_prod':
                if (current_env !== 'production') break;
                helperFunc('S');
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
    help: `To use this command, type: ${current_prefix}classes, then select your elective`,
    execute,
}