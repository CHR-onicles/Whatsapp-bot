// --------------------------------------------------
// helper.js contains helper functions to supplement bot logic
// --------------------------------------------------
const WAWebJS = require("whatsapp-web.js");
const { MessageMedia } = require("whatsapp-web.js");
const { getUsersToNotifyForClass, getNotificationStatus, getAllBotAdmins } = require("../models/misc");
const { ALL_CLASSES, MIME_TYPES } = require("./data");
const { getResource } = require('../models/resources');



// GLOBAL VARIABLES ----------------------------------
/**
 * Counter to keep track of dynamically created variables  later used in `eval` statements.
 */
var VARIABLES_COUNTER = 0;

const current_env = process.env.NODE_ENV;
const PROD_PREFIX = '!';
const current_prefix = current_env === 'production' ? PROD_PREFIX : process.env.DEV_PREFIX; // hiding Development prefix so user's cant access the Development version of the bot as it's still being worked on
const BOT_PUSHNAME = 'Ethereal'; // The bot's whatsapp username
const COOLDOWN_IN_SECS = 5;
const SOFT_BAN_DURATION_IN_MINS = 10;


// FUNCTIONS ----------------------------------------
/**
 * Get a random reply from an array of replies.
 * @param {Array<string>} replies An array of replies.
 * @returns {string} A randomly chosen reply from the array of `replies` provided.
 */
const pickRandomReply = (replies) => {
    return replies[Math.floor(Math.random() * replies.length)];
}

/**
 * Extract time for a course from the `ALL_CLASSES` array.
 * @param {string} course_name A string containing name, time and venue of class.
 * @returns {string} A string containing the time for a course in the format HH:MM.
 */
const extractTime = (course_name) => {
    const time_portion = course_name.split('|')[1].trim();
    const raw_time = time_portion.slice(1);
    let new_raw_time = null;

    if (raw_time.includes('p') && !raw_time.includes('12')) {
        const hour_24_format = +raw_time.split(':')[0] + 12;
        new_raw_time = String(hour_24_format) + ':' + raw_time.split(':')[1];
    }
    // console.log(new_raw_time, raw_time);
    return new_raw_time || raw_time;
}

/**
 * Extracts the command (which is usually the first word) from the message `body`.
 * @param {WAWebJS.Message} msg Message object from whatsapp.
 * @returns {string} The first word in the message `body`.
 */
const extractCommand = (msg) => {
    const split = msg?.body.toLowerCase().split(/(\s+|\n+)/);
    const first_word = split.shift();
    // console.log(first_word)
    if (first_word.startsWith(current_prefix)) return first_word;
    return '';
}

/**
 * Extracts the arguments/flags to supplement a command.
 * @param {WAWebJS.Message} msg Message object from whatsapp .
 * @returns {Array<string>} Empty array if no arguments are attached to command or an array of arguments.
 */
const extractCommandArgs = (msg) => {
    // If there's a newline ignore everything after the new line
    const args = msg.body.toLowerCase().split(/\n+/)[0]; // enforce arguments being separated from commands strictly by space(s)

    // Now split's the group of words by a space... these should be the valid args
    let valid_args = args.split(/\s+/);
    // console.log(valid_args);

    if (valid_args.length) {
        valid_args = valid_args.map(arg => arg.trim());
        return valid_args.slice(1);
    }
    else return [];
}

/**
 * Converts milliseconds to days, hours, minutes and seconds.
 * @param {number} duration A duration in milliseconds.
 * @returns Object containing days, hours, minutes and seconds
 */
const msToDHMS = (duration) => {
    if (duration < 0) {
        throw new Error('The duration cannot be negative!');
    }
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60)) / 24);

    // To add padding of '0' for single digits
    // days = (days < 10) ? "0" + days : days;
    // hours = (hours < 10) ? "0" + hours : hours;
    // minutes = (minutes < 10) ? "0" + minutes : minutes;
    // seconds = (seconds < 10) ? "0" + seconds : seconds;

    return { days, hours, minutes, seconds }
}

