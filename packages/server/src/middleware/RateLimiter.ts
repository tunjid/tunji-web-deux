import { RateLimiterMongo, RateLimiterStoreAbstract } from 'rate-limiter-flexible';
import { Connection } from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { serverMessage } from '@tunji-web/server/src/controllers/Common';

const maxConsecutiveFailsByUsername = 3;

export interface RateLimiter {
    generalLimiter: (req: Request, res: Response, next: NextFunction) => void;
    signInLimiterStore: RateLimiterStoreAbstract;
    maxConsecutiveFailsByUsername: number;
}

const createRateLimiter: (connection: Connection) => RateLimiter = (connection) => {
    const defaultLimiter = new RateLimiterMongo({
        storeClient: connection,
        keyPrefix: 'default-rate-limiter',
        points: 3, // 3 requests
        duration: 60 * 5, // per 5 minutes by IP
    });

    const limiterConsecutiveFailsByUsername = new RateLimiterMongo({
        storeClient: connection,
        keyPrefix: 'username-sign-in-rate-limiter',
        points: maxConsecutiveFailsByUsername,
        duration: 60 * 60 * 24 * 2, // Store for 2 days since first fail
        blockDuration: 60 * 60 * 24 * 7 * 2, // Block for 2 weeks
    });

    return ({
        generalLimiter: (req: Request, res: Response, next: NextFunction) =>
            defaultLimiter.consume(req.ip)
                .then(() => next())
                .catch(() => serverMessage(res, {
                        statusCode: 429,
                        message: 'Too many requests, please try again later.'
                    }
                )),
        signInLimiterStore: limiterConsecutiveFailsByUsername,
        maxConsecutiveFailsByUsername,
    });
};

export default createRateLimiter;
