import config from 'common';

import Session from 'express-session';
import MongoStore from 'connect-mongo';

export default Session({
    name: 'linesman.id',
    resave: false,
    saveUninitialized: false,
    secret: config.sessionSecret,
    store:  MongoStore.create({mongoUrl: config.mongoUrl})
});
