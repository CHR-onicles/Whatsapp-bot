import { ESMap, Set } from "typescript";
import { Client, Message } from "whatsapp-web.js";

interface IClient extends Client {
  // check for better way of typing these
  commands?: Map<
    string,
    {
      name: string;
      description: string;
      alias: string[];
      category: string;
      help: string;
      execute: (client?: IClient, msg?: Message | null, args?: IArgs) => Promise<void>;
    }
  >;
  usedCommandRecently?: Set;
  potentialSoftBanUsers?: ESMap;
}

interface IArgs {
  BOT_START_TIME?: Date;
  RUN_FIRST_TIME?: boolean;
  isListResponse?: boolean;
  isMention?: boolean;
  lastPrefixUsed?: string;
}
