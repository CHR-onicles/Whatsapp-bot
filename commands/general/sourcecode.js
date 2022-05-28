const { getMutedStatus } = require("../../models/misc");
const { current_prefix } = require("../../utils/helpers");

const execute = async (client, msg) => {
    if (await getMutedStatus() === true) return;
    await msg.reply("My source code can be found here:\n\n" + SOURCE_CODE, '', { linkPreview: true }); // link preview not working on Multi-Device
}


module.exports = {
    name: "sourcecode",
    description: "Get the bot's source code",
    alias: ["sc", "source"],
    category: "everyone", // admin | everyone
    help: `To use this command, type: ${current_prefix}sourcecode`,
    execute,
}