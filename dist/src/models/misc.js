"use strict";
// --------------------------------------------------
// misc.js contains the database schema and behaviour
// for miscellaneous stuff relating to the bot which cannot
// go under any other specific schema
// --------------------------------------------------
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeClassGroup = exports.addClassGroup = exports.getAllClassGroups = exports.removeBlacklistedUser = exports.addBlacklistedUser = exports.getBlacklistedUsers = exports.getForwardToUsers = exports.removeUserToBeNotified = exports.addUserToBeNotified = exports.getUsersToNotifyForClass = exports.removeBotAdmin = exports.addBotAdmin = exports.getAllBotAdmins = exports.removeAllAnnouncements = exports.addAnnouncement = exports.getAllAnnouncements = exports.removeAllLinks = exports.addLink = exports.getAllLinks = exports.disableForwarding = exports.enableForwarding = exports.getForwardingStatus = exports.enableOrDisableNotificationForCourse = exports.enableOrDisableAllNotifications = exports.getNotificationStatus = exports.unmuteBot = exports.muteBot = exports.getMutedStatus = void 0;
const mongoose_1 = require("mongoose");
/**
 * Schema for bot's Miscellaneous stuff. It basically acts like local storage.
 */
//TODO:  Type this schema later
const MiscellaneousSchema = new mongoose_1.Schema({
    _id: { type: Number, default: 1 },
    isMuted: { type: Boolean, default: false },
    classNotifications: {
        type: Object,
        default: {
            CSCD416: false,
            CSCD418: false,
            CSCD422: false,
            CSCD424: false,
            CSCD400: false,
            CSCD426: false,
            CSCD428: false,
            CSCD432: false,
            CSCD434: false,
        },
    },
    isForwardingOn: { type: Boolean, default: false },
    allLinks: [String],
    allAnnouncements: [String],
    botAdmins: { type: Array, default: [process.env.GRANDMASTER] },
    forwardToUsers: [String],
    electiveMultimedia: [String],
    electiveExpert: [String],
    electiveConcurrent: [String],
    electiveMobile: [String],
    blacklistedUsers: [String],
    classGroups: [String],
    // numOfCommands: Number, // to be used later
});
const devModelName = "miscellaneous-dev";
const prodModelName = "miscellaneous";
const currentModelName = process.env.NODE_ENV === "production" ? prodModelName : devModelName;
const MiscellaneousModel = (0, mongoose_1.model)(currentModelName, MiscellaneousSchema);
const DEFAULT_ID = { _id: 1 }; // to always update one specific document
/**
 * Helper function to initialize the miscellaneous/miscellaneous-dev collection.
 * @async
 */
const initCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield MiscellaneousModel.countDocuments({});
    // console.log([MISC MODEL] count);
    if (!count) {
        const misc = new MiscellaneousModel({ _id: 1 });
        try {
            yield misc.save();
        }
        catch (err) {
            console.error("[MISC MODEL ERROR]", err);
        }
    }
    else
        console.log("[MISC MODEL]", currentModelName + " collection is not empty");
});
initCollection();
// export const ---------------------------------------------
/**
 * Gets muted status of bot.
 * @async
 * @returns **True** if bot muted, **false** otherwise.
 */
const getMutedStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield MiscellaneousModel.findOne(DEFAULT_ID, { isMuted: 1 });
    // console.log('[MISC MODEL]', status);
    if (status)
        return status.isMuted;
});
exports.getMutedStatus = getMutedStatus;
/**
 * Mutes the bot.
 * @async
 */
const muteBot = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: { isMuted: true },
        });
        // console.log('[MISC MODEL]', res);
        console.log("[MISC MODEL] Bot muted");
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.muteBot = muteBot;
/**
 * Unmutes the bot.
 * @async
 */
const unmuteBot = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: { isMuted: false },
        });
        // console.log('[MISC MODEL]', res);
        console.log("[MISC MODEL] Bot unmuted");
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.unmuteBot = unmuteBot;
/**
 * Gets status of notifications for each course.
 * @async
 * @returns **True** if notifications are on for a specific course, **false** otherwise.
 */
const getNotificationStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield MiscellaneousModel.findOne(DEFAULT_ID, {
        classNotifications: 1,
    });
    // console.log('[MISC MODEL]', status);
    if (status)
        return status.classNotifications;
});
exports.getNotificationStatus = getNotificationStatus;
/**
 * Enable or Disable notifications for all courses.
 * @param status Boolean representing enabled(True) or disabled(False).
 * @async
 */
