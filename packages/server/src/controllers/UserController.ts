import { User, UserDocument } from '../models/UserSchema';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { ErrorCode, getErrorMessage, serverMessage } from './Common';
import { RateLimiter } from '../middleware/RateLimiter';

export interface UserController {
    create: (res: Request, req: Response, next: NextFunction) => void;
    get: (res: Request, req: Response, next: NextFunction) => void;
    put: (res: Request, req: Response, next: NextFunction) => void;
    remove: (res: Request, req: Response, next: NextFunction) => void;
    byId: (res: Request, req: Response, next: NextFunction, id: string) => void;
    find: (res: Request, req: Response, next: NextFunction) => void;
    session: (res: Request, req: Response, next: NextFunction) => void;
    signIn: (res: Request, req: Response, next: NextFunction) => void;
    signUp: (res: Request, req: Response, next: NextFunction) => void;
    signOut: (res: Request, req: Response, next: NextFunction) => void;
    requiresLogin: (res: Request, req: Response, next: NextFunction) => void;
}

const createUserController: (limiter: RateLimiter) => UserController = (limiter) => ({
    create: (req, res, next) => {
        const user = new User(req.body);
        user.save()
            .then(savedUser => res.json(savedUser))
            .catch(error => next(error));
    },
    find: (req, res, next) => {
        User.find({})
            .then(users => res.json(users))
            .catch(error => next(error));
    },
    get: (req, res) => {
        res.json(req.pathUser);
    },
    put: (req, res, next) => {
        next('Unimplemented');

        // User.findByIdAndUpdate(req.pathUser.id, req.body, (error, user) => {
        //     if (error) return next(error);
        //     res.json(user);
        // });
    },
    remove: (req, res, next) => {
        next('Unimplemented');
    },
    byId: (req, res, next, id) => {
        User.findOne({ _id: id })
            .then(user => {
                req.pathUser = user;
                next();
            })
            .catch(error => next(error));
    },
    requiresLogin: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send({
                code: 'no-login',
                message: 'User is not logged in'
            });
        }
        next();
    },
    signUp: (req, res) => {
        // If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
        if (!req.user) {
            // Create a new 'User' model instance
            const user = new User(req.body);

            // Set the user provider property
            user.provider = 'local';

            // Try saving the new user document
            user.save()
                .then(savedUser => {
                    // If the user was created successfully use the Passport 'login' method to login
                    req.login({ ...savedUser, id: savedUser._id.toString() }, err => {
                        // If a login error occurs move to the next middleware
                        if (err) return serverMessage(res, {
                            statusCode: 500,
                            message: 'Login error',
                        });
                        // Redirect the user back to the main application page
                        res.json(savedUser);
                    });
                })
                .catch(err => {
                    // If an error occurs, use flash messages to report the error
                    // Use the error handling method to get the error message
                    const message = getErrorMessage(err);
                    return serverMessage(res, {
                        statusCode: 500,
                        message,
                    });
                });
        } else return serverMessage(res, {
            statusCode: 400,
            message: 'You are already signed in',
        });
    },
    signIn: async (req, res, next) => {
        const username = req.body.username;
        const rlResUsername = await limiter.signInLimiterStore.get(username);

        if (rlResUsername !== null && rlResUsername.consumedPoints > limiter.maxConsecutiveFailsByUsername) {
            const retrySecs = Math.round(rlResUsername.msBeforeNext / 1000) || 1;
            res.set('Retry-After', String(retrySecs));
            return serverMessage(res, {
                errorCode: ErrorCode.RateLimited,
                statusCode: 429,
                message: 'Too Many Requests',
            });
        }

        passport.authenticate('local', async function (err, user, status) {
            if (err) {
                return next(err);
            }
            if (!user) {
                try {
                    await limiter.signInLimiterStore.consume(username);
                    return serverMessage(res, {
                        statusCode: status ? 400 : 404,
                        message: status ? status.message : 'User does not exist'
                    });
                } catch (rlRejected) {
                    if (rlRejected instanceof Error) throw rlRejected;

                    res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || '1');
                    return serverMessage(res, {
                        statusCode: 429,
                        message: 'Too Many Requests',
                    });
                }
            }

            req.logIn(user, async function (err) {
                if (err) return res.json(err);
                if (rlResUsername !== null && rlResUsername.consumedPoints > 0)
                    await limiter.signInLimiterStore.delete(username);

                return res.json(user);
            });
        })(req, res, next);
    },
    signOut: (req, res) => {
        // Use the Passport 'logout' method to logout
        req.logout();
        return serverMessage(res, { statusCode: 200, message: 'Signed out' });
    },
    session: (req, res) => {
        if (req.user) return res.json(req.user);
        return serverMessage(res, {
                errorCode: ErrorCode.NotLoggedIn,
                statusCode: 400,
                message: 'Not signed in'
            }
        );
    },
});


// contact: function (req, res) {
//
//     User.findOne({username: "tunji"}, "email twoFactPass", function (error, user) {
//         if (error) {
//             return serverMessage(res, "Unable to get user");
//         }
//         else if (!user.email || !user.twoFactPass) {
//             return serverMessage(res, "User is missing required details");
//         }
//         else {
//
//             const commentBody = req.body;
//
//             const smtpTransport = nodemailer.createTransport("SMTP", {
//                 service: "Gmail",
//                 auth: {
//                     user: user.email,
//                     pass: user.twoFactPass
//                 }
//             });
//
//             // setup e-mail data with unicode symbols
//             const mailOptions = {
//                 from: commentBody.email, // sender address
//                 to: user.email,
//                 subject: "Comment from tunjid.com", // Subject line
//                 text: commentBody.comment, // plaintext body
//                 html: "<b>From</b>" + " " +
//                     commentBody.firstName +
//                     " " +
//                     commentBody.lastName +
//                     " " +
//                     commentBody.email +
//                     "<p>" + commentBody.comment + "</p>" // html body
//             };
//
//             // send mail with defined transport object
//             smtpTransport.sendMail(mailOptions, function (error) {
//                 if (error) {
//                     const message = getErrorMessage(error);
//                     return serverMessage(res, message);
//                 }
//                 else {
//                     return serverMessage(res, "Email sent");
//                 }
//             });
//         }
//     });
// };

export default createUserController;