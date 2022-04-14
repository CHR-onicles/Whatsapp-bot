// MAIN MIDDLEWARE TO HANDLE INTERACTIONS WITH DATABASE

const { isMuted, mute, unmute, getAllLinks, getAllAnnouncements, addSuperAdmin, addAnnouncement, addLink, removeSuperAdmin, getUsersToNotifyForClass, addUserToElectiveDataMining, addUserToElectiveNetworking, addUserToElectiveSoftModelling, removeUserFromElective } = require('../models/misc');


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

//todo: redo both functions below
exports.addUserToBeNotified = async (user, rowId) => {
    if (rowId === '31') await addUserToElectiveDataMining(user);
    else if (rowId === '32') await addUserToElectiveNetworking(user);
    else if (rowId === '33') await addUserToElectiveSoftModelling(user);
    console.log("User: " + user + " subscribed to be notified for class with " + rowId === '31' ? 'Data Mining' : (rowId === '32' ? 'Networking' : 'Software Modelling') + ' as elective');
}

exports.removeUserToBeNotified = async (user, elective) => {
    await removeUserFromElective(user, elective);
    console.log("User: " + user + " unsubscribed from being notified for class");
}