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

import {
  ArrowForward,
  WarningOutlined,
  SubdirectoryArrowRight,
} from "@mui/icons-material";
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
  TransStanceDenyComments,
  TransStanceQueryComments,
  TransStanceSupportComments,
} from "../TransComponents";
import { TextCopy } from "components/Shared/Utils/TextCopy";
import { Translate } from "components/Shared/Utils/Translate";

import { caaVerificationKeywords } from "./caaVerificationKeywords";

const AssistantCommentResult = ({ collectedComments }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  //const sharedKeyword = i18nLoadNamespace("components/Shared/utils");
  const expandMinimiseText = keyword("expand_minimise_text");

  const classes = useMyStyles();
  const dispatch = useDispatch();
  const pageSize = 10;
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
  const targetObliviousStanceFail = useSelector(
    (state) => state.assistant.targetObliviousStanceFail,
  );
  const targetObliviousStanceColours = {
    support: "success",
    deny: "error",
    query: "warning",
    comment: "inherit",
  };

  // group comments by stance
  function sortCommentsByStance(comments) {
    for (let i = 0; i < comments.length; i++) {
      let text = comments[i].textOriginal;
      // search for link
      //text.search("/www./i") > 0 ? linkComments.push(comments[i]) : null;
      //Linkify.find(text) ? linkComments.push(comments[i]) : null;
      // search for verification text
      caaVerificationKeywords.some((caaVerificationKeyword) =>
        text.includes(caaVerificationKeyword),
      )
        ? verificationComments.push(comments[i])
        : null;
      // add stance
      const stance = targetObliviousStanceResult
        ? targetObliviousStanceResult[comments[i].id]
        : null;
      stance == "query" ? queryComments.push(comments[i]) : null;
      stance == "support" ? supportComments.push(comments[i]) : null;
      stance == "deny" ? denyComments.push(comments[i]) : null;
      // number of comments and replies
      totalCommentsWithReplies += 1;
      comments[i].replies
        ? (totalCommentsWithReplies += comments[i].replies.length)
        : null;
    }
    return (
      linkComments,
      verificationComments,
      denyComments,
      supportComments,
      queryComments,
      totalCommentsWithReplies
    );
  }

  let totalCommentsWithReplies = 0;
  let linkComments = [];
  let verificationComments = [];
  let denyComments = [];
  let supportComments = [];
  let queryComments = [];
  linkComments,
    verificationComments,
    denyComments,
    supportComments,
    queryComments,
    (totalCommentsWithReplies = sortCommentsByStance(collectedComments));

  console.log("totalCommentsWithReplies=", totalCommentsWithReplies);

  // for collectedComments
  function renderCommentList(
    commentList,
    replies = true,
    offset = null,
    pageSize = null,
  ) {
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
      const key = commentId;
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
        renderedReplies = renderCommentList(comment.replies, true);
      }
      renderedComments.push(
        <TableRow key={key}>
          {/* hash */}
          <TableCell align="center">
            {replies ? <SubdirectoryArrowRight color="grey" /> : i + 1}
          </TableCell>

          {/* user */}
          <TableCell component="th" scope="row">
            <Linkify>
              <a
                href={comment.authorChannelUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {authorName}
              </a>
            </Linkify>
          </TableCell>

          {/* created date */}
          <TableCell align="center">
            {/* 2024-11-15, 20:51:54 UTC */}
            {comment["publishedAt"]}
          </TableCell>

          {/* description/comment */}
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

          {/* stance */}
          <TableCell align="center">
            {targetObliviousStanceLoading && <Skeleton variant="rounded" />}
            {targetObliviousStanceDone &&
              targetObliviousStanceResult != null && (
                <Tooltip
                  interactive={"true"}
                  title={
                    <>
                      <TransTargetObliviousStanceTooltip keyword={keyword} />
                      <TransTargetObliviousStanceLink keyword={keyword} />
                    </>
                  }
                  classes={{ tooltip: classes.assistantTooltip }}
                >
                  <Chip
                    label={keyword(targetObliviousStanceResult[commentId])}
                    color={
                      targetObliviousStanceColours[
                        targetObliviousStanceResult[commentId]
                      ]
                    }
                    size="small"
                  />
                </Tooltip>
              )}
            {targetObliviousStanceFail && <Chip label="Service failed" />}
          </TableCell>

          {/* options */}
          <TableCell>
            <TextCopy text={text} index={key} />
            <Translate text={text} />
          </TableCell>
        </TableRow>,
      );

      comment.replies ? renderedComments.push(renderedReplies) : null;
    }

    return renderedComments;
  }

  // for collectedComments
  function renderComments(comments) {
    const offset = (currentPage - 1) * pageSize;
    return (
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">
              <Typography>#</Typography>
            </TableCell>
            <TableCell align="center">{keyword("user")}</TableCell>
            <TableCell align="center">
              {keyword("twitter_user_name_13")}
            </TableCell>
            <TableCell align="center">
              {keyword("twitter_user_name_5")}
            </TableCell>
            <TableCell align="center">{keyword("stance_title")}</TableCell>
            <TableCell align="center">{keyword("options")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderCommentList(comments, false, offset, pageSize)}
        </TableBody>
      </Table>
    );
  }
  // for collectedComments
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

        {/* link comments */}
        <Accordion hidden={linkComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("link_comments") + " (" + linkComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderComments(linkComments)}</AccordionDetails>
        </Accordion>

        {/* verification comments */}
        <Accordion hidden={verificationComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("api_comments_verified") +
                " (" +
                verificationComments.length +
                ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComments(verificationComments)}
          </AccordionDetails>
        </Accordion>

        {/* stance: support comments */}
        <Accordion hidden={supportComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_label")}
              <Chip
                label={keyword("support")}
                color={targetObliviousStanceColours.support}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + supportComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderComments(supportComments)}</AccordionDetails>
        </Accordion>

        {/* stance: query comments */}
        <Accordion hidden={queryComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_label")}
              <Chip
                label={keyword("query")}
                color={targetObliviousStanceColours.query}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + queryComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderComments(queryComments)}</AccordionDetails>
        </Accordion>

        {/* stance: deny comments */}
        <Accordion hidden={denyComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_label")}
              <Chip
                label={keyword("deny")}
                color={targetObliviousStanceColours.deny}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + denyComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>{renderComments(denyComments)}</AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
export default AssistantCommentResult;
