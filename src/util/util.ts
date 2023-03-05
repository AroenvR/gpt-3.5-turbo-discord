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