import React from "react";
import Iframe from "react-iframe";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ImageIcon from "@mui/icons-material/Image";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { KNOWN_LINKS } from "../AssistantRuleBook";

const AssistantVideoResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();

  const processUrl = useSelector((state) => state.assistant.processUrl);
  const input_url_type = useSelector((state) => state.assistant.inputUrlType);

  const useIframe = () => {
    switch (input_url_type) {
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
    switch (input_url_type) {
      default:
        return false;
    }
  };

  const preprocessLinkForEmbed = (processUrl) => {
    let embedURL = processUrl;
    let stringToMatch = "";
    let positionOne = 0;

    // Don't embed blob links, they are url for cached in-memory video
    if (embedURL.startsWith("blob:")) {
      return null;
    }

    let positionTwo;

    switch (input_url_type) {
      case KNOWN_LINKS.YOUTUBE:
        if (!embedURL.includes("/embed/")) {
          let ids = embedURL.match("(?<=v=|youtu.be/)([a-zA-Z0-9_-]+)[&|?]?");
          if (ids) {
            embedURL = "http://www.youtube.com/embed/" + ids[0];
          }
        }
        break;
      case KNOWN_LINKS.YOUTUBESHORTS:
      case KNOWN_LINKS.VK:
        embedURL = null; // Null as youtube shorts and vk do not support embedding
        break;
      case KNOWN_LINKS.VIMEO:
        stringToMatch = "vimeo.com/";
        positionOne = processUrl.indexOf(stringToMatch);
        positionTwo = positionOne + stringToMatch.length;
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
      case KNOWN_LINKS.TIKTOK:
        embedURL = null;
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
      <CardMedia data-testid="assistant-media-video-container">
        {useIframe() && preprocessLinkForEmbed(processUrl) && (
          <div data-testid="assistant-media-video-iframe">
            <Iframe
              hidden={downloadVideoFound()}
              frameBorder="0"
              url={preprocessLinkForEmbed(processUrl)}
              allow="fullscreen"
              height="400"
              width="100%"
            />
          </div>
        )}
        {!useIframe() && preprocessLinkForEmbed(processUrl) && (
          <video
            hidden={downloadVideoFound()}
            src={preprocessLinkForEmbed(processUrl)}
            controls={true}
            height="400"
            width="100%"
            data-testid="assistant-media-video-tag"
          />
        )}
        {!preprocessLinkForEmbed(processUrl) && (
          <div
            style={{
              width: "100%",
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div data-testid="assistant-media-video-noembed">
              {keyword("embedding_not_supported")}
            </div>
          </div>
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
