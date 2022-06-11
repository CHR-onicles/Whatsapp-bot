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
    isNotifsOn: { type: Boolean, default: false },
    isForwardingOn: { type: Boolean, default: false }, // temporary
    allLinks: [String],
    allAnnouncements: [String],
    botAdmins: [String],
    forwardToUsers: [String],
    electiveDataMining: [String],
    electiveSoftModelling: [String],
    electiveNetworking: [String],
    blacklistedUsers: [String]
    // numOfCommands: Number, // to be used later
});

const devModelName = "miscellaneous-dev";
const prodModelName = "miscellaneous";
const currentModelName = process.env.NODE_ENV === "production" ? prodModelName : devModelName;
const MiscellaneousModel = model(currentModelName, MiscellaneousSchema);
const DEFAULT_ID = { _id: process.env.NODE_ENV === 'production' ? 1 : 2 };  // to always update one specific document


/**
 * Helper function to initialize the miscellaneous/miscellaneous-dev collection.
 * @async
 */
const initCollection = async () => {
    const count = await MiscellaneousModel.countDocuments({});
    // console.log(count);
    if (!count) {
        const misc = new MiscellaneousModel({ _id: 1, botAdmins: [process.env.GRANDMASTER] });
        // const misc = new MiscellaneousModel();
        try {
            await misc.save();
        } catch (err) {
            console.log(err);
        }
    } else console.log(currentModelName + " collection is not empty");
}
initCollection();

// EXPORTS ---------------------------------------------

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
 * Gets status of notifications for class.
 * @async
 * @returns {Promise<boolean>} **True** if all notifications are on, **false** otherwise.
 */
exports.getNotificationStatus = async () => {
    const status = await MiscellaneousModel.findOne(DEFAULT_ID, { isNotifsOn: 1 });
    // console.log(status);
    return status.isNotifsOn;
}

/**
 * Turns on all notifications for class.
 * @async
 */
exports.enableAllNotifications = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { isNotifsOn: true } });
        // console.log(res);
        console.log("All notifications have been turned ON")
    } catch (error) {
        console.log(error)
    }
}

/**
 * Turns off all notifications for class.
 * @async
 */
exports.disableAllNotifications = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { isNotifsOn: false } });
        // console.log(res)
        console.log("All notifications have been turned OFF")
    } catch (error) {
        console.log(error)
    }
}

/**
 * Gets status of forwarding important messages. (temporary)
 * @async
 * @returns {Promise<boolean>} **True** if forwarding important messages is on, **false** otherwise.
 */
exports.getForwardingStatus = async () => {
    const status = await MiscellaneousModel.findOne(DEFAULT_ID, { isForwardingOn: 1 });
    // console.log(status);
    return status.isForwardingOn;
}

/**
 * Turns on forwarding of important messages. (temporary)
 * @async
 */
exports.enableForwarding = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { isForwardingOn: true } });
        // console.log(res);
        console.log("Forwarding of important messages have been turned ON")
    } catch (error) {
        console.log(error)
    }
}

/**
 * Turns off forwarding of important messages. (temporary)
 * @async
 */
exports.disableForwarding = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { isForwardingOn: false } });
        // console.log(res)
        console.log("Forwarding of important messages have been turned OFF")
    } catch (error) {
        console.log(error)
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
        console.log("Cleared all announcements");
    } catch (error) {
        console.log(error);
    }
}

/**
 * Gets all bot admins from the database.
 * @async
 * @returns {Array<string>} An array containing bot admins.
 */
exports.getAllBotAdmins = async () => {
    const botAdmins = await MiscellaneousModel.distinct("botAdmins");
    // console.log(botAdmins);
    return botAdmins;
}

/**
 * Adds a user as a bot admin.
 * @param {string} newAdmin A string containing the user to be made a bot admin.
 * @async
 */
exports.addBotAdmin = async (newAdmin) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { botAdmins: newAdmin } });
        // console.log(res);
    } catch (error) {
        console.log(error)
    }
}

/**
 * Demotes a user from being a bot admin.
 * @param {string} admin A string containing a whatsapp user's number.
 * @async
 */
exports.removeBotAdmin = async (admin) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $pull: { botAdmins: admin } });
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
        if (rowId === '1') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { electiveDataMining: newUser } });
        } else if (rowId === '2') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { electiveNetworking: newUser } });
        } else if (rowId === '3') {
            res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { electiveSoftModelling: newUser } });
        }
        // console.log(res);
        console.log("User: " + newUser + " subscribed to be notified for class with " + rowId === '1' ? 'Data Mining' : (rowId === '2' ? 'Networking' : 'Software Modelling') + ' as elective');

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

/**
 * Gets users/groups who want announcements/links forwarded to them.
 * @async
 * @returns List of users/groups where announcements and links will be forwarded to.
 */
exports.getForwardToUsers = async () => {
    const users = await MiscellaneousModel.findOne(DEFAULT_ID, { forwardToUsers: 1 });
    // console.log(users.forwardToUsers);
    return users.forwardToUsers;
}

/**
 * Gets users who have been blacklisted.
 * @async
 * @returns List of users who have been blacklisted.
 */
exports.getBlacklistedUsers = async () => {
    const users = await MiscellaneousModel.findOne(DEFAULT_ID, { blacklistedUsers: 1 });
    // console.log(users);
    return users.blacklistedUsers;
}

/**
 * Adds a user to be blacklisted.
 * @param {string} user String representing a whatsapp number.
 * @async
 */
exports.addBlacklistedUser = async (user) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { blacklistedUsers: user } });
        // console.log(res);
    } catch (e) {
        console.error(e);
    }
}

/**
 * Removes a blacklisted user.
 * @param {string} user String representing a whatsapp number.
 * @async
 */
exports.removeBlacklistedUser = async (user) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $pull: { blacklistedUsers: user } });
        // console.log(res);
    } catch (error) {
        console.error(error)
    }
}