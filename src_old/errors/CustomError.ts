import { logger, LogLevel } from "../util/logger";

/**
 * Custom error class
 * @param fileName Name of the file that is calling the logger function.
 * @param functionName Name of the function that is calling the logger function.
 * @throws CustomError
 * @example
 * const Err = new CustomError(fileName, functionName);
 * throw Err("An issue occurred", error);
 */
export class CustomError extends Error {
    constructor(fileName: string, public message: string = "An error occurred.") {
        super(fileName);
        this.name = this.constructor.name;

        // const log = logger(fileName);
        // log(message, this.stack!, LogLevel.ERROR);

        console.error(`${fileName}: ${this.message}\n${this.stack}`);
    }
}