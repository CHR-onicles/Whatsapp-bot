// --------------------------------------------------
// pastQuestions.ts contains the schema for  course past questions
// --------------------------------------------------

const { Schema, model } = require('mongoose');
const fs = require('fs');


/**
 * Schema for course past questions
 */
const PastQuestionsSchema = new Schema({
    title: String,
    courseCode: String,
    binData: String, // when Buffer is used, puppeteer complains that it's not properly encoded
});

const prodModelName = "pq-files";
const PastQuestionsModel = model(prodModelName, PastQuestionsSchema);
//todo: Since we can't push `past_questions`, we should only allow uploading courses to development collection

/**
 * Helper function to encode the local courses materials and save them on the cloud database.
 * @async
 */
const initCollection = async () => {
    const count = await PastQuestionsModel.countDocuments({});
    console.log('[PAST_QUESTIONS MODEL] Doc count:', count);
    if (!count) {
        const dir = './past_questions';
        for (const folder of fs.readdirSync(dir)) {
            console.log('[PAST_QUESTIONS MODEL]', folder)
            const courseCode = folder.split('-')[0].trim();
            for (const file of fs.readdirSync(dir + '/' + folder)) {
                const binData = fs.readFileSync(dir + '/' + folder + '/' + file, { encoding: 'base64' });
                const doc = new PastQuestionsModel({ title: file, courseCode, binData });
                try {
                    await doc.save();
                } catch (err) {
                    console.error('[PAST_QUESTIONS MODEL ERROR]', err);
                }
            }
        }
        console.log("[PAST_QUESTIONS MODEL] Done encoding all past questions!");
    } else console.log('[PAST_QUESTIONS MODEL]', prodModelName + " collection is not empty");
}
initCollection();


/**
 * Gets specific past questions from the database.
 * @param {string} courseCode String representing the course code for a specific course
 * @returns 
 */
export const getPastQuestions = async (courseCode: string) => {
    const res = await PastQuestionsModel.find({ courseCode });
    // console.log('[PAST_QUESTIONS MODEL]', res);
    return res;
}