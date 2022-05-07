// --------------------------------------------------
// data.js contains all relevant static data needed for the 
// bot to function correctly
// --------------------------------------------------

const current_prefix = process.env.NODE_ENV === 'production' ? '!' : process.env.DEV_PREFIX; // doing this instead of importing to avoid circular dependency


/**
 * Source code for the bot, hosted on Github.
 */
exports.SOURCE_CODE = 'https://github.com/CHR-onicles/Whatsapp-bot';

/**
 * Array containing timetable for Level 400 Computer Science students, all electives included.
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
            { name: '_Accounting_ | ⏰6:30pm | 🏠E10', duration: 1 }
        ]
    },
    {
        day: 'Friday',
        courses: [
            { name: '_Soft. Modelling_ | ⏰9:30am | 🏠N3', duration: 1 },
            { name: '_Theory & Survey_ | ⏰10:30am | 🏠N3', duration: 1 },
            { name: '_Data Mining_ | ⏰3:30pm | 🏠NNB2', duration: 1 },
            { name: '_Compilers_ | ⏰4:30pm | 🏠NNB2', duration: 1 },
            // { name: '_Test Course_ | ⏰7:24pm | 🏠NNB2', duration: 1 }
        ]
    }
]

/**
 * Array containing current L400 1st Semester Computer Science exams timetable.
 */
exports.EXAM_TIMETABLE = [
    {
        date: "Saturday, May 14 2022",
        time: "11:30am",
        courseCode: "CSCD 421",
        courseTitle: "Accounting",
        examMode: "Onsite/Online"
    },
    {
        date: "Monday, May 16 2022",
        time: "7:30am",
        courseCode: "CSCD 419",
        courseTitle: "Formal Methods",
        examMode: "Onsite/Physical"
    },
    {
        date: "Wednesday, May 18 2022",
        time: "7:30am",
        courseCode: "CSCD 417",
        courseTitle: "Theory & Survey",
        examMode: "Onsite/Physical"
    },
    {
        date: "Friday, May 20 2022",
        time: "11:30am",
        courseCode: "CSCD 427",
        courseTitle: "Networking",
        examMode: "Onsite/Physical"
    },
    {
        date: "Saturday, May 21 2022",
        time: "7:30am",
        courseCode: "CSCD 415",
        courseTitle: "Compilers",
        examMode: "Onsite/Physical"
    },
    {
        date: "Monday, May 23 2022",
        time: "3:30pm",
        courseCode: "CSCD 423",
        courseTitle: "Software Modelling",
        examMode: "Onsite/Physical"
    },
]

/**
 * Array containing all commands, roles they are available to, and their descriptions.
 */
