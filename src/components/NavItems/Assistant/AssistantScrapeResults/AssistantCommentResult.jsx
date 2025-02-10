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
  Switch,
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
  const pageSize = 5;
  //const numPages = Math.ceil(collectedComments.length / pageSize);
  const [currentAllPage, setCurrentAllPage] = useState(1);
  const [currentLinkPage, setCurrentLinkPage] = useState(1);
  const [currentVerificationPage, setCurrentVerificationPage] = useState(1);
  const [currentSupportPage, setCurrentSupportPage] = useState(1);
  const [currentQueryPage, setCurrentQueryPage] = useState(1);
  const [currentDenyPage, setCurrentDenyPage] = useState(1);
  const [currentMultilingualSupportPage, setCurrentMultilingualSupportPage] =
    useState(1);
  const [currentMultilingualQueryPage, setCurrentMultilingualQueryPage] =
    useState(1);
  const [currentMultilingualDenyPage, setCurrentMultilingualDenyPage] =
    useState(1);

  // multilingual stance classifier state
  const [multilingualStanceClassifier, setMultilingualStanceClassifier] =
    useState(false);

  // target oblivious stance classifier
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
  const stanceColours = {
    support: "success",
    deny: "error",
    query: "warning",
    comment: "inherit",
  };
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

  // group comments by links, verification and stance
  let totalCommentsWithReplies = 0;
  let linkComments = [];
  let verificationComments = [];
  let denyComments = [];
  let supportComments = [];
  let queryComments = [];
  let multilingualDenyComments = [];
  let multilingualSupportComments = [];
  let multilingualQueryComments = [];
  for (let i = 0; i < collectedComments.length; i++) {
    let text = collectedComments[i].textOriginal;
    // search for link
    text
      .split(" ")
      .find((word) => word.startsWith("http") || word.startsWith("www."))
      ? linkComments.push(collectedComments[i])
      : null;
    // search for verification text
    caaVerificationKeywords.some((caaVerificationKeyword) =>
      text.split(" ").includes(caaVerificationKeyword),
    )
      ? verificationComments.push(collectedComments[i])
      : null;
    // add stance
    const stance = targetObliviousStanceResult
      ? targetObliviousStanceResult[collectedComments[i].id].stance
      : null;
    stance == "query" ? queryComments.push(collectedComments[i]) : null;
    stance == "support" ? supportComments.push(collectedComments[i]) : null;
    stance == "deny" ? denyComments.push(collectedComments[i]) : null;
    // add multilingual stance
    const multilingualStance = multilingualStanceResult
      ? multilingualStanceResult[collectedComments[i].id].stance
      : null;
    multilingualStance == "query"
      ? multilingualQueryComments.push(collectedComments[i])
      : null;
    multilingualStance == "support"
      ? multilingualSupportComments.push(collectedComments[i])
      : null;
    multilingualStance == "deny"
      ? multilingualDenyComments.push(collectedComments[i])
      : null;
    // number of comments and replies
    totalCommentsWithReplies += 1;
    collectedComments[i].replies
      ? (totalCommentsWithReplies += collectedComments[i].replies.length)
      : null;
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
      const targetObliviousStance = targetObliviousStanceResult
        ? targetObliviousStanceResult[commentId]
        : null;
      const multilingualStance = multilingualStanceResult
        ? multilingualStanceResult[commentId]
        : null;

      let renderedReplies = [];
      if ("replies" in comment) {
        renderedReplies = renderCommentList(replies, stanceColours, true);
      }
      renderedComments.push(
        <TableRow
          key={key}
          sx={commentReplies ? null : { backgroundColor: "#e0f2f1" }}
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

          {/* stance: switch between target oblivious and multilingual */}
          {multilingualStanceClassifier ? (
            <TableCell align="center">
              {multilingualStanceLoading && <Skeleton variant="rounded" />}
              {multilingualStanceDone && multilingualStanceResult != null && (
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
          ) : (
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
                      label={keyword(
                        targetObliviousStanceResult[commentId].stance,
                      )}
                      color={
                        stanceColours[
                          targetObliviousStanceResult[commentId].stance
                        ]
                      }
                      size="small"
                    />
                  </Tooltip>
                )}
              {targetObliviousStanceFail && <Chip label="Service failed" />}
            </TableCell>
          )}

          {/* options */}
          <TableCell>
            <TextCopy text={text} index={key} />
            <Translate text={text} />
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
                <Typography display="inline">{keyword("TO")}</Typography>
                <Switch
                  size="small"
                  checked={multilingualStanceClassifier}
                  onChange={switchChangeHandler}
                  //inputProps={{ 'aria-label': 'controlled' }}
                />
                <Typography display="inline">{keyword("ML")}</Typography>
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

  // switch for different stance classifiers
  function switchChangeHandler(event) {
    multilingualStanceClassifier
      ? setMultilingualStanceClassifier(false)
      : setMultilingualStanceClassifier(true);
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
  function multilingualSupportPageChangeHandler(event, page) {
    setCurrentMultilingualSupportPage(page);
  }
  function multilingualQueryPageChangeHandler(event, page) {
    setCurrentMultilingualQueryPage(page);
  }
  function multilingualDenyPageChangeHandler(event, page) {
    setCurrentMultilingualDenyPage(page);
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
            <Typography>
              {keyword("stance_label")}
              {keyword("target_oblivious_comments")}
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
            <Typography>
              {keyword("stance_label")}
              {keyword("target_oblivious_comments")}
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
            <Typography>
              {keyword("stance_label")}
              {keyword("target_oblivious_comments")}
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

        {/* multilingual stance: support comments */}
        <Accordion hidden={supportComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_label")}
              {keyword("multilingual_comments")}
              <Chip
                label={keyword("support")}
                color={stanceColours.support}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + multilingualSupportComments.length + ")"}
              {" multilingual"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComments(
              multilingualSupportComments,
              multilingualSupportPageChangeHandler,
              currentMultilingualSupportPage,
              Math.ceil(multilingualSupportComments.length / pageSize),
            )}
          </AccordionDetails>
        </Accordion>

        {/* multilingual stance: query comments */}
        <Accordion hidden={queryComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_label")}
              {keyword("multilingual_comments")}
              <Chip
                label={keyword("query")}
                color={stanceColours.query}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + multilingualQueryComments.length + ")"}
              {" multilingual"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComments(
              multilingualQueryComments,
              multilingualQueryPageChangeHandler,
              currentMultilingualQueryPage,
              Math.ceil(multilingualQueryComments.length / pageSize),
            )}
          </AccordionDetails>
        </Accordion>

        {/* multilingual stance: deny comments */}
        <Accordion hidden={denyComments.length < 1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {keyword("stance_label")}
              {keyword("multilingual_comments")}
              <Chip
                label={keyword("deny")}
                color={stanceColours.deny}
                size="small"
              />{" "}
              {keyword("comments_label")}
              {" (" + multilingualDenyComments.length + ")"}
              {" multilingual"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderComments(
              multilingualDenyComments,
              multilingualDenyPageChangeHandler,
              currentMultilingualDenyPage,
              Math.ceil(multilingualDenyComments.length / pageSize),
            )}
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
export default AssistantCommentResult;
