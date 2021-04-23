import ExpressApp, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import helmet from 'helmet';

import config from './config';
import session from './session';
import blogPostRouter from '../routes/BlogPostRouter';
import userRouter from '../routes/UserRouter';
import archiveRouter from '../routes/ArchiveRouter';
import errorMiddleware from '../middleware/ErrorMiddleware';
import HttpException from '../utilities/HttpException';

import './mongoose';

import { BlogPost } from '../models/BlogPostSchema';

export default () => {
// Initialize Express app
    const app: Express = ExpressApp();

    // Set the static files location
    app.use('/', ExpressApp.static(path.join(__dirname, '../../client')));

    if (config.serverEnvironment === 'production') app.use(compress());
    else app.use(morgan('dev'));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // Session and passport initialization
    app.use(helmet());
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
    // blogPostRouter(app);
    archiveRouter(app, BlogPost);

    app.all(
        '/*',
        (req: Request, res: Response) => res.sendfile(path.join(__dirname, '../..', 'client/build/index.html'))
    );

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

