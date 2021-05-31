import { readFileSync } from 'fs';
import { join } from 'path';

const key = readFileSync(join(__dirname, '../../', 'domain.key'));
const cert = readFileSync(join(__dirname, '../../', 'domain.crt'));

export default {options: {key: key, cert: cert}};
