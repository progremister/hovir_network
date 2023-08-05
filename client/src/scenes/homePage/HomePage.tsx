import { Box, useMediaQuery } from "@mui/material";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";

import { IState } from "../../constants";
import UserWidget from "../widgets/UserWidget";
import NewPostWidget from "../widgets/NewPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 850px)");
  const { _id, picturePath } = useSelector((state: IState) => state.user!);

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        p="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <NewPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
