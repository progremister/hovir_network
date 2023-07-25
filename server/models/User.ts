import mongoose from "mongoose";

export interface IUserSchema {
  _id: string;
  id?: string;
  firstName: string,
  lastName: string,
  username: string;
  email: string;
  password: string;
  picturePath?: string;
  friends: any;
  location: string;
  occupation: string;
  followers: any;
  impressions: number;
}

const UserSchema = new mongoose.Schema<IUserSchema>(
  {
    firstName: {
      type: String,
      require: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      require: true,
      min: 2,
      max: 50,
    },
    username: {
      type: String,
      require: true,
      min: 3,
      max: 15,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 16,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    followers: {
      type: Array,
      default: [],
    },
    impressions: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
