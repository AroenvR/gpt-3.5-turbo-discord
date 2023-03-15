import * as dotenv from 'dotenv'; dotenv.config();
const { Client, GatewayIntentBits } = require('discord.js'); // TODO: import this.
import { isTruthy } from "../util/isTruthy";
import { logger, LogLevel } from '../util/logger';
import { Events, Message } from 'discord.js';
import { sleepAsync } from '../util/util';
import pubSubProvider from './pubSubProvider';
import { pubSubEvents } from '../util/constants';

let client: any | null = null;

const fileName = "discordProvider.ts";
const log = logger(fileName);

/**
 * Starts the Discord client and its event listeners with the given login token.
 * @param login Discord login token.
 */
export const startDiscordClient = async (login: string) => {
    if (client === null) {
        await setupClient(login)
            .then(() => {
                startEventListener();
            })
            .catch((err: any) => {
                log(`Error starting Discord client:`, err, LogLevel.ERROR);
                throw new Error(`Error creating Discord client: ${err}`);
            });

        await sleepAsync(50); // Just a precaution.
    }

    if (!isTruthy(client)) {
        log(`Could not get Discord client.`, null, LogLevel.ERROR);
        throw new Error(`Could not create Discord client.`);
    }

    log(`Discord client started!`, null, LogLevel.INFO);
}


/**
 * Sets up the Discord client with the given login token.
 * @param login Discord login token.
 */
const setupClient = async (login: string) => {
    try {
        client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
        await client.login(login); 

        log(`Client logged in!`, null, LogLevel.INFO);
    } catch (err: any) {
        log(`Error creating Discord client:`, err, LogLevel.ERROR);
        throw new Error(`Error creating Discord client: ${err}`);
    }

    // client = new Client({ check for other possible intents?
        //     intents: [
        //         GatewayIntentBits.GUILDS,
        //         GatewayIntentBits.GUILD_MESSAGES,
        //         GatewayIntentBits.GUILD_MESSAGE_REACTIONS,
        //         GatewayIntentBits.GUILD_MESSAGE_TYPING,
        //         GatewayIntentBits.DIRECT_MESSAGES,
        //         GatewayIntentBits.DIRECT_MESSAGE_REACTIONS,
        //         GatewayIntentBits.DIRECT_MESSAGE_TYPING,
        //     ],
        // });
}

/**
 * Starts the message events listener.
 */
const startEventListener = async () => {
    log(`Starting Discord event listener...`, null, LogLevel.INFO);

    // Message listener.
    client.on(Events.MessageCreate, async (message: Message) => { // TODO: Look at a generic listener for all events.
        // Ensure a bot doesn't reply to itself.
        if (message.author.bot) return;
        // if (!message.content.startsWith(login)) return; // TODO: Think about this at some point. Also, it's broken at the moment.
        
        if (!isTruthy(message.content)) {
            log(`Message content was falsy.`, null, LogLevel.ERROR);
            throw new Error("Message content was falsy.");
        }

        pubSubProvider.publish(pubSubEvents.DISCORD_MESSAGE, message);
    });
}