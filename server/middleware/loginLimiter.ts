import { Request, Response, NextFunction } from 'express';
import rateLimit, { Options } from 'express-rate-limit';
import { logEvents } from './logger';

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, //a minute
    max: 5, //max login requests per window
    message: {
        message: 'Too many login attempts from this IP! Please try again after a minute pause.'
    },
    handler: (req: Request, resp: Response, next: NextFunction, options: Options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLog.log');
        resp.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false //disable the 'X-RateLimit-*'
});

export default loginLimiter;