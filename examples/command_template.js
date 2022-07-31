const execute = async (client, msg) => {
    // execution code here
}


module.exports = {
    name: "", // command name
    description: "", // short description of what this command does
    alias: [], // synonyms of the command
    category: "", // admin | everyone
    help: "", // a string describing how to use this command Eg = help : 'To use this command type !test arguments'
    execute, // main logic to be executed
}