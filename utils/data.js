// --------------------------------------------------
// data.js contains all relevant static data needed for the 
// bot to function correctly
// --------------------------------------------------

/**
 * Array containing full timetable for Level 400 Computer Science students.
 */
exports.ALL_CLASSES = [
    {
        day: 'Monday',
        courses: [
            { name: '_Formal Methods_ | ⏰5:30pm | 🏠N3', duration: 2 }
        ]
    },
    {
        day: 'Tuesday',
        courses: [
            { name: '_Accounting_ | ⏰5:30pm | 🏠JQB23', duration: 2 },
            { name: '_Networking_ | ⏰11:30am | 🏠MATH05', duration: 2 }
        ]
    },
    {
        day: 'Wednesday',
        courses: [
            { name: '_Compilers_ | ⏰9:30am | 🏠E10', duration: 2 },
            { name: '_Theory & Survey_ | ⏰3:30pm | 🏠JQB09', duration: 2 },
            { name: '_Soft. Modelling_ | ⏰5:30pm | 🏠LOT1', duration: 2 }
        ]
    },
    {
        day: 'Thursday',
        courses: [
            // { name: '_Project_ | ⏰8:30am | 🏠Online', duration: 2 }, // Not being used currently
            { name: '_Formal Methods_ | ⏰12:30pm | 🏠JQB19', duration: 1 },
            { name: '_Data Mining_ | ⏰1:30pm | 🏠JQB14', duration: 2 },
            { name: '_Networking_ | ⏰5:30pm | 🏠E10', duration: 1 },
            { name: '_Accounting_ | ⏰6:35pm | 🏠E10', duration: 1 }
        ]
    },
    {
        day: 'Friday',
        courses: [
            { name: '_Soft. Modelling_ | ⏰9:30am | 🏠N3', duration: 1 },
            { name: '_Theory & Survey_ | ⏰10:30am | 🏠N3', duration: 1 },
            { name: '_Data Mining_ | ⏰3:30pm | 🏠NNB2', duration: 1 },
            { name: '_Compilers_ | ⏰4:30pm | 🏠NNB2', duration: 1 },
            { name: '_Test Course_ | ⏰7:24pm | 🏠NNB2', duration: 1 }
        ]
    }
]

/**
 * Array containing all commands, roles they are available to, and their descriptions.
 */
exports.HELP_COMMANDS = [
    {
        availableTo: 'everyone',
        command: "*!ping*",
        desc: "Check if I'm available 🙋🏽‍♂️"
    },
    {
        availableTo: 'everyone',
        command: "*!uptime*",
        desc: "See how long I've been awake🟢"
    },
    {
        availableTo: 'everyone',
        command: "*!help*",
        desc: "Get commands that can be used with me 💡"
    },
    {
        availableTo: 'admin',
        command: "*!mute*",
        desc: "Get me to be quiet 😅"
    },
    {
        availableTo: 'admin',
        command: "*!unmute*",
        desc: "Allow me to talk 🙂"
    },
    {
        availableTo: 'admin',
        command: "*!everyone*",
        desc: "Ping everyone in the group 😮"
    },
    {
        availableTo: 'everyone',
        command: "*!classes*",
        desc: "Get all the classes you have this week 📚"
    },
    {
        availableTo: 'everyone',
        command: "*!class*",
        desc: "Get today's classes 📕"
    },
    {
        availableTo: 'everyone',
        command: "*!notify*",
        desc: "Get notified for class 🔔"
    },
    {
        availableTo: 'everyone',
        command: "*!notify stop*",
        desc: "Stop getting notified for class 🔕"
    },
    {
        availableTo: 'admin',
        command: "*!subs*",
        desc: "Get users who want to be notified for class 👯‍♂️"
    },
    {
        availableTo: 'everyone',
        command: "*!commands*",
        desc: "Get bot's commands in a list style in your DMs 🥂"
    },
    {
        availableTo: 'admin',
        command: "*!promote <user>",
        desc: "Make user an admin 👮🏽‍♂️"
    },
    {
        availableTo: 'admin',
        command: "*!demote <user>",
        desc: "Dismiss an admin 💀👮🏽‍♂️"
    },
    // {
    //     availableTo: 'everyone',
    //     command: "*!exams",
    //     desc: "Get the exams timetable 📝"
    // },
    // {
    //     availableTo: 'admin',
    //     command: "*!ignore <user>",
    //     desc: "Ignore a specific user 💀"
    // },
    // {
    //     availableTo: 'admin',
    //     command: "*!acknowledge <user>",
    //     desc: "Respond to a specific user 😄"
    // },
    // {
    //     availableTo: 'everyone',
    //     command: "*!admins",
    //     desc: "See all users who can perform administrative functions on the bot 👮🏽‍♂️"
    // },
]

/**
 * Array containing replies to the `!mute` command.
 */
