import passport from 'passport';
import { Strategy, VerifyFunction } from 'passport-local';
import { User, UserDocument } from '../../models/UserSchema';

export default function (): void {

    const verifyFunction: VerifyFunction = (username: string, password: string, done) => {
        User.findOne(
            {username: username},
            (error: any, user: UserDocument | null) => {

                if (error) return done(error);

                if (!user) return done(null, false, {
                    message: 'Unknown user'
                });

                if (!user.authenticate(password)) return done(null, false, {
                    message: 'Invalid password'
                });

                return done(null, user);
            });
    };

    passport.use(new Strategy(verifyFunction));
}