/**
 * Calculates the time left in milliseconds for a reminder in 2 hours, 1 hour, and 30 minutes respectively.
 * @param {{name: string, duration: number}} course Object containing course name and duration.
 * @returns Object containing milliseconds left for a reminder in 2 hours, 1 hour, and 30 minutes respectively.
 */
const notificationTimeCalc = (course) => {
    // Constants for notification intervals
    const two_hrs_ms = 120 * 60 * 1000;
    const one_hr_ms = 60 * 60 * 1000;
    const thirty_mins_ms = 30 * 60 * 1000;

    // Timeouts for the 3 reminder intervals
    let timeout_two_hrs = 0;
    let timeout_one_hr = 0;
    let timeout_thirty_mins = 0;

    const class_time = extractTime(course.name);
    const class_time_hrs = +class_time.split(':')[0];
    const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);

    const cur_time = new Date();
    const new_class_time = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), class_time_hrs, class_time_mins, 0);
    const time_left_in_ms = new_class_time - cur_time;

    if (two_hrs_ms > time_left_in_ms) {
        console.log("Less than 2hrs left to remind for", course.name.split('|')[0]);
    } else {
        timeout_two_hrs = time_left_in_ms - two_hrs_ms;
    }

    if (one_hr_ms > time_left_in_ms) {
        console.log("Less than 1 hr left to remind for", course.name.split('|')[0]);
    } else {
        timeout_one_hr = time_left_in_ms - one_hr_ms;
    }

    if (thirty_mins_ms > time_left_in_ms) {
        console.log("Less than 30 mins left to remind for", course.name.split('|')[0]);
    } else {
        timeout_thirty_mins = time_left_in_ms - thirty_mins_ms;
    }

    // console.log(timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
    return { timeout_two_hrs, timeout_one_hr, timeout_thirty_mins };
}

/**
 * Starts the notification intervals calculation.
 * @param {WAWebJS.Client} client Client object from wweb.js library.
 */
