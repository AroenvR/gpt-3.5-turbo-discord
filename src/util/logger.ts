export enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL",
}

/**
 * Logs a message to the console.
 * The message contains the file name, function name and messages + optional objects.
 * @param fileName Name of the file that is calling the logger function.
 * @example
 * const log = logger("fileName.ts");
 * log("A message", null, LogLevel.DEBUG);
 * log("A message", { foo: "bar" }, LogLevel.LOG);
 */
export const logger = (fileName: string) => (message: string, object: object | string | null, logLevel: LogLevel): void => {

    let functionName = "-";
    try {
        throw new Error();
    } catch (error: any) {
        const stack = error.stack || "";
        const match = stack.match(/at (.*)\s+\(/);
        if (match && match.length > 1) {
            functionName = match[1];
        }
    }

    const logMessage = `File: ${fileName} | Function: ${functionName}\n${message}`;
    switch (logLevel) {
        case LogLevel.DEBUG:
            console.debug(logMessage, object);
            break;
        case LogLevel.INFO:
            console.info(logMessage, object);
            break;
        case LogLevel.WARNING:
            console.warn(logMessage, object);
            break;
        case LogLevel.ERROR:
            console.error(logMessage, object);
            break;
        case LogLevel.CRITICAL:
            console.error(`CRITICAL - ${logMessage}`, object);
            break;
        default:
            console.log(logMessage, object);
            break;
    }  
};

/*
    Usage:
    const log = logger("fileName.ts");
    log("Hello World!", null, LogLevel.INFO);
*/
