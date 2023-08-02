import { PaletteMode } from "@mui/material";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  picturePath: string;
  location: string;
  occupation: string;
  connects: IUser[];
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
  mode: PaletteMode;
  user: IUser | null;
  token: any;
  posts: IPost[];
}

export interface Palette {
  primary: {
    dark: string;
    main: string;
    light: string;
  };
  neutral: {
    dark: string;
    main: string;
    mediumMain: string;
    medium: string;
    light: string;
  };
  background: {
    default: string;
    alt: string;
  };
}