const startNotificationCalculation = async (client) => {
    const today_day = new Date().toString().split(' ')[0];
    const { dataMining, softModelling, networking } = await getUsersToNotifyForClass();

    const total_users = [...dataMining, ...softModelling, ...networking];
    const chats = await client.getChats();
    const notifs_status = await getNotificationStatus();

    if (!notifs_status) return;

    if (!total_users.length) return; // if there are no subscribed users, stop

    if (today_day === 'Sat' || today_day === 'Sun') {
        console.log("No courses to be notified for during the weekend!");
        return;
    }

    const { courses } = ALL_CLASSES.find(class_obj => {
        if (class_obj.day.slice(0, 3) === today_day) {
            return class_obj;
        }
    });
    // console.log(courses);

    for (const course of courses) {
        const class_time = extractTime(course.name);
        const class_time_hrs = +class_time.split(':')[0];
        const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);
        const { timeout_two_hrs, timeout_one_hr, timeout_thirty_mins } = notificationTimeCalc(course);

        const cur_time = new Date();
        const new_class_time = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), class_time_hrs, class_time_mins, 0);
        const time_left_in_ms = new_class_time - cur_time;
        if (time_left_in_ms < 0) continue; // if the time for a course is past, skip to next course

        if (course.name.includes('Data Mining')) {
            if (dataMining.length) {
                dataMining.forEach(student => {
                    generateTimeoutIntervals(student, course, chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                    console.log('Student:', student, ' course:', course)
                })
                console.log('\n');
            }
        } else if (course.name.includes('Networking')) {
            if (networking.length) {
                networking.forEach(student => {
                    generateTimeoutIntervals(student, course, chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                    console.log('Student:', student, ' course:', course)
                })
                console.log('\n');
            }
        } else if (course.name.includes('Soft. Modelling')) {
            if (softModelling.length) {
                softModelling.forEach(student => {
                    generateTimeoutIntervals(student, course, chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                    console.log('Student:', student, ' course:', course)
                })
                console.log('\n');
            }
        } else {
            total_users.forEach(student => {
                generateTimeoutIntervals(student, course, chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                console.log('Student:', student, ' course:', course)
            })
            console.log('\n');
        }
    }
}

/**
 * Generates the dynamic timeouts after which the notification callbacks will send a message to all subscribed users.
 * @param {string} user A string that represents a user, usually by a phone number.
 * @param {{name: string, duration: number}} course Object containing course `name` and `duration`.
 * @param {WAWebJS.Chat} chats All chats the bot is participating in.
 * @param {number} timeout_two_hrs Value in milliseconds left to send the 2 hour notification.
 * @param {number} timeout_one_hr Value in milliseconds left to send the 1 hour notification.
 * @param {number} timeout_thirty_mins Value in milliseconds left to send the 30 minutes notification.
 */
const generateTimeoutIntervals = (user, course, chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins) => {
    const chat_from_user = chats.find(chat => chat.id.user === user); // used in the eval statement

    // Create dynamic variables to assign the timeouts to. The dynamic variables are needed in order to clear the timeouts
    // in case the user opts out or there's a recalculation of notification intervals.
    if (timeout_two_hrs > 0) {
        VARIABLES_COUNTER++;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! You have ' + course.name.split('|')[0]+ ' in 2 hours'); console.log('SENT 2hr notif for' + course.name.split('|')[0] + ' to ', + user, ' => t' + VARIABLES_COUNTER)}, timeout_two_hrs)")
        console.log('Sending 2hr notif for', course.name.split('|')[0], ' to', user, '=> t' + VARIABLES_COUNTER)
    }
    if (timeout_one_hr > 0) {
        VARIABLES_COUNTER++;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! You have ' + course.name.split('|')[0] + ' in 1 hour'); console.log('SENT 1hr notif for' + course.name.split('|')[0] + ' to ', + user, ' => t' + VARIABLES_COUNTER)}, timeout_one_hr)")
        console.log('Sending 1hr notif for', course.name.split('|')[0], ' to', user, '=> t' + VARIABLES_COUNTER)
    }
    if (timeout_thirty_mins > 0) {
        VARIABLES_COUNTER++;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! ' + course.name.split('|')[0] + ' is in 30 minutes!'); console.log('SENT 30min notif for' + course.name.split('|')[0] + ' to ', + user, ' => t' + VARIABLES_COUNTER)}, timeout_thirty_mins)")
        console.log('Sending 30min notif for', course.name.split('|')[0], ' to', user, '=> t' + VARIABLES_COUNTER)
    }
}

/**
 * Stops notification callbacks from executing by clearing the dynamically created timeouts and resetting the global `VARIABLES_COUNTER` to 0.
 */
const stopOngoingNotifications = () => {
    for (let i = 1; i < VARIABLES_COUNTER + 1; ++i) {
        eval("clearTimeout(t" + i + ")");
        console.log(`Cleared timeout t${i}`);
    }
    console.log('Cleared all dynamic variables with timeouts');
    VARIABLES_COUNTER = 0;
}

/**
 * Generates reply to `!classes` command based on elective being offered.
 * @param {Array<{day: string, courses: Array<{name: string, duration: number}>}>} all_classes An array containing the full timetable for Level 400 Computer Science students.
 * @param {string} elective Character identifying the elective being offered.
 * @param {string} text Reply that would be sent by the bot.
 * @returns Modified `text` as bot's response.
 */
const allClassesReply = (all_classes, elective, text) => {
    let filtered_courses = null;
    if (elective === "D") {
        text += "Timetable for students offering *Data Mining* as elective: 📅\n\n"
        all_classes.forEach(class_obj => {
            filtered_courses = class_obj.courses.filter(c => !c.name.includes("Networking") && !c.name.includes("Soft. Modelling"));
            text += "*" + class_obj.day + "*:\n" + filtered_courses.map(c => '→ ' + c.name + "\n").join('') + "\n";
        })
    } else if (elective === "N") {
        text += "Timetable for students offering *Networking* as elective: 📅\n\n"
        all_classes.forEach(class_obj => {
            filtered_courses = class_obj.courses.filter(c => !c.name.includes("Data Mining") && !c.name.includes("Soft. Modelling"))
            text += "*" + class_obj.day + "*:\n" + filtered_courses.map(c => '→ ' + c.name + "\n").join('') + "\n";
        })
    } else if (elective === "S") {
        text += "Timetable for students offering *Software Modelling* as elective: 📅\n\n"
        all_classes.forEach(class_obj => {
            filtered_courses = class_obj.courses.filter(c => !c.name.includes("Data Mining") && !c.name.includes("Networking"))
            text += "*" + class_obj.day + "*:\n" + filtered_courses.map(c => '→ ' + c.name + "\n").join('') + "\n";
        })
    }
    return text;
}

/**
 * Gets classes for the current day.
 * @param {string} text Reply that would be sent by the bot.
 * @param {string} elective Character identifying the elective being offered.
 * @async
 * @returns Modified `text` as bot's response.
 */
const todayClassReply = async (text, elective) => {
    const today_day = new Date().toString().split(' ')[0]; // to get day

    if (today_day === 'Sat' || today_day === 'Sun') {
        text += 'Its the weekend! No classes today🥳\n\n_PS:_ You can type *!classes* to know your classes for the week.';
        return text;
    }

    let { courses } = ALL_CLASSES.find(class_obj => {
        if (class_obj.day.slice(0, 3) === today_day) {
            return class_obj;
        }
    });

    const cur_time = new Date();
    const done_array = [];
    const in_session_array = [];
    const upcoming_array = [];

    if (elective === 'D') {
        text += "Today's classes for students offering *Data Mining*: ☀\n\n"
        courses = courses.filter(c => !c.name.includes("Networking") && !c.name.includes("Soft. Modelling"));
    } else if (elective === 'N') {
        text += "Today's classes for students offering *Networking*: ☀\n\n"
        courses = courses.filter(c => !c.name.includes("Data Mining") && !c.name.includes("Soft. Modelling"));
    } else if (elective === 'S') {
        text += "Today's classes for students offering *Soft. Modelling*: ☀\n\n"
        courses = courses.filter(c => !c.name.includes("Data Mining") && !c.name.includes("Networking"));
    }

    courses.forEach(course => {
        const class_time = extractTime(course.name);
        const class_time_hrs = +class_time.split(':')[0]
        const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);

        if ((cur_time.getHours() < class_time_hrs) || (cur_time.getHours() === class_time_hrs && cur_time.getMinutes() < class_time_mins)) {
            // console.log('Not time yet')
            upcoming_array.push(course);
        }
        else if ((cur_time.getHours() === class_time_hrs) || (cur_time.getHours() < class_time_hrs + course.duration) || ((cur_time.getHours() <= class_time_hrs + course.duration) && cur_time.getMinutes() < class_time_mins)) {
            // console.log('In session')
            in_session_array.push(course);
        }
        else if ((cur_time.getHours() > (class_time_hrs + course.duration)) || (cur_time.getHours() >= (class_time_hrs + course.duration) && (cur_time.getMinutes() > class_time_mins))) {
            // console.log('Past time')
            done_array.push(course);
        }
    })

    text += "✅ *Done*:\n" +
        function () {
            return !done_array.length ? '🚫 None\n' : done_array.map(({ name }) => `~${name}~\n`).join('')
        }()
        + "\n" + "⏳ *In session*:\n" +
        function () {
            return !in_session_array.length ? '🚫 None\n' : in_session_array.map(({ name }) => `${name}\n`).join('')
        }()
        + "\n" + "💡 *Upcoming*:\n" +
        function () {
            return !upcoming_array.length ? '🚫 None\n' : upcoming_array.map(({ name }) => `${name}\n`).join('')
        }();
    return text;
}

/**
 * Helper function to retrieve slides from DB to send to user.
 * @param {WAWebJS.Message} msg Message object from whatsapp.
 * @param {string} courseCode String representing course code.
 * @async
 */
const sendSlides = async (msg, courseCode) => {
    let isDone = false;
    console.log("Getting slides...")
    const materials = await getResource(courseCode);
    if (materials.length) console.log("Got slides")
    else console.log("No slides received from DB");
    for (const material of materials) {
        const cur_material = material;
        const file_extension = cur_material.title.split(".")[cur_material.title.split(".").length - 1]; // always extract the last "." and what comes after
        const { mime_type } = MIME_TYPES.find(obj => obj.fileExtension === file_extension);
        const slide = new MessageMedia(mime_type, cur_material.binData, cur_material.title);
        await msg.reply(slide);
        console.log("Sent a slide")
        if (material === materials[materials.length - 1]) isDone = true;
    }
    // if (isDone) await msg.reply(`Done 👍🏽 from ${current_env}`);
    if (isDone) await msg.reply(`Done 👍🏽`);
    console.log("Done sending slides")
}

/**
 * Checks whether a user is a bot admin. User passed can be a whatsapp contact or a whatsapp number as a String.
 * @param {WAWebJS.Contact} contact Object that represents a contact on whatsapp.
 * @async
 * @returns **True** if contact is a bot admin, **False** otherwise.
 */
const isUserBotAdmin = async (contact) => {
    const admins = new Set(await getAllBotAdmins());
    
    // Probably a bad practice but mehh
    // If a whatsapp number as a string is passed, do this...
    if (typeof contact !== 'object') {
        return admins.has(contact);
    }
    return admins.has(contact.id.user);
}

/**
 * Gets a random item from a map using weighted probability.
 * @param {Map<string, number>} map Map containing a message and its weight.
 * @returns Random item from a map.
 */
const pickRandomWeightedMessage = (map) => {
    const items = [...map.keys()];
    const weights = [...map.values()];
    // console.log(items, weights);

    let sum = weights.reduce((prev, cur) => prev + cur, 0);
    if (sum !== 100) {
        console.log("Sum:", sum)
        throw new Error("Sum is NOT EQUAL TO 100")
    }
    const rand_val = Math.floor(Math.random() * sum);

    for (let i = 0; i < items.length; ++i) {
        sum -= weights[i];
        if (rand_val >= sum) return items[i];
    }
}

/**
 * Checks whether all elements in an array are the same.
 * @param {Array} arr Array containing some elements
 * @returns True if all elements are equal, false otherwise
 */
const areAllItemsEqual = arr => arr.every(item => item === arr[0]);

/**
 * Sleeps the bot for some time.
 * @param {number} milliseconds Represents the amount of time to sleep in milliseconds
 */
const sleep = async (milliseconds = 500) => {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Checks and returns commands for aliases used.
 * @param {Map<String, Object>} map Map containing commands and their relevant information.
 * @param {string} keyword String representing the keyword to search for.
 * @returns {string} String representing key from map.
 */
const checkForAlias = (map, keyword) => {
    for (const entry of map) {
        const aliases = entry[1].alias;
        // console.log(aliases);

        if (aliases.includes(keyword)) {
            // console.log(entry[0]);
            return entry[0];
        }
    }
}

/**
 * Adds a cooldown to each user after using a command.
 * @param {WAWebJS.Client} client Client instance from WWebjs library.
 * @param {string} user String representing a user.
 */
const addToUsedCommandRecently = (client, user) => {
    //todo: reduce cooldown for bot admin to 3secs
    client.usedCommandRecently.add(user);
    setTimeout(() => {
        client.usedCommandRecently.delete(user);
    }, COOLDOWN_IN_SECS * 1000);
}

/**
 * Gets amount of time left in seconds for setTimeout instance to execute.
 * @param {Object} timeout Object representing a setTimeout instance.
 * @returns {number} Number indicating the amount of time left in seconds for the setTimeout instance to execute.
 */
const getTimeLeftForSetTimeout = (timeout) => {
    return Math.ceil((timeout._idleStart + timeout._idleTimeout) / 1000 - process.uptime());
}

/**
 * Checks messages for spam and executes appropriate action.
 * @param {WAWebJS.Client} client Client instance from WWebjs lirbary.
 * @param {WAWebJS.Contact} contact Object representing a whatsapp contact.
 * @param {WAWebJS.Chat} chatFromContact Object representing a whatsapp chat.
 * @param {WAWebJS.Message} msg Object representing a whatsapp message. 
 * @async
 * @returns {boolean} Returns **True** if spam intent is detected, **False** otherwise.
 */
const checkForSpam = async (client, contact, chatFromContact, msg) => {
    let currentUserObj = client.potentialSoftBanUsers.get(contact.id.user);

    // What happens during cooldown
    if (client.usedCommandRecently.has(contact.id.user)) {

        if (!currentUserObj.hasSentWarningMessage) {
            await msg.reply(`Please wait for *${COOLDOWN_IN_SECS}secs* before sending another command.\n\nAll commands issued within the *${COOLDOWN_IN_SECS}secs* period will be ignored 👍🏽`) //todo: Add more replies for this later
            client.potentialSoftBanUsers.set(contact.id.user, { ...currentUserObj, hasSentWarningMessage: true });
            currentUserObj = client.potentialSoftBanUsers.get(contact.id.user); // to get the most recent version of the object after update
        }

        if (currentUserObj.numOfCommandsUsed > 2) {
            // user can now be considered to be spamming
            client.potentialSoftBanUsers.set(contact.id.user, {
                ...currentUserObj,
                isQualifiedForSoftBan: true,
                timeout: setTimeout(async () => {
                    client.potentialSoftBanUsers.delete(contact.id.user);
                    console.log(`User ${contact.id.user}'s soft ban has been lifted`);
                    await contact.unblock();
                    chatFromContact.sendMessage("🔊 Your temporary ban has been lifted.\n\nYou can now use bot commands.")
                }, SOFT_BAN_DURATION_IN_MINS * 60 * 1000)
            });
            console.log(`User ${contact.id.user} is now qualified to be soft banned`);
            await chatFromContact.sendMessage(`🔇You have been banned for a duration of ${SOFT_BAN_DURATION_IN_MINS}mins for spamming.\n\nThe bot will no longer respond to your commands.`)
            await contact.block();
            // Log to DB - implement if need be later
            // const curTime = new Date();
            // curTime.setMinutes(curTime.getMinutes() + 10);
            // const curTimePlus10Mins = new Date(curTime);
            // await addSoftBannedUser(contact.id.user, curTimePlus10Mins);
            return true;
        }
        client.potentialSoftBanUsers.set(contact.id.user, { ...currentUserObj, numOfCommandsUsed: currentUserObj.numOfCommandsUsed + 1 });
        return true;
    }

    // Check if user issues a command while being soft banned
    if (client.potentialSoftBanUsers.has(contact.id.user) && currentUserObj.isQualifiedForSoftBan) {
        try {
            console.log(`User ${contact.id.user} is still in soft ban, time left: ${getTimeLeftForSetTimeout(client.potentialSoftBanUsers.get(contact.id.user).timeout)} secs`);
        } catch (error) {
            console.error(error);
        }
        return true;
    }
    return false;
}



module.exports = {
    current_env,
    current_prefix,
    PROD_PREFIX,
    BOT_PUSHNAME,
    COOLDOWN_IN_SECS,
    pickRandomReply,
    extractTime,
    extractCommand,
    extractCommandArgs,
    msToDHMS, notificationTimeCalc,
    startNotificationCalculation,
    stopOngoingNotifications,
    allClassesReply,
    todayClassReply,
    sendSlides,
    isUserBotAdmin,
    pickRandomWeightedMessage,
    areAllItemsEqual,
    sleep,
    checkForAlias,
    addToUsedCommandRecently,
    getTimeLeftForSetTimeout,
    checkForSpam,
}