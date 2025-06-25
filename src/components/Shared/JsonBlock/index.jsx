import React from "react";

import { useColorScheme } from "@mui/material";
import Typography from "@mui/material/Typography";

/**
 * A presentational component that renders JSON content in a styled, scrollable block.
 * It uses the current MUI color scheme to adjust background color for dark/light modes.
 *
 * @component
 * @param {string} children - The stringified JSON content to display.
 * @returns {JSX.Element} A styled block with the JSON content.
 */
const JsonBlock = ({ children }) => {
  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  return (
    <Typography
      component="pre"
      sx={{
        backgroundColor: resolvedMode === "dark" ? "#1e1e1e" : "#f5f5f5",
        padding: 2,
        borderRadius: 2,
        overflowX: "auto",
        fontFamily: "monospace",
        flexGrow: 1,
        marginRight: 2,
      }}
    >
      {children}
    </Typography>
  );
};

export default JsonBlock;
