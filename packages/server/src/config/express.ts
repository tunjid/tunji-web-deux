import ExpressApp, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import helmet from 'helmet';
import { Connection } from 'mongoose';
import crypto from 'crypto';
import config from './config';

import session from './session';
import userRouter from '../routes/UserRouter';
import archiveRouter from '../routes/ArchiveRouter';
import archiveFileRouter from '../routes/ArchiveFileRouter';
import changeListRouter from '../routes/ChangeListRouter';
import reactRouter from '../routes/ReactRouter';
import errorMiddleware from '../middleware/ErrorMiddleware';
import createRateLimiter from '../middleware/RateLimiter';
import HttpException from '../utilities/HttpException';
import createUserController from '../controllers/UserController';

import { Article } from '../models/ArticleSchema';
import { Project } from '../models/ProjectSchema';
import { Talk } from '../models/TalkSchema';

const app: (connection: Connection) => Express = (connection) => {
    // Initialize Express app
    const expressServer: Express = ExpressApp();

    const rateLimiter = createRateLimiter(connection);
    const userController = createUserController(rateLimiter);

    // Set the static files location
    expressServer.use(ExpressApp.static(path.join(__dirname, '../../client/public'), {index: false}));

    expressServer.use(cors({
        credentials: true,
        preflightContinue: true,
        origin: (origin, callback) => callback(null, config.corsAllowedOrigins),
    }));

    if (config.env === 'production') expressServer.use(compress());
    else expressServer.use(morgan('dev'));

    expressServer.use(bodyParser.json());
    expressServer.use(bodyParser.urlencoded({extended: true}));

    expressServer.all('/.well-known/acme-challenge/jHTByRi03P8lmzpHst99bQ7cXTmTyA6Jt4IFayowKUY', (req, res) => {
        res.sendFile(path.join(__dirname, '../../../', 'cert-renewal'));
    });

    expressServer.use((req, res, next) => {
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
            },
            crossOriginEmbedderPolicy: false
        });
        cspMiddleware(req, res, next);
    });
    // Session and passport initialization
    expressServer.use(session);
    expressServer.use(passport.initialize());
    expressServer.use(passport.session());
    expressServer.use((req: Request, res: Response, next: NextFunction) => {
        const schema = (req.headers['x-forwarded-proto'] || '').toString().toLowerCase();
        if (req.secure || schema === 'https' || req.path.indexOf('.well-known') !== -1) next();
        else res.redirect('https://' + req.headers.host + req.url);
    });

    expressServer.use(cookieParser());

// Route mapping
    changeListRouter(expressServer);
    userRouter(expressServer, userController);
    archiveRouter(expressServer, Article, userController);
    archiveRouter(expressServer, Project, userController);
    archiveRouter(expressServer, Talk, userController);
    archiveFileRouter(expressServer, Article, userController);
    archiveFileRouter(expressServer, Project, userController);
    archiveFileRouter(expressServer, Talk, userController);
    reactRouter(expressServer);

// catch 404 and forward to error handler
    expressServer.use((req: Request, res: Response, next: NextFunction) => {
        next(new HttpException(404, 'Not found'));
    });

    // app.use((err, req, res) => {
    //     res.status(err.status || 500);
    //     res.render('error', {message: err.message, error: config.serverEnvironment === 'development' ? err : {}});
    // });

    expressServer.use(errorMiddleware);

    return expressServer;
};

export default app;
