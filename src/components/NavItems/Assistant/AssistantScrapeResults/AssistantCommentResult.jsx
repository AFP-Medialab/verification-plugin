import React, { useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import Linkify from "react-linkify";
import { useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CommentIcon from "@mui/icons-material/Comment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

import CopyButton from "@/components/Shared/CopyButton";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { Translate } from "@/components/Shared/Utils/Translate";
import moment from "moment/moment";
import PropTypes from "prop-types";

import {
  A_STYLE,
  TransHtmlDoubleLineBreak,
  TransMultilingualStanceLink,
  TransMultilingualStanceTooltip,
  TransUsfdAuthor,
} from "../TransComponents";

const AssistantCommentResult = ({ collectedComments }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();

  // pagination
  const pageSize = 5;
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

  // define colours
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

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

  // create the row data from each top level comment
  function createData(
    id,
    commentNum,
    authorChannelUrl,
    authorDisplayName,
    publishedAt,
    textOriginal,
    replies,
  ) {
    return {
      id,
      commentNum,
      authorChannelUrl,
      authorDisplayName,
      publishedAt,
      textOriginal,
      replies,
    };
  }

  // fixed column widths
  const repliesColumnWidth = 70;
  const optionsColumnWidth = 90;

  // create top level comment rows with collapsible reply rows if exist
  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    const parentRowRef = useRef(null);
    const [colWidths, setColWidths] = useState([]);

    // resize replies columns to match top level comment columns
    useEffect(() => {
      const updateColumnWidths = () => {
        if (parentRowRef.current) {
          const cells = parentRowRef.current.querySelectorAll("td");
          const widths = Array.from(cells)
            .slice(1)
            .map((cell) => cell.getBoundingClientRect().width);
          setColWidths(widths);
        }
      };

      const observer = new ResizeObserver(() => {
        updateColumnWidths();
      });

      if (parentRowRef.current) {
        observer.observe(parentRowRef.current);
        window.addEventListener("resize", updateColumnWidths);
      }

      // init
      updateColumnWidths();

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateColumnWidths);
      };
    }, []);

    return (
      <React.Fragment>
        {/* top level comments */}
        <TableRow
          ref={parentRowRef}
          sx={{
            "& > *": { borderBottom: "unset" },
            backgroundColor: resolvedMode === "dark" ? "#0c0d0d" : "#e0f2f1",
          }}
        >
          {/* replies collapse */}
          <TableCell width={repliesColumnWidth} align="center">
            {row.replies ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            ) : null}
          </TableCell>

          {/* comment number */}
          <TableCell align="center">{row.commentNum}</TableCell>

          {/* username */}
          <TableCell sx={{ textAlign: "start" }}>
            <Typography variant="p">
              <Linkify>
                <a
                  href={row.authorChannelUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  style={A_STYLE}
                >
                  {row.authorDisplayName}
                </a>
              </Linkify>
            </Typography>
          </TableCell>

          {/* date published */}
          <TableCell align="center">
            {moment(row.publishedAt).format("l") +
              " " +
              moment(row.publishedAt).format("LT")}
          </TableCell>

          {/* comment text */}
          <TableCell sx={{ textAlign: "start" }}>{row.textOriginal}</TableCell>

          {/* stance */}
          <TableCell align="center">
            {multilingualStanceLoading && <Skeleton variant="rounded" />}
            {multilingualStanceDone && multilingualStanceResult != null && (
              <Tooltip
                interactive={"true"}
                title={
                  <>
                    <TransMultilingualStanceTooltip keyword={keyword} />
                    <TransUsfdAuthor keyword={keyword} />
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                    <TransMultilingualStanceLink keyword={keyword} />
                  </>
                }
                classes={{ tooltip: classes.assistantTooltip }}
              >
                <Chip
                  label={keyword(multilingualStanceResult[row.id].stance)}
                  color={stanceColours[multilingualStanceResult[row.id].stance]}
                  size="small"
                />
              </Tooltip>
            )}
            {multilingualStanceFail && (
              <Chip label={keyword("stance_service_failed")} />
            )}
          </TableCell>

          {/* options */}
          <TableCell align="center" width={optionsColumnWidth}>
            <Stack direction="row" alignItems="center">
              <CopyButton
                strToCopy={row.textOriginal}
                labelBeforeCopy={keyword("copy_to_clipboard")}
                labelAfterCopy={keyword("copied_to_clipboard")}
              />
              <Tooltip title={keyword("translate")}>
                <div>
                  <Translate text={row.textOriginal} />
                </div>
              </Tooltip>
            </Stack>
          </TableCell>
        </TableRow>

        {/* replies */}
        <TableRow>
          <TableCell
            sx={{ padding: 0, border: 0 }}
            width={repliesColumnWidth}
            colSpan={7}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box>
                {/*  colgroup  */}
                <Table size="small" aria-label="replies">
                  {/* column group */}
                  <colgroup>
                    <col style={{ width: repliesColumnWidth }} />
                    {/* dynamic col width */}
                    {colWidths.map((width, index) => (
                      <col key={index} style={{ width: width }} />
                    ))}
                  </colgroup>

                  <TableBody>
                    {row.replies?.map((repliesRow) => (
                      <TableRow key={repliesRow.id}>
                        {/* replies minimise/expand or empty if reply comment */}
                        <TableCell
                          width={repliesColumnWidth}
                          sx={{ border: 0 }}
                        ></TableCell>

                        {/* comment num or empty if reply comment*/}
                        <TableCell>
                          <ReplyOutlinedIcon color="action" />
                        </TableCell>

                        {/* username */}
                        <TableCell sx={{ textAlign: "start" }}>
                          <Typography variant="p">
                            <Linkify>
                              <a
                                href={repliesRow.authorChannelUrl}
                                rel="noopener noreferrer"
                                target="_blank"
                                style={A_STYLE}
                              >
                                {repliesRow.authorDisplayName}
                              </a>
                            </Linkify>
                          </Typography>
                        </TableCell>

                        {/* date published */}
                        <TableCell align="center">
                          {moment(repliesRow.publishedAt).format("l") +
                            " " +
                            moment(repliesRow.publishedAt).format("LT")}
                        </TableCell>

                        {/* comment text */}
                        <TableCell sx={{ textAlign: "start" }}>
                          <Typography variant="p">
                            <Linkify
                              componentDecorator={(
                                decoratedHref,
                                decoratedText,
                                key,
                              ) => (
                                <a
                                  target="blank"
                                  href={decoratedHref}
                                  key={key}
                                >
                                  {decoratedText}
                                </a>
                              )}
                            >
                              {repliesRow.textOriginal}
                            </Linkify>
                          </Typography>
                        </TableCell>

                        {/* stance */}
                        <TableCell align="center">
                          {multilingualStanceLoading && (
                            <Skeleton variant="rounded" />
                          )}
                          {multilingualStanceDone &&
                            multilingualStanceResult != null && (
                              <Tooltip
                                interactive={"true"}
                                title={
                                  <>
                                    <TransMultilingualStanceTooltip
                                      keyword={keyword}
                                    />
                                    <TransMultilingualStanceLink
                                      keyword={keyword}
                                    />
                                  </>
                                }
                                classes={{ tooltip: classes.assistantTooltip }}
                              >
                                <Chip
                                  label={keyword(
                                    multilingualStanceResult[repliesRow.id]
                                      .stance,
                                  )}
                                  color={
                                    stanceColours[
                                      multilingualStanceResult[repliesRow.id]
                                        .stance
                                    ]
                                  }
                                  size="small"
                                />
                              </Tooltip>
                            )}
                          {multilingualStanceFail && (
                            <Chip label={keyword("stance_service_failed")} />
                          )}
                        </TableCell>

                        {/* options */}
                        <TableCell align="center" width={optionsColumnWidth}>
                          <Stack direction="row" alignItems="center">
                            <CopyButton
                              strToCopy={repliesRow.textOriginal}
                              labelBeforeCopy={keyword("copy_to_clipboard")}
                              labelAfterCopy={keyword("copied_to_clipboard")}
                            />
                            <Tooltip title={keyword("translate")}>
                              <div>
                                <Translate text={repliesRow.textOriginal} />
                              </div>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  // define Row object
  Row.propTypes = {
    row: PropTypes.shape({
      commentNum: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      authorChannelUrl: PropTypes.string.isRequired,
      authorDisplayName: PropTypes.string.isRequired,
      publishedAt: PropTypes.string.isRequired,
      textOriginal: PropTypes.string.isRequired,
      replies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          authorChannelUrl: PropTypes.string.isRequired,
          authorDisplayName: PropTypes.string.isRequired,
          publishedAt: PropTypes.string.isRequired,
          textOriginal: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  };

  // define collapsible tablle component
  function CollapsibleTable({
    comments,
    pageChangeHandler,
    currentPage,
    numPages,
  }) {
    const offset = (currentPage - 1) * pageSize;
    let lastIndex = comments.length;
    if (offset + pageSize < lastIndex) {
      lastIndex = offset + pageSize;
    }

    const rows = comments
      .slice(offset, lastIndex)
      .map((comment) =>
        createData(
          comment.id,
          comment.commentNum,
          comment.authorChannelUrl,
          comment.authorDisplayName,
          comment.publishedAt,
          comment.textOriginal,
          comment.replies || null,
        ),
      );

    return (
      <>
        {comments.length > 5 ? (
          <Box sx={{ mb: 1 }}>
            <Pagination
              count={numPages}
              variant="outlined"
              onChange={pageChangeHandler}
              page={currentPage}
            />
          </Box>
        ) : null}

        <TableContainer component={Paper}>
          <Table size="small" aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width={repliesColumnWidth}>
                  <Typography>
                    {keyword("youtube_comments_replies_title")}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>#</Typography>
                </TableCell>
                <TableCell align={"center"}>
                  <Typography>{keyword("user")}</Typography>
                </TableCell>
                <TableCell align={"center"}>
                  <Typography>
                    {keyword("youtube_comments_published_title")}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{keyword("comment")}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{keyword("stance_title")}</Typography>
                </TableCell>
                <TableCell align="center" width={optionsColumnWidth}>
                  <Typography>{keyword("options")}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {comments.length > 5 ? (
          <Box sx={{ mt: 1 }}>
            <Pagination
              count={numPages}
              variant="outlined"
              onChange={pageChangeHandler}
              page={currentPage}
            />
          </Box>
        ) : null}
      </>
    );
  }

  // pagination for sorted comments
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
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CommentIcon color="primary" />
            {keyword("collected_comments_title")}
          </Box>
        }
        action={
          <Tooltip
            interactive={"true"}
            title={
              <>
                <Trans t={keyword} i18nKey="collected_comments_tooltip" />
                <TransHtmlDoubleLineBreak keyword={keyword} />
                <TransMultilingualStanceTooltip keyword={keyword} />
                <TransUsfdAuthor keyword={keyword} />
                <TransHtmlDoubleLineBreak keyword={keyword} />
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
            <CollapsibleTable
              comments={collectedComments}
              pageChangeHandler={allPageChangeHandler}
              currentPage={currentAllPage}
              numPages={Math.ceil(collectedComments.length / pageSize)}
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
          <AccordionDetails>
            <CollapsibleTable
              comments={linkComments}
              pageChangeHandler={linkPageChangeHandler}
              currentPage={currentLinkPage}
              numPages={Math.ceil(linkComments.length / pageSize)}
            />
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
            <CollapsibleTable
              comments={verificationComments}
              pageChangeHandler={verificationPageChangeHandler}
              currentPage={currentVerificationPage}
              numPages={Math.ceil(verificationComments.length / pageSize)}
            />
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
            <CollapsibleTable
              comments={supportComments}
              pageChangeHandler={supportPageChangeHandler}
              currentPage={currentSupportPage}
              numPages={Math.ceil(supportComments.length / pageSize)}
            />
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
            <CollapsibleTable
              comments={queryComments}
              pageChangeHandler={queryPageChangeHandler}
              currentPage={currentQueryPage}
              numPages={Math.ceil(queryComments.length / pageSize)}
            />
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
            <CollapsibleTable
              comments={denyComments}
              pageChangeHandler={denyPageChangeHandler}
              currentPage={currentDenyPage}
              numPages={Math.ceil(denyComments.length / pageSize)}
            />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
export default AssistantCommentResult;
