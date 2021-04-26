import { User, UserDocument } from '../models/UserSchema';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { basicMessage, errorMessage, getErrorMessage } from './Common';

interface UserController {
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

const UserController: UserController = {
    create: (req, res, next) => {
        const user = new User(req.body);
        user.save(error => {
            if (error) return next(error);
            res.json(user);
        });
    },
    find: (req, res, next) => {
        User.find({}, (error, users) => {
            if (error) return next(error);
            res.json(users);
        });
    },
    get: (req, res) => {
        res.json(req.signedInUser);
    },
    put: (req, res, next) => {
        next('Unimplemented');

        // User.findByIdAndUpdate(req.signedInUser.id, req.body, (error, user) => {
        //     if (error) return next(error);
        //     res.json(user);
        // });
    },
    remove: (req, res, next) => {
        next('Unimplemented');
    },
    byId: (req, res, next, id) => {
        User.findOne({_id: id}, (error: any, user: UserDocument) => {
            if (error) return next(error);
            req.signedInUser = user;
            next();
        });
    },
    requiresLogin: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send({
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
            user.save(function (err) {
                // If an error occurs, use flash messages to report the error
                if (err) {
                    // Use the error handling method to get the error message
                    const message = getErrorMessage(err);
                    return errorMessage(res, message, 500);
                }

                // If the user was created successfully use the Passport 'login' method to login
                req.login({...user, id: user._id.toString()}, err => {
                    // If a login error occurs move to the next middleware
                    if (err) return errorMessage(res, 'Login error', 500);
                    // Redirect the user back to the main application page
                    res.json(user);
                });
            });
        } else return errorMessage(res, 'You are already signed in', 400);
    },
    signIn: (req, res, next) => {
        passport.authenticate('local', function (err, user, status) {
            if (err) {
                return next(err);
            }
            if (!user) return status
                ? errorMessage(res, status.message, 400)
                : errorMessage(res, 'User does not exist', 404);

            req.logIn(user, function (err) {
                return err ? res.json(err) : res.json(user);
            });
        })(req, res, next);
    },
    signOut: (req, res) => {
        // Use the Passport 'logout' method to logout
        req.logout();
        return basicMessage(res, 'Signed out');
    },
    session: (req, res) => {
        if (req.user) return res.json(req.user);
        return errorMessage(res, 'Not signed in', 400);
    },
};


// contact: function (req, res) {
//
//     User.findOne({username: "tunji"}, "email twoFactPass", function (error, user) {
//         if (error) {
//             return errorMessage(res, "Unable to get user");
//         }
//         else if (!user.email || !user.twoFactPass) {
//             return errorMessage(res, "User is missing required details");
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
//                     return errorMessage(res, message);
//                 }
//                 else {
//                     return errorMessage(res, "Email sent");
//                 }
//             });
//         }
//     });
// };

export default UserController;