exports.HELP_COMMANDS = [
    {
        availableTo: 'e', // everyone
        command: `${current_prefix}ping`,
        desc: "Check if I'm available 🙋🏽‍♂️"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}uptime`,
        desc: "See how long I've been awake 🟢"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}help`,
        desc: "Get commands that can be used with me 💡"
    },
    {
        availableTo: 'a', // admins
        command: `${current_prefix}mute`,
        desc: "Get me to be quiet 😅"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}unmute`,
        desc: "Allow me to talk 🙂"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}everyone`,
        desc: "Ping everyone in the group 😮"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}classes`,
        desc: "Get all the classes you have this week 📚"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}class`,
        desc: "Get today's classes 📕"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}notify`,
        desc: "Get notified for class 🔔"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}notify stop`,
        desc: "Stop getting notified for class 🔕"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}subs`,
        desc: "Get users who want to be notified for class 👯‍♂️"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}commands`,
        desc: "Get bot's commands in a list style in your DMs 🥂"
    },
    {
        availableTo: 'a', // maybe change later to everyone
        command: `${current_prefix}admins`,
        desc: "Get all bot admins 👮🏽‍♂️👮🏽‍♀️"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}promote _<user>_`,
        desc: "Make user an admin 👮🏽‍♂️"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}demote _<user>_`,
        desc: "Dismiss an admin 💀"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}env`,
        desc: "Check the current environme`${current_prefix} of the bot `"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}notify status`,
        desc: "Get class notifications status 📄"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}notify enable all`,
        desc: "Enable all class notifications for the day ✔"
    },
    {
        availableTo: 'a',
        command: `${current_prefix}notify disable all`,
        desc: "Disable all class notifications for the day ❌"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}exams`,
        desc: "Get the current exams timetable 📝"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}slides`,
        desc: "Get course materials for all courses 📚"
    },
    {
        availableTo: 'e',
        command: `${current_prefix}gl`,
        desc: "Get current whatsapp group link 📱 "
    },
    {
        availableTo: 'e',
        command: `${current_prefix}sc`,
        desc: "Get bot's source code 💻 "
    },
    // {
    //     availableTo: 'a',
    //     command: `${current_prefix}ignore <user>`,
    //     desc: "Ignore a specific user 💀"
    // },
    // {
    //     availableTo: 'a',
    //     command: `${current_prefix}acknowledge <user>`,
    //     desc: "Respond to a specific user 😄"
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
 * Array containing replies which requires the user to check his PMs.
 */
exports.DM_REPLIES = [
    'Check dm 🐦',
    'Dm 🐦',
    '𝓓𝓶 👍🏽',
    'ℙ𝕞 👍🏽',
    'Pm 🐦',
    '𝑪𝒉𝒆𝒄𝒌 𝑷𝑴𝒔 🐦',
    'In your PMs 🐦',
    'Sliding in your dm 👍🏽',
    'Acknowledged 👍🏽 ',
    'Gotcha 🐦',
    'Got you👍🏽',
    'Say no more...dm🐦',
    'DM-ing you now 👍🏽',
    'Checked your DMs yet?🐦',
    '✅',
    '🤖✅',
    '👀✅',
    '👍🏽',
    '🙃👍🏽',
    '👽✅'
]

/**
 * Array containing replies for users who try to perform administrative functions on the bot.
 */
exports.NOT_ADMIN_REPLIES = [
    "Lel nope🐦, you are not a *bot admin* unfortunately.",
    "No can do🐦, you don't have sufficient privileges.",
    "You are not a *bot admin*",
    "Task successfully failed ❎, command reserved for *bot admins*.",
    "Nope🐦, you don't have the required permissions.",
    "Only *bot admins* can do this 🙂",
    "Only *bot admins* can use this, so that it is not abused.",
    "Sorry, this command is not available to you.",
    "Not happening😗, you're not a *bot admin*.",
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

exports.WAIT_REPLIES = [
    "Gimme a sec🐦",
    "Just a second",
    "One sec🐦",
    "Loading, please wait ⏳",
    "Hold on",
    "Loading ⏳",
    "Gimme a minute, or two 🐦",
    "Please wait, I'll tell you when I'm done 👍🏽",
    "Processing some binary data ⏳, please wait"
]

/**
 * Map containing some extra info about the bot/random messages to be sent to users 
 * based on weighted chances.
 * The **numbers** represent the probability of sending that particular message. The sum of all the numbers is strictly 100.
 */
exports.FOOTNOTES = new Map([
    ["", 75], // send "nothing" more often, to avoid annoying users with multiple tips
    ["Hope you are having a great day 🥳", 0.5],
    ["Have a great day fam 🤍", 0.5],
    ["Have a wonderful day 👍🏽", 0.5],
    [`Good ${new Date().getHours() < 12 ? 'morning' : (new Date().getHours < 17 ? 'afternoon' : 'evening')}`, 2],
    ["Don't forget to DO MORE 👍🏽", 0.5],
    ["Keep on keeping on👍🏽", 0.5],
    ["Checkout the *!help* command to see other commands you can use", 4],
    ["Use *!commands* to see all the commands available to you in a list style", 4],
    ["Did you know you could ping me in a group to see all the commands? 😮", 3.5],
    ["Use *!notify* to subscribe to class notifications.\n\nThe bot will then remember your elective whenever you request for a timetable 💪🏽", 3],
    ["Glad I could be of help 😁", 2],
    ["I hope this was helpful🙂", 2],
    ["Happy to help ☺", 2],
    // ["Run *!updates* to see the bot's latest updates", 10],
])

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

/**
 * Array containing file extensions and their appropriate mime types.
 */
exports.MIME_TYPES = [
    {
        fileExtension: 'doc',
        mime_type: 'application/msword'
    },
    {
        fileExtension: 'docx',
        mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    },
    {
        fileExtension: 'pdf',
        mime_type: 'application/pdf'
    },
    {
        fileExtension: 'ppt',
        mime_type: 'application/vnd.ms-powerpoint'
    },
    {
        fileExtension: 'pptx',
        mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    },
]