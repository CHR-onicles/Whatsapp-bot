const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal')

const SUPER_ADMIN = '233557632802';
const BOT = '233551687450';
const IS_MUTED = false;

const client = new Client({
    authStrategy: new LocalAuth() // to persist client session
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

// --------------------------------------------------
// Helper functions
// --------------------------------------------------
const pickRandomReply = (replies) => {
    replies[Math.floor(Math.random() * replies.length)];
}


// --------------------------------------------------
// BOT LOGIC FROM HERE DOWN
// --------------------------------------------------
client.on('message', message => {
    if (message.body === '!ping' && !IS_MUTED) {
        message.reply('pong');
    }
});



// Mention everyone
client.on('message', async (msg) => {
    if (msg.body === '!everyone' && !IS_MUTED) {
        const chat = await msg.getChat();

        let text = "";
        let mentions = [];

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.id._serialized);

            mentions.push(contact);
            text += `@${participant.id.user} `;
            // console.log(participant);
        }

        await chat.sendMessage(text, { mentions });
    }
});


// Reply if pinged
client.on('message', async (msg) => {

    if (msg.body[0] === '@' && !IS_MUTED) {
        const first_word = msg.body.split()[0];
        const contact = await msg.getContact();

        const PING_REPLIES = [
            `${contact.id.user !== SUPER_ADMIN ? "I'm not your bot shoo🐦" : "Need me sir?"}`,
            `I'm here ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `Alive and well ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `Speak forth ${contact.id.user === SUPER_ADMIN ? 'sir' : 'fam'}🐦`,
            `${contact.id.user !== SUPER_ADMIN ? "Shoo🐦" : "Sir 🐦"}`,
            `Up and running 🐦`,
            `🙋🏽‍♂️`,
            `👋🏽`,
            `🐦`
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
        }
    }
})




client.initialize();