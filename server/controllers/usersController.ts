import User, { IUserSchema } from "../models/user";
import express, { Request, Response } from "express";

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
 * @desc Get User Friends
 * @route GET /:id/friends
 * @access Private
 */
export const getUserFriends = async (req: Request, resp: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return resp.status(404).json({ message: "User not found!" });
  }

  const friends: IUserSchema[] = await Promise.all(
    user.friends.map((id: string) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, username, occupation, location, picturePath, friends }) => {
      return { _id, username, occupation, location, picturePath, friends };
    }
  );
  resp.status(200).json(formattedFriends);
};

/**
 * @desc Add/Remove Friend
 * @route PATCH /:id/friendId
 * @access Private
 */
export const manageFriend = async (req: Request, resp: Response) => {
  const { id, friendId } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendId);
  if (!user || !friend) {
    return resp.status(404).json({ message: "User not found!" });
  }

  if (user.friends.includes(friend)) {
    user.friends = user.friends.filter((id: string) => id !== friendId);
    friend.friends = friend.friends.filter((id: string) => id !== id);
  } else {
    user.friends.push(friendId);
    friend.friends.push(id);
  }

  await user.save();
  await friend.save();

  const friends: IUserSchema[] = await Promise.all(
    user.friends.map((id: string) => User.findById(id))
  );

  const formattedFriends = friends.map(
    ({ _id, username, occupation, location, picturePath, friends }) => {
      return { _id, username, occupation, location, picturePath, friends };
    }
  );

  resp.status(200).json(formattedFriends);
};
