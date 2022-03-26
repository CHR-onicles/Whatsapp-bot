const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./node-localStorage');


// --------------------------------------------------
// Global variables
// --------------------------------------------------
const SUPER_ADMIN = '233557632802';
const BOT = '233551687450';
const BOT_PUSHNAME = 'Ethereal';


// --------------------------------------------------
// Data
// --------------------------------------------------
const CLASSES = [
    {
        day: 'Monday',
        courses: [
            { name: '_Formal Methods_ | ⏰5:30pm | 🏠N3', duration: 2 }
        ]
    },
    {
        day: 'Tuesday',
        courses: [
            { name: '_Accounting_ | ⏰5:30pm | 🏠JQB23', duration: 2 }
        ]
    },
    {
        day: 'Wednesday',
        courses: [
            { name: '_Compilers_ | ⏰9:30am | 🏠E10', duration: 2 },
            { name: '_Theory & Survey_ | ⏰3:30pm | 🏠JQB09', duration: 2 },
            { name: '_Soft. Modelling_ | ⏰5:30pm | 🏠LOT1', duration: 2 }
        ]
    },
    {
        day: 'Thursday',
        courses: [
            { name: '_Project_ | ⏰8:30am | 🏠Online', duration: 2 },
            { name: '_Formal Methods_ | ⏰12:30pm | 🏠JQB19', duration: 1 },
            { name: '_Accounting_ | ⏰6:30pm | 🏠E10', duration: 1 }
        ]
    },
    {
        day: 'Friday',
        courses: [
            { name: '_Soft. Modelling_ | ⏰9:30am | 🏠N3', duration: 1 },
            { name: '_Theory & Survey_ | ⏰10:30am | 🏠N3', duration: 1 },
            { name: '_Compilers_ | ⏰4:30pm | 🏠NNB2', duration: 1 }
        ]
    }
]

const HELP_COMMANDS = [
    {
        command: "*!ping*",
        desc: "check if I'm available 🙋🏽‍♂️"
    },
    {
        command: "*!help*",
        desc: "get commands that can be used with me 💡"
    },
    {
        command: "*!mute*",
        desc: "get me to be quiet 😅"
    },
    {
        command: "*!unmute*",
        desc: "allow me to talk 🙂"
    },
    {
        command: "*!everyone*",
        desc: "ping everyone in the group 😮"
    },
    {
        command: "*!classes*",
        desc: "get all the classes you have this week 📚"
    },
    {
        command: "*!class*",
        desc: "get today's classes 📕"
    }
]



// --------------------------------------------------
// Configurations
// --------------------------------------------------

const client = new Client({
    authStrategy: new LocalAuth() // to persist client session
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// client.on('auth_failure', () => {
//     console.log('Client failed to authenticate!');
// });

// client.on('authenticated', () => {
//     console.log('Client was authenticated successfully!');
// });



// --------------------------------------------------
// Helper functions
// --------------------------------------------------
const pickRandomReply = (replies) => {
    return replies[Math.floor(Math.random() * replies.length)];
}

const getIsMutedStatus = () => {
    return JSON.parse(localStorage.getItem('IS_MUTED') || false);
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


// --------------------------------------------------
// BOT LOGIC FROM HERE DOWN
// --------------------------------------------------

// Ping
client.on('message', msg => {
    if (msg.body.toLowerCase() === '!ping' && !getIsMutedStatus()) {
        msg.reply('pong');
    }
});


// Mention everyone
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === '!everyone' && !getIsMutedStatus()) {
        const contact = await msg.getContact();
        if (contact.id.user !== SUPER_ADMIN) {
            await msg.reply("Only the boss can use this, so you don't abuse it🐦");
            return;
        }
        const chat = await msg.getChat();

        let text = "";
        let mentions = [];

        if (chat.participants) {
            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);

                mentions.push(contact);
                text += `@${participant.id.user} `;
                // console.log(participant);
            }

            await chat.sendMessage(text, { mentions });
        } else {
            await msg.reply("Can't do this - I may break :(");
            console.log('No participants - probably not a group chat!');
        }
    }
});


