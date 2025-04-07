import passport from 'passport';
import { User, UserDocument } from '../models/UserSchema';
import localStrategy from './strategies/local';

const passportConfiguration = () => {
    passport.serializeUser<string>((user, done: (error: any, misc: any) => void) => {
        done(null, user.id);
    });

    passport.deserializeUser<string>(async (userId, done) => {
        try {
            const user = await User.findById(userId);
            if (user) {
                done(null, { ...user.toJSON(), id: user._id });
            } else {
                done('User not found', false);
            }
        } catch (error) {
            done(error, false);
        }
    });

    localStrategy();
};

export default passportConfiguration;
