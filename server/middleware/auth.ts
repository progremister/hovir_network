import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

interface IRequest extends Request {
  user: string | JwtPayload;
}

const verifyToken = async (
  req: IRequest,
  resp: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization");
  if (!token) {
    return resp.status(403).json({ message: "Access denied!" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimStart();
  }

  const verified = jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as Secret
  );
  req.user = verified;
  next();
};

//middleware wrapper for verifyJWT
const verifyJWTMiddleware = (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  verifyToken(req as IRequest, resp, next);
};

export default verifyJWTMiddleware;
