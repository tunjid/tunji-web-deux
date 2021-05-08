import { RateLimiterMongo } from 'rate-limiter-flexible';
import { Connection } from 'mongoose';
import { NextFunction, Request, Response } from 'express';

interface RateLimiter {
    middleware: (req: Request, res: Response, next: NextFunction) => void;
}

const rateLimiter: (connection: Connection) => RateLimiter = (connection) => {
    const limiter = new RateLimiterMongo({
        storeClient: connection,
        keyPrefix: 'middleware',
        points: 10, // 10 requests
        duration: 1, // per 1 second by IP
    });
    return ({
        middleware: (req: Request, res: Response, next: NextFunction) =>
            limiter.consume(req.ip)
                .then(() => next())
                .catch(() => res.status(429).send('Too Many Requests'))
    });
};

export default rateLimiter;
