import config from './config';

import Session from 'express-session';
import MongoStore from 'connect-mongo';

export default Session({
    name: 'linesman.id',
    resave: false,
    saveUninitialized: false,
    secret: config.sessionSecret,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    },
    store:  MongoStore.create({mongoUrl: config.mongoUrl})
});
