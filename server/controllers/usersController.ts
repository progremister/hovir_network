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
 * @desc Get User connects
 * @route GET /:id/connects
 * @access Private
 */
export const getUserConnects = async (req: Request, resp: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return resp.status(404).json({ message: "User not found!" });
  }

  const connects: IUserSchema[] = await Promise.all(
    user.connects.map((id: string) => User.findById(id))
  );

  const formattedConnects = connects.map(
    ({ _id, firstName, lastName, username, occupation, location, picturePath, connects }) => {
      return { _id, firstName, lastName, username, occupation, location, picturePath, connects };
    }
  );
  resp.status(200).json(formattedConnects);
};

/**
 * @desc Add/Remove connect
 * @route PATCH /:id/connectId
 * @access Private
 */
export const manageConnect = async (req: Request, resp: Response) => {
  const { id, connectId } = req.params;
  const user = await User.findById(id);
  const connect = await User.findById(connectId);
  if (!user || !connect) {
    return resp.status(404).json({ message: "User not found!" });
  }

  if (user.connects.includes(connectId)) {
    user.connects = user.connects.filter((id: string) => id !== connectId);
    connect.connects = connect.connects.filter((id: string) => id !== id);
  } else {
    user.connects.push(connectId);
    connect.connects.push(id);
  }

  await user.save();
  await connect.save();

  const connects: IUserSchema[] = await Promise.all(
    user.connects.map((id: string) => User.findById(id))
  );

  const formattedconnects = connects.map(
    ({ _id, firstName, lastName, username, occupation, location, picturePath, connects }) => {
      return { _id, firstName, lastName, username, occupation, location, picturePath, connects };
    }
  );

  resp.status(200).json(formattedconnects);
};
