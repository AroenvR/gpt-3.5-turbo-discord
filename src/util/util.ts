import * as DOMPurify from "dompurify";
import { isTruthy } from "./isTruthy";
import { logger, LogLevel } from "./logger";

/**
 * Encode to ASCII and decode back to UTF-8.
 * @param text to encode and decode.
 * @returns the decoded text.
 */
export const encodeAndDecodeString = async (text: string): Promise<string> => {
    let charCodeArr: number[] = [];
    for (let i = 0; i < text.length; i++) {
        charCodeArr.push(text.charCodeAt(i)); // Encoding
    }

    return String.fromCharCode(...charCodeArr); // Decoded
}

/**
 * Recursively sanitizes the input value using DOMPurify. Supports strings, arrays, and objects.  
 * Other types such as numbers, undefined, and null are returned unchanged.
 * @param val value to sanitize.
 * @returns the sanitized value.
 */
export const sanitizeValue = async (val: any): Promise<any> => {
    if (typeof val === 'string') {
      return DOMPurify.sanitize(val); // Not sure why, but this is crashing. Stopped sanitizing for now. TODO: Re-enable sanitizing.

    } else if (Array.isArray(val)) {
      return val.map(sanitizeValue);

    } else if (val !== null && typeof val === 'object') {
      return sanitizeObject(val);
    }

    return val;
};

/**
 * Recursively sanitizes all values of an object using DOMPurify.
 * The input object is not modified; a new object with sanitized values is returned.
 * @param obj object to sanitize.
 * @returns the sanitized object.
 */
export const sanitizeObject = async (obj: any) => {
    const sanitizedObj: any = {};
  
    for (const [key, val] of Object.entries(obj)) {
      sanitizedObj[key] = sanitizeValue(val);
    }
  
    return sanitizedObj;
};

/**
 * Sleeps for the given amount of milliseconds.
 * @param ms milliseconds to sleep.
 * @returns a promise that resolves after the given amount of milliseconds.
 */
export const sleepAsync = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}