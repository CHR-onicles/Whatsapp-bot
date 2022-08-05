// const path = require('path');
// const fs = require('fs');

const { FOOTNOTES } = require("./utils/data");
const { pickRandomWeightedMessage, getTimeLeftForSetTimeout } = require("./utils/helpers");

// const client = new Map();

// // Read commands into memory
// const root_dir = path.join(__dirname, './commands');
// fs.readdir('./commands', (err, folders) => {
//     if (err) return console.error(err);
//     folders.forEach(folder => {
//         const commands = fs.readdirSync(`${root_dir}/${folder}`).filter((file) => file.endsWith(".js"));
//         for (let file of commands) {
//             const command = require(`${root_dir}/${folder}/${file}`);
//             client.set(command.name, command);
//             // console.log('done')
//         }
//     })

//     // console.log(client.commands.has('everyone'));
//     console.log('Number of commands read successfully:', client.size);

//     const temp = [];
//     client.forEach((value, key) => {
//         temp.push(`!${key} - ${value.description}`);
//     })
//     temp.sort((a, b) => a.localeCompare(b));
//     console.log(temp)
// })


// for (const item of Object.values(list).some(_ => )) {
//     console.log(item);
// }

 console.log(`Great ${new Date().getHours() >= 0 && new Date().getHours() <= 11 ? 'morning' : (new Date().getHours()>= 12 && new Date().getHours() <= 16 ? 'afternoon' : 'evening')} 🥳`);

// let count = 0;
// for (let i = 0; i < 20; ++i) {
//     count++;
//     const temp = pickRandomWeightedMessage(FOOTNOTES, 100);
//     temp && console.log(temp);
//     // console.log(count)
// }
