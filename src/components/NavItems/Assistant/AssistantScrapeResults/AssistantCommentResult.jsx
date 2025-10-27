import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import Linkify from "react-linkify";
import { useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { SubdirectoryArrowRight } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { TextCopy } from "@/components/Shared/Utils/TextCopy";
import { Translate } from "@/components/Shared/Utils/Translate";
import moment from "moment/moment";

import {
  TransHtmlDoubleLineBreak,
  TransMultilingualStanceLink,
  TransMultilingualStanceTooltip,
} from "../TransComponents";

const AssistantCommentResult = ({ collectedComments }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  //const sharedKeyword = i18nLoadNamespace("components/Shared/utils");

  const classes = useMyStyles();

  const pageSize = 5;
  //const numPages = Math.ceil(collectedComments.length / pageSize);
  const [currentAllPage, setCurrentAllPage] = useState(1);
  const [currentLinkPage, setCurrentLinkPage] = useState(1);
  const [currentVerificationPage, setCurrentVerificationPage] = useState(1);
  const [currentSupportPage, setCurrentSupportPage] = useState(1);
  const [currentQueryPage, setCurrentQueryPage] = useState(1);
  const [currentDenyPage, setCurrentDenyPage] = useState(1);

  // multilingual stance classifier
  const multilingualStanceResult = useSelector(
    (state) => state.assistant.multilingualStanceResult,
  );
  const multilingualStanceLoading = useSelector(
    (state) => state.assistant.multilingualStanceLoading,
  );
  const multilingualStanceDone = useSelector(
    (state) => state.assistant.multilingualStanceDone,
  );
  const multilingualStanceFail = useSelector(
    (state) => state.assistant.multilingualStanceFail,
  );
  const stanceColours = {
    support: "success",
    deny: "error",
    query: "warning",
    comment: "inherit",
  };

  // read in verification keywords from TSV file in public/ folder
  const [caaVerificationKeywordsTsv, setCaaVerificationKeywordsTsv] = useState(
    [],
  );

  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  const backgroundColor = resolvedMode === "dark" ? "#0c0d0d" : "#e0f2f1";

  useEffect(() => {
    fetch("/caaVerificationKeywords.tsv")
      .then((response) => response.text())
      .then((text) => {
        let lines = text.split("\n");
        // skip first line with languages header
        for (let i = 1; i < lines.length; i++) {
          let words = lines[i].split("\t");
          words.forEach((word) => caaVerificationKeywordsTsv.push(word));
        }
        setCaaVerificationKeywordsTsv(caaVerificationKeywordsTsv);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // group comments by links, verification and stance
  let linkComments = [];
  let verificationComments = [];
  let denyComments = [];
  let supportComments = [];
  let queryComments = [];
  for (let i = 0; i < collectedComments.length; i++) {
    let text = collectedComments[i].textOriginal;
    // search for link
    text
      .split(" ")
      .find((word) => word.startsWith("http") || word.startsWith("www."))
      ? linkComments.push(collectedComments[i])
      : null;
    // search for verification text
    caaVerificationKeywordsTsv.some((caaVerificationKeyword) =>
      text.split(" ").includes(caaVerificationKeyword),
    )
      ? verificationComments.push(collectedComments[i])
      : null;
    // add stance
    const stance = multilingualStanceResult
      ? multilingualStanceResult[collectedComments[i].id].stance
      : null;
    stance === "query" ? queryComments.push(collectedComments[i]) : null;
    stance === "support" ? supportComments.push(collectedComments[i]) : null;
    stance === "deny" ? denyComments.push(collectedComments[i]) : null;
  }

  // for collectedComments
  function renderCommentList(
    commentList,
    stanceColours,
    commentReplies = true,
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
      const commentNum = comment.commentNum;
      const key = commentId;
      const text = comment.textOriginal;
      const replies = comment.replies;
      const authorName = comment.authorDisplayName;
      const authorChannelUrl = comment.authorChannelUrl;
      const publishedDate =
        moment(comment.publishedAt).format("l") +
        " " +
        moment(comment.publishedAt).format("LT");

      let renderedReplies = [];
      if ("replies" in comment) {
        renderedReplies = renderCommentList(replies, stanceColours, true);
      }

      renderedComments.push(
        <TableRow
          key={key}
          sx={commentReplies ? null : { backgroundColor: backgroundColor }}
        >
          {/* hash */}
          <TableCell align="center">
            <Typography variant="p">
              {commentReplies ? (
                <SubdirectoryArrowRight sx={{ color: "grey" }} />
              ) : (
                <Typography>{commentNum}</Typography>
              )}
            </Typography>
          </TableCell>

          {/* user */}
          <TableCell component="th" scope="row">
            <Typography variant="p">
              <Linkify>
                <a
                  href={authorChannelUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {authorName}
                </a>
              </Linkify>
            </Typography>
          </TableCell>

          {/* created date */}
          <TableCell align="center">
            {/* 2024-11-15, 20:51:54 UTC */}
            <Typography variant="p">{publishedDate}</Typography>
          </TableCell>

          {/* description/comment */}
          <TableCell align="left">
            <Typography variant="p">
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <a target="blank" href={decoratedHref} key={key}>
                    {decoratedText}
                  </a>
                )}
              >
                {text}
              </Linkify>
            </Typography>
          </TableCell>

          {/* stance multilingual */}
          <TableCell align="center">
            {multilingualStanceLoading && <Skeleton variant="rounded" />}
            {multilingualStanceDone && multilingualStanceResult != null && (
              <Tooltip
                interactive={"true"}
                title={
                  <>
                    <TransMultilingualStanceTooltip keyword={keyword} />
                    <TransMultilingualStanceLink keyword={keyword} />
                  </>
                }
                classes={{ tooltip: classes.assistantTooltip }}
              >
                <Chip
                  label={keyword(multilingualStanceResult[commentId].stance)}
                  color={
                    stanceColours[multilingualStanceResult[commentId].stance]
                  }
                  size="small"
                />
              </Tooltip>
            )}
            {multilingualStanceFail && <Chip label="Service failed" />}
          </TableCell>

          {/* options */}
          <TableCell>
            <Tooltip title={keyword("copy_to_clipboard")}>
              <div>
                <TextCopy text={text} index={key} />
              </div>
            </Tooltip>
            <Tooltip title={keyword("translate")}>
              <div>
                <Translate text={text} />
              </div>
            </Tooltip>
          </TableCell>
        </TableRow>,
      );

      replies ? renderedComments.push(renderedReplies) : null;
    }

    return renderedComments;
  }

  // for collectedComments
  function renderComments(comments, pageChangeHandler, currentPage, numPages) {
    const offset = (currentPage - 1) * pageSize;
    return (
      <>
        {comments.length > 5 ? (
          <Pagination
            count={numPages}
            variant="outlined"
            onChange={pageChangeHandler}
            page={currentPage}
          />
        ) : null}

        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography>#</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>{keyword("user")}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>{keyword("twitter_user_name_13")}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>{keyword("twitter_user_name_5")}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>{keyword("stance_title")}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography>{keyword("options")}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderCommentList(
              comments,
              stanceColours,
              false,
              offset,
              pageSize,
            )}
          </TableBody>
        </Table>

        {comments.length > 5 ? (
          <Pagination
            count={numPages}
            variant="outlined"
            onChange={pageChangeHandler}
            page={currentPage}
          />
        ) : null}
      </>
    );
  }

  // pagination for collectedComments
  function allPageChangeHandler(event, page) {
    setCurrentAllPage(page);
  }

  function linkPageChangeHandler(event, page) {
    setCurrentLinkPage(page);
  }

  function verificationPageChangeHandler(event, page) {
    setCurrentVerificationPage(page);
  }

  function supportPageChangeHandler(event, page) {
    setCurrentSupportPage(page);
  }

  function queryPageChangeHandler(event, page) {
    setCurrentQueryPage(page);
  }

  function denyPageChangeHandler(event, page) {
    setCurrentDenyPage(page);
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
                <TransMultilingualStanceTooltip keyword={keyword} />
                <TransMultilingualStanceLink keyword={keyword} />
              </>
            }
            classes={{ tooltip: classes.assistantTooltip }}
          >
            <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
          </Tooltip>
        }
      />

      {multilingualStanceLoading || caaVerificationKeywordsTsv.length === 0 ? (
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
            {renderComments(
              collectedComments,
              allPageChangeHandler,
              currentAllPage,
              Math.ceil(collectedComments.length / pageSize),
              true,
            )}
          </AccordionDetails>
        </Accordion>

        {/* link comments */}
        <Accordion hidden={linkComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("link_comments") + " (" + linkComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComments(
              linkComments,
              linkPageChangeHandler,
              currentLinkPage,
              Math.ceil(linkComments.length / pageSize),
            )}
          </AccordionDetails>
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
            {renderComments(
              verificationComments,
              verificationPageChangeHandler,
              currentVerificationPage,
              Math.ceil(verificationComments.length / pageSize),
            )}
          </AccordionDetails>
        </Accordion>

        {/* stance: support comments */}
        <Accordion hidden={supportComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              {keyword("stance_label")}
              <Chip
                label={keyword("support")}
                color={stanceColours.support}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + supportComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComments(
              supportComments,
              supportPageChangeHandler,
              currentSupportPage,
              Math.ceil(supportComments.length / pageSize),
            )}
          </AccordionDetails>
        </Accordion>

        {/* stance: query comments */}
        <Accordion hidden={queryComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              {keyword("stance_label")}
              <Chip
                label={keyword("query")}
                color={stanceColours.query}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + queryComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComments(
              queryComments,
              queryPageChangeHandler,
              currentQueryPage,
              Math.ceil(queryComments.length / pageSize),
            )}
          </AccordionDetails>
        </Accordion>

        {/* stance: deny comments */}
        <Accordion hidden={denyComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="div">
              {keyword("stance_label")}
              <Chip
                label={keyword("deny")}
                color={stanceColours.deny}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + denyComments.length + ")"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComments(
              denyComments,
              denyPageChangeHandler,
              currentDenyPage,
              Math.ceil(denyComments.length / pageSize),
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
export default AssistantCommentResult;
