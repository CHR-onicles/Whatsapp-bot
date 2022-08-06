"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForChance = exports.checkForSpam = exports.getTimeLeftForSetTimeout = exports.addToUsedCommandRecently = exports.checkForAlias = exports.sleep = exports.areAllItemsEqual = exports.pickRandomWeightedMessage = exports.isUserBotAdmin = exports.sendSlides = exports.todayClassReply = exports.allClassesReply = exports.stopAllOngoingNotifications = exports.startNotificationCalculation = exports.notificationTimeLeftCalc = exports.msToDHMS = exports.extractCommandArgs = exports.extractCommand = exports.extractTime = exports.pickRandomReply = exports.COOLDOWN_IN_SECS = exports.BOT_PUSHNAME = exports.PROD_PREFIX = exports.currentPrefix = exports.currentEnv = void 0;
// --------------------------------------------------
// helper.js contains helper functions to supplement bot logic
// --------------------------------------------------
require("whatsapp-web.js");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const misc_1 = require("../models/misc");
const data_1 = require("./data");
const resources_1 = require("../models/resources");
require("../interfaces");
require("../types");
// GLOBAL VARIABLES ----------------------------------
/**
 * Counter to keep track of dynamically created variables  later used in `eval` statements.
 */
var VARIABLES_COUNTER = 0;
const currentEnv = process.env.NODE_ENV;
exports.currentEnv = currentEnv;
const PROD_PREFIX = "!";
exports.PROD_PREFIX = PROD_PREFIX;
let currentPrefix;
exports.currentPrefix = currentPrefix;
if (process.env.DEV_PREFIX) {
    exports.currentPrefix = currentPrefix =
        currentEnv === "production" ? PROD_PREFIX : process.env.DEV_PREFIX; // hiding Development prefix so user's cant access the Development version of the bot as it's still being worked on
}
const BOT_PUSHNAME = "Ethereal"; // The bot's whatsapp username
exports.BOT_PUSHNAME = BOT_PUSHNAME;
const COOLDOWN_IN_SECS = 5;
exports.COOLDOWN_IN_SECS = COOLDOWN_IN_SECS;
const SOFT_BAN_DURATION_IN_MINS = 15;
// FUNCTIONS ----------------------------------------
/**
 * Get a random reply from an array of replies.
 * @param replies An array of replies.
 * @returns {string} A randomly chosen reply from the array of `replies` provided.
 */
const pickRandomReply = (replies) => {
    return replies[Math.floor(Math.random() * replies.length)];
};
exports.pickRandomReply = pickRandomReply;
/**
 * Extract time for a course from the `ALL_CLASSES` array.
 * @param courseName A string containing name, time and venue of class.
 * @returns A string containing the time for a course in the format HH:MM.
 */
const extractTime = (courseName) => {
    const timePortion = courseName.split("|")[1].trim();
    const rawTime = timePortion.slice(1);
    let newRawTime = null;
    if (rawTime.includes("p") && !rawTime.includes("12")) {
        const hoursIn24HrFormat = +rawTime.split(":")[0] + 12;
        newRawTime = String(hoursIn24HrFormat) + ":" + rawTime.split(":")[1];
    }
    return newRawTime || rawTime;
};
exports.extractTime = extractTime;
/**
 * Extracts the command (which is usually the first word) from the message `body`.
 * @param msg Message object from whatsapp.
 * @returns The first word in the message `body`.
 */
const extractCommand = (msg) => {
    const split = msg.body.toLowerCase().split(/(\s+|\n+)/);
    const firstWord = split.shift();
    // console.log('[HELPERS - EC]', firstWord)
    if (firstWord === null || firstWord === void 0 ? void 0 : firstWord.startsWith(currentPrefix))
        return firstWord;
    return "";
};
exports.extractCommand = extractCommand;
/**
 * Extracts the arguments/flags to supplement a command.
 * @param msg Message object from whatsapp .
 * @returns Empty array if no arguments are attached to command or an array of arguments.
 */
