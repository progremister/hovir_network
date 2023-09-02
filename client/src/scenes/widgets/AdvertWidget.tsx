import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <WidgetWrapper>
      <FlexBetween>
        <Typography variant="h5" color={dark} fontWeight="500">
          Sponsored
        </Typography>
        <Typography color={medium}>Created Ad</Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="https://hovir-server.vercel.app/assets/info4.jpeg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween>
        <Typography color={main}>ZuzBeauty</Typography>
        <Typography color={medium}>zuzbeauty.sk</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        "Discover Your Beauty, Unleash Your Glow!"
      </Typography>
    </WidgetWrapper>
  );
};

export default AdvertWidget;
