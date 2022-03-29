const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { pickRandomReply, extractTime, getIsMutedStatus, localStorage } = require('./helpers.js');
const { CLASSES, HELP_COMMANDS } = require('./data.js');


// --------------------------------------------------
// Global variables
// --------------------------------------------------
const SUPER_ADMIN = '233557632802';
const BOT = '233551687450';
const BOT_PUSHNAME = 'Ethereal';
const EPIC_DEVS_GROUP_ID = '233558460645-1620635743';
const L400_ASSIGNMENTS_GROUP_ID = ' 233241011931-1400749467';
const HIGH_COUNCIL_GROUP_ID = '233557632802-1618870529';


// --------------------------------------------------
// Configurations
// --------------------------------------------------

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: '../.wwebjs_auth/' }), // to persist client session
});

client.setMaxListeners(0); // for an infinite number of event listeners

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
/**/


// --------------------------------------------------
// BOT LOGIC FROM HERE DOWN
// --------------------------------------------------

// Ping
client.on('message', msg => {
    if (msg.body.toLowerCase() === '!ping' && !getIsMutedStatus()) {
        msg.reply('pong 🏓');
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

        text += "✅ *Done*:\n" +
            function () {
                return !done_array.length ? '\t-\n' : done_array.map(({ name }) => `~${name}~\n`).join('')
            }()
            + "\n" + "⏳ *In session*:\n" +
            function () {
                return !in_session_array.length ? '\t-\n' : in_session_array.map(({ name }) => `${name}\n`).join('')
            }()
            + "\n" + "💡 *Upcoming*:\n" +
            function () {
                return !upcoming_array.length ? '\t-\n' : upcoming_array.map(({ name }) => `${name}\n`).join('')
            }();
        await msg.reply(text);
    }
})


// Send a direct message to a user *(Work In Progress)*
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === '!dm' && !getIsMutedStatus()) {
        const contact = await msg.getContact();
        const chat_from_contact = await contact.getChat();

        chat_from_contact.sendMessage("Sliding in DM - ☀");
    }
})


// Forward messages with links to EPiC Devs
client.on('message', async (msg) => {
    if (msg.body.toLowerCase().includes('https')) {
        const chats = await client.getChats();
        const link_pattern = /(https?:\/\/[^\s]+)/;
        const target_chat = chats.find(chat => chat.id.user === EPIC_DEVS_GROUP_ID);
        const extracted_link = link_pattern.exec(msg.body)[0];
        const current_forwarded_links = JSON.parse(localStorage.getItem('FORWARDED_LINKS')) || [];

        // console.log('recognized a link');
        // console.log('extracted link:', extracted_link);
        if (!current_forwarded_links.includes(extracted_link)) {
            localStorage.setItem('FORWARDED_LINKS', JSON.stringify([...current_forwarded_links, extracted_link]));
            await msg.forward(target_chat);
            console.log('added new link');
        } else {
            console.log("repeated link");
        }
    }
})


// Forward messages with announcements to EPiC Devs
client.on('message', async (msg) => {
    if (msg.body.includes('❗') || msg.body.includes('‼')) {
        // PS: There may be repeated messages in the FORWARDED_ANNOUNCEMENTS and
        // FORWARDED_LINKS local storage object depending on whether the exclamation 
        // or the link comes first.

        const chats = await client.getChats();
        const target_chat = chats.find(chat => chat.id.user === EPIC_DEVS_GROUP_ID);
        const current_forwarded_announcements = JSON.parse(localStorage.getItem('FORWARDED_ANNOUNCEMENTS')) || [];

        // console.log('recognized an announcement');

        if (!current_forwarded_announcements.includes(msg.body)) {
            localStorage.setItem('FORWARDED_ANNOUNCEMENTS', JSON.stringify([...current_forwarded_announcements, msg.body]));
            await msg.forward(target_chat);
            console.log('added new announcement');
        } else {
            console.log('repeated announcement');
        }
    }
})




client.initialize();