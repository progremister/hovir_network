import { PaletteMode } from "@mui/material";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  picturePath?: string;
  friends: [];
  location: string;
  occupation: string;
  followers: number;
  impressions: number;
}

export interface IPost {
  _id: string;
  userId: string;
  username: string;
  location: string;
  description: string;
  picturePath: string;
  userPicturePath: string;
  likes: Map<string, boolean>;
  comments: any;
}

export interface IState {
  mode: PaletteMode,
  user: IUser | null,
  token: null,
  posts: IPost[],
}

export interface Palette {
  primary: {
    dark: string,
    main: string,
    light: string,
  },
  neutral: {
    dark: string,
    main: string,
    mediumMain: string,
    medium: string,
    light: string,
  },
  background: {
    default: string,
    alt: string,
  }
}