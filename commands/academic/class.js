const { getMutedStatus } = require("models/misc");
const { current_prefix } = require("utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;


}


module.exports = {
    name: "class",
    description: "Get today's classes depending on your elective",
    alias: ["cl"],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}class`,
    execute,
}