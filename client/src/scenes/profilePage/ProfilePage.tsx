import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../../components/Navbar";
import UserWidget from "../widgets/UserWidget";
import PostsWidget from "../widgets/PostsWidget";
import ConnectsListWidget from "../widgets/ConnectsListWidget";
import { IState, IUser } from "../../constants";

const ProfilePage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const { userId } = useParams();
  const token = useSelector((state: IState) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:800px)");

  const getUser = async () => {
    const response = await fetch(`https://hovir-server.vercel.app/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data: IUser = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        p="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={userId!} picturePath={user.picturePath} />
          <Box>
            {user.connects.length > 0 && (
              <>
                <Box m="2rem 0" />
                <ConnectsListWidget userId={userId!} />
              </>
            )}
          </Box>
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <PostsWidget userId={userId!} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