const enableOrDisableAllNotifications = (status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
                classNotifications: {
                    CSCD416: status,
                    CSCD418: status,
                    CSCD422: status,
                    CSCD424: status,
                    CSCD400: status,
                    CSCD426: status,
                    CSCD428: status,
                    CSCD432: status,
                    CSCD434: status,
                },
            },
        });
        // console.log('[MISC MODEL]',res);
        console.log("[MISC MODEL] All notifications have been turned ON\n");
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.enableOrDisableAllNotifications = enableOrDisableAllNotifications;
/**
 * Enable or Disable notifications for a particular course.
 * @param courseCode String representing the course code Eg: `CSCD416`.
 * @param status Boolean representing enabled(True) or disabled(False).
 * @async
 */
const enableOrDisableNotificationForCourse = (courseCode, status) => __awaiter(void 0, void 0, void 0, function* () {
    const classNotifsRes = yield MiscellaneousModel.findOne(DEFAULT_ID, {
        classNotifications: 1,
    });
    let res = null;
    // Couldn't think of a better way of making it more dynamic
    if (classNotifsRes) {
        try {
            switch (courseCode) {
                case "CSCD416":
                    res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                        $set: {
                            classNotifications: Object.assign(Object.assign({}, classNotifsRes.classNotifications), { CSCD416: status }),
                        },
                    });
                    break;
                case "CSCD418":
                    res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                        $set: {
                            classNotifications: Object.assign(Object.assign({}, classNotifsRes.classNotifications), { CSCD418: status }),
                        },
                    });
                    break;
                case "CSCD422":
                    res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                        $set: {
                            classNotifications: Object.assign(Object.assign({}, classNotifsRes.classNotifications), { CSCD422: status }),
                        },
                    });
                    break;
                case "CSCD424":
                    res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                        $set: {
                            classNotifications: Object.assign(Object.assign({}, classNotifsRes.classNotifications), { CSCD424: status }),
                        },
                    });
                    break;
                // case 'CSCD400':
                //     res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { classNotifications: { ...classNotifsRes.classNotifications, CSCD400: status } } });
                //     break;
                case "CSCD426":
                    res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                        $set: {
                            classNotifications: Object.assign(Object.assign({}, classNotifsRes.classNotifications), { CSCD426: status }),
                        },
                    });
                    break;
                case "CSCD428":
                    res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                        $set: {
                            classNotifications: Object.assign(Object.assign({}, classNotifsRes.classNotifications), { CSCD428: status }),
                        },
                    });
                    break;
                case "CSCD432":
                    res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                        $set: {
                            classNotifications: Object.assign(Object.assign({}, classNotifsRes.classNotifications), { CSCD432: status }),
                        },
                    });
                    break;
                case "CSCD434":
                    res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                        $set: {
                            classNotifications: Object.assign(Object.assign({}, classNotifsRes.classNotifications), { CSCD434: status }),
                        },
                    });
                    break;
                default:
                    break;
            }
        }
        catch (error) {
            console.error("[MISC MODEL ERROR]", error);
        }
    }
});
exports.enableOrDisableNotificationForCourse = enableOrDisableNotificationForCourse;
/**
 * Gets status of forwarding important messages. (temporary)
 * @async
 * @returns **True** if forwarding important messages is on, **false** otherwise.
 */
const getForwardingStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield MiscellaneousModel.findOne(DEFAULT_ID, {
        isForwardingOn: 1,
    });
    // console.log('[MISC MODEL]', status);
    if (status)
        return status.isForwardingOn;
});
exports.getForwardingStatus = getForwardingStatus;
/**
 * Turns on forwarding of important messages. (temporary)
 * @async
 */
const enableForwarding = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: { isForwardingOn: true },
        });
        // console.log('[MISC MODEL]', res);
        console.log("[MISC MODEL] Forwarding of important messages has been turned ON");
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.enableForwarding = enableForwarding;
/**
 * Turns off forwarding of important messages. (temporary)
 * @async
 */
const disableForwarding = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: { isForwardingOn: false },
        });
        // console.log('[MISC MODEL]', res)
        console.log("[MISC MODEL] Forwarding of important messages has been turned OFF");
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.disableForwarding = disableForwarding;
/**
 * Retrieves all the links from the database.
 * @async
 * @returns An array with all links in the database.
 */
