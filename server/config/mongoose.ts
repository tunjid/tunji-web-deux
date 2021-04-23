import config from './config';
import mongoose from 'mongoose';
import bluebird from 'bluebird';

export default function () {
    mongoose.Promise = bluebird;
    mongoose.connect(config.mongoUrl, config.mongooseOptions).then();

    // import('../models/UserSchema');
    // import('../models/BlogPostSchema');
    // import('../models/ProjectSchema');
    // import('../models/TalkSchema');
}
