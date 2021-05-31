import express from './config/express';
import passportConfiguration from './config/passportConfiguraton';

const app = express();
passportConfiguration();

app.set('port', 8080);

export default app;
