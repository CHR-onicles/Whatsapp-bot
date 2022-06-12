const { List } = require("whatsapp-web.js");
const { getMutedStatus, getUsersToNotifyForClass } = require("../../models/misc");
const { FOOTNOTES, DM_REPLIES } = require("../../utils/data");
const { currentPrefix, todayClassReply, pickRandomWeightedMessage, pickRandomReply, currentEnv, PROD_PREFIX } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { isListResponse, lastPrefixUsed } = args;
    const contact = await msg.getContact();
    const chatFromContact = await contact.getChat();
    const curChat = await msg.getChat();
    const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
    let text = "";

    if (curChat.isGroup) {
        await msg.reply(pickRandomReply(DM_REPLIES));
    }

    // refactored repeated code into local function
    const helperForClassesToday = async (text, elective) => {
        text += await todayClassReply(text, elective);
        await chatFromContact.sendMessage(text);
        setTimeout(async () => await chatFromContact.sendMessage(pickRandomWeightedMessage(FOOTNOTES)), 2000);
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
            title: 'Commands available to everyone',
            rows: [
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'class-1_dev' : 'class-1_prod', title: 'Data Mining', description: 'For those offering Data Mining' },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'class-2_dev' : 'class-2_prod', title: 'Networking', description: "For those offering Networking" },
                { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'class-3_dev' : 'class-3_prod', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
            ]
        }],
        'What elective do you offer?',
        'Powered by Ethereal bot'
    );
    // console.log("After creating list, lastPrefixedUsed:", lastPrefixUsed)

    !isListResponse && await chatFromContact.sendMessage(list);

    if (isListResponse) {
        let text = "";
        // console.log('From class:', msg.selectedRowId);
        // console.log('Last prefix used in LR:', lastPrefixUsed)
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
                helperFunc('D');
                break;

            case '1_prod':
                if (currentEnv !== 'production') break;
                helperFunc('D');
                break;

            case '2_dev':
                if (currentEnv !== 'development') break;
                helperFunc('N');
                break;

            case '2_prod':
                if (currentEnv !== 'production') break;
                helperFunc('N');
                break;

            case '3_dev':
                if (currentEnv !== 'development') break;
                helperFunc('S');
                break;

            case '3_prod':
                if (currentEnv !== 'production') break;
                helperFunc('S');
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