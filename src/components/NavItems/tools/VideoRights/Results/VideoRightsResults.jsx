import React, { useEffect, useState } from "react";
import { Paper } from "@mui/material";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Typography from "@mui/material/Typography";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import Divider from "@mui/material/Divider";
import invidLogo from "../images/InVID-logo.svg?url";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import { cleanVideoRightsState } from "../../../../../redux/actions/tools/videoRightsActions";
import { useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const VideoRightsResults = (props) => {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/VideoRights");

  const result = props.result;
  const permittedList = [];
  const prohibitedList = [];
  const requiredList = [];

  if (result.terms !== undefined)
    result.terms.map((term) => {
      const component = (
        <div>
          <Typography variant={"h6"}>{term.action}</Typography>
          <div
            className={"content"}
            dangerouslySetInnerHTML={{ __html: term.description }}
          />
        </div>
      );
      switch (term.status) {
        case "Permitted":
          permittedList.push(component);
          return null;
        case "Prohibited":
          prohibitedList.push(component);
          return null;
        case "Required":
          requiredList.push(component);
          return null;
        default:
          return null;
      }
    });

  const licenseDetails = [
    {
      title: "Permitted",
      elements: permittedList,
      icon: <CheckCircleOutlineIcon fontSize={"large"} />,
      color: classes.buttonOk,
    },
    {
      title: "Prohibited",
      elements: prohibitedList,
      icon: <BlockIcon fontSize={"large"} />,
      color: classes.buttonError,
    },
    {
      title: "Required",
      elements: requiredList,
      icon: <ErrorOutlineIcon fontSize={"large"} />,
      color: classes.buttonWarning,
    },
  ];

  return (
    <Card>
      <CardHeader
        title={keyword("cardheader_results")}
        className={classes.headerUpladedImage}
        action={
          <IconButton
            aria-label="close"
            onClick={() => dispatch(cleanVideoRightsState())}
          >
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        }
      />
      <div className={classes.root2}>
        <Typography variant={"h5"}>{"Reuse Conditions"}</Typography>
        <Box m={2} />
        {result.kind === "youTubeVideos" && result.license === "youtube" && (
          <Typography variant={"body2"}>
            {"YouTube License Summary"}
            {
              "This video is licensed under the Standard YouTube license, defined in YouTube's "
            }
            <a
              href={"https://www.youtube.com/static?template=terms"}
              rel="noopener noreferrer"
              target={"_blank"}
            >
              {"Terms of Service"}
            </a>
            {" Moreover, it is from a "}
            <a
              href={"https://support.google.com/youtube/answer/72851?hl=en"}
              rel="noopener noreferrer"
              target={"_blank"}
            >
              {"YouTube Content Partner"}
            </a>
            {", likely the content owner and potentially monetizing it."}
          </Typography>
        )}
        {result.license === "creativeCommon" && (
          <Typography variant={"body2"}>
            {"Creative Commons License Summary"}
            {
              " This video is licensed under a Creative Commons Attribution license "
            }
            <a
              href={"https://creativecommons.org/licenses/by/3.0/"}
              rel="noopener noreferrer"
              target={"_blank"}
            >
              {"(details)"}
            </a>
          </Typography>
        )}
        {result.kind === "twitterVideos" && (
          <Typography variant={"body2"}>
            {"Twitter License Summary"}
            {
              " This video is licensed under the Standard Twitter license, defined in Twitter's "
            }
            <a
              href={"https://twitter.com/tos"}
              rel="noopener noreferrer"
              target={"_blank"}
            >
              {"Terms of Service"}
            </a>
          </Typography>
        )}
        {result.kind === "facebookVideos" && (
          <Typography variant={"body2"}>
            {"Facebook License Summary"}
            {
              " This video is licensed under the Standard Facebook license, defined in Facebook's "
            }
            <a
              href={"https://www.facebook.com/legal/terms"}
              rel="noopener noreferrer"
              target={"_blank"}
            >
              {"Terms of Service"}
            </a>
          </Typography>
        )}
        <Box m={4} />
        <Divider />
        <Box m={4} />
        <Typography variant={"h5"}>
          {keyword("license_" + result.license)}
        </Typography>
        <Box m={2} />
        {licenseDetails.map((obj, index) => {
          if (obj.elements.length > 0) {
            return (
              <Paper key={index} className={classes.root} elevation={3}>
                <Button
                  variant={"contained"}
                  className={obj.color}
                  disableFocusRipple={true}
                  disableRipple={true}
                  startIcon={obj.icon}
                >
                  <Typography variant={"h6"}>{obj.title}</Typography>
                </Button>
                {obj.elements.map((div, index) => {
                  return (
                    <Box key={index} className={classes.textPaper}>
                      {div}
                    </Box>
                  );
                })}
              </Paper>
            );
          } else return null;
        })}
        <Box m={4} />
        <Divider />
        <Box m={4} />
        <Typography variant={"h5"}>{"Contact"}</Typography>
        <Box m={2} />
        <Typography variant={"body2"}>
          For other uses, it is recommended to contact the video uploader and{" "}
          <b>request permission</b>:
        </Typography>
        <div className={classes.listRoot}>
          {result.user !== undefined && (
            <Paper className={classes.listItem}>
              <Grid container wrap="nowrap" spacing={2} alignItems={"center"}>
                <Grid item>
                  {result.kind === "youTubeVideos" && (
                    <YouTubeIcon color={"primary"} fontSize={"large"} />
                  )}
                  {result.kind === "facebookVideos" && (
                    <FacebookIcon color={"primary"} fontSize={"large"} />
                  )}
                  {result.kind === "twitterVideos" && (
                    <TwitterIcon color={"primary"} fontSize={"large"} />
                  )}
                </Grid>
                <Grid item xs>
                  <a
                    href={result.user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    {result.user.name}
                  </a>
                </Grid>
              </Grid>
            </Paper>
          )}
          <Paper className={classes.listItem}>
            <Grid container wrap="nowrap" spacing={2} alignItems={"center"}>
              <Grid item>
                <Icon classes={{ root: classes.iconRoot }}>
                  <img
                    className={classes.imageIcon}
                    src={invidLogo}
                    alt={invidLogo}
                  />
                </Icon>
              </Grid>
              <Grid item xs>
                Or try:{" "}
                <a
                  href={result.RIGHTS_APP + "/" + result.id}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  InVID Rights Management Tool
                </a>
                .
              </Grid>
            </Grid>
          </Paper>
        </div>
        <Box m={4} />
        <Divider />
        <Box m={4} />
        <Typography variant={"h5"}>{"Copyright Exceptions"}</Typography>
        <Box m={2} />
        <Typography variant={"body2"}>
          <b>Exceptionally</b>, in some jurisdictions, this video might be
          directly reused to report about
          <b>current events</b> under <b>copyright exceptions</b> like
          <a
            href="http://copyrightexceptions.eu/#Art. 5.3(c)"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b> use by the press</b>
          </a>{" "}
          or
          <a
            href="http://infojustice.org/wp-content/uploads/2015/03/fair-use-handbook-march-2015.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b> fair user/fair dealing</b>
          </a>
          . This reuse is under your or your organization sole responsibility
          and, in any case, proper <b>attribution</b> should be provided.
        </Typography>
        <Box m={4} />
        <Divider />
        <Box m={4} />
        <Typography variant={"h5"}>{"How to Give Attribution"}</Typography>
        <Box m={2} />
        <Typography variant={"body2"}>{result.attribution}</Typography>
      </div>
    </Card>
  );
};
export default VideoRightsResults;
