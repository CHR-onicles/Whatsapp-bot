// --------------------------------------------------
// resources.js contains the schema for  course resources
// --------------------------------------------------

const { Schema, model } = require('mongoose');
const fs = require('fs');


/**
 * Schema for course resources
 */
const ResourceSchema = new Schema({
    title: String,
    courseCode: String,
    binData: String, // when Buffer is used, puppeteer complains that it's not properly encoded
});

const prodModelName = "files";
const ResourceModel = model(prodModelName, ResourceSchema);
//todo: Since we can't push `course_resources`, we should only allow uploading courses to development collection

/**
 * Helper function to encode the local courses materials and save them on the cloud database.
 * @async
 */
const initCollection = async () => {
    const count = await ResourceModel.countDocuments({});
    console.log('[RESOURCES MODEL] Doc count:', count);
    if (!count) {
        const dir = './course_resources';
        for (const folder of fs.readdirSync(dir)) {
            console.log('[RESOURCES MODEL]', folder)
            const courseCode = folder.split('-')[0].trim();
            for (const file of fs.readdirSync(dir + '/' + folder)) {
                const binData = fs.readFileSync(dir + '/' + folder + '/' + file, { encoding: 'base64' });
                const doc = new ResourceModel({ title: file, courseCode, binData });
                try {
                    await doc.save();
                } catch (err) {
                    console.error('[RESOURCES MODEL ERROR]', err);
                }
            }
        }
        console.log("[RESOURCES MODEL] Done encoding all course resources!");
    } else console.log('[RESOURCES MODEL]', prodModelName + " collection is not empty");
}
initCollection();


/**
 * Gets specific course materials from the database.
 * @param {string} courseCode String representing the course code for a specific course
 * @returns 
 */
export const getResource = async (courseCode: string) => {
    const res = await ResourceModel.find({ courseCode });
    // console.log('[RESOURCES MODEL]', res);
    return res;
}