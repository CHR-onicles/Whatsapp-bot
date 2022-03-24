const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');


// --------------------------------------------------
// Global variables
// --------------------------------------------------
const SUPER_ADMIN = '233557632802';
const BOT = '233551687450';
let IS_MUTED = false;

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


// --------------------------------------------------
// BOT LOGIC FROM HERE DOWN
// --------------------------------------------------

// Ping
client.on('message', msg => {
    if (msg.body === '!ping' && !IS_MUTED) {
        msg.reply('pong');
    }
});


// Mention everyone
client.on('message', async (msg) => {
    if (msg.body === '!everyone' && !IS_MUTED) {
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

    if (msg.body[0] === '@' && !IS_MUTED) {
        const first_word = msg.body.split(' ')[0];
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
    if ((msg.body === '!🤫' || msg.body === '!mute' || msg.body === '!silence') && !IS_MUTED) {
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
            IS_MUTED = true;
        }
    }
})


// Unmute
client.on('message', async (msg) => {
    if ((msg.body === '!unmute' || msg.body === '!speak') && IS_MUTED) {
        const contact = await msg.getContact();
        if (contact.id.user === SUPER_ADMIN) {
            const UNMUTE_REPLIES = [
                'Thanks sir',
                'Finally🐦',
                '🥳',
                'Speaking freely now 👍🏽',
            ]
            await msg.reply(pickRandomReply(UNMUTE_REPLIES));
            IS_MUTED = false;
        }
    } else if ((msg.body === '!unmute' || msg.body === '!speak') && !IS_MUTED) {
        await msg.reply(`Haven't been muted ${contact.id.user !== SUPER_ADMIN ? "fam" : "sir "}🐦`);
    }
})


// Help
client.on('message', async (msg) => {
    if (msg.body === '!help' && !IS_MUTED) {
        // const contact = await msg.getContact();
        await msg.reply(
            "Hello there 🐦\n\nI'm a bot created for *EPiC Devs🏅🎓*\n\nHere are a few commands you can fiddle with:\n\n*!ping*: check if I'm available🙋🏽‍♂️\n*!help*: get commands that can be used with me\n*!mute*: get me to be quiet😅\n*!unmute*: opposite of command above🙂\n*!everyone*: ping everyone in the group😮"
        )
    }
})




client.initialize();