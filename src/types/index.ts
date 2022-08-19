import { Set } from "typescript";
import { Client, Message } from "whatsapp-web.js";

export type TCommands = Map<
  string,
  {
    name: string;
    description: string;
    alias: string[];
    category: string;
    help: string;
    execute: (
      client?: IClient,
      msg?: Message | null,
      args?: IArgs
    ) => Promise<void>;
  }
>;

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

export interface IClass {
  day: string;
  courses:
    {
      name: string;
      code: string;
      duration: number;
    }[];
}
export interface IExamTimetable {
  date?: string;
  _date?: Date;
  time?: string;
  courseCode?: string;
  courseTitle?: string;
  examMode?: string;
}
