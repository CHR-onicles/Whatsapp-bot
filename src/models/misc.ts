// --------------------------------------------------
// misc.js contains the database schema and behaviour
// for miscellaneous stuff relating to the bot which cannot
// go under any other specific schema
// --------------------------------------------------

import { Schema, model } from "mongoose";

/**
 * Schema for bot's Miscellaneous stuff. It basically acts like local storage.
 */
//TODO:  Type this schema later
const MiscellaneousSchema = new Schema({
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
  isForwardingOn: { type: Boolean, default: false }, // temporary
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
const currentModelName =
  process.env.NODE_ENV === "production" ? prodModelName : devModelName;
const MiscellaneousModel = model(currentModelName, MiscellaneousSchema);
const DEFAULT_ID = { _id: 1 }; // to always update one specific document

/**
 * Helper function to initialize the miscellaneous/miscellaneous-dev collection.
 * @async
 */
const initCollection = async () => {
  const count = await MiscellaneousModel.countDocuments({});
  // console.log([MISC MODEL] count);
  if (!count) {
    const misc = new MiscellaneousModel({ _id: 1 });
    try {
      await misc.save();
    } catch (err) {
      console.error("[MISC MODEL ERROR]", err);
    }
  } else
    console.log("[MISC MODEL]", currentModelName + " collection is not empty");
};
initCollection();

// export const ---------------------------------------------

/**
 * Gets muted status of bot.
 * @async
 * @returns **True** if bot muted, **false** otherwise.
 */
export const getMutedStatus = async () => {
  const status = await MiscellaneousModel.findOne(DEFAULT_ID, { isMuted: 1 });
  // console.log('[MISC MODEL]', status);
  if (status) return status.isMuted;
};

/**
 * Mutes the bot.
 * @async
 */
export const muteBot = async () => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $set: { isMuted: true },
    });
    // console.log('[MISC MODEL]', res);
    console.log("[MISC MODEL] Bot muted");
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Unmutes the bot.
 * @async
 */
export const unmuteBot = async () => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $set: { isMuted: false },
    });
    // console.log('[MISC MODEL]', res);
    console.log("[MISC MODEL] Bot unmuted");
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Gets status of notifications for each course.
 * @async
 * @returns **True** if notifications are on for a specific course, **false** otherwise.
 */
export const getNotificationStatus = async (): Promise<
  | {
      CSCD416: boolean;
      CSCD418: boolean;
      CSCD422: boolean;
      CSCD424: boolean;
      CSCD400: boolean;
      CSCD426: boolean;
      CSCD428: boolean;
      CSCD432: boolean;
      CSCD434: boolean;
    }
  | undefined
> => {
  const status = await MiscellaneousModel.findOne(DEFAULT_ID, {
    classNotifications: 1,
  });
  // console.log('[MISC MODEL]', status);
  if (status) return status.classNotifications;
};

/**
 * Enable or Disable notifications for all courses.
 * @param status Boolean representing enabled(True) or disabled(False).
 * @async
 */
export const enableOrDisableAllNotifications = async (status: boolean) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
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
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Enable or Disable notifications for a particular course.
 * @param courseCode String representing the course code Eg: `CSCD416`.
 * @param status Boolean representing enabled(True) or disabled(False).
 * @async
 */
export const enableOrDisableNotificationForCourse = async (
  courseCode: string,
  status: boolean
) => {
  const classNotifsRes = await MiscellaneousModel.findOne(DEFAULT_ID, {
    classNotifications: 1,
  });
  let res = null;
  // Couldn't think of a better way of making it more dynamic
  if (classNotifsRes) {
    try {
      switch (courseCode) {
        case "CSCD416":
          res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
              classNotifications: {
                ...classNotifsRes.classNotifications,
                CSCD416: status,
              },
            },
          });
          break;
        case "CSCD418":
          res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
              classNotifications: {
                ...classNotifsRes.classNotifications,
                CSCD418: status,
              },
            },
          });
          break;
        case "CSCD422":
          res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
              classNotifications: {
                ...classNotifsRes.classNotifications,
                CSCD422: status,
              },
            },
          });
          break;
        case "CSCD424":
          res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
              classNotifications: {
                ...classNotifsRes.classNotifications,
                CSCD424: status,
              },
            },
          });
          break;
        // case 'CSCD400':
        //     res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { classNotifications: { ...classNotifsRes.classNotifications, CSCD400: status } } });
        //     break;
        case "CSCD426":
          res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
              classNotifications: {
                ...classNotifsRes.classNotifications,
                CSCD426: status,
              },
            },
          });
          break;
        case "CSCD428":
          res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
              classNotifications: {
                ...classNotifsRes.classNotifications,
                CSCD428: status,
              },
            },
          });
          break;
        case "CSCD432":
          res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
              classNotifications: {
                ...classNotifsRes.classNotifications,
                CSCD432: status,
              },
            },
          });
          break;
        case "CSCD434":
          res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
            $set: {
              classNotifications: {
                ...classNotifsRes.classNotifications,
                CSCD434: status,
              },
            },
          });
          break;

        default:
          break;
      }
    } catch (error) {
      console.error("[MISC MODEL ERROR]", error);
    }
  }
};

