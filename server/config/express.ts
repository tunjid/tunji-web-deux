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
import bluebird from 'bluebird';

import config from './config';
import session from './session';
import userRouter from '../routes/UserRouter';
import archiveRouter from '../routes/ArchiveRouter';
import reactRouter from '../routes/ReactRouter';
import errorMiddleware from '../middleware/ErrorMiddleware';
import HttpException from '../utilities/HttpException';

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

    // Set the static files location
    app.use('/', ExpressApp.static(
        path.join(__dirname, '../../../', 'build', 'client'),
        {index: false}
    ));
    app.use('/', ExpressApp.static(
        path.join(__dirname, '../../../', 'build', 'client', 'static', 'css'),
        {index: false}
    ));
    app.use('/', ExpressApp.static(
        path.join(__dirname, '../../../', 'build', 'client', 'static', 'js'),
        {index: false}
    ));
    app.use(cors({
        credentials: true,
        preflightContinue: true,
        origin: (origin, callback) => callback(null, config.corsAllowedOrigins),
    }));

    if (config.serverEnvironment === 'production') app.use(compress());
    else app.use(morgan('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.all('/.well-known/acme-challenge/jHTByRi03P8lmzpHst99bQ7cXTmTyA6Jt4IFayowKUY', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'cert-renewal'));
    });

    // Session and passport initialization
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'img-src': config.corsImageSources,
                'connect-src': config.corsConnectSources,
                'script-src': config.corsScriptSources,
                'frame-src': config.corsFrameSources,
            },
        }
    }));
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
    userRouter(app);
    archiveRouter(app, Article);
    archiveRouter(app, Project);
    archiveRouter(app, Talk);
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
