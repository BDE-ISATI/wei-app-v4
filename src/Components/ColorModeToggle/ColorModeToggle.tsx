import React from "react";
import { ColorModeContext } from "../../App";
import { IconButton, useTheme } from "@mui/material";
import { Brightness3, Brightness7 } from "@mui/icons-material";

const ColorModeToggle = () => {
  const colorMode = React.useContext(ColorModeContext);
  const theme = useTheme();
  return (
    <IconButton
      sx={{ ml: 1, color: theme.palette.text.primary }}
      onClick={colorMode.toggleColorMode}
    >
      {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness3 />}
    </IconButton>
  );
};

export default ColorModeToggle;
