// --------------------------------------------------
// Helper functions
// --------------------------------------------------

var VARIABLES_COUNTER = 0; // used in eval statement later

const { getUsersToNotifyForClass } = require("../middleware");
const { CLASSES } = require("./data");


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
    const args = msg.body.toLowerCase().split(' '); // enforce arguments being separated from commands strictly by space(s)
    return args[index];
}


const msToHMS = (duration) => {
    if (duration < 0) {
        throw new Error('The duration cannot be negative!');
    }
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60)) / 24);

    // days = (days < 10) ? "0" + days : days;
    // hours = (hours < 10) ? "0" + hours : hours;
    // minutes = (minutes < 10) ? "0" + minutes : minutes;
    // seconds = (seconds < 10) ? "0" + seconds : seconds;

    return { days, hours, minutes, seconds }
}


const notificationTimeCalc = (course) => {
    // Constants for notification times
    const two_hrs_ms = 120 * 60 * 1000;
    const one_hr_ms = 60 * 60 * 1000;
    const thirty_mins_ms = 30 * 60 * 1000;

    // Timeouts for the 3 reminder times
    let timeout_two_hrs = 0;
    let timeout_one_hr = 0;
    let timeout_thirty_mins = 0;

    const class_time = extractTime(course.name);
    const class_time_hrs = +class_time.split(':')[0];
    const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);

    const cur_time = new Date();
    const new_class_time = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), class_time_hrs, class_time_mins, 0);
    const time_left_in_ms = new_class_time - cur_time;
    // if (time_left_in_ms < 0) return;

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


const startNotificationCalculation = async (client) => {
    const today_day = new Date().toString().split(' ')[0];
    const subscribed_users = await getUsersToNotifyForClass();
    const chats = await client.getChats();

    if (!subscribed_users.length) {
        return; // stop rather than calling the restart function again which might lead to an infinite loop
    }

    if (today_day === 'Sat' || today_day === 'Sun') {
        console.log("No courses to be notified for during the weekend!");
        return;
    }

    const { courses } = CLASSES.find(class_obj => {
        if (class_obj.day.slice(0, 3) === today_day) {
            return class_obj;
        }
    });

    courses.forEach(course => {
        const class_time = extractTime(course.name);
        const class_time_hrs = +class_time.split(':')[0];
        const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);
        const { timeout_two_hrs, timeout_one_hr, timeout_thirty_mins } = notificationTimeCalc(course);

        const cur_time = new Date();
        const new_class_time = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), class_time_hrs, class_time_mins, 0);
        const time_left_in_ms = new_class_time - cur_time;
        if (time_left_in_ms < 0) return;

        subscribed_users.forEach(user => {
            const chat_from_user = chats.find(chat => chat.id.user === user);

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
        })
    })
}


const stopOngoingNotifications = () => {
    for (let i = 1; i < VARIABLES_COUNTER; ++i) {
        eval("clearTimeout(t" + i + ")");
        console.log(`Cleared timeout t${i}`);
    }
    console.log('Cleared all dynamic variables with timeouts');
    VARIABLES_COUNTER = 0;
}


module.exports = { pickRandomReply, extractTime, extractCommand, extractCommandArgs, msToHMS, notificationTimeCalc, startNotificationCalculation, stopOngoingNotifications }