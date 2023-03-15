import { setupDatabase } from "./database/sqliteClient";
import { startDiscordClient } from "./providers/discordProvider";
import { setupAI } from "./services/aiService";
import { logger } from "./util/logger";

const fileName = "index.ts";
const log = logger(fileName);

const setupClients = async () => {
    console.log("--- Starting GPT-3.5-turbo-discord application ---");
    
    await setupDatabase();
    await startDiscordClient(process.env.OPTONNANI_TOKEN!); // Optonnani online.
    await setupAI();
}
setupClients();