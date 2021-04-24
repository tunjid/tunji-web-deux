import passport from 'passport';
import { User, UserDocument } from '../models/UserSchema';
import localStrategy from './strategies/local';

export default function () {
    passport.serializeUser<string>((user, done: (error: any, misc: any) => void) => {
        done(null, user.id);
    });

    passport.deserializeUser<string>((userId, done) => {
        User.findById(userId, (err: any, user: UserDocument) => {
            done(err, {...user, id: user._id});
        });
    });

    localStrategy();
}
