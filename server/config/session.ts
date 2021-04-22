import Config from './config'

import Session from 'express-session';
import MongoStore from 'connect-mongo';

export default Session({
    name: 'linesman.id',
    resave: false,
    saveUninitialized: false,
    secret: Config.sessionSecret,
    store:  MongoStore.create({mongoUrl: Config.mongoUrl})
});
