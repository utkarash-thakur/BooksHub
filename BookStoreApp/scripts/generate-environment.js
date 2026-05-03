const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const apiUrl = process.env.API_URL || 'http://localhost:8080';
const secretKey = process.env.SECRET_KEY || 'default_secret_key_please_change';

const environmentFileContent = (production) => `export const environment = {
  production: ${production},
  apiUrl: ${JSON.stringify(apiUrl)},
  secretKey: ${JSON.stringify(secretKey)}
};
`;

const envDir = path.resolve(__dirname, '../src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

fs.writeFileSync(path.join(envDir, 'environment.ts'), environmentFileContent(false), 'utf8');
fs.writeFileSync(path.join(envDir, 'environment.prod.ts'), environmentFileContent(true), 'utf8');

console.log('Generated environment files from .env');
