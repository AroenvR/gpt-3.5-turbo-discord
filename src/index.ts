import * as appConfig from "./appConfig.json";
import { setupDatabase } from "./database/sqliteClient";
import { IDiscordBot } from "./interfaces/IDiscordBot";
import { startDiscordClient } from "./providers/discordProvider";
import { setupAI } from "./services/aiService";
import { isTruthy } from "./util/isTruthy";
import { logger, LogLevel } from "./util/logger";

const fileName = "index.ts";
const log = logger(fileName);

const setupClients = async () => {
    console.log("--- Starting GPT-discord application ---");

    // if (!isTruthy(discorDots, false, true)) { // Fails to assert all values..
    //     log("One or more Discord Bot is missing environment values.", null, LogLevel.ERROR);
    //     throw new Error("No Discord bots found in appConfig.json");
    // }

    await setupDatabase();

    for (const bot of await getDiscordBots()) {
        await startDiscordClient(bot);
        await setupAI(bot);
    }

    // for (const bot of appConfig.discord_bots) {
    //     await startDiscordClient(bot);
    // }

    // await startDiscordClient(process.env.OPTONNANI_TOKEN!); // Optonnani online.    
}
setupClients();

export const getDiscordBots = async (): Promise<IDiscordBot[]> => {
    return [ // TODO: Get as encrypted object from API.
        { 
            name: "Optonnani",
            token: process.env.OPTONNANI_TOKEN!,
            id: process.env.OPTONNANI_ID!,
            tag: process.env.OPTONNANI_TAG!
        }, 
        { 
            name: "NanaAI", 
            token: process.env.NANA_TOKEN!,
            id: process.env.NANA_ID!,
            tag: process.env.NANA_TAG!
        },
        {
            name: "Can_I_Ride",
            token: process.env.CAN_I_RIDE_TOKEN!,
            id: process.env.CAN_I_RIDE_ID!,
            tag: process.env.CAN_I_RIDE_TAG!
        }
    ];
}