const extractCommandArgs = (msg) => {
    // If there's a newline ignore everything after the new line
    const args = msg.body.toLowerCase().split(/\n+/)[0]; // enforce arguments being separated from commands strictly by space(s)
    // Now split's the group of words by a space... these should be the valid args
    let validArgs = args.split(/\s+/);
    // console.log('[HELPERS - ECA]', validArgs);
    if (validArgs.length) {
        validArgs = validArgs.map((arg) => arg.trim());
        return validArgs.slice(1);
    }
    else
        return [];
};
exports.extractCommandArgs = extractCommandArgs;
/**
 * Converts milliseconds to days, hours, minutes and seconds.
 * @param duration A duration in milliseconds.
 * @returns Object containing days, hours, minutes and seconds
 */
const msToDHMS = (duration) => {
    if (duration < 0) {
        throw new Error("[HELPERS - MTDHMS] The duration cannot be negative!");
    }
    let seconds = Math.floor((duration / 1000) % 60), minutes = Math.floor((duration / (1000 * 60)) % 60), hours = Math.floor((duration / (1000 * 60 * 60)) % 24), days = Math.floor(duration / (1000 * 60 * 60) / 24);
    // To add padding of '0' for single digits
    // days = (days < 10) ? "0" + days : days;
    // hours = (hours < 10) ? "0" + hours : hours;
    // minutes = (minutes < 10) ? "0" + minutes : minutes;
    // seconds = (seconds < 10) ? "0" + seconds : seconds;
    return { days, hours, minutes, seconds };
};
exports.msToDHMS = msToDHMS;
/**
 * Calculates the time left in milliseconds for a reminder in 2 hours, 1 hour, and 30 minutes respectively.
 * @param course Object containing course name and duration.
 * @returns Object containing milliseconds left for a reminder in 2 hours, 1 hour, and 30 minutes respectively.
 */
const notificationTimeLeftCalc = (course) => {
    // Constants for notification intervals
    const twoHrsInMs = 120 * 60 * 1000;
    const oneHrInMs = 60 * 60 * 1000;
    const thirtyMinsInMs = 30 * 60 * 1000;
    // Timeouts for the 3 reminder intervals
    let timeoutTwoHrs = 0;
    let timeoutOneHr = 0;
    let timeoutThirtyMins = 0;
    const classTime = extractTime(course.name);
    const classTimeHrs = +classTime.split(":")[0];
    const classTimeMins = +classTime
        .split(":")[1]
        .slice(0, classTime.split(":")[1].length - 2);
    const curTime = new Date();
    const newClassTime = new Date(curTime.getFullYear(), curTime.getMonth(), curTime.getDate(), classTimeHrs, classTimeMins, 0);
    const timeLeftInMs = newClassTime.getTime() - curTime.getTime();
    if (twoHrsInMs > timeLeftInMs) {
        console.log("[HELPERS - NTLC] Less than 2hrs left to remind for", course.name.split("|")[0]);
    }
    else {
        timeoutTwoHrs = timeLeftInMs - twoHrsInMs;
    }
    if (oneHrInMs > timeLeftInMs) {
        console.log("[HELPERS - NTLC] Less than 1 hr left to remind for", course.name.split("|")[0]);
    }
    else {
        timeoutOneHr = timeLeftInMs - oneHrInMs;
    }
    if (thirtyMinsInMs > timeLeftInMs) {
        console.log("[HELPERS - NTLC] Less than 30 mins left to remind for", course.name.split("|")[0]);
    }
    else {
        timeoutThirtyMins = timeLeftInMs - thirtyMinsInMs;
    }
    // console.log('[HELPERS - NTLC]', timeoutTwoHrs, timeoutOneHr, timeoutThirtyMins);
    return { timeoutTwoHrs, timeoutOneHr, timeoutThirtyMins };
};
exports.notificationTimeLeftCalc = notificationTimeLeftCalc;
/**
 * Starts the notification intervals calculation.
 * @param client Client object from wweb.js library.
 */
