// --------------------------------------------------
// misc.js contains the database schema and behaviour
// for miscellaneous stuff relating to the bot which cannot
// go under any other specific schema
// --------------------------------------------------

const { Schema, model } = require('mongoose');


/**
 * Schema for bot's Miscellaneous stuff. It basically acts like local storage.
 */
const MiscellaneousSchema = new Schema({
    _id: { type: Number, default: 1 },
    isMuted: { type: Boolean, default: false },
    allLinks: [String],
    allAnnouncements: [String],
    superAdmins: [String],
    electiveDataMining: [String],
    electiveSoftModelling: [String],
    electiveNetworking: [String],
    // numOfCommands: Number, // to be used later
});

const MiscellaneousModel = model("Miscellaneous", MiscellaneousSchema);
const DEFAULT_ID = { _id: 1 }; // to always update one specific document


//! Find better way of doing code below, if internet is slow, it executes query before connecting to DB which creates an error
// (async () => {
//     if (await MiscellaneousModel.findOne({ _id: 1 }) === null) {
//         const misc = new MiscellaneousModel({ _id: 1, numOfCommands: 0, superAdmins: [process.env.GRANDMASTER], electiveSoftModelling: [process.env.GRANDMASTER] });
//         try {
//             await misc.save();
//         } catch (err) {
//             console.log(err);
//         }
//     }
// })();


// EXPORTS

/**
 * Gets muted status of bot.
 * @async
 * @returns {Promise<boolean>} **True** if bot muted, **false** otherwise.
 */
exports.getMutedStatus = async () => {
    const status = await MiscellaneousModel.findOne(DEFAULT_ID, { isMuted: 1 });
    // console.log(status);
    return status.isMuted;
}

/**
 * Mutes the bot.
 * @async
 */
exports.muteBot = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { isMuted: true } });
        // console.log(res);
        console.log("Bot muted");
    } catch (error) {
        console.log(error)
    }
}

/**
 * Unmutes the bot.
 * @async
 */
exports.unmuteBot = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { isMuted: false } });
        // console.log(res);
        console.log("Bot unmuted");
    } catch (error) {
        console.log(error);
    }
}

/**
 * Retrieves all the links from the database.
 * @async
 * @returns {Array<string>} An array with all links in the database.
 */
exports.getAllLinks = async () => {
    const links = await MiscellaneousModel.findOne(DEFAULT_ID, { allLinks: 1 });
    // console.log(links.allLinks);
    return links.allLinks;
}

/**
 * Adds a new link to the database.
 * @param {string} newLink A string with a whatsapp message including the link.
 * @async
 */
exports.addLink = async (newLink) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { allLinks: newLink } });
        // console.log(res);
        console.log('New Link added');
    } catch (error) {
        console.log(error);
    }
}

/**
 * Removes all the links saved in the database.
 * @async
 */
exports.removeAllLinks = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { allLinks: [] } });
        // console.log(res);
    } catch (error) {
        console.log(error)
    }
}

/**
 * Gets all the announcements from the database.
 * @async
 * @returns {Array<string>} An array with all announcements in the database.
 */
exports.getAllAnnouncements = async () => {
    const ann = await MiscellaneousModel.findOne(DEFAULT_ID, { allAnnouncements: 1 });
    // console.log(ann.allAnnouncements);
    return ann.allAnnouncements;
}

/**
 * Adds a new announcement to the database.
 * @param {string} newAnnouncement A string containing the new announcement.
 * @async
 */
exports.addAnnouncement = async (newAnnouncement) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { allAnnouncements: newAnnouncement } });
        // console.log(res);
        console.log('New announcement added');

    } catch (error) {
        console.log(error)
    }
}

/**
 * Removes all announcements in the database.
 * @async
 */
exports.removeAllAnnouncements = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { allAnnouncements: [] } });
        // console.log(res);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Gets all super admins from the database.
 * @async
 * @returns {Array<string>} An array containing super admins.
 */
exports.getAllSuperAdmins = async () => {
    const superAdmins = await MiscellaneousModel.distinct("superAdmins");
    console.log(superAdmins);
    return superAdmins;
}

/**
 * Adds a user as a super admin of the bot.
 * @param {string} newAdmin A string containing the user to be made a super admin.
 * @async
 */
exports.addSuperAdmin = async (newAdmin) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { superAdmins: newAdmin } });
        // console.log(res);
    } catch (error) {
        console.log(error)
    }
}

/**
 * Demotes a user from being a super admin of the bot.
 * @param {string} admin A string containing a whatsapp user.
 * @async
 */
exports.removeSuperAdmin = async (admin) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $pull: { superAdmins: admin } });
        // console.log(res);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Gets users who have subscribed to be notified for class.
 * @async
 * @returns Object with each property containing an array of users who offer a specific elective.
 */
exports.getUsersToNotifyForClass = async () => {
    const resUsers = await MiscellaneousModel.findOne(DEFAULT_ID, { electiveDataMining: 1, electiveNetworking: 1, electiveSoftModelling: 1 });
    const { electiveDataMining: dataMining, electiveNetworking: networking, electiveSoftModelling: softModelling } = resUsers;
    return { dataMining, networking, softModelling };
}

/**
 * Subscribes a user to be notified for class.
 * @param {string} newUser A string representing a whatsapp user.
 * @param {string} rowId A string representing the **ID** for a specific whatsapp list.
 * @async
 */
exports.addUserToBeNotified = async (newUser, rowId) => {
    try {
        let res = null;
        if (rowId === '31') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { electiveDataMining: newUser } });
        } else if (rowId === '32') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { electiveNetworking: newUser } });
        } else if (rowId === '33') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { electiveSoftModelling: newUser } });
        }
        // console.log(res);
        console.log("User: " + newUser + " subscribed to be notified for class with " + rowId === '31' ? 'Data Mining' : (rowId === '32' ? 'Networking' : 'Software Modelling') + ' as elective');

    } catch (error) {
        console.log(error)
    }
}

/**
 * Unsubscribes a user from being notified for class.
 * @param {string} user A string representing a whatsapp.
 * @param {string} elective A string representing a single character used to identify an elective.
 * @async
 */
exports.removeUserToBeNotified = async (user, elective) => {
    try {
        let res = null;
        if (elective === 'D') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $pull: { electiveDataMining: user } });
        } else if (elective === 'N') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $pull: { electiveNetworking: user } });
        } else if (elective === 'S') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $pull: { electiveSoftModelling: user } });
        }
        // console.log(res);
        console.log("User: " + user + " unsubscribed from being notified for class");
    } catch (error) {
        console.log(error);
    }
}

