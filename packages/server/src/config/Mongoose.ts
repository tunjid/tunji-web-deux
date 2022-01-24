import mongoose, { Connection } from 'mongoose';
import bluebird from 'bluebird';
import config from './config';


const mongooseConnection: () => Promise<Connection> = () => {
    return new Promise((resolve) => {
        mongoose.Promise = bluebird;
        mongoose.connect(config.mongoUrl, config.mongooseOptions)
            .then(mongoose => resolve(mongoose.connection))
            .catch(err => {
                console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
                // process.exit();
            });
    });
};

export default mongooseConnection;