const startNotificationCalculation = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const todayDay = new Date().toString().split(" ")[0];
    const usersToNotify = yield (0, misc_1.getUsersToNotifyForClass)();
    if (usersToNotify) {
        const { multimedia, expert, concurrent, mobile } = usersToNotify;
        const totalUsers = [...multimedia, ...expert, ...concurrent, ...mobile];
        const chats = yield client.getChats();
        const notifsStatus = yield (0, misc_1.getNotificationStatus)();
        if (notifsStatus) {
            const { CSCD416, CSCD418, CSCD422, CSCD424, CSCD426, CSCD428, CSCD432, CSCD434, } = notifsStatus;
            if (Object.values(notifsStatus).every((elem) => !elem)) {
                console.log("[HELPERS - SNC] Exiting because all notifications have been turned OFF");
                return;
            }
            if (!totalUsers.length) {
                console.log("[HELPERS - SNC] Exiting because there are no users to notify");
                return;
            }
            if (todayDay === "Sat" || todayDay === "Sun") {
                console.log("[HELPERS - SNC] No courses to be notified for during the weekend!");
                return;
            }
            const found = data_1.ALL_CLASSES.find((classObj) => {
                if (classObj.day.slice(0, 3) === todayDay) {
                    return classObj;
                }
            });
            // console.log('[HELPERS - SNC]', courses);
            if (found) {
                const { courses } = found;
                for (const course of courses) {
                    if ((course.code === "CSCD416" && !CSCD416) ||
                        (course.code === "CSCD418" && !CSCD418) ||
                        (course.code === "CSCD422" && !CSCD422) ||
                        (course.code === "CSCD424" && !CSCD424) ||
                        // (course.code === 'CSCD400' && !CSCD400) ||
                        (course.code === "CSCD426" && !CSCD426) ||
                        (course.code === "CSCD428" && !CSCD428) ||
                        (course.code === "CSCD432" && !CSCD432) ||
                        (course.code === "CSCD434" && !CSCD434)) {
                        continue;
                    }
                    const classTime = extractTime(course.name);
                    const classTimeHrs = +classTime.split(":")[0];
                    const classTimeMins = +classTime
                        .split(":")[1]
                        .slice(0, classTime.split(":")[1].length - 2);
                    const { timeoutTwoHrs, timeoutOneHr, timeoutThirtyMins } = notificationTimeLeftCalc(course);
                    const curTime = new Date();
                    const newClassTime = new Date(curTime.getFullYear(), curTime.getMonth(), curTime.getDate(), classTimeHrs, classTimeMins, 0);
                    const timeLeftInMs = newClassTime.getTime() - curTime.getTime();
                    if (timeLeftInMs < 0)
                        continue; // if the time for a course is past, skip to next course
                    // Helper function to reduce repetition;
                    const helperForTimeoutIntervalGeneration = (electiveArray) => {
                        if (electiveArray.length) {
                            electiveArray.forEach((student) => {
                                generateTimeoutIntervals(student, course, chats, timeoutTwoHrs, timeoutOneHr, timeoutThirtyMins);
                                // console.log('[HELPERS - SNC] Student:', student, ' course:', course);
                            });
                            console.log("\n");
                        }
                    };
                    if (course.name.includes("Mult")) {
                        helperForTimeoutIntervalGeneration(multimedia);
                    }
                    else if (course.name.includes("Expert")) {
                        helperForTimeoutIntervalGeneration(expert);
                    }
                    else if (course.name.includes("Conc")) {
                        helperForTimeoutIntervalGeneration(concurrent);
                    }
                    else if (course.name.includes("Mob")) {
                        helperForTimeoutIntervalGeneration(mobile);
                    }
                    else {
                        totalUsers.forEach((student) => {
                            generateTimeoutIntervals(student, course, chats, timeoutTwoHrs, timeoutOneHr, timeoutThirtyMins);
                            // console.log('[HELPERS - SNC] Student:', student, ' course:', course);
                        });
                        console.log("\n");
                    }
                }
            }
        }
    }
});
exports.startNotificationCalculation = startNotificationCalculation;
/**
 * Generates the dynamic timeouts after which the notification callbacks will send a message to all subscribed users.
 * @param user A string that represents a user, usually by a phone number.
 * @param course Object containing course `name` and `duration`.
 * @param chats All chats the bot is participating in.
 * @param timeoutTwoHrs Value in milliseconds left to send the 2 hour notification.
 * @param timeoutOneHr Value in milliseconds left to send the 1 hour notification.
 * @param timeoutThirtyMins Value in milliseconds left to send the 30 minutes notification.
 */