const getAllLinks = () => __awaiter(void 0, void 0, void 0, function* () {
    const links = yield MiscellaneousModel.findOne(DEFAULT_ID, { allLinks: 1 });
    // console.log('[MISC MODEL]', links.allLinks);
    if (links)
        return links.allLinks;
});
exports.getAllLinks = getAllLinks;
/**
 * Adds a new link to the database.
 * @param newLink A string with a whatsapp message including the link.
 * @async
 */
const addLink = (newLink) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $push: { allLinks: newLink },
        });
        // console.log('[MISC MODEL]', res);
        console.log("[MISC MODEL] New Link added");
    }
    catch (error) {
        console.error("[MISC MODEL]", error);
    }
});
exports.addLink = addLink;
/**
 * Removes all the links saved in the database.
 * @async
 */
const removeAllLinks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: { allLinks: [] },
        });
        // console.log('[MISC MODEL]', res);
    }
    catch (error) {
        console.error("[MISC MODEL]", error);
    }
});
exports.removeAllLinks = removeAllLinks;
/**
 * Gets all the announcements from the database.
 * @async
 * @returns An array with all announcements in the database.
 */
const getAllAnnouncements = () => __awaiter(void 0, void 0, void 0, function* () {
    const ann = yield MiscellaneousModel.findOne(DEFAULT_ID, {
        allAnnouncements: 1,
    });
    // console.log('[MISC MODEL]', ann.allAnnouncements);
    if (ann)
        return ann.allAnnouncements;
});
exports.getAllAnnouncements = getAllAnnouncements;
/**
 * Adds a new announcement to the database.
 * @param newAnnouncement A string containing the new announcement.
 * @async
 */
const addAnnouncement = (newAnnouncement) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $push: { allAnnouncements: newAnnouncement },
        });
        // console.log('[MISC MODEL]', res);
        console.log("[MISC MODEL] New announcement added");
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.addAnnouncement = addAnnouncement;
/**
 * Removes all announcements in the database.
 * @async
 */
const removeAllAnnouncements = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: { allAnnouncements: [] },
        });
        // console.log('[MISC MODEL]', res);
        console.log("[MISC MODEL] Cleared all announcements");
    }
    catch (error) {
        console.error("[MISC MODEL]", error);
    }
});
exports.removeAllAnnouncements = removeAllAnnouncements;
/**
 * Gets all bot admins from the database.
 * @async
 * @returns An array containing bot admins.
 */
const getAllBotAdmins = () => __awaiter(void 0, void 0, void 0, function* () {
    const botAdmins = yield MiscellaneousModel.distinct("botAdmins");
    // console.log('[MISC MODEL]', botAdmins);
    return botAdmins;
});
exports.getAllBotAdmins = getAllBotAdmins;
/**
 * Adds a user as a bot admin.
 * @param newAdmin A string containing the user to be made a bot admin.
 * @async
 */
const addBotAdmin = (newAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $push: { botAdmins: newAdmin },
        });
        // console.log('[MISC MODEL]', res);
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.addBotAdmin = addBotAdmin;
/**
 * Demotes a bot admin to a regular user.
 * @param admin A string containing a whatsapp user's number.
 * @async
 */
//! Keep getting a type error when "admin" is a string, so it will be "any" for now
const removeBotAdmin = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $pull: { botAdmins: admin },
        });
        // console.log('[MISC MODEL]', res);
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.removeBotAdmin = removeBotAdmin;
/**
 * Gets users who have subscribed to be notified for class.
 * @async
 * @returns Object with each property containing an array of users who offer a specific elective.
 */
const getUsersToNotifyForClass = () => __awaiter(void 0, void 0, void 0, function* () {
    const resUsers = yield MiscellaneousModel.findOne(DEFAULT_ID, {
        electiveMultimedia: 1,
        electiveExpert: 1,
        electiveConcurrent: 1,
        electiveMobile: 1,
    });
    if (resUsers) {
        const { electiveMultimedia: multimedia, electiveExpert: expert, electiveConcurrent: concurrent, electiveMobile: mobile, } = resUsers;
        return { multimedia, expert, concurrent, mobile };
    }
});
exports.getUsersToNotifyForClass = getUsersToNotifyForClass;
/**
 * Subscribes a user to be notified for class.
 * @param newUser A string representing a whatsapp user.
 * @param rowId A string representing the **ID** for a specific whatsapp list.
 * @async
 */
