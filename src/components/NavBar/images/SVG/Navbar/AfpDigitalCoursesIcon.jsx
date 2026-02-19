import React from "react";

import Box from "@mui/material/Box";
import { useColorScheme } from "@mui/material/styles";

/**
 * AFP Digital Courses Icon that switches between light and dark variants
 * based on the current theme mode
 */
const AfpDigitalCoursesIcon = (props) => {
  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // Use light logo for light mode, dark logo for dark mode
  // If mode is 'system', it will resolve to either 'light' or 'dark'
  const logoSrc =
    resolvedMode === "dark"
      ? "/img/afp_digital_courses_dark.svg"
      : "/img/afp_digital_courses_light.svg";

  return (
    <Box
      sx={{
        marginInlineStart: -1,
        width: "200px",
        height: "50px",
        display: "block",
        ...props.sx,
      }}
    >
      <img
        src={logoSrc}
        alt="AFP Digital Courses"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </Box>
  );
};

export default AfpDigitalCoursesIcon;
