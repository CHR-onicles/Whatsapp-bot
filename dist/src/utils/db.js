"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// --------------------------------------------------
// db.js contains the logic to connect to both local and
// deployed databases
// --------------------------------------------------
const { connect } = require("mongoose");
/**
 * Connect to local or deployed database.
 * @async
 */
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (process.env.NODE_ENV === "production") {
            console.log("[DB] In PRODUCTION environment");
            const res = yield connect(process.env.MONGO_URL);
            // console.log('[DB]', res)
        }
        else if (process.env.NODE_ENV === "development") {
            console.log("[DB] In DEVELOPMENT environment");
            // const res = await connect(process.env.MONGO_LOCAL);
            const res = yield connect(process.env.MONGO_URL);
            // console.log('[DB]', res)
        }
        console.log("[DB] Successful connection to DB");
    }
    catch (err) {
        console.error("[DB ERROR]", err);
    }
});
connectToDB();
