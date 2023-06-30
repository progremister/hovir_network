import { createSlice } from "@reduxjs/toolkit";

import { IUser, IPost } from "constants";

const initialState = {
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
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("User frinds list is empty :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
        const updatedPosts = state.posts.map((post) => {
            if (post._id === action.payload.post_id) {
              return { ...post, ...action.payload.updatedPost };
            }
          });
          state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setPosts, setPost } = authSlice.actions;

export default authSlice.reducer;