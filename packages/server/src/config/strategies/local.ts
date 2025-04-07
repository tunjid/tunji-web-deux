import passport from 'passport';
import { Strategy, VerifyFunction } from 'passport-local';
import { User } from '../../models/UserSchema';

export default function (): void {
    const verifyFunction: VerifyFunction = async (username, password, done) => {
        try {
            const user = await User.findOne({ username });

            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }

            if (!user.authenticate(password)) {
                return done(null, false, { message: 'Invalid password' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    };

    passport.use(new Strategy(verifyFunction));
}