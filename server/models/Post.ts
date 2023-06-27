import mongoose from "mongoose";

export interface IPostSchema {
    _id: string;
    id?: string;
    userId: string;
    username: string;
    location: string;
    description: string;
    picturePath: string;
    userPicturePath: string;
    likes: Map<string, boolean>;
    comments: any;
}

const postSchema = new mongoose.Schema<IPostSchema>(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;