exports.MUTE_REPLIES = [
    'Yes sir',
    'Roger that🐦',
    'Sigh...oki 😔',
    '👍🏽',
    'Got it 👍🏽',
    '🤐👍🏽',
    '✅'
]

/**
 * Array containing replies to the `!unmute` command.
 */
exports.UNMUTE_REPLIES = [
    'Thanks sir',
    'Finally🐦',
    '🥳',
    'Speaking freely now 👍🏽',
    'Acknowledged ✅',
    'Ya yeet🐦',
    '✅',
]

/**
 * Array containing replies to the `!notify` command.
 */
exports.DM_REPLIES = [
    'Check dm 🐦',
    '✅',
    'Dm 🐦',
    'Check your Pms 🐦',
    'Sliding in your dm 👍🏽'
]

/**
 * Array containing replies for users who try to perform administrative functions on the bot.
 */
exports.NOT_ADMIN_REPLIES = [
    "Lel nope🐦, you are not an admin unfortunately.",
    "No can do🐦, you don't sufficient privileges.",
    "You are not an admin",
    "Task successfully failed ❎, command reserved for admins.",
    "Nope🐦, you don't have the required permissions.",
    "Only admins can do this 🙂",
    "Only admins can use this, so that it is not abused.",
    "Sorry, this command is not available to you.",
    "Not happening😗, you're not an admin.",
]

/**
 * Array containing replies to admins attempting to promote the bot.
 */
exports.PROMOTE_BOT_REPLIES = [
    "Thanks for the kind gesture, but I need no promotion🐦",
    "Sorry, the bot can't be promoted",
    "Sorry, I can't be promoted",
    "I already have the highest privileges🐦",
    "I am promoted by no one🐦",
    "🙄",
    "🤦🏽‍♂️",
    "You don't promote me... I promote you🐦",
    "Wow thanks!\n\nJust kidding, you can't promote me😂",
    "Must've done something great to deserve this promotion huh🐦"
]


/**
 * Array containing replies to admins attempting to demote the bot.
 */
exports.DEMOTE_BOT_REPLIES = [
    "Imagine trying to demote me 🙄",
    "Wow okay lol",
    "Sorry, the bot can't be demoted",
    "I cannot be demoted fam",
    "I can't be demoted, Im *Ethereal* 🐦",
    "I demote you first yes?🐦",
    "🙄",
    "First time?🐦",
    "Oh no! 😭\n\nJust kidding, you can't demote me🐦",
    "You're not worthy to demote me🐦",
    "Only the Grandmaster can demote me🐦",
    "🤣aye good luck",
    "Got any other better thing doing?🐦",
    "🤦🏽‍♂️",
    "👎🏽",
    "Why would you do that, I've literally been a good bot🐦",
]

/**
 * Array containing replies to admins attempting to promote the bot owner(the Grandmaster).
 */
exports.PROMOTE_GRANDMASTER_REPLIES = [
    "Interesting lel🐦",
    "The Grandmaster needs no further promotion 👍🏽",
    "You are not worthy to promote the Grandmaster🐦",
    "Only the worthy can do this🐦",
    "I'll think about it🐦",
    "😮",
    "❌",
    "You can't promote the Grandmaster.",
    "Lol okay",
    "Okayyy?",
    "How much more power do you want the Grandmaster to have?"
]

/**
 * Array containing replies to admins attempting to demote the bot owner(the Grandmaster).
 */
exports.DEMOTE_GRANDMASTER_REPLIES = [
    "Interesting🐦",
    "👎🏽",
    "❌",
    "🙄",
    "🤦🏽‍♂️",
    "💔",
    "Think it through first 👍🏽",
    "We don't do that here 🙄",
    "I'll think about it🐦",
    "You are unworthy mortal🐦",
    "You'll be demoted first🐦",
    "Not while I'm still around🐦",
    "Not anytime soon fam🐦",
    "The Grandmaster will be told of this treason.",
    "You will be demoted soon 👍🏽",
    "You can't demote the Grandmaster.",
    "wHy, just WhY",
    "This was foreseen, and you will be banned soon.",
    "Okay and have a great day 👍🏽",
    "Ignored, have a great day 👍🏽"
]

/**
 * Array containing links that should not be forwarded from other groups.
 */
exports.LINKS_BLACKLIST = [
    'instagram',
    'facebook',
    'sefbenonline',
    'audiomack',
    'betway',
    'sportybet',
    'spotify',
    'soundcloud',
    'premierleague',
    'hypeghnewsroom',
    'museafrica',
    'ghananewspoint',
    'tunesgod',
    'modernghana',
]

/**
 * Array containing keywords in links that should not be forwarded from other groups.
 */
exports.WORDS_IN_LINKS_BLACKLIST = [
    'music',
    'bet',
    'gift',
    'anime',
    'game',
    'gaming',
    'crypto',
    'movie',
    'VGMA',
    'blog',
]