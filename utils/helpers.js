// --------------------------------------------------
// helper.js contains helper functions to supplement bot logic
// --------------------------------------------------
const WAWebJS = require("whatsapp-web.js");
const { MessageMedia } = require("whatsapp-web.js");
const { getUsersToNotifyForClass, getNotificationStatus } = require("../models/misc");
const { ALL_CLASSES } = require("./data");
const { getResource } = require('./models/resources');



// GLOBAL VARIABLES
/**
 * Counter to keep track of dynamically created variables  later used in `eval` statements.
 */
var VARIABLES_COUNTER = 0; // used in eval statement later

// FUNCTIONS
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
    const raw_time = time_portion.slice(1, time_portion.length);
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
    const first_word = split[0];
    // console.log(first_word)
    if (first_word[0] === '!') {
        return first_word;
    }
}

/**
 * Extracts the arguments/flags to supplement a command.
 * @param {WAWebJS.Message} msg Message object from whatsapp .
 * @param {number} index Index of specific extra arguments to supplement a command. Default is 1 because 0 is the actual command.
 * @returns {string} Empty string if no arguments are attached to command or the argument at the provided index if arguments are present.
 */
const extractCommandArgs = (msg, index = 1) => {
    // If there's a newline ignore everything after the new line
    const args = msg.body.toLowerCase().split('\n')[0]; // enforce arguments being separated from commands strictly by space(s)

    // Now split's the group of words by a space... these should be the valid args
    const valid_args = args.split(' ');
    // console.log(valid_args);
    return valid_args[index] || '';
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

    console.log(timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
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

    if (!total_users.length) {
        return; // if there are no subscribed users, stop
    }

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

    for (let i = 0; i < courses.length; ++i) {
        const class_time = extractTime(courses[i].name);
        const class_time_hrs = +class_time.split(':')[0];
        const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);
        const { timeout_two_hrs, timeout_one_hr, timeout_thirty_mins } = notificationTimeCalc(courses[i]);

        const cur_time = new Date();
        const new_class_time = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), class_time_hrs, class_time_mins, 0);
        const time_left_in_ms = new_class_time - cur_time;
        if (time_left_in_ms < 0) continue; // if the time for a course is past, skip to next course

        if (courses[i].name.includes('Data Mining')) {
            if (dataMining.length) {
                dataMining.forEach(student => {
                    generateTimeoutIntervals(student, courses[i], chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                    console.log('Student:', student, ' course:', courses[i])
                })
                console.log('\n');
            }
        } else if (courses[i].name.includes('Networking')) {
            if (networking.length) {
                networking.forEach(student => {
                    generateTimeoutIntervals(student, courses[i], chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                    console.log('Student:', student, ' course:', courses[i])
                })
                console.log('\n');
            }
        } else if (courses[i].name.includes('Soft. Modelling')) {
            if (softModelling.length) {
                softModelling.forEach(student => {
                    generateTimeoutIntervals(student, courses[i], chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                    console.log('Student:', student, ' course:', courses[i])
                })
                console.log('\n');
            }
        } else {
            total_users.forEach(student => {
                generateTimeoutIntervals(student, courses[i], chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                console.log('Student:', student, ' course:', courses[i])
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
        ++VARIABLES_COUNTER;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! You have ' + course.name.split('|')[0]+ ' in 2 hours'); console.log('SENT 2hr notif for' + course.name.split('|')[0] + ' to ', + user, ' => t' + VARIABLES_COUNTER)}, timeout_two_hrs)")
        console.log('Sending 2hr notif for', course.name.split('|')[0], ' to', user, '=> t' + VARIABLES_COUNTER)
    }
    if (timeout_one_hr > 0) {
        ++VARIABLES_COUNTER;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! You have ' + course.name.split('|')[0] + ' in 1 hour'); console.log('SENT 1hr notif for' + course.name.split('|')[0] + ' to ', + user, ' => t' + VARIABLES_COUNTER)}, timeout_one_hr)")
        console.log('Sending 1hr notif for', course.name.split('|')[0], ' to', user, '=> t' + VARIABLES_COUNTER)
    }
    if (timeout_thirty_mins > 0) {
        ++VARIABLES_COUNTER;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! ' + course.name.split('|')[0] + ' is in 30 minutes!'); console.log('SENT 30min notif for' + course.name.split('|')[0] + ' to ', + user, ' => t' + VARIABLES_COUNTER)}, timeout_thirty_mins)")
        console.log('Sending 30min notif for', course.name.split('|')[0], ' to', user, '=> t' + VARIABLES_COUNTER)
    }
}


/**
 * Stops notification callbacks from executing by clearing the dynamically created timeouts and resetting the global `VARIABLES_COUNTER` to 0.
 */
const stopOngoingNotifications = () => {
    for (let i = 1; i < VARIABLES_COUNTER; ++i) {
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
 * 
 * @param {string} text Reply that would be sent by the bot.
 * @param {string} elective Character identifying the elective being offered.
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
 * 
 * @param {*} msg 
 * @param {*} courseCode 
 */
const sendSlides = async (msg, courseCode) => {
    const materials = await getResource(courseCode);
    for (let i = 0; i < materials.length; ++i) { // using this for-loop style for  performance
        const cur_material = materials[i];
        const file_extension = cur_material.title.split(".")[cur_material.title.split(".").length - 1]; // always extract the last "." and what comes after
        const { mime_type } = MIME_TYPES.find(obj => obj.fileExtension === file_extension);
        const slide = new MessageMedia(mime_type, cur_material.binData, cur_material.title);
        await msg.reply(slide);
    }
    await msg.reply("Done 👍🏽");
}


module.exports = { pickRandomReply, extractTime, extractCommand, extractCommandArgs, msToDHMS, notificationTimeCalc, startNotificationCalculation, stopOngoingNotifications, allClassesReply, todayClassReply, sendSlides }