import passport from 'passport';
import { Strategy, VerifyFunction } from 'passport-local';
import { User, UserDocument } from '../../models/UserSchema';

export default function () {

    const verifyFunction : VerifyFunction = (username: string, password: string, done) => {
        User.findOne({
                username: username
            },
            function (error: any, user: UserDocument | null) {

                if (error) {
                    return done(error);
                }

                if (!user) {
                    return done(null, false, {
                        message: 'Unkown user'
                    });
                }

                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }

                return done(null, user.id);
            });
    }

    passport.use(new Strategy(verifyFunction));
};
