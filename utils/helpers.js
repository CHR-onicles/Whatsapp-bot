// --------------------------------------------------
// helper.js contains helper functions to supplement bot logic
// --------------------------------------------------
const { getUsersToNotifyForClass } = require("../middleware");
const { ALL_CLASSES } = require("./data");

// GLOBAL VARIABLES
/**
 * Counter to keep track of dynamically created variables  later used in eval statements.
 */
var VARIABLES_COUNTER = 0; // used in eval statement later

// FUNCTIONS
/**
 * Get a random reply from an array of replies
 * @param {Array} replies An array of replies
 * @returns {String} A randomly chosen reply from the array of replies provided
 */
const pickRandomReply = (replies) => {
    return replies[Math.floor(Math.random() * replies.length)];
}


const extractTime = (course) => {
    const time_portion = course.split('|')[1].trim();
    const raw_time = time_portion.slice(1, time_portion.length);
    let new_raw_time = null;

    if (raw_time.includes('p') && !raw_time.includes('12')) {
        const hour_24_format = +raw_time.split(':')[0] + 12;
        new_raw_time = String(hour_24_format) + ':' + raw_time.split(':')[1];
    }

    return new_raw_time || raw_time;
}


const extractCommand = (msg) => {
    const split = msg?.body.toLowerCase().split(/(\s+|\n+)/);
    const first_word = split[0];
    // console.log(first_word)
    if (first_word[0] === '!') {
        return first_word;
    }
}


const extractCommandArgs = (msg, index = 1) => {
    // If there's a newline ignore everything after the new line
    const args = msg.body.toLowerCase().split('\n')[0]; // enforce arguments being separated from commands strictly by space(s)

    // Now split's the group of words by a space... these should be the valid args
    const valid_args = args.split(' ');
    // console.log(valid_args);
    return valid_args[index] || '';
}


const msToHMS = (duration) => {
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


const startNotificationCalculation = async (client) => {
    const today_day = new Date().toString().split(' ')[0];
    const { dataMining, softModelling, networking } = await getUsersToNotifyForClass();

    const total_users = [...dataMining, ...softModelling, ...networking];
    const chats = await client.getChats();

    if (!total_users.length) {
        return; // stop rather than calling the restart function again which might lead to an infinite loop
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
        if (time_left_in_ms < 0) continue;

        if (courses[i].name.includes('Data Mining')) {
            if (dataMining.length) {
                dataMining.forEach(student => {
                    generateTimeoutIntervals(student, courses[i], chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                })
            }
        } else if (courses[i].name.includes('Networking')) {
            if (networking.length) {
                networking.forEach(student => {
                    generateTimeoutIntervals(student, courses[i], chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                })
            }
        } else if (courses[i].name.includes('Soft. Modelling')) {
            if (softModelling.length) {
                softModelling.forEach(student => {
                    generateTimeoutIntervals(student, courses[i], chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
                })
            }
        } else {
            total_users.forEach(student => {
                generateTimeoutIntervals(student, courses[i], chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins);
            })
        }
    }
}

const generateTimeoutIntervals = (user, course, chats, timeout_two_hrs, timeout_one_hr, timeout_thirty_mins) => {
    const chat_from_user = chats.find(chat => chat.id.user === user); // used in the eval statement

    if (timeout_two_hrs > 0) {
        ++VARIABLES_COUNTER;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! You have ' + course.name.split('|')[0]+ ' in 2 hours')}, timeout_two_hrs)")
        console.log('Sending 2hr notif for', course.name.split('|')[0], ' to', user)
    }
    if (timeout_one_hr > 0) {
        ++VARIABLES_COUNTER;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! You have ' + course.name.split('|')[0] + ' in 1 hour')}, timeout_one_hr)")
        console.log('Sending 1hr notif for', course.name.split('|')[0], ' to', user)
    }
    if (timeout_thirty_mins > 0) {
        ++VARIABLES_COUNTER;
        eval("globalThis['t' + VARIABLES_COUNTER] = setTimeout(async () => {await chat_from_user.sendMessage('Reminder! ' + course.name.split('|')[0] + ' is in 30 minutes!')}, timeout_thirty_mins)")
        console.log('Sending 30min notif for', course.name.split('|')[0], ' to', user)
    }
}


const stopOngoingNotifications = () => {
    for (let i = 1; i < VARIABLES_COUNTER; ++i) {
        eval("clearTimeout(t" + i + ")");
        console.log(`Cleared timeout t${i}`);
    }
    console.log('Cleared all dynamic variables with timeouts');
    VARIABLES_COUNTER = 0;
}


const allClassesReply = (all_classes, elective, text) => {
    let filtered_courses = null;
    if (elective === "D") {
        text += "Timetable for *Data Mining* as elective:\n\n"
        all_classes.forEach(class_obj => {
            filtered_courses = class_obj.courses.filter(c => !c.name.includes("Networking") && !c.name.includes("Soft. Modelling"));
            text += "*" + class_obj.day + "*:\n" + filtered_courses.map(c => '→ ' + c.name + "\n").join('') + "\n";
        })
    } else if (elective === "N") {
        text += "Timetable for *Networking* as elective:\n\n"
        all_classes.forEach(class_obj => {
            filtered_courses = class_obj.courses.filter(c => !c.name.includes("Data Mining") && !c.name.includes("Soft. Modelling"))
            text += "*" + class_obj.day + "*:\n" + filtered_courses.map(c => '→ ' + c.name + "\n").join('') + "\n";
        })
    } else if (elective === "S") {
        text += "Timetable for *Software Modelling* as elective:\n\n"
        all_classes.forEach(class_obj => {
            filtered_courses = class_obj.courses.filter(c => !c.name.includes("Data Mining") && !c.name.includes("Networking"))
            text += "*" + class_obj.day + "*:\n" + filtered_courses.map(c => '→ ' + c.name + "\n").join('') + "\n";
        })
    }
    return text;
}


const todayClassReply = async (text, elective) => {
    const today_day = new Date().toString().split(' ')[0]; // to get day

    if (today_day === 'Sat' || today_day === 'Sun') {
        await msg.reply('Its the weekend! No classes today🥳\n\n_PS:_ You can type *!classes* to know your classes for the week.');
        return;
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
        text += "Today's classes ( *Data Mining*): ☀\n\n"
        courses = courses.filter(c => !c.name.includes("Networking") && !c.name.includes("Soft. Modelling"));
    } else if (elective === 'N') {
        text += "Today's classes ( *Networking*): ☀\n\n"
        courses = courses.filter(c => !c.name.includes("Data Mining") && !c.name.includes("Soft. Modelling"));
    } else if (elective === 'S') {
        text += "Today's classes ( *Soft. Modelling*): ☀\n\n"
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


module.exports = { pickRandomReply, extractTime, extractCommand, extractCommandArgs, msToHMS, notificationTimeCalc, startNotificationCalculation, stopOngoingNotifications, allClassesReply, todayClassReply }