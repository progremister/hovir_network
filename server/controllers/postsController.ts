import { Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";

export const createPost = async (req: Request, resp: Response) => {
  const { userId, description, picturePath } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return resp.status(404).json({ message: "User not found!" });
  }
  const newPost = new Post({
    userId,
    username: user.username,
    location: user.location,
    description,
    userPicturePath: user.picturePath,
    picturePath,
    likes: {},
    comments: [],
  });
  await newPost.save();

  const posts = await Post.find();
  resp.status(201).json(posts);
};

export const getFeedPosts = async (req: Request, resp: Response) => {
  const posts = await Post.find();
  resp.status(200).json(posts);
};

export const getUserPosts = async (req: Request, resp: Response) => {
  const { userId } = req.params;
  const post = await Post.find({ userId });
  resp.status(200).json(post);
};

export const likePost = async (req: Request, resp: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById(id);
  if (!post) {
    return resp.status(404).json({ message: "Post not found!" });
  }
  const isLiked = post.likes.get(userId);

  isLiked ? post.likes.delete(userId) : post.likes.set(userId, true);

  const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });

  resp.status(200).json(updatedPost);
};
