import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Grid2, Skeleton } from "@mui/material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

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
import { WarningAmber } from "@mui/icons-material";

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
  return (
    <Card
      data-testid="url-media-results"
      hidden={!urlMode || (!imageList.length && !videoList.length)}
    >
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("media_title")}
        action={
          <div style={{ display: "flex" }}>
            <div
            //hidden={dbkfImageMatch === null && dbkfVideoMatch === null}
            >
              {console.log("dbkfMediaMatchLoading=", dbkfMediaMatchLoading)}
              {dbkfMediaMatchLoading && <Skeleton variant="circular" />}
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

      {/* selected image with recommended tools */}
      <CardContent>
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
            </Grid2>
          )
        ) : null}
      </CardContent>

      {/* image grid and video grid of extracted media */}
      {!singleMediaPresent ? (
        <div>
          {/* select media */}
          <CardContent>
            <Typography
              component={"div"}
              sx={{ textAlign: "start" }}
              variant={"subtitle1"}
            >
              {keyword("media_below")}
            </Typography>
          </CardContent>

          {/* image list */}
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

          {/* video list */}
          <CardContent>
            <VideoGridList
              list={videoList}
              handleClick={(vidLink) => {
                submitMediaToProcess(vidLink);
              }}
            />
          </CardContent>
        </div>
      ) : null}
    </Card>
  );
};
export default AssistantMediaResult;
