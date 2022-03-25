
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



const course = '_Soft. Modelling_ | ⏰5:30pm | 🏠LOT1';
const cur_time = new Date();
const duration = 1;
console.log(extractTime(course));

console.log(cur_time.getHours(), cur_time.getMinutes());
const class_time = extractTime(course);
const class_time_hrs = +class_time.split(':')[0]
const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);

if ((cur_time.getHours() < class_time_hrs) || (cur_time.getHours() === class_time_hrs && cur_time.getMinutes() < class_time_mins)) {
    console.log('Not time yet')
}
else if ((cur_time.getHours() === class_time_hrs) || ((cur_time.getHours() <= class_time_hrs + duration) && cur_time.getMinutes() <= class_time_mins)) {
    console.log('In session')
}
else if (((cur_time.getHours() + duration) > (class_time_hrs + duration)) || ((cur_time.getHours() + duration) > (class_time_hrs + duration)) && (cur_time.getMinutes() > class_time_mins)) {
    console.log('Past time')
}
