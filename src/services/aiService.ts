import * as dotenv from 'dotenv'; dotenv.config();
import appConfig from "../appConfig.json";
import { chatGptResponse, handleGptResponse, getModelPrimer } from './gptService';
import { logger, LogLevel } from '../util/logger';
import { Message } from 'discord.js';
import { aiModelNames, pubSubEvents } from '../util/constants';
import {  sha2Async } from './cryptoService';
import { ISubscriber } from '../interfaces/IPubSub';
import pubSubProvider from '../providers/pubSubProvider';
import { IAIModel } from '../interfaces/IAIModel';
import { getWeatherData } from './weatherService';

const fileName = "discordService.ts";
const log = logger(fileName);

let ai: IAIModel = appConfig.ai_models.can_i_ride;

// TODO: Create AI client?

export const setupAI = async () => {
    log(`Setting up AI: ${ai.model}`, null, LogLevel.DEBUG);
    // TODO: Get SQLite Client
    // TODO: Add primer to DB.

    const subscriber: ISubscriber = {
        id: ai.model,
        eventType: pubSubEvents.DISCORD_MESSAGE,
        callback: handleDiscordMessage
    }
    pubSubProvider.subscribe(subscriber);
}

/**
 * 
 * @param message
 */
const handleDiscordMessage = async (message: Message) => {
    switch (ai.model) {
        // case aiModelNames.MIDJOURNEY_PROMPT_CREATOR:
        //     await midJourneyPromptCreator(messageContent, userId);
        //     break;

        case aiModelNames.CAN_I_RIDE:
            await canIRide(message);
            break;

        default:
            log(`AI model not found: ${ai.model}`, null, LogLevel.ERROR);
            throw new Error(`AI model not found: ${ai.model}`);
    }

    // TODO: Get SQLite Client
    // TODO: Add user message to DB.
}

const canIRide = async (message: Message) => {
    // const messageContent = message.content.replace(`${process.env.OPTONNANI_TAG!} `, ""); // TODO: Get rid of the token.
    const messageContent = await getWeatherData("Brussels");
    const userId = message.author.id;

    // GPT-3
    // const resp = await handleGptResponse(message)
    //     .catch((err: any) => {
    //         log(`Error handling GPT Response`, err, LogLevel.ERROR);
    //         throw new Error(`Error handling GPT Response`);
    //     });

    // ChatGPT-3.5
    const primer = await getModelPrimer(ai); // TODO: Get from DB.
    const resp = await chatGptResponse(ai, primer, messageContent, await sha2Async(userId)); // TODO: last 2 params optional?

    // TODO: Add response to DB.

    //@ts-ignore
    message.channel.send(resp);
    // message.reply(resp);
}











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
// export const startOptonnanid = async () => {
//     console.log("...Starting Optonnani...");

//     client.on(Events.MessageCreate, async (message: Message) => {
//         // Ensure the bot doesn't reply to itself.
//         if (message.author.bot) return;

//         if (!message.content.startsWith(process.env.OPTONNANI_TAG!)) return;
//         if (!isTruthy(message.content)) {
//             throw new Error("Message content was falsy.");
//         } 

//         const messageContent = message.content.replace(`${process.env.OPTONNANI_TAG!} `, "");

//         // GPT-3
//         // const resp = await handleGptResponse(messageContent)
//         //     .catch((err: any) => {
//         //         log(`Error handling GPT Response`, err, LogLevel.ERROR);
//         //         throw new Error(`Error handling GPT Response`);
//         //     });

//         // ChatGPT-3.5
//         const ai_model = await getModelPrimer("MidJourney_Prompt_Creator", ["###"], ["Kawasaki H2 SX SE, a sleek and sporty looking motorcycle that has a distinctive design"]);
//         const resp = await chatGptResponse(ai_model, messageContent, await sha2Async(message.author.id), "MidJourney_Prompt_Creator"); // TODO: last 2 params optional?

//         // message.reply(resp);
//         //@ts-ignore
//         message.channel.send(resp); // Doesn't work in TS..?
//     });

//     client.login(process.env.OPTONNANI_TOKEN); // 
// }

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