import React from "react";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import {
  cleanAnalysisState,
  setAnalysisComments,
  setAnalysisLinkComments,
  setAnalysisVerifiedComments,
} from "../../../../../redux/actions/tools/analysisActions";
import ImageUrlGridList from "../../../../Shared/ImageGridList/ImageUrlGridList";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import { ReverseSearchButtons } from "../../../../Shared/ReverseSearch/ReverseSearchButtons";
import { reverseImageSearch } from "../../../../Shared/ReverseSearch/reverseSearchUtils";
import AnalysisComments from "./AnalysisComments";

const TwitterResults = (props) => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Analysis");
  const reverseSearch = (website) => {
    for (let image of thumbnails) {
      reverseImageSearch(image.url, website, false);
    }
  };

  const dispatch = useDispatch();
  const report = props.report;
  const thumbnails = [report["thumbnails"]["preferred"]];

  return (
    <div data-testid="analysis-tw-result">
      {report !== null &&
        report["thumbnails"] !== undefined &&
        report["thumbnails"]["preferred"]["url"] && (
          <Card>
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
                  <CloseIcon sx={{ color: "white" }} />
                </IconButton>
              }
            />
            <div className={classes.root2}>
              <Typography variant={"h5"}>
                {report["video"]["source"]}
              </Typography>
              <Typography variant={"subtitle1"}>
                {report["video"]["created_at"]}
              </Typography>
              <img
                src={report["thumbnails"]["preferred"]["url"]}
                className={classes.image}
                alt={"img"}
              />
              <Box m={2} />
              <Divider />
              <Box m={2} />
              <Typography variant={"h6"}>
                {keyword("youtube_video_name1_2")}
              </Typography>
              {report["video"] && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.text}
                >
                  {report["video"]["full_text"]}
                </Typography>
              )}
              <Box m={2} />
              <Divider />
              {report["video"] && (
                <Table
                  className={classes.table}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableBody>
                    {!report["video"]["source"] ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_3")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["source"]}
                        </TableCell>
                      </TableRow>
                    )}
                    {!report["video"]["favorite_count"] ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_4")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["favorite_count"]}
                        </TableCell>
                      </TableRow>
                    )}
                    {!report["video"]["retweet_count"] ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_5")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["retweet_count"]}
                        </TableCell>
                      </TableRow>
                    )}
                    {!(
                      report["video"]["hashtags"] &&
                      report["video"]["hashtags".length > 0]
                    ) ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_6")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["hashtags"].map((value, key) => {
                            return <span key={key}>{value}</span>;
                          })}
                        </TableCell>
                      </TableRow>
                    )}
                    {!(
                      report["video"]["urls"] &&
                      report["video"]["urls"].length > 0
                    ) ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_7")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["urls"].map((value, key) => {
                            return (
                              <a
                                key={key}
                                href={value}
                                rel="noopener noreferrer"
                                target={"_blank"}
                              >
                                {value}
                              </a>
                            );
                          })}
                        </TableCell>
                      </TableRow>
                    )}
                    {!(
                      report["video"]["user_mentions"] &&
                      report["video"]["user_mentions".length > 0]
                    ) ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_8")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["user_mentions"].map(
                            (value, key) => {
                              return <span key={key}>{value + " "}</span>;
                            },
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                    {!report["video"]["lang"] ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_9")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["lang"]}
                        </TableCell>
                      </TableRow>
                    )}
                    {!report["thumbnails"]["preferred"]["url"] ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_10")}
                        </TableCell>
                        <TableCell align="right">
                          <a
                            href={report["thumbnails"]["preferred"]["url"]}
                            rel="noopener noreferrer"
                            target={"_blank"}
                          >
                            {report["thumbnails"]["preferred"]["url"]}
                          </a>
                        </TableCell>
                      </TableRow>
                    )}
                    {!(
                      report["video"]["video_info"] &&
                      report["video"]["video_info"]["aspect_ratio"]
                    ) ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_11")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["video_info"]["aspect_ratio"]}
                        </TableCell>
                      </TableRow>
                    )}
                    {!(
                      report["video"]["video_info"] &&
                      report["video"]["video_info"]["duration"]
                    ) ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_12")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["video_info"]["duration"]}
                        </TableCell>
                      </TableRow>
                    )}
                    {!(
                      report["video"]["video_info"] &&
                      report["video"]["video_info"]["urls"] &&
                      report["video"]["video_info"]["urls"].length > 0
                    ) ? null : (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_video_name_16")}
                        </TableCell>
                        <TableCell align="right">
                          {report["video"]["video_info"]["urls"].map(
                            (value, key) => {
                              return (
                                <a
                                  key={key}
                                  href={value}
                                  rel="noopener noreferrer"
                                  target={"_blank"}
                                >
                                  {value + " "}
                                </a>
                              );
                            },
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              {report["source"] && (
                <div>
                  <Box m={4} />
                  <Typography variant={"h6"}>
                    {keyword("profile_creator") +
                      ": " +
                      report["source"]["user_name"]}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    className={classes.text}
                  >
                    {report["source"]["user_description"]}
                  </Typography>
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      {!report["source"]["user_screen_name"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_2")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_screen_name"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_location"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_3")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_location"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_url"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_4")}
                          </TableCell>
                          <TableCell align="right">
                            <a
                              href={report["source"]["url"]}
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {report["source"]["user_url"]}
                            </a>
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_protected"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_6")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_protected"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_verified"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_7")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_verified"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_followers_count"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_8")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_followers_count"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_friends_count"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_9")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_friends_count"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_listed_count"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_10")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_listed_count"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_favourites_count"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_11")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_favourites_count"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_statuses_count"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_12")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_statuses_count"]}
                          </TableCell>
                        </TableRow>
                      )}
                      {!report["source"]["user_created_at"] ? null : (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("twitter_user_name_13")}
                          </TableCell>
                          <TableCell align="right">
                            {report["source"]["user_created_at"]}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              {report["verification_comments"] && (
                <AnalysisComments
                  type="TWITTER"
                  classes={classes}
                  title={"twitter_video_replies"}
                  keyword={keyword}
                  report={report}
                  setAnalysisComments={setAnalysisComments}
                  setAnalysisLinkComments={setAnalysisLinkComments}
                  setAnalysisVerifiedComments={setAnalysisVerifiedComments}
                />
              )}
              <Box m={4} />

              {thumbnails !== undefined && (
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
                  <ReverseSearchButtons reverseSearch={reverseSearch}>
                    <></>
                  </ReverseSearchButtons>
                </div>
              )}
            </div>
          </Card>
        )}
    </div>
  );
};
export default TwitterResults;