/**
 * Gets status of forwarding important messages. (temporary)
 * @async
 * @returns **True** if forwarding important messages is on, **false** otherwise.
 */
export const getForwardingStatus = async () => {
  const status = await MiscellaneousModel.findOne(DEFAULT_ID, {
    isForwardingOn: 1,
  });
  // console.log('[MISC MODEL]', status);
  if (status) return status.isForwardingOn;
};

/**
 * Turns on forwarding of important messages. (temporary)
 * @async
 */
export const enableForwarding = async () => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $set: { isForwardingOn: true },
    });
    // console.log('[MISC MODEL]', res);
    console.log(
      "[MISC MODEL] Forwarding of important messages has been turned ON"
    );
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Turns off forwarding of important messages. (temporary)
 * @async
 */
export const disableForwarding = async () => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $set: { isForwardingOn: false },
    });
    // console.log('[MISC MODEL]', res)
    console.log(
      "[MISC MODEL] Forwarding of important messages has been turned OFF"
    );
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Retrieves all the links from the database.
 * @async
 * @returns An array with all links in the database.
 */
export const getAllLinks = async () => {
  const links = await MiscellaneousModel.findOne(DEFAULT_ID, { allLinks: 1 });
  // console.log('[MISC MODEL]', links.allLinks);

  if (links) return links.allLinks;
};

/**
 * Adds a new link to the database.
 * @param newLink A string with a whatsapp message including the link.
 * @async
 */
export const addLink = async (newLink: string) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $push: { allLinks: newLink },
    });
    // console.log('[MISC MODEL]', res);
    console.log("[MISC MODEL] New Link added");
  } catch (error) {
    console.error("[MISC MODEL]", error);
  }
};

/**
 * Removes all the links saved in the database.
 * @async
 */
export const removeAllLinks = async () => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $set: { allLinks: [] },
    });
    // console.log('[MISC MODEL]', res);
  } catch (error) {
    console.error("[MISC MODEL]", error);
  }
};

/**
 * Gets all the announcements from the database.
 * @async
 * @returns An array with all announcements in the database.
 */
export const getAllAnnouncements = async () => {
  const ann = await MiscellaneousModel.findOne(DEFAULT_ID, {
    allAnnouncements: 1,
  });
  // console.log('[MISC MODEL]', ann.allAnnouncements);
  if (ann) return ann.allAnnouncements;
};

/**
 * Adds a new announcement to the database.
 * @param newAnnouncement A string containing the new announcement.
 * @async
 */
export const addAnnouncement = async (newAnnouncement: string) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $push: { allAnnouncements: newAnnouncement },
    });
    // console.log('[MISC MODEL]', res);
    console.log("[MISC MODEL] New announcement added");
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Removes all announcements in the database.
 * @async
 */
export const removeAllAnnouncements = async () => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $set: { allAnnouncements: [] },
    });
    // console.log('[MISC MODEL]', res);
    console.log("[MISC MODEL] Cleared all announcements");
  } catch (error) {
    console.error("[MISC MODEL]", error);
  }
};

/**
 * Gets all bot admins from the database.
 * @async
 * @returns An array containing bot admins.
 */
export const getAllBotAdmins = async (): Promise<string[]> => {
  const botAdmins = await MiscellaneousModel.distinct("botAdmins");
  // console.log('[MISC MODEL]', botAdmins);
  return botAdmins;
};

/**
 * Adds a user as a bot admin.
 * @param newAdmin A string containing the user to be made a bot admin.
 * @async
 */
export const addBotAdmin = async (newAdmin: string) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $push: { botAdmins: newAdmin },
    });
    // console.log('[MISC MODEL]', res);
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Demotes a bot admin to a regular user.
 * @param admin A string containing a whatsapp user's number.
 * @async
 */
//! Keep getting a type error when "admin" is a string, so it will be "any" for now
export const removeBotAdmin = async (admin: any) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $pull: { botAdmins: admin },
    });
    // console.log('[MISC MODEL]', res);
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Gets users who have subscribed to be notified for class.
 * @async
 * @returns Object with each property containing an array of users who offer a specific elective.
 */
