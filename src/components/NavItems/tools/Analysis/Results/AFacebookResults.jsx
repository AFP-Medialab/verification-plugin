import React from "react";
import { useDispatch } from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import axios from "axios";
import ImageUrlGridList from "../../../../Shared/ImageGridList/ImageUrlGridList";
import { submissionEvent } from "../../../../Shared/GoogleAnalytics/GoogleAnalytics";
import _ from "lodash";
import AnalysisComments from "./AnalysisComments";
import {
  SEARCH_ENGINE_SETTINGS,
  reverseImageSearch,
} from "../../../../Shared/ReverseSearch/reverseSearchUtils";

const AFacebookResults = (props) => {
  const cleanAnalysisState = props.cleanAnalysisState;
  const setAnalysisComments = props.setAnalysisComments;
  const setAnalysisLinkComments = props.setAnalysisLinkComments;
  const setAnalysisVerifiedComments = props.setAnalysisVerifiedComments;
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Analysis.tsv",
    tsv
  );

  const reverseSearch = async (website) => {
    for (let image of thumbnails) {
      await reverseImageSearch(image.url, true, website);
    }
  };

  const handleClick_delete_result = (report) => {
    let media_id = report.video_id ? report.video_id : report.image_id;
    submissionEvent("delete media id " + media_id);
    axios
      .delete(" https://mever.iti.gr/caa/api/v4/media/reports/" + media_id)
      .then(() => {
        dispatch(cleanAnalysisState());
      })
      .catch((err) => {
        console.log("error calling delete service", err);
        dispatch(cleanAnalysisState());
      });
  };
  const titleReader = (report) => {
    if (!_.isNil(report.video))
      return {
        title: report.video.title,
        created_time: report.video.created_time,
      };
    else if (!_.isNil(report.image))
      return {
        title: report.image.source,
        created_time: report.image.created_time,
      };
    return { title: null, created_time: null };
  };
  const thumbnailReader = (props) => {
    let image_url = props.report.thumbnails
      ? props.report.thumbnails.preferred.url
      : props.image;
    let google_reverse_search = null;
    if (!_.isNil(props.report.thumbnails))
      google_reverse_search =
        props.report.thumbnails.preferred.google_reverse_image_search;
    else if (!_.isNil(props.report.representations[0]))
      google_reverse_search =
        props.report.representations[0].google_reverse_image_search;
    return {
      image_url: image_url,
      google_reverse_search: google_reverse_search,
    };
  };

  const dispatch = useDispatch();
  const report = props.report;

  const thumbnails = report.thumbnails ? report.thumbnails.others : null;
  const process_show_image = thumbnailReader(props);
  const process_title = titleReader(report);

  return (
    <div>
      {report !== null && (
        <Card>
          <CardHeader
            title={keyword("cardheader_results")}
            className={classes.headerUpladedImage}
          />
          <div className={classes.root2}>
            <CloseResult onClick={() => dispatch(cleanAnalysisState())} />
            <Typography variant={"h5"}>{process_title.title}</Typography>
            <Typography variant={"subtitle1"}>
              {process_title.created_time}
            </Typography>
            <img
              src={process_show_image.image_url}
              onClick={() => {
                if (!_.isNil(process_show_image.google_reverse_search))
                  window.open(
                    process_show_image.google_reverse_search,
                    "_blank"
                  );
              }}
              className={classes.image}
              alt={"img"}
            />
            <Box m={2} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleClick_delete_result(report)}
            >
              {keyword("facebook_delete_result")}
            </Button>
            <Box m={2} />
            <Divider />
            <Box m={2} />
            <Typography variant={"h6"}>
              {report.video && keyword("video_description")}
              {report.image && keyword("image_description")}
            </Typography>
            <Box m={2} />
            {props.children}
            {report["verification_comments"] && (
              <AnalysisComments
                type="FACEBOOK"
                classes={classes}
                title={"facebook_comment_title"}
                keyword={keyword}
                report={report}
                setAnalysisComments={setAnalysisComments}
                setAnalysisLinkComments={setAnalysisLinkComments}
                setAnalysisVerifiedComments={setAnalysisVerifiedComments}
              />
            )}
            <Box m={4} />

            {thumbnails !== null && (
              <div>
                <Box m={4} />
                <Typography variant={"h6"}>
                  {keyword("navbar_thumbnails")}
                </Typography>
                <Box m={1} />
                <OnClickInfo keyword={"keyframes_tip"} />
                <Box m={1} />
                <div className={classes.imagesRoot}>
                  <ImageUrlGridList
                    list={thumbnails}
                    cols={3}
                    style={{ maxHeigth: "none", height: "auto" }}
                  />
                </div>
                <Box m={2} />
                <Button
                  className={classes.button}
                  variant="contained"
                  color={"primary"}
                  onClick={async () =>
                    await reverseSearch(
                      SEARCH_ENGINE_SETTINGS.GOOGLE_SEARCH.NAME
                    )
                  }
                >
                  {keyword("button_reverse_google")}
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color={"primary"}
                  onClick={async () =>
                    await reverseSearch(
                      SEARCH_ENGINE_SETTINGS.YANDEX_SEARCH.NAME
                    )
                  }
                >
                  {keyword("button_reverse_yandex")}
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  color={"primary"}
                  onClick={async () =>
                    await reverseSearch(
                      SEARCH_ENGINE_SETTINGS.TINEYE_SEARCH.NAME
                    )
                  }
                >
                  {keyword("button_reverse_tineye")}
                </Button>
                {report["verification_cues"] &&
                  report["verification_cues"]["twitter_search_url"] && (
                    <Button
                      className={classes.button}
                      variant="contained"
                      color={"primary"}
                      onClick={() =>
                        window.open(
                          report["verification_cues"]["twitter_search_url"]
                        )
                      }
                    >
                      {keyword("button_reverse_twitter")}
                    </Button>
                  )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
export default AFacebookResults;
