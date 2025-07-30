import React from "react";

import Button from "@mui/material/Button";

export const SNAButton = (clickFunction, buttonText) => {
  return (
    <Button
      variant="outlined"
      sx={{
        color: "green",
        borderColor: "green",
        backgroundColor: "transparent",
        "&:hover": {
          backgroundColor: "rgba(0, 128, 0, 0.1)",
          borderColor: "darkgreen",
        },
        overflow: "hidden",
        textOverflow: "ellipsis",
        justifyContent: "flex-start",
        textAlign: "left",
      }}
      onClick={clickFunction}
    >
      {buttonText}
    </Button>
  );
};
