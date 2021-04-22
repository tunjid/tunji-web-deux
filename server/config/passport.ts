import passport from 'passport';
import { User, UserDocument } from '../models/UserSchema';

module.exports = function () {
    passport.serializeUser(function (user: UserDocument, done: (error: any, userId: string) => void) {
        done(null, user.id);
    });

    passport.deserializeUser(function (userId: string, done: (error: any, user: UserDocument | null) => void) {
        User.findOne(
            {_id: userId},
            '-password -salt',
            done
        );
    });

    const localStrategy = require('./strategies/local.js');
    localStrategy();
};
