import * as appConfig from "../appConfig.json";
import callerCallsite from 'caller-callsite';
import { isTruthy } from "./isTruthy";

export enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL",
}

/**
 * Logs a message to the console.
 * The message contains the file name, function name, and messages + optional objects.
 * The file name and function name are captured automatically.
 * @param message The message to be logged.
 * @param object An optional object, string or null that provides additional information.
 * @param logLevel The log level to use when logging the message.
 * @example
 * logger("A message", null, LogLevel.DEBUG);
 * logger("A message", { foo: "bar" }, LogLevel.INFO);
 */
export const logger = async (message: string, object: object | string | null, logLevel: LogLevel): Promise<void> => {
    // const Callsite = (await import("caller-callsite")).default;
    const fileName = callerCallsite()!.getFileName()?.split(/[\\/]/).pop() || "-";
    const functionName = callerCallsite()!.getFunctionName() || "-";

    const logMessage = `File: ${fileName} | Function: ${functionName} | Message: ${message}`;

    if (!appConfig.logging) return;

    switch (logLevel) {
        case LogLevel.DEBUG:
            if (appConfig.enable_debug_log) console.debug(logMessage, object ?? "");
            break;

        case LogLevel.INFO:
            console.info(logMessage, object ?? "");
            break;
    
        case LogLevel.WARNING:
            console.warn(logMessage, object ?? "");
            break;
    
        case LogLevel.ERROR:
            console.error("ERROR - " + logMessage, object ?? "");
            break;
    
        case LogLevel.CRITICAL:
            console.error(`CRITICAL - ${logMessage}`, object ?? "");
            break;
    
        default:
            console.log(logMessage, object ?? "");
            break;
    }  
}

// const getFileAndFunctionNames = () => {
    // let fileName = "-";
    // let functionName = "-";

    // const customError: { stack?: string } = {};
    // Error.captureStackTrace(customError);
    // const stack = customError.stack || "";
    // const lines = stack.split("\n");
    // const callerLine = lines[3];
    
    // if (callerLine) {
    //     const matchFunction = callerLine.match(/at\s(?:new\s)?(?:[^]*?\s)?(\S+)\s\(?/);
    //     if (matchFunction && matchFunction.length > 1) {
    //         // functionName = matchFunction[1];
    //         // if (functionName === '<anonymous>') {
    //         //     functionName = '-';
    //         // }
    //     }
        
    //     const matchFile = callerLine.match(/(\S+):\d+:\d+/);
    //     if (matchFile && matchFile.length > 1) {
    //         fileName = matchFile[1].split(/[\\/]/).pop() || "-";
    //     }
    // }
    
    // console.log('Caller line:', callerLine);
    // console.log('Extracted function name:', functionName);
    // console.log('Extracted file name:', fileName);

    // let fileName = callerCallsite()!.getFileName()?.split(/[\\/]/).pop() || "-";
    // let functionName = callerCallsite()!.getFunctionName() || "-";

//     return { fileName, functionName };
// }

/**
 * Logs a message to the console.
 * The message contains the file name, function name and messages + optional objects.
 * @param fileName Name of the file that is calling the logger function.
 * @example
 * const log = logger("fileName.ts");
 * log("A message", null, LogLevel.DEBUG);
 * log("A message", { foo: "bar" }, LogLevel.LOG);
 */
// export const logger = (fileName: string) => (message: string, object: object | string | null, logLevel: LogLevel): void => {

//     let functionName = "-";
//     try {
//         throw new Error();
//     } catch (error: any) {
//         const stack = error.stack || "";
//         const match = stack.match(/at (.*)\s+\(/);
//         if (match && match.length > 1) {
//             functionName = match[1];
//         }
//     }

//     const logMessage = `File: ${fileName} | Function: ${functionName} | Message: ${message}`;

//     if (!appConfig.logging) return;

//     switch (logLevel) {
//         case LogLevel.DEBUG:
//             if (appConfig.enable_debug_log) console.debug(logMessage, object ? object : "");
//             break;

//         case LogLevel.INFO:
//             console.info(logMessage, object ? object : "");
//             break;

//         case LogLevel.WARNING:
//             console.warn(logMessage, object ? object : "");
//             break;

//         case LogLevel.ERROR:
//             console.error("ERROR - " + logMessage, object ? object : "");
//             break;

//         case LogLevel.CRITICAL:
//             console.error(`CRITICAL - ${logMessage}`, object ? object : "");
//             break;

//         default:
//             console.log(logMessage, object ? object : "");
//             break;
//     }  
// };