import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { logoLight, logoDark } from "../../assets";

import Form from './Form'

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(max-width: 815px)");

  const alt = theme.palette.background.alt;

  return (
    <Box
      width="100%"
      minHeight="100vh"
      style={{ backgroundColor: alt }}
      p="1rem 6%"
      textAlign="center"
    >
      <Box>
      <img 
        src={ theme.palette.mode === "light" ? logoLight : logoDark } 
        alt="logo" 
        width="20%" 
        style={{ marginTop: "3.5rem" }} />

      </Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        style={{ backgroundColor: alt }}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem"}}>
          Welcome to Hóvir Network, the platform where ideas collide and conversations thrive!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
