import { ESMap, Set } from "typescript";
import { Client } from "whatsapp-web.js";

interface IClient extends Client {
    // check for better way of typing these
    commands?: ESMap
    usedCommandRecently?: Set
    potentialSoftBanUsers?: ESMap
}

interface IArgs {
    BOT_START_TIME?: typeof BOT_START_TIME;
    RUN_FIRST_TIME?: boolean;
    isListResponse?: boolean;
    isMention?: boolean;
    lastPrefixUsed?: string;
}