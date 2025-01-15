import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Grid2, LinearProgress } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { CONTENT_TYPE } from "../AssistantRuleBook";
import AssistantImageResult from "./AssistantImageResult";
import AssistantVideoResult from "./AssistantVideoResult";

// from Video Analysis - change these to AssistantSaga ?
import {
  setAnalysisComments,
  setAnalysisLinkComments,
  setAnalysisVerifiedComments,
} from "../../../../redux/actions/tools/analysisActions";
import AnalysisComments from "../../tools/Analysis/Results/AnalysisComments";

import AssistantProcessUrlActions from "./AssistantProcessUrlActions";
import ImageGridList from "../../../Shared/ImageGridList/ImageGridList";
import {
  setProcessUrl,
  setWarningExpanded,
} from "../../../../redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import VideoGridList from "../../../Shared/VideoGridList/VideoGridList";
import { WarningAmber } from "@mui/icons-material";

import {
  TransHtmlDoubleLinkBreak,
  TransSupportedToolsLink,
} from "../TransComponents";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

const AssistantMediaResult = () => {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  // assistant media states
  const processUrl = useSelector((state) => state.assistant.processUrl);
  const urlMode = useSelector((state) => state.assistant.urlMode);
  const resultProcessType = useSelector(
    (state) => state.assistant.processUrlType,
  );
  const singleMediaPresent = useSelector(
    (state) => state.assistant.singleMediaPresent,
  );
  const imageList = useSelector((state) => state.assistant.imageList);
  const videoList = useSelector((state) => state.assistant.videoList);

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
  const resultIsImage = resultProcessType === CONTENT_TYPE.IMAGE;

  // Video Analysis for YouTube comments
  const report = useSelector((state) => state.analysis.result);
  const targetObliviousStanceResult = useSelector(
    (state) => state.assistant.targetObliviousStanceResult,
  );
  //const collectedComments = useSelector((state) => state.assistant.collectedComments);

  // local control state
  // const [expandMedia, setExpandMedia] = useState(
  //   !singleMediaPresent || processUrl == null,
  // );

  // select the correct media to process, then load actions possible
  const submitMediaToProcess = (url) => {
    //setExpandMedia(false);
    let cType = null;
    if (imageList.includes(url)) {
      cType = CONTENT_TYPE.IMAGE;
    } else if (videoList.includes(url)) {
      cType = CONTENT_TYPE.VIDEO;
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
          resolve({ url: imageUrl, width: image.width, height: image.height });
        };
        image.onerror = () => {
          resolve({ url: imageUrl, width: null, height: null });
        };
      });
    });

    Promise.all(imagePromises)
      .then((imageDimensions) => {
        const filteredImages = imageDimensions
          .filter((image) => image.width > 2 && image.height > 2)
          .map((image) => image.url);
        setFilteredImageList(filteredImages);
      })
      .catch((error) => {
        console.error("Assistant error loading images:", error);
      });
  }, [imageList]);

  return (
    <Card
      data-testid="url-media-results"
      hidden={!urlMode || (!filteredImageList.length && !videoList.length)}
      //width={window.innerWidth}
    >
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("media_title")}
        subheader={keyword("media_below")}
        subheaderTypographyProps={{ sx: { color: "white" } }}
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
                    <TransHtmlDoubleLinkBreak keyword={keyword} />
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
      />

      {dbkfMediaMatchLoading ? (
        <div>
          <LinearProgress />
        </div>
      ) : null}

      {/* selected image or video with recommended tools */}
      <CardContent sx={{ padding: processUrl == null ? 0 : undefined }}>
        {processUrl !== null ? (
          resultIsImage ? (
            <Grid2 container spacing={2}>
              <Grid2 size={6}>
                <AssistantImageResult />
              </Grid2>
              <Grid2 size={6}>
                <AssistantProcessUrlActions />
              </Grid2>
            </Grid2>
          ) : (
            <Grid2 container spacing={2}>
              <Grid2 size={6}>
                <AssistantVideoResult />
              </Grid2>
              <Grid2 size={6}>
                <AssistantProcessUrlActions />
              </Grid2>

              {/* YouTube comments */}
              {report != null ? (
                <Grid2 size={12}>
                  <AnalysisComments
                    type="YOUTUBE"
                    classes={classes}
                    //title={"youtube_comment_title"}
                    title={"collected_comments_title"}
                    keyword={keyword}
                    report={report} // difference in assistant and video analysis API results
                    targetObliviousStance={targetObliviousStanceResult}
                    setAnalysisComments={setAnalysisComments}
                    setAnalysisLinkComments={setAnalysisLinkComments}
                    setAnalysisVerifiedComments={setAnalysisVerifiedComments}
                  />
                </Grid2>
              ) : null}
            </Grid2>
          )
        ) : null}
      </CardContent>

      {/* image grid and video grid of extracted media */}
      {!singleMediaPresent ? (
        <div>
          {/* select media */}
          {/*<CardContent>
            <Typography
              component={"div"}
              sx={{ textAlign: "start" }}
              variant={"subtitle1"}
            >
              {keyword("media_below")}
            </Typography>
          </CardContent>*/}

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
                    handleClick={(vidLink) => {
                      submitMediaToProcess(vidLink);
                    }}
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
