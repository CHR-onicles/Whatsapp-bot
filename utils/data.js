// --------------------------------------------------
// Data
// --------------------------------------------------

exports.CLASSES = [
    {
        day: 'Monday',
        courses: [
            { name: '_Formal Methods_ | ⏰5:30pm | 🏠N3', duration: 2 }
        ]
    },
    {
        day: 'Tuesday',
        courses: [
            { name: '_Accounting_ | ⏰5:30pm | 🏠JQB23', duration: 2 }
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
            { name: '_Project_ | ⏰8:30am | 🏠Online', duration: 2 },
            { name: '_Formal Methods_ | ⏰12:30pm | 🏠JQB19', duration: 1 },
            { name: '_Accounting_ | ⏰6:30pm | 🏠E10', duration: 1 }
        ]
    },
    {
        day: 'Friday',
        courses: [
            { name: '_Soft. Modelling_ | ⏰9:30am | 🏠N3', duration: 1 },
            { name: '_Theory & Survey_ | ⏰10:30am | 🏠N3', duration: 1 },
            { name: '_Compilers_ | ⏰4:30pm | 🏠NNB2', duration: 1 }
        ]
    }
]

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
            { name: '_Project_ | ⏰8:30am | 🏠Online', duration: 2 },
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
            { name: '_Compilers_ | ⏰4:30pm | 🏠NNB2', duration: 1 }
        ]
    }
]

exports.HELP_COMMANDS = [
    {
        availableTo: 'everyone',
        command: "*!ping*",
        desc: "check if I'm available 🙋🏽‍♂️"
    },
    {
        availableTo: 'everyone',
        command: "*!uptime*",
        desc: "see how long I've been awake🟢"
    },
    {
        availableTo: 'everyone',
        command: "*!help*",
        desc: "get commands that can be used with me 💡"
    },
    {
        availableTo: 'admin',
        command: "*!mute*",
        desc: "get me to be quiet 😅"
    },
    {
        availableTo: 'admin',
        command: "*!unmute*",
        desc: "allow me to talk 🙂"
    },
    {
        availableTo: 'admin',
        command: "*!everyone*",
        desc: "ping everyone in the group 😮"
    },
    {
        availableTo: 'everyone',
        command: "*!classes*",
        desc: "get all the classes you have this week 📚"
    },
    {
        availableTo: 'everyone',
        command: "*!class*",
        desc: "get today's classes 📕"
    },
    {
        availableTo: 'everyone',
        command: "*!notify*",
        desc: "get notified for class 🔔"
    },
    {
        availableTo: 'everyone',
        command: "*!notify stop*",
        desc: "stop getting notified for class 🔕"
    },
    {
        availableTo: 'admin',
        command: "*!subs*",
        desc: "get users who want to be notified for class 👯‍♂️"
    }
]

exports.MUTE_REPLIES = [
    'Yes sir',
    'Roger that🐦',
    'Sigh...oki 😔',
    '👍🏽',
    'Got it 👍🏽',
    '🤐👍🏽',
    '✅'
]

exports.UNMUTE_REPLIES = [
    'Thanks sir',
    'Finally🐦',
    '🥳',
    'Speaking freely now 👍🏽',
    'Acknowledged ✅',
    'Ya yeet🐦',
    '✅',
]

exports.NOTIFY_REPLIES = [
    'Check dm 🐦',
    '✅',
    'Dm 🐦',
    'Check your Pms 🐦',
]

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