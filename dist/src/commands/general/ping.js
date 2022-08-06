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
Object.defineProperty(exports, "__esModule", { value: true });
require("../../interfaces");
require("whatsapp-web.js");
const misc_1 = require("../../models/misc");
const helpers_1 = require("../../utils/helpers");
const execute = (client, msg) => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield (0, misc_1.getMutedStatus)()) === true)
        return;
    const msgTimestamp = new Date(msg.timestamp * 1000);
    const curTime = new Date();
    const actualPing = Math.abs(curTime.getTime() - msgTimestamp.getTime());
    // console.log('[PING CMD] Msg timestamp:', msgTimestamp, ' | Current time:', curTime)
    // console.log(`[PING CMD] Actual ping: ${actualPing}ms`)
    yield msg.reply(`Response in _${actualPing}ms_`);
});
module.exports = {
    name: "ping",
    description: "Get response time of the bot in milliseconds 🙋🏽‍♂️",
    alias: ["p"],
    category: "everyone",
    help: `To use this command, type:\n*${helpers_1.currentPrefix}ping*`,
    execute,
};
