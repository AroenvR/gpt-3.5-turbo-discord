import * as fs from 'fs-extra';

let tableName = "";

export const getFakeSqliteClient = async (primer: string) => {
    tableName = `./src/logs/conversation_${new Date()}.json`;

    await createTable(primer);
}

const createTable = async (primer: string) => {
    const tableExists = fs.existsSync(tableName);
    if (!tableExists) {
        fs.writeFileSync(tableName, JSON.stringify([{ role: "system", content: primer }], null, 4));
    }
}

export const insertMessage = async (entry: any) => {
    try {
        const jsonString = fs.readFileSync(tableName, 'utf8');
        const jsonArray = JSON.parse(jsonString);
        jsonArray.push(entry);
        const newJsonString = JSON.stringify(jsonArray);
        fs.writeFileSync(tableName, newJsonString, 'utf8');
    } catch (err) {
        console.error(err);
    }
}

export const getAllMessages = async () => {
    let messages: string[] = [];
    try {
        const jsonString = fs.readFileSync(tableName, 'utf8');
        messages = JSON.parse(jsonString);
    } catch (err) {
        console.error(err);
    }

    return messages;
}