export const getUsersToNotifyForClass = async () => {
  const resUsers = await MiscellaneousModel.findOne(DEFAULT_ID, {
    electiveMultimedia: 1,
    electiveExpert: 1,
    electiveConcurrent: 1,
    electiveMobile: 1,
  });

  if (resUsers) {
    const {
      electiveMultimedia: multimedia,
      electiveExpert: expert,
      electiveConcurrent: concurrent,
      electiveMobile: mobile,
    } = resUsers;
    return { multimedia, expert, concurrent, mobile };
  }
};

/**
 * Subscribes a user to be notified for class.
 * @param newUser A string representing a whatsapp user.
 * @param rowId A string representing the **ID** for a specific whatsapp list.
 * @async
 */
export const addUserToBeNotified = async (newUser: string, rowId: string) => {
  try {
    let res = null;
    if (rowId === "1") {
      res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
        $push: { electiveMultimedia: newUser },
      });
    } else if (rowId === "2") {
      res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
        $push: { electiveExpert: newUser },
      });
    } else if (rowId === "3") {
      res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
        $push: { electiveConcurrent: newUser },
      });
    } else if (rowId === "4") {
      res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
        $push: { electiveMobile: newUser },
      });
    }
    // console.log('[MISC MODEL]', res);
    console.log(
      "[MISC MODEL] User: " +
        newUser +
        " subscribed to be notified for class with " +
        rowId ===
        "1"
        ? "Multimedia"
        : (rowId === "2" ? "Expert" : rowId === "3" ? "Concurrent" : "Mobile") +
            " as elective"
    );
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Unsubscribes a user from being notified for class.
 * @param user A string representing a whatsapp.
 * @param elective A string representing a single character used to identify an elective.
 * @async
 */
export const removeUserToBeNotified = async (
  user: string,
  elective: string
) => {
  try {
    let res = null;
    if (elective === "MA") {
      res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
        $pull: { electiveMultimedia: user },
      });
    } else if (elective === "E") {
      res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
        $pull: { electiveExpert: user },
      });
    } else if (elective === "C") {
      res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
        $pull: { electiveConcurrent: user },
      });
    } else if (elective === "MC") {
      res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
        $pull: { electiveMobile: user },
      });
    }
    // console.log('[MISC MODEL]', res);
    console.log(
      "[MISC MODEL] User: " +
        user +
        " unsubscribed from being notified for class"
    );
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Gets users/groups who want announcements/links forwarded to them.
 * @async
 * @returns Array of users/groups where announcements and links will be forwarded to.
 */
export const getForwardToUsers = async () => {
  const users = await MiscellaneousModel.findOne(DEFAULT_ID, {
    forwardToUsers: 1,
  });
  // console.log('[MISC MODEL]', users.forwardToUsers);
  if (users) return users.forwardToUsers;
};

/**
 * Gets users who have been blacklisted.
 * @async
 * @returns Array of users who have been blacklisted.
 */
export const getBlacklistedUsers = async () => {
  const users = await MiscellaneousModel.findOne(DEFAULT_ID, {
    blacklistedUsers: 1,
  });
  // console.log('[MISC MODEL]', users);
  if (users) return users.blacklistedUsers;
};

/**
 * Adds a user to be blacklisted.
 * @param user String representing a whatsapp number.
 * @async
 */
export const addBlacklistedUser = async (user: string) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $push: { blacklistedUsers: user },
    });
    // console.log('[MISC MODEL]', res);
  } catch (e) {
    console.error("[MISC MODEL ERROR]", e);
  }
};

/**
 * Removes a blacklisted user.
 * @param user String representing a whatsapp number.
 * @async
 */
export const removeBlacklistedUser = async (user: string) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $pull: { blacklistedUsers: user },
    });
    // console.log('[MISC MODEL]', res);
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Gets all official class groups;
 * @async
 * @returns Array of official class groups.
 */
export const getAllClassGroups = async () => {
  const groups = await MiscellaneousModel.findOne(DEFAULT_ID, {
    classGroups: 1,
  });
  // console.log('[MISC MODEL]', groups);
  if (groups) return groups.classGroups;
};

/**
 * Adds a group as an official class group.
 * @async
 * @param group String representing the group id user (`group.id.user`).
 */
export const addClassGroup = async (group: string) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $push: { classGroups: group },
    });
    // console.log('[MISC MODEL]', res);
  } catch (error) {
    console.error("[MISC MODEL ERROR]", error);
  }
};

/**
 * Removes a group from official class groups.
 * @async
 * @param group String representing the group id user (`group.id.user`).
 */
export const removeClassGroup = async (group: string) => {
  try {
    const res = await MiscellaneousModel.updateOne(DEFAULT_ID, {
      $pull: { classGroups: group },
    });
    // console.log('[MISC MODEL]', res);
  } catch (error) {
    console.log("[MISC MODEL ERROR]", error);
  }
};