const generateTimeoutIntervals = (user, course, chats, timeoutTwoHrs, timeoutOneHr, timeoutThirtyMins) => {
    const chat_from_user = chats.find((chat) => chat.id.user === user); // used in the eval statement
    // Create dynamic variables to assign the timeouts to. The dynamic variables are needed in order to clear the timeouts
    // in case the user opts out or there's a recalculation of notification intervals.
    if (timeoutTwoHrs > 0) {
        VARIABLES_COUNTER++;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! You have ' + course.name.split('|')[0]+ ' in 2 hours'); console.log('[HELPERS - GTI] SENT 2hr notif for' + course.name.split('|')[0] + ' to ', + user)}, timeoutTwoHrs)");
        console.log("[HELPERS - GTI] Sending 2hr notif for", course.name.split("|")[0], " to", user, "=> t" + VARIABLES_COUNTER);
    }
    if (timeoutOneHr > 0) {
        VARIABLES_COUNTER++;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! You have ' + course.name.split('|')[0] + ' in 1 hour'); console.log('[HELPERS - GTI] SENT 1hr notif for' + course.name.split('|')[0] + ' to ', + user)}, timeoutOneHr)");
        console.log("[HELPERS - GTI] Sending 1hr notif for", course.name.split("|")[0], " to", user, "=> t" + VARIABLES_COUNTER);
    }
    if (timeoutThirtyMins > 0) {
        VARIABLES_COUNTER++;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! ' + course.name.split('|')[0] + ' is in 30 minutes!'); console.log('[HELPERS - GTI] SENT 30min notif for' + course.name.split('|')[0] + ' to ', + user)}, timeoutThirtyMins)");
        console.log("[HELPERS - GTI] Sending 30min notif for", course.name.split("|")[0], " to", user, "=> t" + VARIABLES_COUNTER);
    }
};
/**
 * Stops notification callbacks from executing by clearing the dynamically created timeouts and resetting the global `VARIABLES_COUNTER` to 0.
 */
const stopAllOngoingNotifications = () => {
    for (let i = 1; i < VARIABLES_COUNTER + 1; ++i) {
        eval("clearTimeout(t" + i + ")");
        console.log(`[HELPERS - SAON] Cleared timeout t${i}`);
    }
    console.log("[HELPERS - SAON] Cleared all dynamic variables with timeouts");
    VARIABLES_COUNTER = 0;
};
exports.stopAllOngoingNotifications = stopAllOngoingNotifications;
/**
 * Generates reply to `!classes` command based on elective being offered.
 * @param allClasses An array containing the full timetable for Level 400 Computer Science students.
 * @param elective Character identifying the elective being offered.
 * @param text Reply that would be sent by the bot.
 * @returns Modified `text` as bot's response.
 */
