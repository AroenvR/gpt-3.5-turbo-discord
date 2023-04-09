import sqlite3 from "sqlite3";
import fs from "fs-extra";
import { isTruthy } from "../util/isTruthy";
import { logger, LogLevel } from "../util/logger";

/**
 * The database object.
 * @type {sqlite3.Database | null}
 * @private
 */
let db: sqlite3.Database | null = null;

/**
 * Gets the database client.
 * @returns A ready to use database client.
 */
export const getSqliteClient = async () => {
    if (db === null) {
        db = new sqlite3.Database("./conversations.db", (err: any) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                logger("SQLite database connected.", LogLevel.DEBUG);
            }
        });
    }

    if (!isTruthy(db)) {
        logger("Could not connect to the database.", LogLevel.ERROR)
        throw new Error("Could not connect to the database.");
    }

    return db;
};

/**
 * Creates the database schema.
 */
export const setupDatabase = async () => {
    const db = await getSqliteClient();

    const schema = fs.readFileSync("./src/database/SQL/schema.sql", "utf8");
    db.run("PRAGMA foreign_keys = ON", (err: any) => {
        if (err) {
            logger("Error executing PRAGMA foreign_keys:", LogLevel.ERROR, err);
            throw new Error("Error executing PRAGMA foreign_keys: " + err.message);
        }
        else {
            logger("SQLite database foreign keys successfully enabled.", LogLevel.DEBUG);
        }
    });

    db.run(schema, (err: any) => {
        if (err) {
            logger("Error creating Database schema:", LogLevel.ERROR, err);
            throw new Error("Error creating Database schema: " + err.message);
        }
        else {
            logger("SQLite database schema successfully created.", LogLevel.DEBUG);
        }
    });
};

/**
 * Closes the database connection.
 */
export const closeDatabase = () => {
    if (db !== null) {
        db.close((err: any) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                console.log("SQLite database closed.");
            }
        });
    }
    else {
        console.info("SQLite database was already closed.");
    }
};