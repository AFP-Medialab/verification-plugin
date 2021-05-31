import { useDispatch } from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import React, { useState } from "react";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import { cleanAnalysisState } from "../../../../../redux/actions/tools/analysisActions";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import TableHead from "@material-ui/core/TableHead";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import ImageReverseSearch from "../../ImageReverseSearch";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
//import AsynchMyMap from "../../../../Shared/MyMap/AsynchMyMap";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import styles from "./layout.module.css";
import axios from "axios";
import { setAnalysisComments } from "../../../../../redux/actions/tools/analysisActions";

const FacebookResults = (props) => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Analysis.tsv",
    tsv
  );
  const [count, setCount] = useState(1);

  const reverseSearch = (website) => {
    for (let image of thumbnails) {
      ImageReverseSearch(website, image.url);
    }
  };

  var nextPage = props.report.pagination.next;
  var previousPage = props.report.pagination.previous;

  console.log(previousPage);

  const handleClick_next_page = (event) => {
    if (nextPage !== "undefined" && nextPage !== "null" && nextPage !== "") {
      setCount(count + 1);
      axios.get("http://mever.iti.gr" + nextPage).then((response) => {
        dispatch(setAnalysisComments(response.data));
      });
    }
  };
  const handleClick_previous_page = (event) => {
    if (
      previousPage !== "undefined" &&
      previousPage !== "null" &&
      previousPage !== ""
    ) {
      setCount(count - 1);
      axios.get("http://mever.iti.gr" + previousPage).then((response) => {
        dispatch(setAnalysisComments(response.data));
      });
    }
  };

  const dispatch = useDispatch();
  const report = props.report;
  console.log("Report ", report);
  //console.log("report.pagination.next ",report.pagination.next)
  const verificationComments = report.comments ? report.comments : [];
  const linkComments = report.link_comments ? report.link_comments : [];
  const thumbnails = report.thumbnails.others;

  //console.log("nothing ", nothing)
  return (
    <div>
      {report !== null &&
        report.thumbnails !== undefined &&
        report.thumbnails.preferred.url && (
          <Card>
            <CardHeader
              title={keyword("cardheader_results")}
              className={classes.headerUpladedImage}
            />
            <div className={classes.root2}>
              <CloseResult onClick={() => dispatch(cleanAnalysisState())} />
              <Typography variant={"h5"}>{report.video.title}</Typography>
              <Typography variant={"subtitle1"}>
                {report.video.created_time}
              </Typography>
              <img
                src={report.thumbnails.preferred.url}
                onClick={() => {
                  window.open(
                    report.thumbnails.preferred.google_reverse_image_search,
                    "_blank"
                  );
                }}
                className={classes.image}
                alt={"img"}
              />
              <Box m={2} />
              <Divider />
              <Box m={2} />
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={classes.text}
              >
                {report.video.description}
              </Typography>
              <Box m={2} />
              {report["video"] && (
                <Table
                  className={classes.table}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableBody>
                    {report.video_id && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_1")}
                        </TableCell>
                        <TableCell align="right">{report.video_id}</TableCell>
                      </TableRow>
                    )}
                    {
                      //report.video.title &&
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_2")}
                        </TableCell>
                        <TableCell align="right">
                          {report.video.title}
                        </TableCell>
                      </TableRow>
                    }
                    {report.video.length && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_3")}
                        </TableCell>
                        <TableCell align="right">
                          {report.video.length}
                        </TableCell>
                      </TableRow>
                    )}
                    {report.video.content_category && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_4")}
                        </TableCell>
                        <TableCell align="right">
                          {report.video.content_category}
                        </TableCell>
                      </TableRow>
                    )}
                    {report.video.content_tags && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_5")}
                        </TableCell>
                        <TableCell align="right">
                          {"" + report.video.content_tags.join(", ")}
                        </TableCell>
                      </TableRow>
                    )}
                    {report.video.likes && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_7")}
                        </TableCell>
                        <TableCell align="right">
                          {report.video.likes}
                        </TableCell>
                      </TableRow>
                    )}
                    {report.video.updated_time && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_8")}
                        </TableCell>
                        <TableCell align="right">
                          {report.video.updated_time}
                        </TableCell>
                      </TableRow>
                    )}
                    {report.video.created_time && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_9")}
                        </TableCell>
                        <TableCell align="right">
                          {report.video.created_time}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              <div>
                <Box m={4} />
                <Typography variant={"h6"}>
                  {keyword("facebook_comment_title")}
                </Typography>
                <Box m={2} />
                {report.verification_cues && (
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      {report.verification_cues.num_comments && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("facebook_comment_name_1")}
                          </TableCell>
                          <TableCell align="right">
                            {report.verification_cues.num_comments}
                          </TableCell>
                        </TableRow>
                      )}
                      {report.verification_cues.num_verification_comments !==
                        0 && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("facebook_comment_name_2")}
                          </TableCell>
                          <TableCell align="right">
                            {report.verification_cues.num_verification_comments}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
                <Box m={2} />
                {
                  //linkComments.length > 0 &&
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>
                        {keyword("link_comments")}
                      </Typography>
                      <Typography className={classes.secondaryHeading}>
                        {" "}
                        ...
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell className={styles.size} align="center">
                              {keyword("twitter_user_name_13")}
                            </TableCell>
                            <TableCell align="center">
                              {keyword("twitter_user_name_5")}
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody className={styles.container}>
                          {linkComments.map((comment, key) => {
                            return (
                              <TableRow key={key}>
                                <TableCell align="center" size="small">
                                  {comment.publishedAt}
                                </TableCell>
                                <TableCell align="left" size="small">
                                  {comment.textDisplay}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                }
                <Box m={2} />
                {verificationComments.length > 0 && (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>
                        {keyword("api_comments")}
                      </Typography>
                      <Typography className={classes.secondaryHeading}>
                        {" "}
                        ...
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell className={styles.size} align="center">
                              {keyword("twitter_user_name_13")}
                            </TableCell>
                            <TableCell align="center">
                              {keyword("twitter_user_name_5")}
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody
                          className={
                            styles.container
                          } /* class="fixed_headers" */
                        >
                          {verificationComments.map((comment, key) => {
                            //  console.log("comment ", comment)
                            //   console.log("key ", key)

                            return (
                              <TableRow key={key}>
                                <TableCell align="center" size="small">
                                  {comment.publishedAt}
                                </TableCell>
                                <TableCell align="left" size="small">
                                  {comment.textDisplay}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                    <Box>{keyword("page_number") + count}</Box>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={handleClick_previous_page}
                    >
                      {keyword("previous_button")}
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={handleClick_next_page}
                    >
                      {keyword("next_button")}
                    </Button>
                  </Accordion>
                )}
              </div>
              <Box m={4} />
              {/*report.mentioned_locations &&
                report.mentioned_locations.detected_locations &&
                report.mentioned_locations.detected_locations.length > 0 && (
                  <div>
                    <AsynchMyMap
                      locations={report.mentioned_locations.detected_locations}
                    />
                    <Box m={4} />
                  </div>
                )*/}
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
                    <GridList
                      cellHeight={160}
                      className={classes.gridList}
                      cols={3}
                    >
                      {thumbnails.map((tile, key) => (
                        <GridListTile key={key} cols={1}>
                          <img src={tile.url} alt={"img"} />
                        </GridListTile>
                      ))}
                    </GridList>
                  </div>
                  <Box m={2} />
                  <Button
                    className={classes.button}
                    variant="contained"
                    color={"primary"}
                    onClick={() => reverseSearch("google")}
                  >
                    {keyword("button_reverse_google")}
                  </Button>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color={"primary"}
                    onClick={() => reverseSearch("yandex")}
                  >
                    {keyword("button_reverse_yandex")}
                  </Button>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color={"primary"}
                    onClick={() => reverseSearch("tineye")}
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
export default FacebookResults;
