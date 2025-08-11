import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { WarningAmber } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import ImageGridList from "@/components/Shared/ImageGridList/ImageGridList";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import VideoGridList from "@/components/Shared/VideoGridList/VideoGridList";
import { TOOLS_CATEGORIES } from "@/constants/tools";
import {
  setProcessUrl,
  setStateExpanded,
  setWarningExpanded,
} from "@/redux/actions/tools/assistantActions";

import {
  TransHtmlDoubleLineBreak,
  TransSupportedToolsLink,
} from "../TransComponents";
import AssistantImageResult from "./AssistantImageResult";
import AssistantProcessUrlActions from "./AssistantProcessUrlActions";
import AssistantVideoResult from "./AssistantVideoResult";

const AssistantMediaResult = () => {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const stateExpanded = useSelector((state) => state.assistant.stateExpanded);

  // assistant media states
  const processUrl = useSelector((state) => state.assistant.processUrl);
  const resultProcessType = useSelector(
    (state) => state.assistant.processUrlType,
  );
  const singleMediaPresent = useSelector(
    (state) => state.assistant.singleMediaPresent,
  );
  const imageList = useSelector((state) => state.assistant.imageList);
  const videoList = useSelector((state) => state.assistant.videoList);
  const missingMedia = useSelector((state) => state.assistant.missingMedia);

  // third party topMenuItem states
  //const ocrLoading = useSelector(state=>state.assistant.ocrLoading)
  const dbkfMediaMatchLoading = useSelector(
    (state) => state.assistant.dbkfMediaMatchLoading,
  );
  const dbkfImageMatch = useSelector((state) => state.assistant.dbkfImageMatch);
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);

  const warningExpanded = useSelector(
    (state) => state.assistant.warningExpanded,
  );
  const resultIsImage = resultProcessType === TOOLS_CATEGORIES.IMAGE;

  // local control state
  // const [expandMedia, setExpandMedia] = useState(
  //   !singleMediaPresent || processUrl == null,
  // );

  // select the correct media to process, then load actions possible
  const submitMediaToProcess = (url) => {
    //setExpandMedia(false);
    let cType = null;
    if (imageList.includes(url)) {
      cType = TOOLS_CATEGORIES.IMAGE;
    } else if (videoList.includes(url)) {
      cType = TOOLS_CATEGORIES.VIDEO;
    }
    dispatch(setProcessUrl(url, cType));
  };

  const [filteredImageList, setFilteredImageList] = useState([]);

  useEffect(() => {
    const imagePromises = imageList.map((imageUrl) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = imageUrl;
        image.onload = () => {
          resolve({
            url: imageUrl,
            include: image.width > 2 || image.height > 2,
          });
        };
        image.onerror = () => {
          // We have to include it if there's an error loading as we don't have enough info to filter it out
          // Instagram seem to have some pretty aggressive security policies, so we get this there
          resolve({ url: imageUrl, include: true });
        };
      });
    });

    Promise.all(imagePromises)
      .then((imageDimensions) => {
        const filteredImages = imageDimensions
          .filter((image) => image.include)
          .map((image) => image.url);
        setFilteredImageList(filteredImages);
      })
      .catch((error) => {
        console.error("Assistant error loading images:", error);
      });
  }, [imageList]);

  return (
    <Card
      variant="outlined"
      data-testid="url-media-results"
      hidden={!filteredImageList.length && !videoList.length}
    >
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("media_title")}
        subheader={keyword("media_below")}
        action={
          <div style={{ display: "flex" }}>
            <div>
              {(dbkfImageMatch || dbkfVideoMatch) && (
                <Tooltip title={keyword("image_warning")}>
                  <WarningAmber
                    color={"warning"}
                    className={classes.toolTipWarning}
                    onClick={() => {
                      dispatch(setWarningExpanded(!warningExpanded));
                      window.scroll(0, 0);
                    }}
                  />
                </Tooltip>
              )}
            </div>
            <div>
              <Tooltip
                interactive={"true"}
                title={
                  <>
                    <Trans
                      t={keyword}
                      i18nKey="media_tooltip"
                      components={{
                        b: <b />,
                      }}
                    />
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                    <TransSupportedToolsLink keyword={keyword} />
                  </>
                }
                classes={{ tooltip: classes.assistantTooltip }}
              >
                <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
              </Tooltip>
            </div>
          </div>
        }
        slotProps={{
          subheader: { sx: { color: "white" } },
        }}
      />
      {dbkfMediaMatchLoading ? (
        <div>
          <LinearProgress />
        </div>
      ) : null}
      {/* selected image or video with recommended tools */}
      <CardContent sx={{ padding: processUrl == null ? 0 : undefined }}>
        {missingMedia ? (
          <Alert severity="warning">
            <Typography component={"span"}>
              <Box
                sx={{
                  color: "orange",
                  fontStyle: "italic",
                }}
              >
                {keyword("missing_media_title")}
                <IconButton
                  className={classes.assistantIconRight}
                  onClick={() => dispatch(setStateExpanded(!stateExpanded))}
                >
                  <ExpandMoreIcon style={{ color: "orange" }} />
                </IconButton>
              </Box>
            </Typography>

            <Collapse
              in={stateExpanded}
              className={classes.assistantBackground}
            >
              <Typography>{keyword("missing_media_instructions")}</Typography>
            </Collapse>
          </Alert>
        ) : null}
        {processUrl !== null ? (
          resultIsImage ? (
            <Grid container spacing={2}>
              <Grid size={6}>
                <AssistantImageResult />
              </Grid>
              <Grid size={6}>
                <AssistantProcessUrlActions />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid size={6}>
                <AssistantVideoResult />
              </Grid>
              <Grid size={6}>
                <AssistantProcessUrlActions />
              </Grid>
            </Grid>
          )
        ) : null}
      </CardContent>
      {/* image grid and video grid of extracted media */}
      {!singleMediaPresent ? (
        <div>
          <CardContent style={{ wordBreak: "break-word" }}>
            {/* image list */}
            {filteredImageList.length > 0 ? (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    {keyword("images_label")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ImageGridList
                    list={filteredImageList}
                    height={60}
                    cols={5}
                    handleClick={(event) => {
                      submitMediaToProcess(event);
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            ) : null}

            {/* video list */}
            {videoList.length > 0 ? (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    {keyword("videos_label")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails style={{ paddingTop: 0 }}>
                  <VideoGridList
                    list={videoList}
                    height={60}
                    cols={5}
                    handleClick={(vidLink) => {
                      submitMediaToProcess(vidLink);
                    }}
                    style={{ overflowY: "visible" }}
                  />
                </AccordionDetails>
              </Accordion>
            ) : null}
          </CardContent>
        </div>
      ) : null}
    </Card>
  );
};
export default AssistantMediaResult;
