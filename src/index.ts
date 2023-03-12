import { closeDatabase, getClient, setupDatabase } from "./database/sqliteClient";
import { startOptonnani } from "./services/discordService";

const startAIApplication = async () => {
    console.log("--- Starting GPT-3.5-turbo-discord application ---");

    await setupDatabase();
    await startOptonnani();
};

startAIApplication();