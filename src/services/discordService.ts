import { Message } from "discord.js";

let typingTimeout: any;

/**
 * Sends a typing indicator for the given message.
 * @param message to send typing indicator for.
 */
export const startTyping = async (message: Message) => {
    // @ts-ignore
    message.channel.sendTyping();

    typingTimeout = setTimeout(() => {
        startTyping(message);
      }, 7000);
}

/**
 * Stops the typing indicator.
 */
export const stopTyping = async () => {
    clearTimeout(typingTimeout);
}