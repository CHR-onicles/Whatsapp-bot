// MAIN MIDDLEWARE TO HANDLE INTERACTIONS WITH DATABASE

const { isMuted, mute, unmute, getAllLinks, getAllAnnouncements, addSuperAdmin, addAnnouncement, addLink, removeSuperAdmin, getUsersToNotifyForClass, addUserToBeNotified, removeUserToBeNotified } = require('../models/misc');


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

exports.getAllLinks = async () => {
    const links = await getAllLinks();
    // console.log('Links:', links);
    return links;
}

exports.addLink = async (link) => {
    await addLink(link);
    console.log('New Link added');
}

exports.getAllAnnouncements = async () => {
    const ann = await getAllAnnouncements();
    // console.log('Announcements:', ann);
    return ann;
}

exports.addAnnouncement = async (ann) => {
    await addAnnouncement(ann);
    console.log('New announcement added');
}

exports.getUsersToNotifyForClass = async () => {
    const { electiveDataMining: dataMining, electiveNetworking: networking, electiveSoftModelling: softModelling } = await getUsersToNotifyForClass();
    // console.log(dataMining, networking, softModelling);
    return { dataMining, networking, softModelling };
}

exports.addUserToBeNotified = async (user) => {
    await addUserToBeNotified(user);
    console.log("User: " + user + " subscribed to be notified for class");
}

exports.removeUserToBeNotified = async (user) => {
    await removeUserToBeNotified(user);
    console.log("User: " + user + " unsubscribed from being notified for class");
}