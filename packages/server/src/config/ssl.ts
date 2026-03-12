import { readFileSync } from 'fs';
import { join } from 'path';

let options: { key?: Buffer; cert?: Buffer } = {};
try {
    const key = readFileSync(join(__dirname, '../../../', 'domain.key'));
    const cert = readFileSync(join(__dirname, '../../../', 'domain.crt'));
    options = { key, cert };
} catch {
    // No certs available — running behind a TLS-terminating proxy (e.g., Cloud Run)
}

export default { options };
