import React from "react";
import { useSelector } from "react-redux";

import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton } from "@mui/material";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantImageResult = () => {
  const classes = useMyStyles();

  const processUrl = useSelector((state) => state.assistant.processUrl);
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const copyUrl = () => {
    navigator.clipboard.writeText(processUrl);
  };

  return (
    <Card variant={"outlined"}>
      <CardMedia>
        <img
          crossOrigin={"anonymous"}
          src={processUrl}
          height={"100%"}
          alt={processUrl}
          width={"100%"}
        />
      </CardMedia>
      <CardActions>
        <ImageIcon color={"action"} />
        <Link
          className={classes.longText}
          href={processUrl}
          target={"_blank"}
          color={"textSecondary"}
          variant={"subtitle2"}
        >
          {processUrl.length > 60
            ? processUrl.substring(0, 60) + "..."
            : processUrl}
        </Link>
        <Tooltip title={keyword("copy_link")}>
          <IconButton
            style={{ marginLeft: "auto" }}
            onClick={() => {
              copyUrl();
            }}
          >
            <FileCopyIcon color={"action"} />
          </IconButton>
        </Tooltip>
        <Tooltip title={keyword("archive_link")}>
          <IconButton
            onClick={() => {
              window.open(
                "https://web.archive.org/save/" + processUrl,
                "_blank",
              );
            }}
          >
            <ArchiveOutlinedIcon color={"action"} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
export default AssistantImageResult;
