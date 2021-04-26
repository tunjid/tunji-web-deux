import config from './config/config';
process.env.NODE_ENV = config.serverEnvironment;

import express from './config/express';
import passportConfiguration from './config/passportConfiguraton';

const app = express();
passportConfiguration();

app.set('port', 8080);

export default app;
