-- Path: src/database/SQL/schema.sql

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS ai_model;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;

CREATE TABLE IF NOT EXISTS users 
(
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- users primary key
    user_id TEXT NOT NULL,                -- User ID
    name TEXT NOT NULL,                   -- User name
    creation_date INTEGER NOT NULL,       -- User creation timestamp
);

CREATE TABLE IF NOT EXISTS ai_model 
(
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- ai_model primary key
    model_id TEXT NOT NULL,               -- Model ID
    primer TEXT NOT NULL,                 -- Model primer prompt
    name TEXT NOT NULL,                   -- Model name
    description TEXT NOT NULL,            -- Model description
    creation_date INTEGER NOT NULL        -- Model creation timestamp
);

CREATE TABLE IF NOT EXISTS messages
(
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- messages primary key
    message_id TEXT NOT NULL,             -- Message ID
    message TEXT NOT NULL,                -- Message contents
    timestamp INTEGER NOT NULL            -- Message timestamp
);

CREATE TABLE IF NOT EXISTS conversations
(
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- conversations primary key
    conversation_id TEXT NOT NULL,        -- Conversation ID
    sender TEXT NOT NULL,                 -- Sender name
    creation_date INTEGER NOT NULL,       -- Conversation creation timestamp

    message_id INTEGER NOT NULL,          -- Foreign key to messages table
        FOREIGN KEY (message_id)
        REFERENCES messages (id),

    user_id INTEGER NOT NULL              -- Foreign key to users table
        FOREIGN KEY (user_id) 
        REFERENCES users (id),

    model_id INTEGER NOT NULL             -- Foreign key to ai_model table
        FOREIGN KEY (model_id)
        REFERENCES ai_model (id),
);