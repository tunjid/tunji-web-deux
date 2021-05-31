import passport from 'passport';
import { User, UserDocument } from '../models/UserSchema';
import localStrategy from './strategies/local';

const passportConfiguration = () => {
    passport.serializeUser<string>((user, done: (error: any, misc: any) => void) => {
        done(null, user.id);
    });

    passport.deserializeUser<string>((userId, done) => {
        User.findById(userId, (err: any, user: UserDocument) => {
            done(err, {...user.toJSON(), id: user._id});
        });
    });

    localStrategy();
};

export default passportConfiguration;
