/**
 * @interface IDiscordBot
 * @property {string} name - The name of the Discord bot.
 * @property {string} token - The token of the Discord bot.
 * @property {string} id - The ID of the Discord bot.
 * @property {string} tag - The tag of the Discord bot.
 * @example {
 * name: "Optonnani",
 * token: process.env.OPTONNANI_TOKEN!,
 * id: process.env.OPTONNANI_ID!,
 * tag: process.env.OPTONNANI_TAG!
 * }
 */
export interface IDiscordBot {
    name: string;
    token: string;
    id: string;
    tag: string;
}