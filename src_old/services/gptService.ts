import * as fs from 'fs-extra';
import { Configuration, OpenAIApi } from "openai";
import { IErrorResponse } from '../interfaces/IErrorResponse';
import { IGPTResponse } from '../interfaces/IGPTResponse';
import { isTruthy } from "../util/isTruthy";
import { logger, LogLevel } from "../util/logger";
import { encodeAndDecodeString } from '../util/util';
import { httpsPost } from "./httpService";
import path from 'path';
import { IAIModel } from '../interfaces/IAIModel';
import { getFakeSqliteClient, getAllMessages, insertMessage } from '../database/fakeClient';
const apiKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
    apiKey: apiKey
});
const openai: OpenAIApi = new OpenAIApi(configuration);

const gptPromptArr: string[] = [];

/**
 * Sends a message to OpenAI to query an AI with.
 * @param prompt string to query the AI with.
 * @returns a response from OpenAI in "" format.
 */
export const handleGptResponse = async (prompt: string, model?: string, max_tokens?: number, temperature?: number): Promise<string | IErrorResponse> => {
    // Encode the prompt to ASCII and decode it back to UTF-8.
    prompt = await encodeAndDecodeString(prompt);

    gptPromptArr.push(prompt);
    console.log(gptPromptArr);

    //@ts-ignore
    const resp = await openai.createCompletion({
        // model: model ? model : "text-davinci-003", // https://help.openai.com/en/articles/6643408-how-do-davinci-and-text-davinci-003-differ
        prompt: prompt,
        max_tokens: max_tokens ? max_tokens : 100,
        temperature: temperature ? temperature : 0.5,
        // top_p: 1, // Best not alter this if temperature is altered.
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        // best of 1
    })
    .catch((err: any) => {
        throw handleGptResponseError(err);
    }) as IGPTResponse;

    return resp.data.choices[0].text.replace("\n", "");
}

/** TODO: Update doc
 * Writes the file bit by bit.
 * System first.
 * User second.
 * Assistant last.
 * @param primer 
 * @param messages 
 * @param logName 
 * @returns 
*/
export const customGptResponse = async (ai: IAIModel, primer: string, message: string, userId: string) => {
    // Encode to ASCII and decode it back to UTF-8 to reduce potential issues.
    primer = await encodeAndDecodeString(primer);
    await getFakeSqliteClient(primer);

    const userMessage = {
        role: 'user',
        content: await encodeAndDecodeString(message)
    };

    await insertMessage(userMessage);
    
    const payload = {
        model: ai.model,
        messages: await getAllMessages()
    }

    logger("Sending payload to OpenAI...", null, LogLevel.INFO);

    const resp = await httpsPost("api.openai.com/v1/chat/completions", payload, apiKey);
    if (!isTruthy(resp)) throw new Error("No response from OpenAI.");

    const gptEntry = {
        role: 'assistant',
        content: resp.choices[0].message.content
    };

    // await insertMessage(gptEntry);
    
    // console.info("OpenAI response:", resp.choices[0].message.content);
    return gptEntry.content;
}

/*  |--------------------|
    |       HELPERS      |
    |--------------------|  */

/**
 * Reads the contents of an AI file and returns them as a string.
 * @param fileName - The name of the AI file to read.
 * @returns The contents of the AI file as a string.
 */
export const getModelPrimer = async (aiModel: IAIModel) => {
    const filePath = path.join(__dirname, `../ai_class_prompts/${aiModel.name.toLowerCase()}/${aiModel.name}.AI`);
    const fileContents = fs.readFileSync(filePath, 'utf-8');

    let aiPrimer = fileContents;

    if (isTruthy(aiModel.symbol_to_replace) && isTruthy(aiModel.symbol_replacements)) {
        for (let i = 0; i < aiModel.symbol_replacements.length; i++) {
            const myVariable = aiModel.symbol_replacements[i];
            aiPrimer = fileContents.replace(new RegExp(aiModel.symbol_to_replace, "g"), myVariable);
        }
    }

    return aiPrimer; //  + "\nYour responses must be 2000 or fewer tokens in length."
}

/**
 * Handles errors from OpenAI.
 * @param err error from OpenAI.
 * @returns a response from OpenAI in "" format.
 */
const handleGptResponseError = (err: any): IErrorResponse => {
    logger(`Error handling GPT Response for model`, err, LogLevel.ERROR);

    // Check for different types of errors and return appropriate status codes and messages
    switch (err.response.status) {
        case 400:
          return { status: 400, message: "Bad request: Invalid input parameters or invalid request format." };

        case 401:
            return { status: 401, message: `Unauthorized - Invalid API key: ${apiKey}` };

        case 403:
          return { status: 403, message: "Forbidden: Incorrect API key or insufficient permissions." };

        case 429:
          return { status: 429, message: "Too many requests: Rate limit exceeded." };

        case 500:
          return { status: 500, message: "Internal server error: An unexpected error occurred on the server." };

        case 503:
            return { status: 503, message: "Service unavailable: The OpenAI server is currently unavailable." };

        default:
          return { status: 500, message: "Unknown error." };
    }
}