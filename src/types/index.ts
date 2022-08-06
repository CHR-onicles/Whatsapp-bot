import { IArgs, IClient } from "../interfaces";
import { Message } from "whatsapp-web.js";

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