// Reply if pinged
client.on('message', async (msg) => {

    if (msg.body.toLowerCase()[0] === '@' && !getIsMutedStatus()) {
        const first_word = msg.body.toLowerCase().split(' ')[0];
        const contact = await msg.getContact();

        const PING_REPLIES = [
            `${contact.id.user !== SUPER_ADMIN ? "I'm not your bot shoo🐦" : "Need me sir?"}`,
            `I'm here ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `Alive and well ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `Speak forth ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `${contact.id.user !== SUPER_ADMIN ? "Shoo🐦" : "Sir 🐦"}`,
            `${contact.id.user !== SUPER_ADMIN ? "🙄" : "Boss 🐦"}`,
            `Up and running 🐦`,
            `🙋🏽‍♂️`,
            `👋🏽`,
            `🐦`,
            `👀`,
            `Adey 🐦`,
            `Yo 🐦`,
        ]

        // console.log("first word:", first_word);
        if (first_word.slice(1, first_word.length) === BOT) {
            await msg.reply(pickRandomReply(PING_REPLIES));
        }
    }
});


// Mute
client.on('message', async (msg) => {
    if ((msg.body.toLowerCase() === '!🤫' || msg.body.toLowerCase() === '!mute' || msg.body.toLowerCase() === '!silence') && !getIsMutedStatus()) {
        const contact = await msg.getContact();
        if (contact.id.user === SUPER_ADMIN) {
            const MUTE_REPLIES = [
                'Yes sir',
                'Roger that🐦',
                'Sigh...oki',
                '👍🏽',
                'Got it 👍🏽',
                '🤐👍🏽'
            ]
            await msg.reply(pickRandomReply(MUTE_REPLIES));
            // IS_MUTED = true;
            localStorage.setItem('IS_MUTED', 'true');
        }
    }
})


// Unmute
client.on('message', async (msg) => {
    const contact = await msg.getContact();
    if ((msg.body.toLowerCase() === '!unmute' || msg.body.toLowerCase() === '!speak') && getIsMutedStatus()) {
        if (contact.id.user === SUPER_ADMIN) {
            const UNMUTE_REPLIES = [
                'Thanks sir',
                'Finally🐦',
                '🥳',
                'Speaking freely now 👍🏽',
            ]
            await msg.reply(pickRandomReply(UNMUTE_REPLIES));
            // IS_MUTED = false;
            localStorage.setItem('IS_MUTED', 'false');
        }
    } else if ((msg.body.toLowerCase() === '!unmute' || msg.body.toLowerCase() === '!speak') && !getIsMutedStatus()) {
        await msg.reply(`Haven't been muted ${contact.id.user !== SUPER_ADMIN ? "fam" : "sir "}🐦`);
    }
})


// Help
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === '!help' && !getIsMutedStatus()) {
        let text = `Hello there I'm *${BOT_PUSHNAME}*🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n`;

        HELP_COMMANDS.forEach(obj => {
            text += obj.command + ': ' + obj.desc + '\n';
        })
        await msg.reply(text);
    }
})


// Check classes for the week
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === '!classes' && !getIsMutedStatus()) {
        let text = "If *Software Modelling* is your elective:\n\n";
        CLASSES.forEach(class_obj => {
            text += "*" + class_obj.day + "*:\n" + class_obj.courses.map(course => course.name + "\n").join('') + "\n";
            // added join('') to map() to remove the default comma after each value in array
        })
        await msg.reply(text);
    }
})


// Check class for today
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === '!class' && !getIsMutedStatus()) {
        const today_day = new Date().toString().split(' ')[0]; // to get day

        if (today_day === 'Sat' || today_day === 'Sun') {
            await msg.reply('Its the weekend! No classes today🥳\n\n_PS:_ You can type *!classes* to know your classes for the week.');
            return;
        }

        const { courses } = CLASSES.find(class_obj => {
            if (class_obj.day.slice(0, 3) === today_day) {
                return class_obj;
            }
        });

        const cur_time = new Date();
        const done_array = [];
        const in_session_array = [];
        const upcoming_array = [];
        let text = "*Today's classes* ☀\n\n";

        courses.map(course => {
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


        text += "✅ *Done*:\n" + done_array.map(({ name }) => `~${name}~\n`).join('') + "\n" + "⏳ *In session*:\n" + in_session_array.map(({ name }) => `${name}\n`).join('') + "\n" + "💡 *Upcoming*:\n" + upcoming_array.map(({ name }) => `${name}\n`).join('');
        await msg.reply(text);
    }
})


// Send a direct message to a user
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === '!dm' && !getIsMutedStatus()) {
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();

        chat_from_contact.sendMessage("Sliding in DM - ☀");
    }
})




client.initialize();