const addUserToBeNotified = (newUser, rowId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = null;
        if (rowId === "1") {
            res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                $push: { electiveMultimedia: newUser },
            });
        }
        else if (rowId === "2") {
            res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                $push: { electiveExpert: newUser },
            });
        }
        else if (rowId === "3") {
            res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                $push: { electiveConcurrent: newUser },
            });
        }
        else if (rowId === "4") {
            res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                $push: { electiveMobile: newUser },
            });
        }
        // console.log('[MISC MODEL]', res);
        console.log("[MISC MODEL] User: " +
            newUser +
            " subscribed to be notified for class with " +
            rowId ===
            "1"
            ? "Multimedia"
            : (rowId === "2" ? "Expert" : rowId === "3" ? "Concurrent" : "Mobile") +
                " as elective");
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.addUserToBeNotified = addUserToBeNotified;
/**
 * Unsubscribes a user from being notified for class.
 * @param user A string representing a whatsapp.
 * @param elective A string representing a single character used to identify an elective.
 * @async
 */
const removeUserToBeNotified = (user, elective) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = null;
        if (elective === "MA") {
            res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                $pull: { electiveMultimedia: user },
            });
        }
        else if (elective === "E") {
            res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                $pull: { electiveExpert: user },
            });
        }
        else if (elective === "C") {
            res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                $pull: { electiveConcurrent: user },
            });
        }
        else if (elective === "MC") {
            res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
                $pull: { electiveMobile: user },
            });
        }
        // console.log('[MISC MODEL]', res);
        console.log("[MISC MODEL] User: " +
            user +
            " unsubscribed from being notified for class");
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.removeUserToBeNotified = removeUserToBeNotified;
/**
 * Gets users/groups who want announcements/links forwarded to them.
 * @async
 * @returns Array of users/groups where announcements and links will be forwarded to.
 */
const getForwardToUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield MiscellaneousModel.findOne(DEFAULT_ID, {
        forwardToUsers: 1,
    });
    // console.log('[MISC MODEL]', users.forwardToUsers);
    if (users)
        return users.forwardToUsers;
});
exports.getForwardToUsers = getForwardToUsers;
/**
 * Gets users who have been blacklisted.
 * @async
 * @returns Array of users who have been blacklisted.
 */
const getBlacklistedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield MiscellaneousModel.findOne(DEFAULT_ID, {
        blacklistedUsers: 1,
    });
    // console.log('[MISC MODEL]', users);
    if (users)
        return users.blacklistedUsers;
});
exports.getBlacklistedUsers = getBlacklistedUsers;
/**
 * Adds a user to be blacklisted.
 * @param user String representing a whatsapp number.
 * @async
 */
const addBlacklistedUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $push: { blacklistedUsers: user },
        });
        // console.log('[MISC MODEL]', res);
    }
    catch (e) {
        console.error("[MISC MODEL ERROR]", e);
    }
});
exports.addBlacklistedUser = addBlacklistedUser;
/**
 * Removes a blacklisted user.
 * @param user String representing a whatsapp number.
 * @async
 */
const removeBlacklistedUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $pull: { blacklistedUsers: user },
        });
        // console.log('[MISC MODEL]', res);
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.removeBlacklistedUser = removeBlacklistedUser;
/**
 * Gets all official class groups;
 * @async
 * @returns Array of official class groups.
 */
const getAllClassGroups = () => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield MiscellaneousModel.findOne(DEFAULT_ID, {
        classGroups: 1,
    });
    // console.log('[MISC MODEL]', groups);
    if (groups)
        return groups.classGroups;
});
exports.getAllClassGroups = getAllClassGroups;
/**
 * Adds a group as an official class group.
 * @async
 * @param group String representing the group id user (`group.id.user`).
 */
const addClassGroup = (group) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $push: { classGroups: group },
        });
        // console.log('[MISC MODEL]', res);
    }
    catch (error) {
        console.error("[MISC MODEL ERROR]", error);
    }
});
exports.addClassGroup = addClassGroup;
/**
 * Removes a group from official class groups.
 * @async
 * @param group String representing the group id user (`group.id.user`).
 */
const removeClassGroup = (group) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield MiscellaneousModel.updateOne(DEFAULT_ID, {
            $pull: { classGroups: group },
        });
        // console.log('[MISC MODEL]', res);
    }
    catch (error) {
        console.log("[MISC MODEL ERROR]", error);
    }
});
exports.removeClassGroup = removeClassGroup;
