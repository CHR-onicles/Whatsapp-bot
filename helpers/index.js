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

module.exports = { pickRandomReply, getIsMutedStatus, extractTime }