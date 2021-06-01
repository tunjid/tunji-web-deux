import ExpressApp, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import helmet from 'helmet';
import mongoose from 'mongoose';
import crypto from 'crypto';
import bluebird from 'bluebird';
import config from './config';

import session from './session';
import userRouter from '../routes/UserRouter';
import archiveRouter from '../routes/ArchiveRouter';
import reactRouter from '../routes/ReactRouter';
import errorMiddleware from '../middleware/ErrorMiddleware';
import createRateLimiter from '../middleware/RateLimiter';
import HttpException from '../utilities/HttpException';
import createUserController from '../controllers/UserController';

import { Article } from '../models/ArticleSchema';
import { Project } from '../models/ProjectSchema';
import { Talk } from '../models/TalkSchema';

const App: () => Express = () => {
    // Initialize Express app
    const app: Express = ExpressApp();

    mongoose.Promise = bluebird;
    mongoose.connect(config.mongoUrl, config.mongooseOptions).then(
        () => {
            return;
        },
    ).catch(err => {
        console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
        // process.exit();
    });

    const rateLimiter = createRateLimiter(mongoose.connection);
    const userController = createUserController(rateLimiter);

    // Set the static files location
    app.use(ExpressApp.static(path.join(__dirname, '../../client/public'), {index: false}));

    app.use(cors({
        credentials: true,
        preflightContinue: true,
        origin: (origin, callback) => callback(null, config.corsAllowedOrigins),
    }));

    if (config.env === 'production') app.use(compress());
    else app.use(morgan('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.all('/.well-known/acme-challenge/jHTByRi03P8lmzpHst99bQ7cXTmTyA6Jt4IFayowKUY', (req, res) => {
        res.sendFile(path.join(__dirname, '../../../', 'cert-renewal'));
    });

    app.use((req, res, next) => {
        const serverReduxStateNonce = crypto.randomBytes(16).toString('hex');
        req.serverReduxStateNonce = serverReduxStateNonce;

        const cspMiddleware = helmet({
            contentSecurityPolicy: {
                directives: {
                    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                    'img-src': config.corsImageSources,
                    'connect-src': config.corsConnectSources,
                    'script-src': [...config.corsScriptSources, `'nonce-${serverReduxStateNonce}'`],
                    'frame-src': config.corsFrameSources,
                },
            }
        });
        cspMiddleware(req, res, next);
    });
    // Session and passport initialization
    app.use(session);
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req: Request, res: Response, next: NextFunction) => {
        const schema = (req.headers['x-forwarded-proto'] || '').toString().toLowerCase();
        if (req.secure || schema === 'https' || req.path.indexOf('.well-known') !== -1) next();
        else res.redirect('https://' + req.headers.host + req.url);
    });

    app.use(cookieParser());

// Route mapping
    userRouter(app, userController);
    archiveRouter(app, Article, userController);
    archiveRouter(app, Project, userController);
    archiveRouter(app, Talk, userController);
    reactRouter(app);

// catch 404 and forward to error handler
    app.use((req: Request, res: Response, next: NextFunction) => {
        next(new HttpException(404, 'Not found'));
    });

    // app.use((err, req, res) => {
    //     res.status(err.status || 500);
    //     res.render('error', {message: err.message, error: config.serverEnvironment === 'development' ? err : {}});
    // });

    app.use(errorMiddleware);

    return app;
};

export default App;