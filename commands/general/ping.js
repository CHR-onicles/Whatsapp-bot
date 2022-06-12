const { getMutedStatus } = require("../../models/misc");
const { currentPrefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;
    const msgTimestamp = new Date(msg.timestamp * 1000);
    const curTime = new Date();
    const actualPing = Math.abs(curTime - msgTimestamp);
    // console.log('Msg timestamp:', msgTimestamp, ' | Current time:', curTime)
    // console.log(`Actual ping: ${actualPing}ms`)
    await msg.reply(`Response in _${actualPing}ms_`);
}


module.exports = {
    name: "ping",
    description: "Get response time of the bot in milliseconds 🙋🏽‍♂️",
    alias: ["p"],
    category: "everyone", // admin | everyone
    help: `To use this command, type:\n*${currentPrefix}ping*`,
    execute,
}