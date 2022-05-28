const { getMutedStatus } = require("../../models/misc");
const { current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;


}


module.exports = {
    name: "help",
    description: "",
    alias: ["h"],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}help`,
    execute,
}