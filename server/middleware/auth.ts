import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret, VerifyErrors } from "jsonwebtoken";

export interface IRequest extends Request {
  user: string | JwtPayload;
}

const verifyToken = (req: IRequest, resp: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.toString().startsWith("Bearer ")) {
    return resp.status(401).json({ message: "Unauthorized!" });
  }

  const token = authHeader.toString().split(" ")[1];

  const verified = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as Secret,
    async (err: VerifyErrors | null, decoded: any ) => {
      if (err) {
        return resp.status(403).json({ message: "Forbidden!" });
      }

      req.user = decoded._id;
      next();
    }
  );
};

const verifyJWTMiddleware = (req: Request, resp: Response, next: NextFunction) => {
  verifyToken(req as IRequest, resp, next);
};

export default verifyJWTMiddleware;
