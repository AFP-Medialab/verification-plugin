import React from "react";
import { useSelector } from "react-redux";

import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Iframe from "react-iframe";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { KNOWN_LINKS } from "../AssistantRuleBook";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantVideoResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();

  const processUrl = useSelector((state) => state.assistant.processUrl);
  const process_url_type = useSelector(
    (state) => state.assistant.processUrlType,
  );
  const input_url_type = useSelector((state) => state.assistant.inputUrlType);

  const useIframe = () => {
    switch (process_url_type) {
      case KNOWN_LINKS.YOUTUBE:
      case KNOWN_LINKS.VIMEO:
      case KNOWN_LINKS.DAILYMOTION:
      case KNOWN_LINKS.LIVELEAK:
        return true;
      default:
        return false;
    }
  };

  const downloadVideoFound = () => {
    return input_url_type === KNOWN_LINKS.INSTAGRAM;
  };

  const preprocessLinkForEmbed = (processUrl) => {
    let embedURL = processUrl;
    let stringToMatch = "";
    let positionOne = 0;

    switch (process_url_type) {
      case KNOWN_LINKS.YOUTUBE:
        if (!embedURL.includes("/embed/")) {
          let ids = embedURL.match("(?<=v=|youtu.be/)([a-zA-Z0-9_-]+)[&|?]?");
          if (ids) {
            embedURL = "http://www.youtube.com/embed/" + ids[0];
          }
        }
        break;
      case KNOWN_LINKS.VIMEO:
        stringToMatch = "vimeo.com/";
        positionOne = processUrl.indexOf(stringToMatch);
        var positionTwo = positionOne + stringToMatch.length;
        embedURL =
          embedURL.slice(0, positionOne) +
          "player." +
          embedURL.slice(positionOne, positionTwo) +
          "video/" +
          embedURL.slice(positionTwo);
        break;
      case KNOWN_LINKS.DAILYMOTION:
        stringToMatch = "dailymotion.com/";
        positionOne = processUrl.indexOf(stringToMatch) + stringToMatch.length;
        embedURL =
          embedURL.slice(0, positionOne) +
          "embed/" +
          embedURL.slice(positionOne);
        break;
      default:
        return embedURL;
    }
    return embedURL;
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(processUrl);
  };

  return (
    <Card variant={"outlined"}>
      <CardMedia>
        {useIframe() ? (
          <Iframe
            hidden={downloadVideoFound()}
            frameBorder="0"
            url={preprocessLinkForEmbed(processUrl)}
            allow="fullscreen"
            height="400"
            width="100%"
          />
        ) : (
          <video
            hidden={downloadVideoFound()}
            src={preprocessLinkForEmbed(processUrl)}
            controls={true}
            height="400"
            width="100%"
          />
        )}
      </CardMedia>
      <CardMedia hidden={!downloadVideoFound()}>
        <Typography
          variant={"h4"}
          align={"center"}
          hidden={!downloadVideoFound()}
        >
          {keyword("download_video")}
        </Typography>
      </CardMedia>

      <CardActions>
        <ImageIcon color={"action"} />
        <Link
          className={classes.longText}
          href={processUrl}
          color={"textSecondary"}
          variant={"subtitle2"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {processUrl.length > 60
            ? processUrl.substring(0, 60) + "..."
            : processUrl}
        </Link>
        <Tooltip title={keyword("copy_link")}>
          <IconButton
            className={classes.assistantIconLeft}
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
export default AssistantVideoResult;
