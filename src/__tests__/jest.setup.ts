import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs-extra';

const testEnvPath = path.join(__dirname, "..", "..", '.env.test');
const exists = fs.existsSync(testEnvPath);

if (!exists) throw new Error(`Test environment file not found: ${testEnvPath}`);
else dotenv.config({ path: '.env.test' });

afterAll(() => {
    jest.restoreAllMocks();
});