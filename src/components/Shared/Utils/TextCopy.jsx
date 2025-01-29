import React, { useState } from "react";
import FileCopyOutlined from "@mui/icons-material/FileCopy";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

export const TextCopy = ({ text, index, type }) => {
  const keyword = i18nLoadNamespace("components/Shared/utils");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState(0);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Tooltip
      open={tooltipIndex === index && tooltipOpen}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={keyword("tooltip_copy")}
    >
      {type === "BUTTON" ? (
        <Button
          variant="outlined"
          color="primary"
          size={"large"}
          fullWidth
          onClick={() => {
            setTooltipIndex(index);
            setTooltipOpen(true);
            copyText(text);
            setTimeout(() => {
              setTooltipOpen(false);
            }, 1000);
          }}
        >
          <FileCopyOutlined style={{ marginRight: "10px" }} />
          {keyword("copy_to_clipboard")}
        </Button>
      ) : (
        <IconButton
          sx={{
            "&:hover": {
              backgroundColor: "inherit",
            },
          }}
          onClick={() => {
            copyText(text);
            setTooltipIndex(index);
            setTooltipOpen(true);
            setTimeout(() => {
              setTooltipOpen(false);
            }, 1000);
          }}
        >
          <FileCopyOutlined color={"primary"} />
        </IconButton>
      )}
    </Tooltip>
  );
};
