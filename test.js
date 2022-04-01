
const course = '_Soft. Modelling_ | ⏰5:30pm | 🏠LOT1';
const cur_time = new Date();
const duration = 1;
console.log(extractTime(course));

console.log(cur_time.getHours(), cur_time.getMinutes());
console.log('Duration:', duration)
const class_time = extractTime(course);
const class_time_hrs = +class_time.split(':')[0]
const class_time_mins = +class_time.split(':')[1].slice(0, class_time.split(':')[1].length - 2);

if ((cur_time.getHours() < class_time_hrs) || (cur_time.getHours() === class_time_hrs && cur_time.getMinutes() < class_time_mins)) {
    console.log('Not time yet')
}
else if ((cur_time.getHours() === class_time_hrs) || (cur_time.getHours() < class_time_hrs + duration) || ((cur_time.getHours() <= class_time_hrs + duration) && cur_time.getMinutes() < class_time_mins)) {
    console.log('In session')
}
else if ((cur_time.getHours() > (class_time_hrs + duration)) || (cur_time.getHours() >= (class_time_hrs + duration) && (cur_time.getMinutes() > class_time_mins))) {
    console.log('Past time')
}
