import { TCommands } from "../types";
import { Set } from "typescript";
import { Client } from "whatsapp-web.js";

export interface IClient extends Client {
  // check for better way of typing these
  commands?: TCommands;
  usedCommandRecently?: Set<string>;
  potentialSoftBanUsers?: Map<any, any>; //todo: Define this type properly later
}

export interface IArgs {
  BOT_START_TIME?: Date;
  RUN_FIRST_TIME?: boolean;
  isListResponse?: boolean;
  isMention?: boolean;
  lastPrefixUsed?: string;
}

export interface ICourse {
  name?: string;
  code?: string;
  duration?: number;
}
