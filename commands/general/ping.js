const { getMutedStatus } = require("../../models/misc");
const { current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;
    const msg_timestamp = new Date(msg.timestamp * 1000);
    const cur_time = new Date();
    const actual_ping = Math.abs(cur_time - msg_timestamp);
    // console.log('Msg timestamp:', msg_timestamp, ' | Current time:', cur_time)
    // console.log(`Actual ping: ${actual_ping}ms`)
    await msg.reply(`Response in _${actual_ping}ms_`);
}


module.exports = {
    name: "ping",
    description: "Get response time of the bot in milliseconds 🙋🏽‍♂️",
    alias: ["p"],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${current_prefix}ping*`,
    execute,
}