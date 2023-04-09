import * as appConfig from "./appConfig.json";
import { setupDatabase } from "./database/sqliteClient";
import { IDiscordBot } from "./interfaces/IDiscordBot";
import { startDiscordClient } from "./providers/discordProvider";
import { setupAI } from "./services/aiService";
import { isTruthy } from "./util/isTruthy";
import { logger, LogLevel } from "./util/logger";

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
    let toReturn = [
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
        },
        {
            name: "OptonnaniPT-4",
            token: process.env.OPTONNANIPT4_TOKEN!,
            id: process.env.OPTONNANIPT4_ID!,
            tag: process.env.OPTONNANIPT4_TAG!
        },
        {
            name: "Copy-Cat",
            token: process.env.COPY_CAT_TOKEN!,
            id: process.env.COPY_CAT_ID!,
            tag: process.env.COPY_CAT_TAG!
        }
    ];

    toReturn.forEach((bot) => {
        for (const [key, val] of Object.entries(bot)) {
            if (!isTruthy(key)) logger(`A Discord Bot is missing a key!`, null, LogLevel.ERROR);
            if (!isTruthy(val)) logger(`Discord Bot: ${bot.name} is missing a value for: ${key}`, null, LogLevel.ERROR);
        }
    });

    return toReturn;
}