const allClassesReply = (allClasses, elective, text) => {
    let filtered_courses = null;
    if (elective === "MA") {
        text +=
            "Timetable for students offering *Multimedia Applications* as elective: 📅\n\n";
        allClasses.forEach((classObj) => {
            filtered_courses = classObj.courses.filter((c) => !c.name.includes("Expert") &&
                !c.name.includes("Conc") &&
                !c.name.includes("Mob"));
            text +=
                "*" +
                    classObj.day +
                    "*:\n" +
                    (filtered_courses.length
                        ? filtered_courses.map((c) => "→ " + c.name + "\n").join("")
                        : "_None_\n") +
                    "\n";
        });
    }
    else if (elective === "E") {
        text +=
            "Timetable for students offering *Expert Systems* as elective: 📅\n\n";
        allClasses.forEach((classObj) => {
            filtered_courses = classObj.courses.filter((c) => !c.name.includes("Mult") &&
                !c.name.includes("Conc") &&
                !c.name.includes("Mob"));
            text +=
                "*" +
                    classObj.day +
                    "*:\n" +
                    (filtered_courses.length
                        ? filtered_courses.map((c) => "→ " + c.name + "\n").join("")
                        : "_None_\n") +
                    "\n";
        });
    }
    else if (elective === "C") {
        text +=
            "Timetable for students offering *Concurrent & Distributed Systems* as elective: 📅\n\n";
        allClasses.forEach((classObj) => {
            filtered_courses = classObj.courses.filter((c) => !c.name.includes("Mult") &&
                !c.name.includes("Expert") &&
                !c.name.includes("Mob"));
            text +=
                "*" +
                    classObj.day +
                    "*:\n" +
                    (filtered_courses.length
                        ? filtered_courses.map((c) => "→ " + c.name + "\n").join("")
                        : "_None_\n") +
                    "\n";
        });
    }
    else if (elective === "MC") {
        text +=
            "Timetable for students offering *Mobile Computing* as elective: 📅\n\n";
        allClasses.forEach((classObj) => {
            filtered_courses = classObj.courses.filter((c) => !c.name.includes("Mult") &&
                !c.name.includes("Expert") &&
                !c.name.includes("Conc"));
            text +=
                "*" +
                    classObj.day +
                    "*:\n" +
                    (filtered_courses.length
                        ? filtered_courses.map((c) => "→ " + c.name + "\n").join("")
                        : "_None_\n") +
                    "\n";
        });
    }
    return text;
};
exports.allClassesReply = allClassesReply;
/**
 * Gets classes for the current day.
 * @param text Reply that would be sent by the bot.
 * @param elective Character identifying the elective being offered.
 * @async
 * @returns Modified `text` as bot's response.
 */
