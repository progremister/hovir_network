import mongoose from "mongoose";

interface IUserSchema {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  picturePath: string;
  friends: any;
  location: string;
  occupation: string;
  followers: number;
  impressions: number;
}

const UserSchema = new mongoose.Schema<IUserSchema>(
  {
    firstname: {
      type: String,
      require: true,
      min: 2,
      max: 50,
    },
    lastname: {
      type: String,
      required: true,
      min: 2,
      max: 50,
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
    followers: Number,
    impressions: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;