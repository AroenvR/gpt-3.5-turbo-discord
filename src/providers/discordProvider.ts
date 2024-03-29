import * as dotenv from 'dotenv'; dotenv.config();
const { Client, GatewayIntentBits } = require('discord.js'); // TODO: import this.
import { isTruthy } from "../util/isTruthy";
import { logger, LogLevel } from '../util/logger';
import { Events, Message } from 'discord.js';
import { sleepAsync } from '../util/util';
import pubSubProvider from './pubSubProvider';
import { pubSubEvents } from '../util/constants';
import { IDiscordBot } from '../interfaces/IDiscordBot';

/**
 * In-memory map of Discord clients.
 */
const discordClients = new Map<string, any>([]);

/**
 * Starts the Discord client and its event listeners with the given login token.
 * @param login Discord login token.
 */
export const startDiscordClient = async (bot: IDiscordBot) => {
    const discordClient = discordClients.get(bot.name);

    if (!isTruthy(discordClient)) {
        await setupClient(bot)
            .then(() => {
                startEventListener(bot);
            })
            .catch((err: any) => {
                logger(`Error starting Discord client:`, LogLevel.ERROR, err);
                throw new Error(`Error creating Discord client: ${err}`);
            });

        await sleepAsync(50); // Just a precaution.
    }

    const newClient = discordClients.get(bot.name);
    if (!isTruthy(newClient)) {
        logger(`Could not get new Discord client.`, LogLevel.ERROR);
        throw new Error(`Could not create Discord client.`);
    }
}


/**
 * Sets up the Discord client with the given login token.
 * @param login Discord login token.
 */
const setupClient = async (bot: IDiscordBot) => {
    try {
        const newClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
        discordClients.set(bot.name, newClient);

        const myClient = discordClients.get(bot.name);
        await myClient.login(bot.token);

        logger(`Discord bot ${bot.name} logged in!`, LogLevel.INFO);
    } catch (err: any) {
        logger(`Error creating Discord client for bot ${bot.name}:`, err, LogLevel.ERROR);
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
const startEventListener = async (bot: IDiscordBot) => {
    const myClient = discordClients.get(bot.name);

    // Message listener.
    myClient.on(Events.MessageCreate, async (message: Message) => { // TODO: Look at a generic listener for all events.
        if (!isTruthy(bot.tag)) {
            logger(`Bot tag was falsy! Please fill it in: ${message.content}`, LogLevel.ERROR);
            return;
        }

        // Ensure bots don't reply to other bots.
        if (message.author.bot) return;
        if (!message.content.startsWith(bot.tag)) return; // TODO: Think about this at some point. Also, it's broken at the moment.
        logger(`Discord Bot: ${bot.name} received a message: ${message.content.replace(`${bot.tag} `, "")}`, LogLevel.INFO);

        if (!isTruthy(message.content)) {
            logger(`Message content was falsy.`, LogLevel.ERROR);
            throw new Error("Message content was falsy.");
        }

        // publish event name, event message, discord bot id
        pubSubProvider.publish(pubSubEvents.DISCORD_MESSAGE, message, bot);
    });

    logger(`Discord bot ${bot.name} event listener started!`, LogLevel.INFO);
}