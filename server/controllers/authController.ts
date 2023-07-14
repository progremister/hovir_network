import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
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
    followers: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 1000),
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
export const login = async (req: Request, resp: Response) => {
  const { email, username, password }: IUserSchema = req.body;
  if (!password || (!email && !username)) {
    return resp.status(400).json({ message: "Not enough fields provided!" });
  }
  const user = username
    ? await User.findOne({ username }).exec()
    : await User.findOne({ email }).exec();

  if (!user) {
    return resp.status(400).json({ message: "User does not exists!" });
  }

  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    return resp.status(400).json({ message: "Invalid credentials!" });
  }

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: "10m",
      algorithm: "RS256",
    }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: "1d",
      algorithm: "RS256",
    }
  );

  resp.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000, //1 day
  });
  resp.status(200).json({ accessToken });
};

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
