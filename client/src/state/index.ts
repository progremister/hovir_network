import { createSlice } from "@reduxjs/toolkit";

import { IPost, IState } from "../constants";

const initialState: IState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setConnects: (state, action) => {
      if (state.user) {
        state.user.connects = action.payload.connects;
      } else {
        console.error("User connects list is empty :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post: IPost) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setConnects, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