const todayClassReply = (text, elective) => __awaiter(void 0, void 0, void 0, function* () {
    const todayDay = new Date().toString().split(" ")[0]; // to get day of today
    if (todayDay === "Sat" || todayDay === "Sun") {
        text +=
            "Its the weekend! No classes today🥳\n\n_PS:_ You can type *!classes* to know your classes for the week.";
        return text;
    }
    const found = data_1.ALL_CLASSES.find((classObj) => {
        if (classObj.day.slice(0, 3) === todayDay) {
            return classObj;
        }
    });
    if (found) {
        let { courses } = found;
        const curTime = new Date();
        const doneArray = [];
        const inSessionArray = [];
        const upcomingArray = [];
        if (elective === "MA") {
            text +=
                "Today's classes for students offering *Multimedia Applications*: ☀\n\n";
            courses = courses.filter((c) => !c.name.includes("Expert") &&
                !c.name.includes("Conc") &&
                !c.name.includes("Mob"));
        }
        else if (elective === "E") {
            text += "Today's classes for students offering *Expert Systems*: ☀\n\n";
            courses = courses.filter((c) => !c.name.includes("Mult") &&
                !c.name.includes("Conc") &&
                !c.name.includes("Mob"));
        }
        else if (elective === "C") {
            text +=
                "Today's classes for students offering *Concurrent & Distributed Systems*: ☀\n\n";
            courses = courses.filter((c) => !c.name.includes("Mult") &&
                !c.name.includes("Expert") &&
                !c.name.includes("Mob"));
        }
        else if (elective === "MC") {
            text += "Today's classes for students offering *Mobile Computing*: ☀\n\n";
            courses = courses.filter((c) => !c.name.includes("Mult") &&
                !c.name.includes("Expert") &&
                !c.name.includes("Conc"));
        }
        courses.forEach((course) => {
            const classTime = extractTime(course.name);
            const classTimeHrs = +classTime.split(":")[0];
            const classTimeMins = +classTime
                .split(":")[1]
                .slice(0, classTime.split(":")[1].length - 2);
            if (curTime.getHours() < classTimeHrs ||
                (curTime.getHours() === classTimeHrs &&
                    curTime.getMinutes() < classTimeMins)) {
                upcomingArray.push(course);
            }
            else if (curTime.getHours() === classTimeHrs ||
                curTime.getHours() < classTimeHrs + course.duration ||
                (curTime.getHours() <= classTimeHrs + course.duration &&
                    curTime.getMinutes() < classTimeMins)) {
                inSessionArray.push(course);
            }
            else if (curTime.getHours() > classTimeHrs + course.duration ||
                (curTime.getHours() >= classTimeHrs + course.duration &&
                    curTime.getMinutes() > classTimeMins)) {
                doneArray.push(course);
            }
        });
        text +=
            "✅ *Done*:\n" +
                (function () {
                    return !doneArray.length
                        ? "🚫 None\n"
                        : doneArray.map(({ name }) => `~${name}~\n`).join("");
                })() +
                "\n" +
                "⏳ *In session*:\n" +
                (function () {
                    return !inSessionArray.length
                        ? "🚫 None\n"
                        : inSessionArray.map(({ name }) => `${name}\n`).join("");
                })() +
                "\n" +
                "💡 *Upcoming*:\n" +
                (function () {
                    return !upcomingArray.length
                        ? "🚫 None\n"
                        : upcomingArray.map(({ name }) => `${name}\n`).join("");
                })();
        return text;
    }
});
exports.todayClassReply = todayClassReply;
/**
 * Helper function to retrieve slides from DB to send to user.
 * @param msg Message object from whatsapp.
 * @param courseCode String representing course code.
 * @async
 */
const sendSlides = (msg, courseCode) => __awaiter(void 0, void 0, void 0, function* () {
    let isDone = false;
    console.log("[HELPERS - SS] Getting slides...");
    const materials = yield (0, resources_1.getResource)(courseCode);
    if (materials.length)
        console.log(" [HELPERS - SS]Got slides");
    else
        console.error(" [HELPERS - SS ERROR] No slides received from DB");
    for (const material of materials) {
        const curMaterial = material;
        const file_extension = curMaterial.title.split(".")[curMaterial.title.split(".").length - 1]; // always extract the last "." and what comes after
        const foundMimeType = data_1.MIME_TYPES.find((obj) => obj.fileExtension === file_extension);
        if (foundMimeType) {
            const { mime_type } = foundMimeType;
            const slide = new whatsapp_web_js_1.MessageMedia(mime_type, curMaterial.binData, curMaterial.title);
            yield msg.reply(slide);
            console.log("[HELPERS - SS] Sent a slide");
            if (material === materials[materials.length - 1])
                isDone = true;
        }
        // if (isDone) await msg.reply(`Done 👍🏽 from ${currentEnv}`);
        if (isDone)
            yield msg.reply(`Done 👍🏽`);
        console.log(" [HELPERS - SS]Done sending slides");
    }
});
exports.sendSlides = sendSlides;
/**
 * Checks whether a user is a bot admin. User passed can be a whatsapp contact or a whatsapp number as a String.
 * @param contact Object that represents a contact on whatsapp.
 * @async
 * @returns **True** if contact is a bot admin, **False** otherwise.
 */
