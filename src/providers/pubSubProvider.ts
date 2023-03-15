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
    publish: async (eventType: string, event: any) => {
        log(`Publishing event of type ${eventType}.`, null, LogLevel.INFO);

        if (!isTruthy(subscribers)) {
            return;
        }

        if (!isTruthy(eventType)) {
            log(`Event type is falsy.`, null, LogLevel.ERROR);
            return;
        }

        subscribers.forEach((s) => {
            if (s.eventType === eventType) {
                s.callback(event);
            }
        });
    },

    subscribe: async (subscriber: ISubscriber) => {
        log(`New subscriber: ${subscriber.id} to eventType: ${subscriber.eventType}`, null, LogLevel.INFO);

        if (subscribers.some((s) => s.id === subscriber.id && s.eventType === subscriber.eventType)) {
            return;
        }

        subscribers.push(subscriber);
    },

    unsubscribe: async (id: string, eventType: string) => {
        log(`Unsubscribing subscriber: ${id} from eventType: ${eventType}`, null, LogLevel.INFO);

        if (!subscribers.some((s) => s.id === id && s.eventType === eventType)) {
            return;
        }

        subscribers.forEach((s) => {
            if (s.id === id && s.eventType === eventType) {
                subscribers.splice(subscribers.findIndex((s) => s.id === id && s.eventType === eventType), 1);
            }
        });
    },

    unsubscribeAll: async (id: string) => {
        log(`Unsubscribing subscriber: ${id} from all events.`, null, LogLevel.INFO);

        subscribers.forEach((s) => {
            if (s.id === id) {
                subscribers.splice(subscribers.findIndex((s) => s.id === id), 1);
            }
        });
    }
}

export default pubSubProvider;