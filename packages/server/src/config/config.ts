import { readFileSync } from 'fs';
import { join } from 'path';

const configPath = process.env.CONFIG_PATH || join(__dirname, '../../../serverConfig.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

export default config;
