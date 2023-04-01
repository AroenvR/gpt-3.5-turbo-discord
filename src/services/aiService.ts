import * as dotenv from 'dotenv'; dotenv.config();
import * as appConfig from "../appConfig.json";
import { customGptResponse, getModelPrimer } from './gptService';
import { logger, LogLevel } from '../util/logger';
import { Message } from 'discord.js';
import { aiModelNames, pubSubEvents } from '../util/constants';
import {  sha2Async } from './cryptoService';
import { ISubscriber } from '../interfaces/IPubSub';
import pubSubProvider from '../providers/pubSubProvider';
import { IAIModel } from '../interfaces/IAIModel';
import { getWeatherData } from './weatherService';
import { isTruthy } from '../util/isTruthy';
import { getDiscordBots } from '..';
import { IDiscordBot } from '../interfaces/IDiscordBot';
import { sanitizeValue } from '../util/util';

// TODO: There's a bug where the AI responds twice?
const fileName = "aiService.ts";
const log = logger(fileName);

/**
 * In-memory map of AI models.
 */
const aiMap = new Map<string, IAIModel>([]);

/**
 * Sets up an AI model for a given Discord bot, adds it to the aiMap, and creates a new subscriber for the bot.
 * If the bot already has an AI subscribed to it, the function returns early without creating a new subscriber.
 * @param {IDiscordBot} bot - The Discord bot for which the AI model should be set up.
 * @throws {Error} Will throw an error if the AI model for the Discord bot is not found in the appConfig.
 * @throws {Error} Will throw an error if the AI for the Discord bot did not get added to the aiMap.
 */
export const setupAI = async (bot: IDiscordBot) => {
    if (aiMap.has(bot.id)) {
        log(`AI is already subscribed to bot with ID ${bot.id}`, null, LogLevel.DEBUG);
        return;
    }

    try {
        //@ts-ignore
        const newAI = appConfig.ai_models[bot.name.toLowerCase()] as IAIModel;
        aiMap.set(bot.id, newAI);
    } catch (error) {
        log(`AI model for Discord Bot name: ${bot.name} not found.`, null, LogLevel.ERROR);
        throw new Error(`AI model for Discord Bot name: ${bot.name} not found.`);
    }

    if (!isTruthy(aiMap.get(bot.id))) throw new Error(`AI for Discord Bot name: ${bot.name} did not get added to the Map.`);

    const subscriber: ISubscriber = {
        name: aiMap.get(bot.id)!.name,
        bot: bot,
        eventType: pubSubEvents.DISCORD_MESSAGE,
        callback: (message: Message, bot: IDiscordBot) => handleDiscordMessage(message, bot)
    }
    pubSubProvider.subscribe(subscriber);
}

/**
 * 
 * @param message
 */
const handleDiscordMessage = async (message: Message, bot: IDiscordBot) => {
    const ai = aiMap.get(bot.id);
    if (!isTruthy(ai)) throw new Error(`AI not found for Discord Bot: ${bot.name}`);

    log(`AI: ${ai!.name} handling Discord Message`, null, LogLevel.DEBUG);    
    const primer = await getModelPrimer(ai!);

    switch (ai!.name) {
        case aiModelNames.CAN_I_RIDE:
            console.error("Can I Ride? WIP!");
            // await canIRide(ai!, primer, message);
            break;
            
        case aiModelNames.OPTONNANI:
        case aiModelNames.NANAAI:
        case aiModelNames.PROMPT_IMPROVER:
        case aiModelNames.MIDJOURNEY_PROMPT_CREATOR:
            await defaultMessageHandler(ai!, primer, message, bot);
            break;

        default:
            await defaultMessageHandler(ai!, primer, message, bot);
            // message.reply("I'm sorry, something went wrong. \nThe requested AI model is not available.");
            // log(`AI model not found: ${ai!.name}`, null, LogLevel.ERROR);
            // throw new Error(`AI model not found: ${ai!.name}`);
    }

    // TODO: Get SQLite Client
    // TODO: Add user message to DB.
}

/**
 * 
 * @param primer 
 * @param message 
 */
