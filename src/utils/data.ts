// --------------------------------------------------
// data.js contains all relevant static data needed for the
// bot to function correctly
// --------------------------------------------------

import { IClass, IExamTimetable } from "../types";

/**
 * Source code for the bot, hosted on Github.
 */
export const SOURCE_CODE = "https://github.com/CHR-onicles/Whatsapp-bot";

/**
 * Array containing timetable for Level 400 Computer Science students, all electives included.
 */
export const ALL_CLASSES: IClass[] = [
  {
    day: "Monday",
    courses: [
      {
        name: "_Conc & Dist Systems_ | ⏰5:30pm | 🏠JQB11",
        code: "CSCD432",
        duration: 2,
      },
    ],
  },
  {
    day: "Tuesday",
    courses: [
      {
        name: "_Mult Applications_ | ⏰11:30am | 🏠MATH05",
        code: "CSCD426",
        duration: 2,
      },
    ],
  },
  {
    day: "Wednesday",
    courses: [
      {
        name: "_Conc & Dist Systems_ | ⏰8:30am | 🏠MATH19",
        code: "CSCD432",
        duration: 1,
      },
      {
        name: "_Expert Systems_ | ⏰9:30am | 🏠E9",
        code: "CSCD428",
        duration: 2,
      },
      {
        name: "_Comp Security_ | ⏰3:30pm | 🏠MATH05",
        code: "CSCD418",
        duration: 2,
      },
      { name: "_HCI_ | ⏰5:30pm | 🏠LOT1", code: "CSCD422", duration: 2 },
    ],
  },
  {
    day: "Thursday",
    courses: [
      // { name: '_Project_ | ⏰8:30am | 🏠ONLINE', code: 'CSCD400', duration: 2 },
      {
        name: "_Expert Systems_ | ⏰12:30pm | 🏠JQB19",
        code: "CSCD428",
        duration: 1,
      },
      {
        name: "_Sys Programming_ | ⏰1:30pm | 🏠JQB14",
        code: "CSCD416",
        duration: 2,
      },
      {
        name: "_Mob Computing_ | ⏰3:30pm | 🏠JQB19",
        code: "CSCD434",
        duration: 2,
      },
      {
        name: "_Mgmt Principles_ | ⏰5:30pm | 🏠E10",
        code: "CSCD424",
        duration: 2,
      },
    ],
  },
  {
    day: "Friday",
    courses: [
      {
        name: "_Mob Computing_ | ⏰9:30am | 🏠N3",
        code: "CSCD434",
        duration: 1,
      },
      { name: "_HCI_ | ⏰10:30am | 🏠N3", code: "CSCD422", duration: 1 },
      {
        name: "_Comp Security_ | ⏰1:30pm | 🏠MATH05",
        code: "CSCD418",
        duration: 1,
      },
      {
        name: "_Mult Applications_ | ⏰2:30pm | 🏠MATH05",
        code: "CSCD426",
        duration: 1,
      },
      {
        name: "_Sys Programming_ | ⏰3:30pm | 🏠NNB2",
        code: "CSCD416",
        duration: 1,
      },
      {
        name: "_Mgmt Principles_ | ⏰4:30pm | 🏠NNB2",
        code: "CSCD424",
        duration: 1,
      },
      // { name: '_Test Course_ | ⏰7:24pm | 🏠NNB2', duration: 1 }
    ],
  },
];

/**
 * Array containing current L400 1st Semester Computer Science exams timetable.
 */
export const EXAM_TIMETABLE: IExamTimetable[] = [
  {
    date: "Monday, Sep 12 2022",
    _date: new Date(2022, 8, 12, 7, 30), // to avoid extra processing logic :)
    time: "7:30am",
    courseCode: "CSCD 432",
    courseTitle: "Conc & Dist Systems",
    examMode: "Onsite/Physical",
  },
  {
    date: "Sunday, Sep 18 2022",
    _date: new Date(2022, 8, 18, 15, 30),
    time: "3:30pm",
    courseCode: "CSCD 422",
    courseTitle: "HCI",
    examMode: "Onsite/Physical",
  },
  {
    date: "Thursday, Sep 15 2022",
    _date: new Date(2022, 8, 15, 15, 30),
    time: "3:30pm",
    courseCode: "CSCD 428",
    courseTitle: "Expert Systems",
    examMode: "Onsite/Physical",
  },
  {
    date: "Thursday, Sep 18 2022",
    _date: new Date(2022, 8, 18, 7, 30),
    time: "7:30am",
    courseCode: "CSCD 426",
    courseTitle: "Multimedia Applications",
    examMode: "Onsite/Physical",
  },
  {
    date: "Tuesday, Sep 20 2022",
    _date: new Date(2022, 8, 20, 7, 30),
    time: "7:30am",
    courseCode: "CSCD 416",
    courseTitle: "System Programming",
    examMode: "Onsite/Physical",
  },
  {
    date: "Wednesday, Sep 21 2022",
    _date: new Date(2022, 8, 21, 11, 30),
    time: "11:30am",
    courseCode: "CSCD 418",
    courseTitle: "Computer Security",
    examMode: "Onsite/Physical",
  },
  {
    date: "Thursday, Sep 22 2022",
    _date: new Date(2022, 8, 22, 15, 30),
    time: "3:30pm",
    courseCode: "CSCD 424",
    courseTitle: "Management Principles",
    examMode: "Onsite/Physical",
  },
  {
    date: "Saturday, Sep 24 2022",
    _date: new Date(2022, 8, 24, 7, 30),
    time: "7:30am",
    courseCode: "CSCD 434",
    courseTitle: "Mobile Computing",
    examMode: "Onsite/Physical",
  },
];

