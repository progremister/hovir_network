import { createSlice } from "@reduxjs/toolkit";

import { IUser, IPost, IState } from "../constants";

const initialState: IState = {
  mode: "light",
  user: null as IUser | null,
  token: null,
  posts: [] as IPost[],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        const { friends } = action.payload;
        state.user.friends = friends;
      } else {
        console.error("User frinds list is empty :(");
      }
    },
    setPosts: (state, action) => {
      const { posts } = action.payload;
      state.posts = posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
export const selectCurrentTokent = (state: IState) => state.token;