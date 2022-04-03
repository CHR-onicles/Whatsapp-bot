// --------------------------------------------------
// Helper functions
// --------------------------------------------------


const pickRandomReply = (replies) => {
    return replies[Math.floor(Math.random() * replies.length)];
}


const getIsMutedStatus = () => {
    // return JSON.parse(localStorage.getItem('IS_MUTED') || false);
    return false;
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
    const first_word = msg?.body.toLowerCase().split(/(\s+|\n+)/)[0];
    // console.log(first_word)
    if (first_word[0] === '!') {
        return first_word;
    }
}


const msToHMS = (duration) => {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // hours = (hours < 10) ? "0" + hours : hours;
    // minutes = (minutes < 10) ? "0" + minutes : minutes;
    // seconds = (seconds < 10) ? "0" + seconds : seconds;

    return { hours, minutes, seconds }
}

module.exports = { pickRandomReply, getIsMutedStatus, extractTime, msToHMS, extractCommand }