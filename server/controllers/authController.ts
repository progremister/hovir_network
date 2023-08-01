import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, Secret, VerifyCallback, VerifyErrors } from "jsonwebtoken";
import User, { IUserSchema } from "../models/User";

/**
 * @desc Registration
 * @route POST /auth/register
 * @access Public
 */
export const register = async (req: Request, resp: Response) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    picturePath,
    friends,
    location,
    occupation,
    followers
  }: IUserSchema = req.body;
  if (!username || !firstName || !lastName || !password || !email) {
    return resp.status(400).json({ message: "All fields are required!" });
  }

  const duplicate = await User.findOne({ username })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return resp.status(409).json({ message: "Such username is already used!" });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    picturePath,
    friends,
    location,
    occupation,
    followers
  });

  const savedUser = await newUser.save();
  if (newUser) {
    resp.status(201).json(savedUser);
  } else {
    resp.status(400).json({ message: "Invalid user data receivevd!" });
  }
};

/**
 * @desc Login
 * @route POST /auth/login
 * @access Public
 */
/* LOGGING IN */
export const login = async (req: Request, resp: Response) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return resp.status(400).json({ message: "All fields are required!" });
  }

  const user = await User.findOne({ email: email }).exec();
  if (!user) return resp.status(400).json({ message: "User does not exist. " });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return resp.status(409).json({ messge: "Invalid credentials. " });

  const token = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: "1h",
      algorithm: "HS256"
    }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: "1d",
      algorithm: "HS256"
    },
  );

  resp.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000
  });

  resp.status(200).json({ token, user });
};

/**
 * @desc Refresh
 * @route POST /auth/refresh
 * @access Public
 */
export const refresh = (req: Request, resp: Response) => {
  const cookies = req.cookies;
  if(!cookies?.jwt) {
    return resp.status(401).json({ message: 'Unauthorized.'});
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as Secret,
    async (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        return resp.status(403).json({ message: "Forbidden!" });
      }

      const user = await User.findOne({ username: decoded.username });

      if (!user) {
        return resp.status(401).json({ message: "Unauthorized!" });
      }

      const accessToken = jwt.sign(
        {
          id: user._id
        },
        process.env.ACCESS_TOKEN_SECRET as Secret,
        { 
          expiresIn: "15m"
         }
      );

      resp.json({ accessToken });
    }
  );
}

/**
 * @desc Logout
 * @route POST /auth/logout
 * @access Public
 */
export const logout = (req: Request, resp: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return resp.sendStatus(204);
  }

  resp.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  resp.json({ message: "Cookies cleared." });
};
