import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { setConnects } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useNavigate } from "react-router-dom";
import { IState } from "../constants";

type ConnectProps = {
  connectId: string;
  username: string;
  subtitle: string;
  userPicturePath: string;
};

const Connect = ({ connectId, username, subtitle, userPicturePath }: ConnectProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state: IState) => state.user!);
  const token = useSelector((state: IState) => state.token);
  const connects = useSelector((state: IState) => state.user!.connects);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isConnected = connects.find((connect) => connect._id === connectId);

  const patchConnect = async () => {
    const response = await fetch(
      `http://localhost:3030/users/${_id}/${connectId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

    const data = await response.json();
    dispatch(setConnects({ connects: data}));
    console.log(isConnected);
  };

  return (
    <FlexBetween>
        <FlexBetween gap="1rem">
            <UserImage image={userPicturePath} size="50px" />
            <Box
                onClick={() => {
                    navigate(`/profile/${connectId}`);
                    navigate(0); //TODO: fix in future
                }}
            >
                <Typography
                    color={main}
                    variant="h5"
                    fontWeight="500"
                    sx={{
                        "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer"
                        }
                    }}
                >
                    {username}
                </Typography>
                <Typography color={medium} fontSize="0.75rem">
                    {subtitle}
                </Typography>
            </Box>
        </FlexBetween>
        <IconButton 
        onClick={() => patchConnect()}
        sx={{ 
            backgroundColor: primaryLight, 
            p: "0.6rem"
        }}
        >
            {isConnected ? (
                <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
                <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
        </IconButton>
    </FlexBetween>
  );
};

export default Connect;
