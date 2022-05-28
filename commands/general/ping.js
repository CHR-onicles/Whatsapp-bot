const { getMutedStatus } = require("../../models/misc");
const { current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;
    const msg_timestamp = new Date(msg.timestamp * 1000);
    const actual_ping = msg_timestamp - new Date();
    console.log(actual_ping)
    await msg.reply(`Response in _${actual_ping}ms_`);
}


module.exports = {
    name: "ping",
    description: "Get response time of the bot in milliseconds",
    alias: ["p"],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}help`,
    execute,
}