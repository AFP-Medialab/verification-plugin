import React from "react";

import { useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

/**
 * Returns a component displaying the text submitted and the detection results highlighted in colors based on the detection score.
 * @param text {string} The text submitted
 * @param chunks {MachineGeneratedTextResult} The results of the text analysis
 * @returns {Element}
 * @constructor
 */
const HighlightedText = ({ text, chunks }) => {
  const { systemMode, mode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  return (
    <Box>
      {chunks.entities.Important_Sentence.map((chunk, index) => {
        const chunkText = text.slice(chunk.indices[0], chunk.indices[1]);
        const color = resolvedMode === "light" ? chunk.rgb : chunk.rgbDark;
        const scorePercentage = Math.round(chunk.score * 100);

        return (
          <Tooltip
            key={index}
            title={`Score: ${scorePercentage}%`}
            placement="top"
            arrow
          >
            <Typography
              sx={{
                backgroundColor: `rgb(${color.join(" ")})`,
                display: "inline",
                padding: "0 2px",
                margin: "0 2px",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  filter: "brightness(1.2)",
                },
              }}
            >
              {chunkText}
            </Typography>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default HighlightedText;
