import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";

import WidgetWrapper from "../../components/WidgetWrapper";
import Connect from "../../components/Connect";
import { setConnects } from "../../state";
import { IState } from "../../constants";

type ConnectsListProps = { userId: string };

const ConnectsListWidget = ({ userId }: ConnectsListProps) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state: IState) => state.token);
  const connects = useSelector((state: IState) => state.user!.connects);

  const getFriends = async () => {
    const response = await fetch(
      `https://hovir-server.vercel.app/users/${userId}/connects`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    dispatch(setConnects({ connects: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Connects List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {connects.map((connect) => (
          <Connect
            key={connect._id}
            connectId={connect._id}
            username={connect.username}
            subtitle={connect.occupation}
            userPicturePath={connect.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default ConnectsListWidget;
