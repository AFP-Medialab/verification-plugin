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
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { TextCopy } from "@/components/Shared/Utils/TextCopy";
import { Translate } from "@/components/Shared/Utils/Translate";
import moment from "moment/moment";
import PropTypes from "prop-types";

import {
  A_STYLE,
  TransHtmlDoubleLineBreak,
  TransMultilingualStanceLink,
  TransMultilingualStanceTooltip,
} from "../TransComponents";

const AssistantCommentResult = ({ collectedComments }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  //const sharedKeyword = i18nLoadNamespace("components/Shared/utils");

  const classes = useMyStyles();

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

  const repliesColumnWidth = 70;
  const optionsColumnWidth = 90;

  // read in verification keywords from TSV file in public/ folder
  const [caaVerificationKeywordsTsv, setCaaVerificationKeywordsTsv] = useState(
    [],
  );

  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

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
          <TableCell width={repliesColumnWidth}>
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
            <TextCopy text={row.textOriginal} index={row.id} />
            <Translate text={row.textOriginal} />
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
                      <col key={index} style={{ width }} />
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
                        <TableCell></TableCell>

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
                        <TableCell>
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
                          <TextCopy
                            text={repliesRow.textOriginal}
                            index={repliesRow.id}
                          />
                          <Translate text={repliesRow.textOriginal} />
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

  function CollapsibleTable({ comments }) {
    const rows = comments.map((comment) =>
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
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
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
    );
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
            <CollapsibleTable comments={collectedComments} />
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
            <CollapsibleTable comments={linkComments} />
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
            <CollapsibleTable comments={verificationComments} />
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
            <CollapsibleTable comments={supportComments} />
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
            <CollapsibleTable comments={queryComments} />
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
            <CollapsibleTable comments={denyComments} />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};
export default AssistantCommentResult;
