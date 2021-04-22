import passport from "passport";
import { User, UserDocument } from "../models/UserSchema";
import localStrategy from "./strategies/local";

export default function () {
    passport.serializeUser<any>((user, done: (error: any, userId: any) => void) => {
        done(null, user);
    });

    passport.deserializeUser<any>((userId, done) => {
        User.findById(userId, (err: any, user: UserDocument) => {
            done(err, user.id);
        });
    });

    localStrategy();
}
