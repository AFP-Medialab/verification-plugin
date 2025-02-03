import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CardHeader,
  Chip,
  Divider,
  Grid2,
  Pagination,
  Skeleton,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import moment from "moment/moment";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Linkify from "react-linkify";

import { WarningOutlined } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { setWarningExpanded } from "../../../../redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { treeMapToElements } from "./assistantUtils";
import { useDispatch } from "react-redux";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Trans } from "react-i18next";
import {
  TransCollectedCommentsTooltip,
  TransTargetObliviousStanceTooltip,
  TransTargetObliviousStanceLink,
  TransHtmlDoubleLineBreak,
} from "../TransComponents";
import { TextCopy } from "components/Shared/Utils/TextCopy";
import { Translate } from "components/Shared/Utils/Translate";

import AnalysisComments, {
  CommentsPanel,
} from "components/NavItems/tools/Analysis/Results/AnalysisComments";
import {
  cleanAnalysisState,
  setAnalysisComments,
  setAnalysisLinkComments,
  setAnalysisVerifiedComments,
} from "redux/actions/tools/analysisActions";
import YoutubeResults from "components/NavItems/tools/Analysis/Results/YoutubeResults";

const AssistantCommentResult = ({ collectedComments, youtubeComments }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  //const sharedKeyword = i18nLoadNamespace("components/Shared/utils");
  const expandMinimiseText = keyword("expand_minimise_text");

  const classes = useMyStyles();
  const dispatch = useDispatch();
  const pageSize = 20;
  const numPages = Math.ceil(collectedComments.length / pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const targetObliviousStanceResult = useSelector(
    (state) => state.assistant.targetObliviousStanceResult,
  );
  const targetObliviousStanceLoading = useSelector(
    (state) => state.assistant.targetObliviousStanceLoading,
  );
  const targetObliviousStanceDone = useSelector(
    (state) => state.assistant.targetObliviousStanceDone,
  );
  const targetObliviousStanceColours = {
    support: "success",
    deny: "error",
    query: "warning",
    comment: "inherit",
  };

  // organise collectedComments into groups
  let denyComments = [];
  let supportComments = [];
  let queryComments = [];
  for (let i = 0; i < collectedComments.length; i++) {
    // add stance
    const stance = targetObliviousStanceResult
      ? targetObliviousStanceResult[collectedComments[i].id]
      : null;
    stance == "query" ? queryComments.push(collectedComments[i]) : null;
    stance == "support" ? supportComments.push(collectedComments[i]) : null;
    stance == "deny" ? denyComments.push(collectedComments[i]) : null;
    // add link
    // TODO get this working correctly
    // const commentText = collectedComments
    //   ? collectedComments[i].textOriginal
    //   : null;
    // commentText.search(/www./i)
    //   ? linkComments.push(collectedComments[i])
    //   : null;
    // add verification
    // TODO code for pattern recognition
  }

  function renderCommentTable(commentList) {
    return (
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">{keyword("user")}</TableCell>
            {/* <TableCell className={styles.size} align="center"> */}
            <TableCell>{keyword("twitter_user_name_13")}</TableCell>
            <TableCell align="center">
              {keyword("twitter_user_name_5")}
            </TableCell>
            <TableCell align="center">{keyword("stance_title")}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {" "}
          {/*className={styles.container}>*/}
          {commentList.map((comment, key) => {
            return (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  <a
                    href={
                      "https://www.youtube.com/" + comment["authorDisplayName"]
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {comment["authorDisplayName"]}
                  </a>
                </TableCell>
                <TableCell align="center">
                  {/* 2024-11-15, 20:51:54 UTC */}
                  {comment["publishedAt"]}
                </TableCell>
                <TableCell align="left">
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a target="blank" href={decoratedHref} key={key}>
                        {decoratedText}
                      </a>
                    )}
                  >
                    {comment.textOriginal}
                  </Linkify>
                </TableCell>

                <TableCell align="center">
                  {targetObliviousStanceLoading && (
                    <Skeleton variant="rounded" />
                  )}
                  {targetObliviousStanceDone &&
                    targetObliviousStanceResult != null && (
                      <Tooltip
                        interactive={"true"}
                        title={
                          <>
                            <TransTargetObliviousStanceTooltip
                              keyword={keyword}
                            />
                            <TransTargetObliviousStanceLink keyword={keyword} />
                          </>
                        }
                        classes={{ tooltip: classes.assistantTooltip }}
                      >
                        <Chip
                          label={keyword(
                            targetObliviousStanceResult[comment.id],
                          )}
                          color={
                            targetObliviousStanceColours[
                              targetObliviousStanceResult[comment.id]
                            ]
                          }
                          size="small"
                        />
                      </Tooltip>
                    )}
                </TableCell>

                <TableCell>
                  <TextCopy text={comment.textOriginal} index={key} />
                  <Translate text={comment.textOriginal} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  function renderCommentList(commentList, offset = null, pageSize = null) {
    let renderedComments = [];
    if (offset === null) {
      offset = 0;
      pageSize = 99999;
    }

    let lastIndex = commentList.length;
    if (offset + pageSize < lastIndex) {
      lastIndex = offset + pageSize;
    }
    for (let i = offset; i < lastIndex; i++) {
      const comment = commentList[i];
      const commentId = comment.id;
      const text = comment.textOriginal;
      const authorName = comment.authorDisplayName;
      const publishedDate = moment(comment.publishedAt);
      const updatedDate = moment(comment.updatedAt);
      const targetObliviousStance = targetObliviousStanceResult
        ? targetObliviousStanceResult[commentId]
        : null;
      const targetObliviousStanceColours = {
        support: "success",
        deny: "error",
        query: "warning",
        comment: "inherit",
      };

      let renderedReplies = [];
      if ("replies" in comment) {
        renderedReplies = renderCommentList(comment.replies);
      }
      renderedComments.push(
        <ListItem key={comment.id}>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <div>
                <span style={{ fontWeight: "bold" }}>{authorName}</span>{" "}
                <span style={{ fontStyle: "italic", fontSize: "small" }}>
                  {updatedDate.format("Do MMM YYYY hh:mm")}
                </span>
                <span style={{ float: "right" }}>
                  {targetObliviousStanceLoading ? (
                    <Skeleton variant="rounded" width={60} height={20} />
                  ) : null}
                  {targetObliviousStanceDone &&
                  targetObliviousStanceResult[commentId] ? (
                    <Tooltip
                      interactive={"true"}
                      title={
                        <>
                          <TransTargetObliviousStanceTooltip
                            keyword={keyword}
                          />
                          <TransTargetObliviousStanceLink keyword={keyword} />
                        </>
                      }
                      classes={{ tooltip: classes.assistantTooltip }}
                    >
                      <Chip
                        label={
                          keyword("stance_label") +
                          keyword(targetObliviousStance)
                        }
                        color={
                          targetObliviousStanceColours[targetObliviousStance]
                        }
                        size="small"
                      />
                    </Tooltip>
                  ) : null}
                </span>
              </div>
              <Divider flexItem />
              <p>{text}</p>
              {renderedReplies}
            </CardContent>
          </Card>
        </ListItem>,
      );
    }

    return <List>{renderedComments}</List>;
  }

  function renderComments(comments, allComments) {
    if (allComments) {
      const offset = (currentPage - 1) * pageSize;
      return renderCommentTable(comments, offset, pageSize);
    }
    return renderCommentTable(comments, null, null);
  }

  function pageChangeHandler(event, page) {
    setCurrentPage(page);
  }

  return (
    <Card data-testid="assistant-collected-comments">
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("collected_comments_title")}
        action={
          <Tooltip
            interactive={"true"}
            title={
              <>
                <Trans t={keyword} i18nKey="collected_comments_tooltip" />
                <TransHtmlDoubleLineBreak keyword={keyword} />
                <TransTargetObliviousStanceTooltip keyword={keyword} />
                <TransTargetObliviousStanceLink keyword={keyword} />
              </>
            }
            classes={{ tooltip: classes.assistantTooltip }}
          >
            <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
          </Tooltip>
        }
      />

      {targetObliviousStanceLoading ? (
        <div>
          <LinearProgress />
        </div>
      ) : null}

      <CardContent width="100%">
        <Box m={2} />
        {console.log(youtubeComments)}
        {youtubeComments && (
          <AnalysisComments
            type="YOUTUBE"
            classes={classes}
            title={"youtube_comment_title"}
            keyword={keyword}
            report={youtubeComments}
            setAnalysisComments={setAnalysisComments}
            setAnalysisLinkComments={setAnalysisLinkComments}
            setAnalysisVerifiedComments={setAnalysisVerifiedComments}
          />
        )}
        {/* {youtubeComments && youtubeComments.coms.comments.length >= 1 && (
          <CommentsPanel
            title={"api_comments"}
            classes={classes}
            keyword={keyword}
            report={youtubeComments.coms} //
            targetObliviousStance={targetObliviousStanceResult} //
            nb_comments={youtubeComments.coms.pagination.total_comments}
            setCommentsAction={setAnalysisComments} //
            commentsData={youtubeComments.coms.comments}
            com_type={"coms"}
          />
        )}
        <Box m={2} />
        {youtubeComments && youtubeComments.vercoms.comments.length >= 1 && (
          <CommentsPanel
            title={"api_comments_verified"}
            classes={classes}
            keyword={keyword}
            report={youtubeComments.vercoms} //
            targetObliviousStance={targetObliviousStanceResult} //
            nb_comments={youtubeComments.vercoms.pagination.total_comments}
            setCommentsAction={setAnalysisVerifiedComments} //
            commentsData={youtubeComments.vercoms.comments}
            com_type={"vercoms"}
          />
        )}
        <Box m={2} />
        {youtubeComments && youtubeComments.linkcoms.comments.length >= 1 && (
          <CommentsPanel
            title={"link_comments"}
            classes={classes}
            keyword={keyword}
            report={youtubeComments.linkcoms} //
            targetObliviousStance={targetObliviousStanceResult} //
            nb_comments={youtubeComments.linkcoms.pagination.total_comments}
            setCommentsAction={setAnalysisLinkComments} //
            commentsData={youtubeComments.linkcoms.comments}
            com_type={"linkcoms"}
          />
        )} */}

        <Box m={2} />

        {/* all comments */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            disabled={collectedComments.length < 1}
          >
            <Typography>
              {keyword("api_comments") + " (" + collectedComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Pagination
              count={numPages}
              variant="outlined"
              onChange={pageChangeHandler}
              page={currentPage}
            />
            {renderComments(collectedComments, true)}
            <Pagination
              count={numPages}
              variant="outlined"
              onChange={pageChangeHandler}
              page={currentPage}
            />
          </AccordionDetails>
        </Accordion>

        {/* stance: deny comments */}
        <Accordion hidden={denyComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_deny_comments") +
                " (" +
                denyComments.length +
                ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderComments(denyComments)}</AccordionDetails>
        </Accordion>

        {/* stance: support comments */}
        <Accordion hidden={supportComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_support_comments") +
                " (" +
                supportComments.length +
                ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderComments(supportComments)}</AccordionDetails>
        </Accordion>

        {/* stance: query comments */}
        <Accordion hidden={queryComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_query_comments") +
                " (" +
                queryComments.length +
                ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderComments(queryComments)}</AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
export default AssistantCommentResult;
