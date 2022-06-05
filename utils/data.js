// --------------------------------------------------
// data.js contains all relevant static data needed for the 
// bot to function correctly
// --------------------------------------------------


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
        _date: new Date(2022, 04, 14, 13, 20), // to avoid extra processing logic :)
        time: "1:20pm",
        courseCode: "CSCD 421",
        courseTitle: "Accounting",
        examMode: "Onsite/Online"
    },
    {
        date: "Monday, May 16 2022",
        _date: new Date(2022, 04, 16, 7, 30),
        time: "7:30am",
        courseCode: "CSCD 419",
        courseTitle: "Formal Methods",
        examMode: "Onsite/Physical"
    },
    {
        date: "Wednesday, May 18 2022",
        _date: new Date(2022, 04, 18, 7, 30),
        time: "7:30am",
        courseCode: "CSCD 417",
        courseTitle: "Theory & Survey",
        examMode: "Onsite/Physical"
    },
    {
        date: "Friday, May 20 2022",
        _date: new Date(2022, 04, 20, 11, 30),
        time: "11:30am",
        courseCode: "CSCD 427",
        courseTitle: "Networking",
        examMode: "Onsite/Physical"
    },
    {
        date: "Saturday, May 21 2022",
        _date: new Date(2022, 04, 21, 7, 30),
        time: "7:30am",
        courseCode: "CSCD 415",
        courseTitle: "Compilers",
        examMode: "Onsite/Physical"
    },
    {
        date: "Monday, May 23 2022",
        _date: new Date(2022, 04, 23, 15, 30),
        time: "3:30pm",
        courseCode: "CSCD 423",
        courseTitle: "Software Modelling",
        examMode: "Onsite/Physical"
    },
]

/**
 * Object containing arrays of replies for both bot admins and everyone.
 */
exports.PING_REPLIES = {
    botAdmin: [
        "Need me sir?",
        "Sir",
        "Boss",
        "I'm here sir 🐦",
        "Alive and well sir 🐦",
        "Speak forth sir 🐦",
        "Greetings boss 🐦"
    ],
    everyone: [
        "Fam 🐦",
        "Uhuh? 🐦",
        "Hello there🐦",
        "I'm here fam 🐦",
        "Alive and well fam 🐦",
        "Speak forth fam 🐦",
        "Up and running 🐦",
        "Listening in 🐦",
        "Greetings 🐦",
        "The bot is fine, thanks for not asking 🙄",
        `Great ${new Date().getHours() < 12 ? 'morning' : (new Date().getHours() < 17 ? 'afternoon' : 'evening')} 🥳`,
        "🙋🏽‍♂️",
        "👋🏽",
        "🐦",
        "👀",
        "🤖",
        "👊🏽",
        "Adey 🐦",
        "Yo 🐦",
        "Sup 🐦",
        "Hola 🙋🏽‍♂️",
        "👁👃🏽👁",
    ]
}

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
    '✅',
    '🤖✅',
    '👀✅',
    '👍🏽',
    '🙃👍🏽',
    '👽✅'
]

/**
 * Array containing replies for users who try to perform administrative functions on the bot but are not bot admins.
 */
exports.NOT_BOT_ADMIN_REPLIES = [
    "No please 🐦, you are not a *bot admin* unfortunately.",
    "No can do 🐦, you don't have sufficient privileges.",
    "You are not a *bot admin*",
    "Nope🐦, you don't have the required permissions.",
    "Only *bot admins* can do this 🙂",
    // "Only *bot admins* can use this, so that it is not abused.",
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
    "❌",
    "You can't promote the Grandmaster.",
    "Lol okay",
    "How much more power do you want the Grandmaster to have?"
]

/**
 * Array containing replies to admins attempting to demote the bot owner(the Grandmaster).
 */
exports.DEMOTE_GRANDMASTER_REPLIES = [
    "Interesting🐦",
    "❌",
    "🙄",
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
    "Ignored, have a great day 👍🏽"
]

/**
 * Array containing replies to commands that require the bot to perform actions that may take long.
 */
exports.WAIT_REPLIES = [
    "Gimme a sec🐦",
    "Just a second",
    "One sec🐦",
    "Loading, please wait ⏳",
    "Hold on",
    "Hang on",
    "Loading ⏳",
    "Gimme a minute 🐦",
    "Uno momento 🐦",
    "Please wait, I'll tell you when I'm done 👍🏽",
    "Processing some binary data ⏳, please wait",
]

/**
 * Array containing replies to `!slides` command.
 */
exports.COURSE_MATERIALS_REPLIES = [
    "Need some slides?",
    "Oh you need slides? 🐦",
    "Need any course materials?",
    "What materials can I help you with?",
    "Looking for course materials?",
    "Your search for slides ends here 🐦",
    "Your wish is my command 🐦",
]

/**
 * Map containing some extra info about the bot/random messages to be sent to users 
 * based on weighted chances.
 * The **numbers** represent the probability of sending that particular message. The sum of all the numbers is strictly 100.
 */
exports.FOOTNOTES = new Map([
    ["", 70], // send "nothing" more often, to avoid annoying users with multiple tips
    ["Hope you are having a great day 🥳", 1],
    ["Have a great day fam 🤍", 1],
    ["Have a wonderful day 👍🏽", 1],
    [`Good ${new Date().getHours() < 12 ? 'morning' : (new Date().getHours < 17 ? 'afternoon' : 'evening')}`, 3],
    ["Don't forget to DO MORE 👍🏽", 0.5],
    ["Keep on keeping on👍🏽", 0.5],
    ["Have you tried !𝒉𝒆𝒍𝒑 ?", 3],
    ["Checked out !𝕞𝕖𝕟𝕦 ?", 2],
    ["Checkout the *!help* command to see other commands you can use", 4],
    ["Use *!menu* to see all the commands available to you", 4],
    ["Did you know you could ping me in a group to see all the commands? 😮", 4],
    // ["Use *!notify* to subscribe to class notifications.\n\nThe bot will then remember your elective whenever you request for a timetable 💪🏽", 3],
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