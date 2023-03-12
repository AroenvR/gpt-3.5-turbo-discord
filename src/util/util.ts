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
 * Sleeps for the given amount of milliseconds.
 * @param ms milliseconds to sleep.
 * @returns a promise that resolves after the given amount of milliseconds.
 */
export const sleepAsync = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}