/**
 * Object containing arrays of replies for both bot admins and everyone.
 */
export const PING_REPLIES = {
  botAdmin: [
    "Need me sir?",
    "Sir",
    "Boss",
    "I'm here sir 🐦",
    "Alive and well sir 🐦",
    "Speak forth sir 🐦",
    "Greetings boss 🐦",
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
    // `Great ${new Date().getHours() < 12 ? 'morning' : (new Date().getHours() < 17 ? 'afternoon' : 'evening')} 🥳`,
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
  ],
};

/**
 * Array containing replies to the `!mute` command.
 */
export const MUTE_REPLIES = [
  "Yes sir",
  "Roger that🐦",
  "Sigh...oki 😔",
  "👍🏽",
  "Got it 👍🏽",
  "🤐👍🏽",
  "✅",
];

/**
 * Array containing replies to the `!unmute` command.
 */
export const UNMUTE_REPLIES = [
  "Thanks sir",
  "Finally🐦",
  "🥳",
  "Speaking freely now 👍🏽",
  "Acknowledged ✅",
  "Ya yeet🐦",
  "✅",
];

/**
 * Array containing replies which requires the user to check his PMs.
 */
export const REACT_EMOJIS = [
  "✅",
  "🤖",
  "👀",
  "👍🏻",
  "🙃",
  "🐦",
  "👽",
  "👁",
  "💪🏻",
  "🤘🏻",
  "👊🏻",
  "👋🏻",
  "🤝🏻",
  "🙏🏻",
];

/**
 * Array containing replies for users who try to perform administrative functions on the bot but are not bot admins.
 */
export const NOT_BOT_ADMIN_REPLIES = [
  "No please 🐦, you are not a *bot admin* unfortunately.\n\nTry *!help* to see commands available to you.",
  "No can do 🐦, you don't have sufficient privileges.\n\nTry *!menu* to see commands available to you.",
  "You are not a *bot admin*\n\nTry *!help* or *!menu* to see commands that are available to you.",
  "Nope🐦, you don't have the required permissions.\n\nUse *!help* or *!menu* to see commands that you can use.",
  "Only *bot admins* can do this 🙂\n\nCommands you can use be found by typing *!help* or *!menu*",
  // "Only *bot admins* can use this, so that it is not abused.",
  "Sorry, this command is not available to you.\n\nCheckout commands you can use by typing *!help* or *!menu*.",
];

/**
 * Array containing replies to admins attempting to promote the bot.
 */
export const PROMOTE_BOT_REPLIES = [
  "Thanks for the kind gesture, but I need no promotion🐦",
  "Sorry, the bot can't be promoted",
  "Sorry, I can't be promoted",
  "I already have the highest privileges🐦",
  "I am promoted by no one🐦",
  "🙄",
  "🤦🏽‍♂️",
  "You don't promote me... I promote you🐦",
  "Wow thanks!\n\nJust kidding, you can't promote me😂",
  "Must've done something great to deserve this promotion huh🐦",
];

/**
 * Array containing replies to admins attempting to demote the bot.
 */
export const DEMOTE_BOT_REPLIES = [
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
];

/**
 * Array containing replies to admins attempting to promote the bot owner(the Grandmaster).
 */
export const PROMOTE_GRANDMASTER_REPLIES = [
  "Interesting lel🐦",
  "The Grandmaster needs no further promotion 👍🏽",
  "You are not worthy to promote the Grandmaster🐦",
  "Only the worthy can do this🐦",
  "I'll think about it🐦",
  "❌",
  "You can't promote the Grandmaster.",
  "Lol okay",
  "How much more power do you want the Grandmaster to have?",
];

/**
 * Array containing replies to admins attempting to demote the bot owner(the Grandmaster).
 */
export const DEMOTE_GRANDMASTER_REPLIES = [
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
  "Ignored, have a great day 👍🏽",
];

/**
 * Array containing replies to commands that require the bot to perform actions that may take long.
 */
export const WAIT_REPLIES = [
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
];

/**
 * Array containing replies to `!slides` command.
 */
