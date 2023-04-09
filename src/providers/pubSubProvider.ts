import { Message } from "discord.js";
import { IDiscordBot } from "../interfaces/IDiscordBot";
import { IPubSubProvider, ISubscriber } from "../interfaces/IPubSub";
import { isTruthy } from "../util/isTruthy";
import { logger, LogLevel } from "../util/logger";

/**
 * In-memory array of subscribers.
 */
const subscribers: ISubscriber[] = [];

/**
 * PubSub provider that uses an in-memory array to store subscribers.
 */
const pubSubProvider: IPubSubProvider = {
    publish: async (eventType: string, event: Message | any, bot: IDiscordBot) => {
        logger(`Bot: ${bot.name} is publishing event of type ${eventType}`, LogLevel.INFO);

        if (!isTruthy(subscribers)) {
            return;
        }

        if (!isTruthy(eventType)) {
            logger(`Event type is falsy.`, LogLevel.ERROR);
            return;
        }

        subscribers.forEach((s) => {
            if (s.eventType === eventType && bot === s.bot) {
                s.callback(event, bot);
            }
        });
    },

    subscribe: async (subscriber: ISubscriber) => {
        logger(`New AI subscriber: ${subscriber.name} to Discord Bot: ${subscriber.bot.name} for eventType: ${subscriber.eventType}`, LogLevel.INFO);

        if (subscribers.some((s) => s.name === subscriber.name && s.eventType === subscriber.eventType)) {
            return;
        }

        subscribers.push(subscriber);
    },

    unsubscribe: async (name: string, eventType: string) => {
        logger(`Unsubscribing subscriber: ${name} from eventType: ${eventType}`, LogLevel.INFO);

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
        logger(`Unsubscribing subscriber: ${name} from all events.`, LogLevel.INFO);

        subscribers.forEach((s) => {
            if (s.name === name) {
                subscribers.splice(subscribers.findIndex((s) => s.name === name), 1);
            }
        });
    }
}

export default pubSubProvider;