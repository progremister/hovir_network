import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { IUserSchema } from '../models/User'

interface JWTRequest extends Request {
    user: string | JwtPayload
}

export const verifyToken = async (req: JWTRequest, resp: Response, next: NextFunction) => {
    let token = req.header("Authorization");
    if(!token) {
        return resp.status(403).json({ message: "Access denied!"})
    }

    if(token.startsWith("Bearer ")) {
        token = token.slice(7, token.length).trimStart();
    }

    const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as Secret);
    req.user = verified;
    next();
}