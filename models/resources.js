// --------------------------------------------------
// resources.js contains the database schema and behaviour
// for...
// --------------------------------------------------

const { Schema, model } = require('mongoose');
const fs = require('fs');


/**
 * Schema for....
 */
const ResourceSchema = new Schema({
    title: String,
    courseCode: String,
    binData: String, // when Buffer is used, puppeeter complains that it's not properly encoded
});

const devModelName = "files-dev";
const prodModelName = "files";
const currentModelName = process.env.NODE_ENV === 'production' ? prodModelName : devModelName;
const ResourceModel = model(currentModelName, ResourceSchema);

const initCollection = async () => {
    const count = await ResourceModel.countDocuments({});
    // console.log(count);
    if (!count) {
        const dir = './course_resources';
        for (const folder of fs.readdirSync(dir)) {
            console.log(folder)
            const courseCode = folder.split('-')[0].trim();
            for (const file of fs.readdirSync(dir + '/' + folder)) {
                const binData = fs.readFileSync(dir + '/' + folder + '/' + file, { encoding: 'base64' });
                const doc = new ResourceModel({ title: file, courseCode, binData });
                try {
                    await doc.save();
                } catch (err) {
                    console.log(err);
                }
            }
        }
        console.log("Done encoding all course resources!");
    } else console.log(currentModelName + " collection is not empty");
}
initCollection();


/**
 * 
 * @param {string} courseCode String representing the course code for a specific course
 * @returns 
 */
exports.getResource = async (courseCode) => {
    const res = await ResourceModel.find({ courseCode });
    // console.log(res);
    return res;
}