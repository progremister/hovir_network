import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPosts } from "../../state";
import PostWidget from "./PostWidget";
import { IPost, IState } from "../../constants";

type PostsWidgetProps = { userId: string; isProfile?: boolean };

const PostsWidget = ({ userId, isProfile = false }: PostsWidgetProps) => {
  const dispatch = useDispatch();
  const posts = useSelector((state: IState) => state.posts);
  const token = useSelector((state: IState) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:3030/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: IPost = await response.json();
    dispatch(setPosts({ posts: data }));
  };
  
  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3030/posts/${userId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };
  

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {Array.from(posts).reverse().map(
        ({
          _id,
          userId,
          username,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            username={username}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
