import * as dotenv from 'dotenv'; dotenv.config();
const { Client, GatewayIntentBits } = require('discord.js');
import { chatGptResponse, handleGptResponse } from '../services/gptService';
import { isTruthy } from "../util/isTruthy";
import { logger } from '../util/logger';
import { Events, Message } from 'discord.js';
import { promptPrimes } from '../util/constants';
import {  sha2Async } from './cryptoService';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const fileName = "discordService.ts";
const log = logger(fileName);
// const Err = new CustomError(fileName); // This needs work

/*
DALL-E 2 named Optonnani. Optonnani had this to say:
Optonnani is derived from the Latin words 'optatum' meaning wish or desire, and 'anni' meaning year; together, they signify an AI that can make wishes come true.

When asked about a new AI, Optonnani said:
Human: I would like you to name your fellow AI.
Optonnani:  Ok great! How about we call the other AI Nana?
            Nana is derived from the Latin word 'nannus' meaning wise and compassionate.
            It's also a nod to the fact that AI can be both wise and compassionate companions.
*/

/**
 * Starts the Optonnani Discord bot.
 */
export const startOptonnani = () => {
    console.log("Starting Optonnani...");

    client.on(Events.MessageCreate, async (message: Message) => {
        // Ensure the bot doesn't reply to itself.
        if (message.author.bot) return;

        if (!message.content.startsWith(process.env.OPTONNANI_TAG!)) return;
        if (!isTruthy(message.content)) {
            throw new Error("Message content was falsy.");
        } 

        const messageContent = message.content.replace(`${process.env.OPTONNANI_TAG!} `, "");

        // GPT-3
        // const resp = await handleGptResponse(messageContent)
        //     .catch((err: any) => {
        //         log(`Error handling GPT Response`, err, LogLevel.ERROR);
        //         throw new Error(`Error handling GPT Response`);
        //     });

        // ChatGPT-3.5
        const resp = await chatGptResponse(promptPrimes.CHUCK_NORRIS, messageContent, await sha2Async(message.author.id), "CHUCK_NORRIS");

        message.reply(resp);
        // message.channel.send(gptResponse); // Doesn't work in TS..?
    });

    client.login(process.env.OPTONNANI_TOKEN);
}

 /* Interesting Discord.JS Events:
        MessageCreate = 'messageCreate',
        MessageDelete = 'messageDelete',
        MessageUpdate = 'messageUpdate',

        MessageBulkDelete = 'messageDeleteBulk',
        MessageReactionAdd = 'messageReactionAdd',
        MessageReactionRemove = 'messageReactionRemove',
        MessageReactionRemoveAll = 'messageReactionRemoveAll',
        MessageReactionRemoveEmoji = 'messageReactionRemoveEmoji',

        VoiceServerUpdate = 'voiceServerUpdate',
        VoiceStateUpdate = 'voiceStateUpdate',
        TypingStart = 'typingStart',
    */