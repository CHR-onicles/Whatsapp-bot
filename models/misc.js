// Miscellaneous stuff for the bot

const { Schema, model } = require('mongoose');


// Schema
const MiscellaneousSchema = new Schema({
    _id: { type: Number, default: 1 },
    isMuted: { type: Boolean, default: false },
    allLinks: [String],
    allAnnouncements: [String],
    superAdmins: [String],
    numOfCommands: Number, // to be used later
});

const MiscellaneousModel = model("MiscellaneousModel", MiscellaneousSchema);
const DEFAULT_ID = { _id: 1 };


// EXPORTS
exports.initializeMiscModel = async () => {
    const misc = new MiscellaneousModel({ _id: 1, numOfCommands: 0, superAdmins: ['233557632802'] });
    try {
        await misc.save();
    } catch (err) {
        console.log(err)
    }
}

exports.isMuted = async () => {
    const status = await MiscellaneousModel.findOne({}, {isMuted: 1});
    console.log(status);
    return status.isMuted;
}

exports.mute = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { isMuted: true } });
        console.log(res);
    } catch (error) {
        console.log(error)
    }
}

exports.unmute = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { isMuted: false } });
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

exports.getAllLinks = async () => {
    const links = await MiscellaneousModel.distinct("allLinks");
    console.log(links);
    return links;
}

exports.addLink = async (newLink) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { allLinks: newLink } });
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

exports.removeAllLinks = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { allLinks: [] } });
        console.log(res);
    } catch (error) {
        console.log(error)
    }
}

exports.getAllAnnouncements = async () => {
    const announcements = await MiscellaneousModel.distinct("allAnnouncements");
    console.log(announcements);
    return announcements;
}

exports.addAnnouncement = async (newAnnouncement) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { allAnnouncements: newAnnouncement } });
        console.log(res);
    } catch (error) {
        console.log(error)
    }
}

exports.removeAllAnnouncements = async () => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $set: { allAnnouncements: [] } });
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}

exports.getAllSuperAdmins = async () => {
    const superAdmins = await MiscellaneousModel.distinct("superAdmins");
    console.log(superAdmins);
    return superAdmins;
}

exports.addSuperAdmin = async (newAdmin) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $push: { superAdmins: newAdmin } });
        console.log(res);
    } catch (error) {
        console.log(error)
    }
}

exports.removeSuperAdmin = async (admin) => {
    try {
        const res = await MiscellaneousModel.updateOne(DEFAULT_ID, { $pull: { superAdmins: admin } });
        console.log(res);
    } catch (error) {
        console.log(error);
    }
}