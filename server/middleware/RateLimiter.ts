import { RateLimiterMongo, RateLimiterStoreAbstract } from 'rate-limiter-flexible';
import { Connection } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

const maxConsecutiveFailsByUsername = 3;

export interface RateLimiter {
    generalLimiter: (req: Request, res: Response, next: NextFunction) => void;
    signInLimiterStore: RateLimiterStoreAbstract
    maxConsecutiveFailsByUsername: number;
}

const rateLimiter: (connection: Connection) => RateLimiter = (connection) => {
    const defaultLimiter = new RateLimiterMongo({
        storeClient: connection,
        keyPrefix: 'default-rate-limiter',
        points: 10, // 10 requests
        duration: 1, // per 1 second by IP
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
                .catch(() => res.status(429).send('Too Many Requests')),
        signInLimiterStore: limiterConsecutiveFailsByUsername,
        maxConsecutiveFailsByUsername,
    });
};

export default rateLimiter;
