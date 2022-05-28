const execute = async (client, msg) => {

}

// rowId = commandName + "-" + uniqueID
const executeForListResponse = async (client, msg, rowId) => {

}

module.exports = {
    name: "", // command name
    description: "", // short description of what this command does
    alias: [], // other similar words related to the command
    category: "", // admin | everyone
    help: "", // a string describing how to use this command Eg = help : 'To use this command type !test arguments'
    execute, // main logic to be executed when command is run and message type is "text"
    executeForListResponse // logic to be executed when user responds to a list from the command
}