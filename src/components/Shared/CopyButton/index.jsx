import { IconButton, Tooltip } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import React, { useState } from "react";

const CopyButton = ({ strToCopy, labelBeforeCopy, labelAfterCopy }) => {
  if (typeof strToCopy !== "string") {
    throw new Error("strToCopy parameter is not a string");
  }

  if (typeof labelBeforeCopy !== "string") {
    throw new Error("labelBeforeCopy parameter is not a string");
  }

  if (typeof labelAfterCopy !== "string") {
    throw new Error("labelAfterCopy parameter is not a string");
  }

  const [clicks, setClicks] = useState([]);

  const handleIconClick = (id) => {
    let result = clicks.includes(id)
      ? clicks.filter((click) => click != id)
      : [...clicks, id];
    setClicks(result);
  };

  return (
    <Tooltip
      title={clicks.includes(strToCopy) ? labelAfterCopy : labelBeforeCopy}
    >
      <IconButton
        onClick={async () => {
          await navigator.clipboard.writeText(strToCopy);
          handleIconClick(strToCopy);
        }}
        aria-label="copy url"
      >
        {clicks.includes(strToCopy) ? (
          <DoneIcon color="success" />
        ) : (
          <FileCopyIcon />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
