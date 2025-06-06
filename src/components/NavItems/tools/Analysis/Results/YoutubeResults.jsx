import React from "react";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import {
  cleanAnalysisState,
  setAnalysisComments,
  setAnalysisLinkComments,
  setAnalysisVerifiedComments,
} from "@/redux/actions/tools/analysisActions";
import { ReverseSearchButtons } from "@Shared/ReverseSearch/ReverseSearchButtons";
import { reverseImageSearch } from "@Shared/ReverseSearch/reverseSearchUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import ImageUrlGridList from "../../../../Shared/ImageGridList/ImageUrlGridList";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import AnalysisComments from "./AnalysisComments";
import TimeToLocalTime from "./TimeToLocalTime";

const YoutubeResults = (props) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Analysis");

  const reverseSearch = async (website) => {
    for (let image of thumbnails) {
      await reverseImageSearch(image.url, website, false);
    }
  };

  const dispatch = useDispatch();
  const report = props.report;
  const thumbnails = report["thumbnails"]["others"];

  const videoTable = [
    {
      title: keyword("youtube_video_name2_1"),
      value: report["video"]["viewCount"],
    },
    {
      title: keyword("youtube_video_name2_2"),
      value: report["video"]["likeCount"],
    },
    {
      title: keyword("youtube_video_name2_3"),
      value: report["video"]["dislikeCount"],
    },
    {
      title: keyword("youtube_video_name2_4"),
      value: report["video"]["duration"],
    },
    {
      title: keyword("youtube_video_name2_5"),
      value: report["video"]["licensedContent"],
    },
    {
      title: keyword("youtube_video_name2_6"),
      value: <TimeToLocalTime time={report["video"]["publishedAt"]} />,
    },
  ];

  const sourceTable = [
    {
      title: keyword("youtube_channel_name_2"),
      value: <TimeToLocalTime time={report["source"]["publishedAt"]} />,
    },
    {
      title: keyword("youtube_channel_name_3"),
      value: report["source"]["viewCount"],
    },
    {
      title: keyword("youtube_channel_name_4"),
      value: (
        <a
          href={report["source"]["url"]}
          rel="noopener noreferrer"
          target="_blank"
        >
          {report["source"]["url"]}
        </a>
      ),
    },
    {
      title: keyword("youtube_channel_name_5"),
      value: report["source"]["subscriberCount"],
    },
  ];

  return (
    <div data-testid="analysis-yt-result">
      {report !== null &&
        report["thumbnails"] !== undefined &&
        report["thumbnails"]["preferred"]["url"] && (
          <Card variant="outlined">
            <CardHeader
              title={keyword("cardheader_results")}
              className={classes.headerUploadedImage}
              action={
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    dispatch(cleanAnalysisState());
                  }}
                >
                  <CloseIcon />
                </IconButton>
              }
            />
            <div className={classes.root2}>
              <Typography variant={"h5"}>{report["video"]["title"]}</Typography>
              <Typography variant={"subtitle1"}>
                {report["video"]["publishedAt"]}
              </Typography>
              <img
                src={report["thumbnails"]["preferred"]["url"]}
                title={report["video"]["title"]}
                alt={"img"}
              />
              <Box
                sx={{
                  m: 2,
                }}
              />
              <Divider />
              <Box
                sx={{
                  m: 2,
                }}
              />
              <Typography variant={"h6"}>
                {keyword("youtube_video_name1_2")}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                className={classes.text}
              >
                {report["video"]["description"]}
              </Typography>
              <Box
                sx={{
                  m: 2,
                }}
              />
              <Divider />
              {report["video"] && (
                <Table
                  className={classes.table}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableBody>
                    {videoTable.map((obj, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {obj.title}
                          </TableCell>
                          <TableCell align="right">{obj.value}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
              {report["source"] && (
                <div>
                  <Box
                    sx={{
                      m: 4,
                    }}
                  />
                  <Typography variant={"h6"}>
                    {keyword("youtube_channel_title") +
                      " " +
                      report["source"]["title"]}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    className={classes.text}
                  >
                    {report["source"]["description"]}
                  </Typography>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      {sourceTable.map((obj, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {obj.title}
                            </TableCell>
                            <TableCell align="right">{obj.value}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
              <Box
                sx={{
                  m: 2,
                }}
              />
              {report["verification_comments"] && (
                <AnalysisComments
                  type="YOUTUBE"
                  classes={classes}
                  title={"youtube_comment_title"}
                  keyword={keyword}
                  report={report}
                  setAnalysisComments={setAnalysisComments}
                  setAnalysisLinkComments={setAnalysisLinkComments}
                  setAnalysisVerifiedComments={setAnalysisVerifiedComments}
                />
              )}

              <Box
                sx={{
                  m: 4,
                }}
              />
              {thumbnails !== undefined && (
                <div>
                  <Box
                    sx={{
                      m: 4,
                    }}
                  />
                  <Typography variant={"h6"}>
                    {keyword("navbar_thumbnails")}
                  </Typography>
                  <Box
                    sx={{
                      m: 1,
                    }}
                  />
                  <OnClickInfo keyword={"keyframes_tip"} />
                  <Box
                    sx={{
                      m: 1,
                    }}
                  />
                  <div className={classes.imagesRoot}>
                    <ImageUrlGridList
                      list={thumbnails}
                      cols={3}
                      style={{ maxHeigth: "none", height: "auto" }}
                    />
                  </div>
                  <Box
                    sx={{
                      m: 2,
                    }}
                  />
                  <ReverseSearchButtons reverseSearch={reverseSearch}>
                    {report["verification_cues"] &&
                      report["verification_cues"]["twitter_search_url"] && (
                        <Grid>
                          <Button
                            className={classes.button}
                            variant="contained"
                            color={"primary"}
                            onClick={() =>
                              window.open(
                                report["verification_cues"][
                                  "twitter_search_url"
                                ],
                              )
                            }
                          >
                            {keyword("button_reverse_twitter")}
                          </Button>
                        </Grid>
                      )}
                  </ReverseSearchButtons>
                </div>
              )}
            </div>
          </Card>
        )}
    </div>
  );
};
export default YoutubeResults;