const isUserBotAdmin = (contact) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = new Set(yield (0, misc_1.getAllBotAdmins)());
    // Probably a bad practice but mehh
    // If a whatsapp number is passed as a string, do this...
    if (typeof contact !== "object") {
        return admins.has(contact);
    }
    return admins.has(contact.id.user);
});
exports.isUserBotAdmin = isUserBotAdmin;
/**
 * Gets a random item from a map using weighted probability.
 * @param map Map containing a message and its weight.
 * @returns Random item from a map.
 */
const pickRandomWeightedMessage = (map) => {
    const items = [...map.keys()];
    const weights = [...map.values()];
    let sum = weights.reduce((prev, cur) => prev + cur, 0);
    if (sum !== 100) {
        console.log("[HELPERS - PRWM] Sum:", sum);
        throw new Error("[HELPERS] Sum is NOT EQUAL TO 100");
    }
    const randVal = Math.floor(Math.random() * sum);
    for (let i = 0; i < items.length; ++i) {
        sum -= weights[i];
        if (randVal >= sum)
            return items[i];
    }
};
exports.pickRandomWeightedMessage = pickRandomWeightedMessage;
/**
 * Checks whether all elements in an array are the same.
 * @param arr Array containing some elements
 * @returns True if all elements are equal, false otherwise
 */
// I think this definitely has to be an "any" type
const areAllItemsEqual = (arr) => arr.every((item) => item === arr[0]);
exports.areAllItemsEqual = areAllItemsEqual;
/**
 * Sleeps the bot for some time.
 * @param milliseconds Represents the amount of time to sleep in milliseconds
 */
const sleep = (milliseconds = 500) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => setTimeout(resolve, milliseconds));
});
exports.sleep = sleep;
/**
 * Checks and returns commands for aliases used.
 * @param map Map containing commands and their relevant information.
 * @param keyword String representing the keyword to search for.
 * @returns String representing key from map.
 */
const checkForAlias = (map, keyword) => {
    for (const entry of map) {
        const aliases = entry[1].alias;
        // console.log('[HELPERS - CFA]', aliases);
        if (aliases.includes(keyword)) {
            // console.log('[HELPERS - CFA]', entry[0]);
            return entry[0];
        }
    }
};
exports.checkForAlias = checkForAlias;
/**
 * Adds a cooldown to each user after using a command.
 * @param client Client instance from WWebjs library.
 * @param user String representing a user.
 */
const addToUsedCommandRecently = (client, user) => {
    client.usedCommandRecently && client.usedCommandRecently.add(user);
    setTimeout(() => {
        client.usedCommandRecently && client.usedCommandRecently.delete(user);
    }, COOLDOWN_IN_SECS * 1000);
};
exports.addToUsedCommandRecently = addToUsedCommandRecently;
/**
 * Gets amount of time left in seconds for setTimeout instance to execute.
 * @param timeout NodeJS timeout instance.
 * @returns Number indicating the amount of time left in seconds for the setTimeout instance to execute.
 */
const getTimeLeftForSetTimeout = (timeout) => {
    return Math.ceil(
    //@ts-ignore - Properties actually do exist but TS says it doesn't
    (timeout._idleStart + timeout._idleTimeout) / 1000 - process.uptime());
};
exports.getTimeLeftForSetTimeout = getTimeLeftForSetTimeout;
/**
 * Checks messages for spam and executes appropriate action.
 * @param client Client instance from WWebjs library.
 * @param contact Object representing a whatsapp contact.
 * @param chatFromContact Object representing a whatsapp chat.
 * @param msg Object representing a whatsapp message.
 * @async
 * @returns Returns **True** if spam intent is detected, **False** otherwise.
 */
