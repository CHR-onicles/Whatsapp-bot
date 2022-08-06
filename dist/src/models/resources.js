"use strict";
// --------------------------------------------------
// resources.js contains the schema for  course resources
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
exports.getResource = void 0;
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
const initCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield ResourceModel.countDocuments({});
    console.log('[RESOURCES MODEL] Doc count:', count);
    if (!count) {
        const dir = './course_resources';
        for (const folder of fs.readdirSync(dir)) {
            console.log('[RESOURCES MODEL]', folder);
            const courseCode = folder.split('-')[0].trim();
            for (const file of fs.readdirSync(dir + '/' + folder)) {
                const binData = fs.readFileSync(dir + '/' + folder + '/' + file, { encoding: 'base64' });
                const doc = new ResourceModel({ title: file, courseCode, binData });
                try {
                    yield doc.save();
                }
                catch (err) {
                    console.error('[RESOURCES MODEL ERROR]', err);
                }
            }
        }
        console.log("[RESOURCES MODEL] Done encoding all course resources!");
    }
    else
        console.log('[RESOURCES MODEL]', prodModelName + " collection is not empty");
});
initCollection();
/**
 * Gets specific course materials from the database.
 * @param {string} courseCode String representing the course code for a specific course
 * @returns
 */
const getResource = (courseCode) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield ResourceModel.find({ courseCode });
    // console.log('[RESOURCES MODEL]', res);
    return res;
});
exports.getResource = getResource;
