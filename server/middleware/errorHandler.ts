import { NextFunction, Request, Response } from 'express';
import { logEvents } from "../middleware/logger";

const errorHandler = (err: Error, req: Request, resp: Response, next: NextFunction) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}\n`, 'errorLog.log');
    console.error(err.stack);

    const status = resp.statusCode ? resp.statusCode : 500;
    resp.status(status);
    resp.json({ message: err.message, isError: true});
    next();
}

export default errorHandler;