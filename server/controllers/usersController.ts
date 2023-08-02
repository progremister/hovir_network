import User, { IUserSchema } from "../models/User";
import { Request, Response } from "express";

/**
 * @desc Get User
 * @route GET /:id/
 * @access Private
 */
export const getUser = async (req: Request, resp: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return resp.status(404).json({ message: "User not found!" });
  }
  resp.status(200).json(user);
};

/**
 * @desc Get User follows
 * @route GET /:id/follows
 * @access Private
 */
export const getUserFollows = async (req: Request, resp: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return resp.status(404).json({ message: "User not found!" });
  }

  const follows: IUserSchema[] = await Promise.all(
    user.follows.map((id: string) => User.findById(id))
  );

  const formattedFollows = follows.map(
    ({ _id, firstName, lastName, username, occupation, location, picturePath, follows }) => {
      return { _id, firstName, lastName, username, occupation, location, picturePath, follows };
    }
  );
  resp.status(200).json(formattedFollows);
};

/**
 * @desc Add/Remove follow
 * @route PATCH /:id/followId
 * @access Private
 */
export const manageFollow = async (req: Request, resp: Response) => {
  const { id, followId } = req.params;
  const user = await User.findById(id);
  const follow = await User.findById(followId);
  if (!user || !follow) {
    return resp.status(404).json({ message: "User not found!" });
  }

  if (user.follows.includes(follow)) {
    user.follows = user.follows.filter((id: string) => id !== followId);
    follow.follows = follow.follows.filter((id: string) => id !== id);
  } else {
    user.follows.push(followId);
    follow.follows.push(id);
  }

  await user.save();
  await follow.save();

  const follows: IUserSchema[] = await Promise.all(
    user.follows.map((id: string) => User.findById(id))
  );

  const formattedFollows = follows.map(
    ({ _id, firstName, lastName, username, occupation, location, picturePath, follows }) => {
      return { _id, firstName, lastName, username, occupation, location, picturePath, follows };
    }
  );

  resp.status(200).json(formattedFollows);
};
