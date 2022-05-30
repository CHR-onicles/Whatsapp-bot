const { List } = require("whatsapp-web.js");
const { getMutedStatus, getUsersToNotifyForClass } = require("../../models/misc");
const { FOOTNOTES, DM_REPLIES } = require("../../utils/data");
const { current_prefix, todayClassReply, pickRandomWeightedMessage, pickRandomReply, current_env, PROD_PREFIX } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { isListResponse, lastPrefixUsed } = args;
    // console.log('isListResponse From class:', isListResponse)
    const contact = await msg.getContact();
    const chat_from_contact = await contact.getChat();
    const cur_chat = await msg.getChat();
    const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
    let text = "";

    if (cur_chat.isGroup) {
        await msg.reply(pickRandomReply(DM_REPLIES));
    }

    // refactored repeated code into local function
    const helperForClassesToday = async (text, elective) => {
        text += await todayClassReply(text, elective);
        await chat_from_contact.sendMessage(text);
        setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
    }

    // if user has already subscribed to be notified for class, get his elective and send the current day's
    // timetable based on the elective.
    if (dataMining.includes(contact.id.user)) {
        helperForClassesToday(text, 'D');
        return;
    } else if (networking.includes(contact.id.user)) {
        helperForClassesToday(text, 'N');
        return;
    } else if (softModelling.includes(contact.id.user)) {
        helperForClassesToday(text, 'S');
        return;
    }

    const list = new List(
        '\nMake a choice from the list of electives',
        'See electives',
        [{
            title: 'Commands available to everyone', rows: [
                { id: lastPrefixUsed === PROD_PREFIX ? 'class-1_prod' : 'class-1_dev', title: 'Data Mining', description: 'For those offering Data Mining' },
                { id: lastPrefixUsed === PROD_PREFIX ? 'class-2_prod' : 'class-2_dev', title: 'Networking', description: "For those offering Networking" },
                { id: lastPrefixUsed === PROD_PREFIX ? 'class-3_prod' : 'class-3_dev', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
            ]
        }],
        'What elective do you offer?',
        'Powered by Ethereal bot'
    );

    !isListResponse && await chat_from_contact.sendMessage(list);

    if (isListResponse) {
        let text = "";
        console.log('From class:', msg.selectedRowId);
        const selectedRowId = msg.selectedRowId.split('-')[1];
        console.log('Split selected rowID:', selectedRowId);

        switch (selectedRowId) {
            case '1_dev':
            case '1_prod': //using two IDs to prevent list response from one environment to leak into another environment
                text += await todayClassReply(text, 'D');
                break;
            case '2_dev':
            case '2_prod':
                text += await todayClassReply(text, 'N');
                break;
            case '3_dev':
            case '3_prod':
                text += await todayClassReply(text, 'S');
                break;
            default:
                break;
        }

        await msg.reply(text + `\nFrom ${current_env} env`);
        setTimeout(async () => await chat_from_contact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
        args.isListResponse = false; // to prevent evaluating list response when message type is text
    }
}


module.exports = {
    name: "class",
    description: "Get today's classes depending on your elective 📕",
    alias: [],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}class, then select an elective`,
    execute,
}