export const COURSE_MATERIALS_REPLIES = [
  "Need some slides?",
  "Oh you need slides? 🐦",
  "Need any course materials?",
  "What materials can I help you with?",
  "Looking for course materials?",
  "Your search for slides ends here 🐦",
  "Your wish is my command 🐦",
];

/**
 * Array containing replies to `!slides` command.
 */
export const PAST_QUESTIONS_REPLIES = [
  "Need some past questions?",
  "Oh you need pasco? 🐦",
  "Need any past questions?",
  "What past questions can I help you with?",
  "Looking for pasco?",
  "Your search for pasco ends here 🐦",
  "Your wish is my command 🐦",
];

/**
 * Map containing some extra info about the bot/random messages to be sent to users
 * based on weighted chances.
 * The **numbers** represent the probability of sending that particular message. The sum of all the numbers is strictly 100.
 */
export const FOOTNOTES = new Map([
  ["", 68], // send "nothing" more often, to avoid annoying users with multiple tips

  // Greetings/wishes
  ["Hope you are having a great day 🥳", 1],
  ["Have a great day fam 🤍", 1],
  ["Have a wonderful day 👍🏽", 1],
  ["Do enjoy the rest of your day 👍🏽", 1],
  // [
  //   `Good ${
  //     new Date().getHours() >= 0 && new Date().getHours() <= 11
  //       ? "morning"
  //       : new Date().getHours() >= 12 && new Date().getHours() <= 16
  //       ? "afternoon"
  //       : "evening"
  //   } 🥳`,
  //   2,
  // ],
  ["Don't forget to DO MORE 👍🏽", 1],
  ["Keep on keeping on👍🏽", 1],
  ["Glad I could be of help 😁", 2],
  ["I hope this was helpful🙂", 2],
  ["Happy to help ☺", 2],
  ["Enjoy 🐦", 1],

  // Hints
  ["Have you tried !𝒉𝒆𝒍𝒑 ? Try it out!", 2],
  ["Checked out !𝕞𝕖𝕟𝕦 yet?", 2],
  ["💡 Use *!menu* to see all the commands available to you", 2],
  [
    "💡 Did you know you could ping me in a group to see all my commands? 😮",
    2,
  ],
  // [
  //   "💡 Use *!notify enable* to subscribe to class notifications.\n\nThe bot will remember your elective whenever you request for a timetable 💪🏽",
  //   4,
  // ],
  // [
  //   "💡 You don't need to type full commands, you can use shorter aliases now!\n\nType *!help <command>* to see if a command has aliases.\n\nEg: *!help class*",
  //   1,
  // ],
  // [
  //   "🆕 Checkout *!help <command>* to see more information about any command.\n\nEg: *!help botadmins*",
  //   1,
  // ],
  // [
  //   "🆕 Did you know that almost all commands have aliases?\n\nType *!help <command>* to see aliases and how to use the command.\n\nEg: *!help classes*",
  //   1,
  // ],
  // [
  //   "🆕 Don't know how to use a specific command?\n\nType *!help <command>* to see how to use it.\n\nEg: *!help slides*",
  //   1,
  // ],
  [
    "🆕 There are now *cooldowns* after using any command to avoid overloading the bot.\n\nThis simply means after using any command, you'll have to wait for a few seconds before using another command.",
    1,
  ],
  // [
  //   "🆕 Command arguments like *enable* and *disable* can be replaced with *-e* and *-d* respectively.\n\nEg: *!notify -e* or *!notify -d*",
  //   1,
  // ],
  // ["Run *!updates* to see the bot's latest updates", 0],

  // Farewell messages
  ["Congrats on finishing school 🎉", 2],
  ["It was an honor serving you 🐦", 2],
  ["Best of luck in your future endeavours 👍🏻", 2],
  ["Farewell soldier 👋🏻", 2],
  ["I enjoyed serving you, thank you.", 2],
]);

/**
 * Array containing links that should not be forwarded from other groups.
 */
export const LINKS_BLACKLIST = [
  "instagram",
  "facebook",
  "sefbenonline",
  "audiomack",
  "betway",
  "sportybet",
  "spotify",
  "soundcloud",
  "premierleague",
  "hypeghnewsroom",
  "museafrica",
  "ghananewspoint",
  "tunesgod",
  "modernghana",
];

/**
 * Array containing keywords in links that should not be forwarded from other groups.
 */
export const WORDS_IN_LINKS_BLACKLIST = [
  "music",
  "bet",
  "gift",
  "anime",
  "game",
  "gaming",
  "crypto",
  "movie",
  "VGMA",
  "blog",
];

/**
 * Array containing file extensions and their appropriate mime types.
 */
export const MIME_TYPES = [
  {
    fileExtension: "doc",
    mime_type: "application/msword",
  },
  {
    fileExtension: "docx",
    mime_type:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  {
    fileExtension: "pdf",
    mime_type: "application/pdf",
  },
  {
    fileExtension: "ppt",
    mime_type: "application/vnd.ms-powerpoint",
  },
  {
    fileExtension: "pptx",
    mime_type:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  },
];
