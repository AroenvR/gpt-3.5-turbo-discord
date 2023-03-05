import CryptoJS from 'crypto-js';

/**
 * **SYNC** Hashes a message using SHA-256.
 * @param message To hash.
 * @returns The checksum.
 */
export const sha2 = (message: string): string => {
    return CryptoJS.SHA256(message).toString();
}

/**
 * **ASYNC** Hashes a message using SHA-256.
 * @param message To hash.
 * @returns The checksum.
 */
export const sha2Async = async (message: string): Promise<string> => {
    return CryptoJS.SHA256(message).toString();
}

/**
 * **SYNC** Encrypts a string using AES-256.
 * @param toEncrypt To encrypt.
 * @param key To encrypt with.
 * @returns The ciphertext.
 */
export const aesEncrypt = (toEncrypt: string, key: string): string => {
    return CryptoJS.AES.encrypt(toEncrypt, key).toString();
}

/**
 * **ASYNC** Encrypts a string using AES-256.
 * @param toEncrypt To encrypt.
 * @param key To encrypt with.
 * @returns The ciphertext.
 */
export const aesEncryptAsync = async (toEncrypt: string, key: string): Promise<string> => {
    return CryptoJS.AES.encrypt(toEncrypt, key).toString();
}

/**
 * **SYNC** Dencrypts a ciphertext using AES-256.
 * @param ciphertext To decrypt.
 * @param key To decrypt with.
 * @returns The original string.
 */
export const aesDecrypt = async (ciphertext: string, key: string): Promise<string> => {
    var bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * **ASYNC** Dencrypts a ciphertext using AES-256.
 * @param ciphertext To decrypt.
 * @param key To decrypt with.
 * @returns The original string.
 */
export const aesDecryptAsync = async (ciphertext: string, key: string): Promise<string> => {
    var bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}