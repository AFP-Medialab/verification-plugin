import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Grid2 } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";

import { CONTENT_TYPE } from "../AssistantRuleBook";
import AssistantImageResult from "./AssistantImageResult";
import AssistantVideoResult from "./AssistantVideoResult";
import AssistantProcessUrlActions from "./AssistantProcessUrlActions";
import ImageGridList from "../../../Shared/ImageGridList/ImageGridList";
import {
  setProcessUrl,
  setWarningExpanded,
} from "../../../../redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import VideoGridList from "../../../Shared/VideoGridList/VideoGridList";
import { WarningOutlined } from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";

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

  // local control state
  const [expandMedia, setExpandMedia] = useState(
    !singleMediaPresent || processUrl == null,
  );

  // select the correct media to process, then load actions possible
  const submitMediaToProcess = (url) => {
    setExpandMedia(false);
    let cType = null;
    if (imageList.includes(url)) {
      cType = CONTENT_TYPE.IMAGE;
    } else if (videoList.includes(url)) {
      cType = CONTENT_TYPE.VIDEO;
    }
    dispatch(setProcessUrl(url, cType));
  };
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }} hidden={!urlMode}>
        <Card data-testid="url-media-results">
          <CardHeader
            className={classes.assistantCardHeader}
            title={keyword("media_title")}
            action={
              <div style={{ display: "flex" }}>
                <div
                  hidden={dbkfImageMatch === null && dbkfVideoMatch === null}
                >
                  <Tooltip title={keyword("image_warning")}>
                    <WarningOutlined
                      className={classes.toolTipWarning}
                      onClick={() => {
                        dispatch(setWarningExpanded(!warningExpanded));
                        window.scroll(0, 0);
                      }}
                    />
                  </Tooltip>
                </div>
                <div>
                  <Tooltip
                    interactive={"true"}
                    title={
                      <div
                        className={"content"}
                        dangerouslySetInnerHTML={{
                          __html: keyword("media_tooltip"),
                        }}
                      />
                    }
                    classes={{ tooltip: classes.assistantTooltip }}
                  >
                    <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
                  </Tooltip>
                </div>
              </div>
            }
          />
          {
            /*!ocrLoading && */ dbkfMediaMatchLoading && (
              <LinearProgress variant={"indeterminate"} color={"secondary"} />
            )
          }
          <CardContent>
            {processUrl !== null ? (
              resultIsImage ? (
                <AssistantImageResult />
              ) : (
                <AssistantVideoResult />
              )
            ) : null}
          </CardContent>
          {!singleMediaPresent ? (
            <div>
              <CardActions disableSpacing>
                <IconButton
                  onClick={() => {
                    setExpandMedia(!expandMedia);
                  }}
                >
                  <ExpandMoreIcon fontSize={"small"} />
                  <Typography>{keyword("media_below")}</Typography>
                </IconButton>
              </CardActions>
              <Collapse in={expandMedia}>
                <CardContent>
                  <ImageGridList
                    list={imageList}
                    height={60}
                    cols={5}
                    handleClick={(event) => {
                      submitMediaToProcess(event);
                    }}
                  />
                </CardContent>
                <CardContent>
                  <VideoGridList
                    list={videoList}
                    handleClick={(vidLink) => {
                      submitMediaToProcess(vidLink);
                    }}
                  />
                </CardContent>
              </Collapse>
            </div>
          ) : null}
        </Card>
      </Grid2>

      <Grid2 size={{ xs: 6 }}>
        <AssistantProcessUrlActions />
      </Grid2>
    </Grid2>
  );
};
export default AssistantMediaResult;
