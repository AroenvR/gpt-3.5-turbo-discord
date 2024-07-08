import { Message } from "discord.js";
import { IDiscordBot } from "./IDiscordBot";

/**
 * @interface ISubscriber
 * @property {string} id - Unique id of subscriber.
 * @property {string} eventType - Event type to subscribe to.
 * @property {function} callback - Callback function to call when event is published.
 */
export interface ISubscriber {
    name: string;
    eventType: string;
    bot: IDiscordBot;
    callback: (event: Message | any, bot: IDiscordBot) => void;
}

/**
 * @interface IPubSubProvider
 * @property {function} publish - Publishes an event.
 * @property {function} subscribe - Subscribes to an event.
 * @property {function} unsubscribe - Unsubscribes from an event.
 * @property {function} unsubscribeAll - Unsubscribes from all events.
 */
export interface IPubSubProvider {
    publish: (eventType: string, event: Message | any, bot: IDiscordBot) => Promise<void>;
    subscribe: (subscriber: ISubscriber) => Promise<void>;
    unsubscribe: (id: string, eventType: string) => Promise<void>;
    unsubscribeAll: (id: string) => Promise<void>;
}