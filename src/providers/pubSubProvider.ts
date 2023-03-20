import { Message } from "discord.js";
import { IDiscordBot } from "../interfaces/IDiscordBot";
import { IPubSubProvider, ISubscriber } from "../interfaces/IPubSub";
import { isTruthy } from "../util/isTruthy";
import { logger, LogLevel } from "../util/logger";

const fileName = "pubSubProvider.ts";
const log = logger(fileName);

/**
 * In-memory array of subscribers.
 */
const subscribers: ISubscriber[] = [];

/**
 * PubSub provider that uses an in-memory array to store subscribers.
 */
const pubSubProvider: IPubSubProvider = {
    publish: async (eventType: string, event: Message | any, bot: IDiscordBot) => {
        log(`Bot: ${bot.name} is publishing event of type ${eventType}`, null, LogLevel.INFO);

        if (!isTruthy(subscribers)) {
            return;
        }

        if (!isTruthy(eventType)) {
            log(`Event type is falsy.`, null, LogLevel.ERROR);
            return;
        }

        subscribers.forEach((s) => {
            if (s.eventType === eventType && bot === s.bot) {
                s.callback(event, bot);
            }
        });
    },

    subscribe: async (subscriber: ISubscriber) => {
        log(`New AI subscriber: ${subscriber.name} to Discord Bot: ${subscriber.bot.name} for eventType: ${subscriber.eventType}`, null, LogLevel.INFO);

        if (subscribers.some((s) => s.name === subscriber.name && s.eventType === subscriber.eventType)) {
            return;
        }

        subscribers.push(subscriber);
    },

    unsubscribe: async (name: string, eventType: string) => {
        log(`Unsubscribing subscriber: ${name} from eventType: ${eventType}`, null, LogLevel.INFO);

        if (!subscribers.some((s) => s.name === name && s.eventType === eventType)) {
            return;
        }

        subscribers.forEach((s) => {
            if (s.name === name && s.eventType === eventType) {
                subscribers.splice(subscribers.findIndex((s) => s.name === name && s.eventType === eventType), 1);
            }
        });
    },

    unsubscribeAll: async (name: string) => {
        log(`Unsubscribing subscriber: ${name} from all events.`, null, LogLevel.INFO);

        subscribers.forEach((s) => {
            if (s.name === name) {
                subscribers.splice(subscribers.findIndex((s) => s.name === name), 1);
            }
        });
    }
}

export default pubSubProvider;