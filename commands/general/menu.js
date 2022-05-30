const { List } = require("whatsapp-web.js");
const { getMutedStatus } = require("../../models/misc");
const { HELP_COMMANDS, DM_REPLIES, PING_REPLIES } = require("../../utils/data");
const { isUserBotAdmin, pickRandomReply, current_prefix } = require("../../utils/helpers");

const execute = async (client, msg, args) => {
    if (await getMutedStatus() === true) return;

    const contact = await msg.getContact();
    const chat_from_contact = await contact.getChat();
    const cur_chat = await msg.getChat();
    const isBotAdmin = await isUserBotAdmin(contact);

    if (cur_chat.isGroup) {
        await msg.reply(pickRandomReply(DM_REPLIES));
    }

    // Have to keep this array here because I want the most updated list of super Admins
    // every time this is needed.


    let startID = 0; // dynamic ID to be used for whatsapp list
    const temp_rows = [];
    for (const com of HELP_COMMANDS) {
        const { availableTo, command, desc } = com;
        ++startID;
        if (!isBotAdmin && availableTo === 'e') {
            temp_rows.push({ id: `menu-${startID}`, title: command, description: desc });
        } else if (isBotAdmin) {
            if (!command.includes('<')) // avoiding commands that would involve extra user input for now
                temp_rows.push({ id: `menu-${startID}`, title: command, description: desc });
            else continue;
        }
    }
    // console.log(temp_rows);

    const list = new List(
        '\nThis is a list of commands the bot can perform',
        'See commands',
        [{ title: `Commands available to ${isBotAdmin ? 'admins' : 'everyone'}`, rows: temp_rows }],
        isBotAdmin ? pickRandomReply(PING_REPLIES.botAdmin.concat(PING_REPLIES.everyone)) : pickRandomReply(PING_REPLIES.everyone),
        'Powered by Ethereal bot'
    );

    if (cur_chat.isGroup) {
        await chat_from_contact.sendMessage(list);
    } else if (!cur_chat.isGroup) {
        await msg.reply(list);
    }
}


module.exports = {
    name: "menu",
    description: "Get list of commands ⚙",
    alias: ["commands", "command", "coms", "comms", "menus"],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}menu or ping the bot in a group chat`,
    execute,
}