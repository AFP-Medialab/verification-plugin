import { IconButton, Tooltip } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import React, { useState } from "react";

const CopyButton = ({ str }) => {
  if (typeof str !== "string") {
    throw new Error("str parameter is not a string");
  }

  const [clicks, setClicks] = useState([]);

  const handleIconClick = (id) => {
    let result = clicks.includes(id)
      ? clicks.filter((click) => click != id)
      : [...clicks, id];
    setClicks(result);
  };

  return (
    <Tooltip title={clicks.includes(str) ? "Copied!" : "Copy link"}>
      <IconButton
        onClick={async () => {
          await navigator.clipboard.writeText(str);
          handleIconClick(str);
        }}
        aria-label="copy url"
      >
        {clicks.includes(str) ? <DoneIcon color="success" /> : <FileCopyIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
