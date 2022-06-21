const { List } = require("whatsapp-web.js");
const { getMutedStatus, removeUserToBeNotified, getUsersToNotifyForClass, addUserToBeNotified } = require("../../models/misc");
const { REACT_EMOJIS } = require("../../utils/data");
const { currentEnv, pickRandomReply, currentPrefix, extractCommandArgs, stopOngoingNotifications, startNotificationCalculation } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const { isListResponse, lastPrefixUsed } = args;
    const msgArgs = extractCommandArgs(msg)[0];
    const contact = await msg.getContact();
    const curChat = await msg.getChat();
    const chatFromContact = await contact.getChat();
    const { dataMining, networking, softModelling } = await getUsersToNotifyForClass();
    const totalUsers = [...dataMining, ...networking, ...softModelling]

    if (isListResponse) {

        const selectedRowId = msg.selectedRowId.split('-')[1];
        // console.log('selected row id:', selectedRowId)

        // Helper function to solely for refactoring
        const helper = async () => {
            if (totalUsers.includes(contact.id.user)) {
                await msg.reply("You are already being notified for class🐦");
                console.log('Already subscribed, from List Response')
                return;
            }

            if (curChat.isGroup) {
                await msg.react(pickRandomReply(REACT_EMOJIS));
            }

            await chatFromContact.sendMessage(`🔔 You will now be notified periodically for class, using *${selectedRowId[0] === '1' ? 'Data Mining' : (selectedRowId[0] === '2' ? 'Networking' : 'Software Modelling')}* as your elective.\n\nExpect me🐦`);
            await addUserToBeNotified(contact.id.user, selectedRowId[0]);
            stopOngoingNotifications();
            await startNotificationCalculation(client);
        }

        switch (selectedRowId) {
            case '1_dev':
                if (currentEnv !== 'development') break;
                helper();
                console.log('add user to be notified from 1_dev');
                break;

            case '1_prod':
                if (currentEnv !== 'production') break;
                helper();
                console.log('add user to be notified from 1_prod');
                break;

            case '2_dev':
                if (currentEnv !== 'development') break;
                helper();
                console.log('add user to be notified from 2_dev');
                break;

            case '2_prod':
                if (currentEnv !== 'production') break;
                helper();
                console.log('add user to be notified from 2_prod');
                break;

            case '3_dev':
                if (currentEnv !== 'development') break;
                helper();
                console.log('add user to be notified from 3_dev');
                break;

            case '3_prod':
                if (currentEnv !== 'production') break;
                helper();
                console.log('add user to be notified from 3_prod');
                break;

            default:
                break;
        }

        args.isListResponse = false;
        return;
    }


    console.log('msg args:', msgArgs);
    switch (msgArgs) {
        case 'enable':
        case '-e':
            if (totalUsers.includes(contact.id.user)) {
                await msg.reply("You are already being notified for class🐦");
                console.log('Already subscribed from case enable')
                return;
            }

            const list = new List(
                '\nMake a choice from the list of electives',
                'See electives',
                [{
                    title: 'Commands available to everyone',
                    rows: [
                        { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'notify-1_dev' : 'notify-1_prod', title: 'Data Mining', description: 'For those offering Data Mining' },
                        { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'notify-2_dev' : 'notify-2_prod', title: 'Networking', description: 'For those offering Networking' },
                        { id: lastPrefixUsed === process.env.DEV_PREFIX ? 'notify-3_dev' : 'notify-3_prod', title: 'Software Modelling', description: 'For those offering Software Simulation and Modelling' },
                    ]
                }],
                'Which elective do you offer?',
                'Powered by Ethereal bot'
            );

            !isListResponse && await msg.reply(list);
            break;

        case 'disable':
        case '-d':
            if (totalUsers.includes(contact.id.user)) {
                if (dataMining.includes(contact.id.user)) {
                    await removeUserToBeNotified(contact.id.user, 'D');
                } else if (networking.includes(contact.id.user)) {
                    await removeUserToBeNotified(contact.id.user, 'N');
                } else if (softModelling.includes(contact.id.user)) {
                    await removeUserToBeNotified(contact.id.user, 'S');
                }
                msg.reply("I won't remind you to go to class anymore ✅");
                stopOngoingNotifications();
                await startNotificationCalculation(client);
            } else {
                await msg.reply("You weren't subscribed in the first place 🤔");
            }
            break;

        default:
            await msg.reply(`You missed some arguments!\nCorrect syntax:\n${currentPrefix}notify (enable | disable)`)
            break;
    }
}

module.exports = {
    name: "notify",
    description: "Turn on/off reminders for class 🔔",
    alias: [],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}notify (enable | disable)*`,
    execute,
}