const defaultMessageHandler = async (ai: IAIModel, primer: string, message: Message, bot: IDiscordBot) => {
    const messageContent = message.content.replace(`${bot.tag} `, ""); // TODO: Get rid of the token.
    const userId = message.author.id;

    // const sanitized = await sanitizeValue(messageContent);

    // @ts-ignore
    message.channel.sendTyping();
    const resp = await customGptResponse(ai, primer, messageContent, await sha2Async(userId))
        .catch((err: any) => {
            message.reply(`${ai.name} had an issue occur getting GPT response: ${err}`);
        });

    log("AI Response: " + resp, null, LogLevel.DEBUG);

    let chunks = await splitMessage(resp);
    chunks.forEach(async (chunk: string) => {
        await message.reply(chunk)
            .catch((err: any) => {
                log(`Failed to send AI Response to Discord:\n${resp}`, null, LogLevel.ERROR);
                message.reply(`Can-I-Ride had an issue occur sending Discord reply: ${err.message}`);
            });
    });
    return;
}

/**
 * 
 * @param primer 
 * @param message 
 */
// const canIRide = async (ai: IAIModel, primer: string, message: Message) => {
//     const messageContent = await getWeatherData("Brussels");
//     const userId = message.author.id;

//     const resp = await customGptResponse(ai, primer, messageContent, await sha2Async(userId))
//         .catch((err: any) => {
//             message.reply(`${ai.name} had an issue occur getting GPT response: ${err}`);
//         });

//     let chunks = await splitMarkdownPreservingChunks(resp);
//     chunks.forEach(async (chunk: string) => {
//         await message.reply(chunk)
//             .catch((err: any) => {
//                 log(`Failed to send AI Response to Discord:\n${resp}`, null, LogLevel.ERROR);
//                 message.reply(`Can-I-Ride had an issue occur sending Discord reply: ${err.message}`);
//             });
//     });
//     return;

//     // GPT-3
//     // const resp = await handleGptResponse(message)
//     //     .catch((err: any) => {
//     //         log(`Error handling GPT Response`, err, LogLevel.ERROR);
//     //         throw new Error(`Error handling GPT Response`);
//     //     });
// }

/**
 * Split a message into chunks of 1999 characters or less.
 * @param message to split.
 * @returns array of chunks.
 */
const splitMessage = async (message: string): Promise<string[]> => {
    const maxLength = 1999;
    let chunks: string[] = [];
  
    if (message.length <= maxLength) {
      chunks.push(message);
    } else {
      while (message.length > 0) {
        let chunk = message.slice(0, maxLength);
        chunks.push(chunk);
        message = message.slice(maxLength);
      }
    }
  
    return chunks;
}

/**
 * 
 * @param str 
 * @param maxLength 
 * @returns 
 */
const splitMarkdownPreservingChunks = async (str: string, maxLength = 1999) => {
    const chunks: string[] = [];
    let startIndex = 0;
  
    const findValidBreakpoint = (index: number) => {
      const markdownDelimiters = [
        /\n/, // Line break
        /\s/, // Whitespace
        /\\/, // Backslash
        /[_*~]/, // Markdown formatting characters: _, *, ~
      ];
  
      for (const delimiter of markdownDelimiters) {
        const match = str.slice(0, index).match(delimiter);
        if (match) {
          index = match.index!;
          break;
        }
      }
      return index;
    };
  
    while (startIndex < str.length) {
      let endIndex = startIndex + maxLength;
  
      if (endIndex < str.length) {
        endIndex = findValidBreakpoint(endIndex);
      }
  
      const chunk = str.slice(startIndex, endIndex);
      chunks.push(chunk);
  
      startIndex = endIndex;
    }
  
    return chunks;
}
  

/*
DALL-E 2 named Optonnani. Optonnani had this to say:
Optonnani is derived from the Latin words 'optatum' meaning wish or desire, and 'anni' meaning year; together, they signify an AI that can make wishes come true.

When asked about a new AI, Optonnani said:
Human: I would like you to name your fellow AI.
Optonnani:  Ok great! How about we call the other AI Nana?
            Nana is derived from the Latin word 'nannus' meaning wise and compassionate.
            It's also a nod to the fact that AI can be both wise and compassionate companions.
*/

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