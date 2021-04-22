process.env.NODE_ENV = require('./config/config').serverEnvironment;

import express from './config/express';
import passport from './config/passport';

const app = express();
passport();

app.set('port', 8080);

export default app;
