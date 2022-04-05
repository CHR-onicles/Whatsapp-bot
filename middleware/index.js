// MAIN MIDDLEWARE TO HANDLE INTERACTIONS WITH DATABASE

const { isMuted, mute, unmute, getAllLinks, getAllAnnouncements, addSuperAdmin, addAnnouncement, addLink, removeSuperAdmin } = require('../models/misc');


exports.muteBot = async () => {
    await mute();
    console.log("Bot muted");
}

exports.unmuteBot = async () => {
    await unmute();
    console.log("Bot unmuted");
}

exports.getMutedStatus = async () => {
    const status = await isMuted();
    return status;
}