const checkForSpam = (client, contact, chatFromContact, msg) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return; // Don't check for spam and potentially send a message if bot is muted
    if (contact.id.user === process.env.GRANDMASTER)
        return; // Don't check for spam for owner of the bot hehe 😈
    let currentUserObj = (_a = client.potentialSoftBanUsers) === null || _a === void 0 ? void 0 : _a.get(contact.id.user);
    // This block takes care of what happens during cooldown
    if (client.usedCommandRecently &&
        client.usedCommandRecently.has(contact.id.user)) {
        if (!currentUserObj.hasSentWarningMessage) {
            yield msg.reply(`Please wait for *${COOLDOWN_IN_SECS}secs* before sending another command.\n\nAll commands issued within the *${COOLDOWN_IN_SECS}secs* period will be ignored 👍🏽`); //todo: Add more replies for this later
            client.potentialSoftBanUsers &&
                client.potentialSoftBanUsers.set(contact.id.user, Object.assign(Object.assign({}, currentUserObj), { hasSentWarningMessage: true }));
            currentUserObj =
                client.potentialSoftBanUsers &&
                    client.potentialSoftBanUsers.get(contact.id.user); // to get the most recent version of the object after update
        }
        if (currentUserObj.numOfCommandsUsed > 2) {
            // user can now be considered to be spamming
            client.potentialSoftBanUsers &&
                client.potentialSoftBanUsers.set(contact.id.user, Object.assign(Object.assign({}, currentUserObj), { isQualifiedForSoftBan: true, timeout: setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                        client.potentialSoftBanUsers &&
                            client.potentialSoftBanUsers.delete(contact.id.user);
                        console.log(`[HELPERS - CFS] User ${contact.id.user}'s soft ban has been lifted`);
                        yield contact.unblock();
                        chatFromContact.sendMessage("🔊 Your temporary ban has been lifted.\n\nYou can now use bot commands.");
                    }), SOFT_BAN_DURATION_IN_MINS * 60 * 1000) }));
            console.log(`[HELPERS - CFS] User ${contact.id.user} is now qualified to be soft banned`);
            yield chatFromContact.sendMessage(`🔇You have been banned for a duration of ${SOFT_BAN_DURATION_IN_MINS}mins for spamming.\n\nThe bot will no longer respond to your commands.`);
            yield contact.block();
            // Log to DB - implement if need be later
            // const curTime = new Date();
            // curTime.setMinutes(curTime.getMinutes() + 10);
            // const curTimePlus10Mins = new Date(curTime);
            // await addSoftBannedUser(contact.id.user, curTimePlus10Mins);
            return true;
        }
        client.potentialSoftBanUsers &&
            client.potentialSoftBanUsers.set(contact.id.user, Object.assign(Object.assign({}, currentUserObj), { numOfCommandsUsed: currentUserObj.numOfCommandsUsed + 1 }));
        return true;
    }
    // Check if user issues a command while being soft banned
    if (client.potentialSoftBanUsers &&
        client.potentialSoftBanUsers.has(contact.id.user) &&
        currentUserObj.isQualifiedForSoftBan) {
        try {
            console.log(`[HELPERS - CFS] User ${contact.id.user} is still in soft ban, time left: ${getTimeLeftForSetTimeout(client.potentialSoftBanUsers.get(contact.id.user).timeout)} secs`);
        }
        catch (error) {
            console.error("[HELPERS - CFS]", error);
        }
        return true;
    }
    return false;
});
exports.checkForSpam = checkForSpam;
/**
 * Get random chance of occurrence.
 * @param chance Number representing chance for something to occur. Valid range is from 1 to 9. 1 means 10% chance of occurring, 2 means 20% and so on.
 * @returns True or False
 */
const checkForChance = (chance) => {
    if (chance < 1)
        throw new Error("[HELPERS] Chance cannot be less than 1");
    if (chance > 9)
        throw new Error("[HELPERS] Chance cannot be more than 9");
    return Math.ceil(Math.random() * 10) < chance;
};
exports.checkForChance = checkForChance;
