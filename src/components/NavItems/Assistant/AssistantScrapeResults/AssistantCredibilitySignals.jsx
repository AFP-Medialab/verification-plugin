import React, { useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CardHeader, CircularProgress, Link, styled } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AssistantTextClassification from "./AssistantTextClassification";
import AssistantTextSpanClassification from "./AssistantTextSpanClassification";
import ResultDisplayItem from "components/NavItems/tools/SemanticSearch/components/ResultDisplayItem";
import dayjs from "dayjs";
import LocaleData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";

import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  Remove,
} from "@mui/icons-material";
import TranslateIcon from "@mui/icons-material/Translate";
import IconButton from "@mui/material/IconButton";
import FileCopyOutlined from "@mui/icons-material/FileCopy";

import { useNavigate } from "react-router-dom";
import { getLanguageName } from "../../../Shared/Utils/languageUtils";

const renderEntityKeys = (entities) => {
  // tidy array into readable string
  let entitiesString = Object.keys(entities)
    .toString()
    .replace("Important_Sentence", "")
    .replaceAll(",", ", ")
    .replaceAll("_", " ")
    .trim();

  // remove beginning and last hanging commas
  if (entitiesString.slice(0, 2) === ", ") {
    entitiesString = entitiesString.substring(2, entitiesString.length);
  }
  if (entitiesString.slice(-1) === ",") {
    entitiesString = entitiesString.substring(0, entitiesString.length - 1);
  }

  return entitiesString;
};

const round = (number, decimalPlaces) => {
  return (Math.round(number * 100) / 100).toFixed(decimalPlaces);
};

const calculateSubjectivity = (sentences) => {
  let scoresSUBJ = [];
  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i].label == "SUBJ") {
      scoresSUBJ.push(Number(sentences[i].score));
    }
  }

  return (
    " (",
    scoresSUBJ.length,
    "/",
    sentences.length,
    ")".toString().replaceAll(",", "")
  );
};

const getExpandIcon = (loading, fail, done = null, role = null) => {
  if (loading || fail || done || (role && !role.includes("BETA_TESTER"))) {
    // "done" is for when subjectivityDone = true and Object.keys(result.entities).length < 1
    return <Remove />;
  } else {
    return <ExpandMoreIcon />;
  }
};

const renderCollapse = (
  classes,
  setDisplayOrigLang,
  displayOrigLang,
  textLang,
  sharedKeyword,
  keyword,
  text,
  displayExpander,
  expanded,
  setExpanded,
) => {
  return (
    <Box mb={1.5}>
      <Divider />
      <Grid container>
        <Grid item xs={6} style={{ display: "flex" }}>
          <Typography
            className={classes.toolTipIcon}
            onClick={() => setDisplayOrigLang(!displayOrigLang)}
          >
            {textLang}
          </Typography>
          <Tooltip title={sharedKeyword("copy_to_clipboard")}>
            <IconButton
              className={classes.toolTipIcon}
              onClick={() => {
                navigator.clipboard.writeText(text);
              }}
            >
              <FileCopyOutlined />
            </IconButton>
          </Tooltip>
          {textLang && textLang !== "en" && textLang !== "" ? (
            <Tooltip title={keyword("translate")}>
              <IconButton
                className={classes.toolTipIcon}
                onClick={() =>
                  window.open(
                    "https://translate.google.com/?sl=auto&text=" +
                      encodeURIComponent(text) +
                      "&op=translate",
                    "_blank",
                  )
                }
              >
                <TranslateIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </Grid>
        <Grid item xs={6} align={"right"}>
          {displayExpander ? (
            expanded ? (
              <ExpandLessOutlined
                className={classes.toolTipIcon}
                onClick={() => {
                  setExpanded(!expanded);
                }}
              />
            ) : (
              <ExpandMoreOutlined
                className={classes.toolTipIcon}
                onClick={() => {
                  setExpanded(!expanded);
                }}
              />
            )
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

const renderCollapsePrevFactChecks = (
  classes,
  displayExpander,
  expanded,
  setExpanded,
  navigate,
  keyword,
) => {
  const handleClick = (path) => {
    // instead need to set parameter then load text in SemanticSearch/index.jsx
    navigate("/app/" + path + "/assistantText");
  };

  return (
    <Box mb={1.5}>
      <Divider />
      <Grid container>
        <Grid item xs={4} align={"left"}>
          <></>
        </Grid>
        <Grid item xs={6} align={"left"}>
          <Typography sx={{ color: "text.secondary", align: "left" }}>
            <p></p>
            {keyword("more_details")}{" "}
            <Link
              sx={{ cursor: "pointer" }}
              onClick={() => handleClick("tools/semanticSearch")}
            >
              {keyword("semantic_search_title")}
            </Link>
          </Typography>
        </Grid>
        <Grid item xs={2} align={"right"}>
          {displayExpander ? (
            expanded ? (
              <ExpandLessOutlined
                className={classes.toolTipIcon}
                onClick={() => {
                  setExpanded(!expanded);
                }}
              />
            ) : (
              <ExpandMoreOutlined
                className={classes.toolTipIcon}
                onClick={() => {
                  setExpanded(!expanded);
                }}
              />
            )
          ) : null}
        </Grid>
      </Grid>
    </Box>
  );
};

const AssistantCredSignals = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const sharedKeyword = i18nLoadNamespace("components/Shared/utils");
  const classes = useMyStyles();

  // displaying expanded text in AccordionDetails
  const [displayOrigLang, setDisplayOrigLang] = useState(true);
  const [displayExpander, setDisplayExpander] = useState(true);
  const [expanded, setExpanded] = useState(true);

  // one accordion open at once
  const [expandedAccordion, setExpandedAccordion] = React.useState("false");
  const handleChange = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : false);
  };

  //style disabled accordion
  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    ".Mui-disabled": {
      opacity: "1 !important",
      background: "white",
    },
  }));

  // assistant media states
  const text = useSelector((state) => state.assistant.urlText);
  const textLang = useSelector((state) => state.assistant.textLang);
  const textHtmlMap = useSelector((state) => state.assistant.urlTextHtmlMap);

  // news framing (topic)
  const newsFramingTitle = keyword("news_framing");
  const newsFramingResult = useSelector(
    (state) => state.assistant.newsFramingResult,
  );
  const newsFramingLoading = useSelector(
    (state) => state.assistant.newsFramingLoading,
  );
  const newsFramingDone = useSelector(
    (state) => state.assistant.newsFramingDone,
  );
  const newsFramingFail = useSelector(
    (state) => state.assistant.newsFramingFail,
  );

  // news genre
  const newsGenreTitle = keyword("news_genre");
  const newsGenreResult = useSelector(
    (state) => state.assistant.newsGenreResult,
  );
  const newsGenreLoading = useSelector(
    (state) => state.assistant.newsGenreLoading,
  );
  const newsGenreDone = useSelector((state) => state.assistant.newsGenreDone);
  const newsGenreFail = useSelector((state) => state.assistant.newsGenreFail);

  // persuasion techniques
  const persuasionTitle = keyword("persuasion_techniques");
  const persuasionResult = useSelector(
    (state) => state.assistant.persuasionResult,
  );
  const persuasionLoading = useSelector(
    (state) => state.assistant.persuasionLoading,
  );
  const persuasionDone = useSelector((state) => state.assistant.persuasionDone);
  const persuasionFail = useSelector((state) => state.assistant.persuasionFail);

  // subjectivity
  const subjectivityTitle = keyword("subjectivity");
  const subjectivityResult = useSelector(
    (state) => state.assistant.subjectivityResult,
  );
  const subjectivityLoading = useSelector(
    (state) => state.assistant.subjectivityLoading,
  );
  const subjectivityDone = useSelector(
    (state) => state.assistant.subjectivityDone,
  );
  const subjectivityFail = useSelector(
    (state) => state.assistant.subjectivityFail,
  );

  // previous fact checks
  const prevFactChecksTitle = keyword("previous_fact_checks");
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );
  const prevFactChecksLoading = useSelector(
    (state) => state.assistant.prevFactChecksLoading,
  );
  const prevFactChecksDone = useSelector(
    (state) => state.assistant.prevFactChecksDone,
  );
  const prevFactChecksFail = useSelector(
    (state) => state.assistant.prevFactChecksFail,
  );
  // checking if user logged in
  const role = useSelector((state) => state.userSession.user.roles);
  // date information
  dayjs.extend(LocaleData);
  dayjs.extend(localizedFormat);
  const globalLocaleData = dayjs.localeData();
  // for navigating to Semantic Search with text
  const navigate = useNavigate();

  // machine generated text
  const machineGeneratedTextTitle = keyword("machine_generated_text");
  const machineGeneratedTextResult = useSelector(
    (state) => state.assistant.machineGeneratedTextResult,
  );
  const machineGeneratedTextLoading = useSelector(
    (state) => state.assistant.machineGeneratedTextLoading,
  );
  const machineGeneratedTextDone = useSelector(
    (state) => state.assistant.machineGeneratedTextDone,
  );
  const machineGeneratedTextFail = useSelector(
    (state) => state.assistant.machineGeneratedTextFail,
  );

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          // title
          title={
            <Typography variant={"h5"}>
              {keyword("credibility_signals")}
            </Typography>
          }
          action={
            // tooltip
            <Tooltip
              interactive={"true"}
              title={
                <div
                  className={"content"}
                  dangerouslySetInnerHTML={{
                    __html:
                      keyword("credibility_signals_tooltip") +
                      "<br><br><b>" +
                      keyword("news_framing") +
                      "</b><br>" +
                      keyword("news_framing_tooltip") +
                      "<br><br><b>" +
                      keyword("news_genre") +
                      "</b><br>" +
                      keyword("news_genre_tooltip") +
                      "<br><br><b>" +
                      keyword("persuasion_techniques") +
                      "</b><br>" +
                      keyword("persuasion_techniques_tooltip") +
                      "<br><br><b>" +
                      keyword("subjectivity") +
                      "</b><br>" +
                      keyword("subjectivity_tooltip") +
                      "<br><br><b>" +
                      keyword("previous_fact_checks") +
                      "</b><br>" +
                      keyword("previous_fact_checks_tooltip") +
                      "<br><br><b>" +
                      keyword("machine_generated_text") +
                      "</b><br>" +
                      keyword("machine_generated_text_tooltip"),
                  }}
                />
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
            </Tooltip>
          }
        />

        <CardContent
          style={{
            wordBreak: "break-word",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* News Framing/Topic */}
          <StyledAccordion
            expanded={expandedAccordion === newsFramingTitle}
            onChange={handleChange(newsFramingTitle)}
            disabled={newsFramingLoading || newsFramingFail}
            disableGutters
          >
            <AccordionSummary
              expandIcon={getExpandIcon(newsFramingLoading, newsFramingFail)}
            >
              <Grid container wrap="wrap">
                <Grid item xs={4} align="left">
                  <Typography
                    display="inline"
                    sx={{ flexShrink: 0, align: "left" }}
                  >
                    {newsFramingTitle}
                  </Typography>
                </Grid>
                <Grid item xs={8} align="left">
                  {newsFramingLoading && (
                    <CircularProgress color={"secondary"} />
                  )}
                  {newsFramingFail && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("failed_to_load")}
                    </Typography>
                  )}
                  {newsFramingDone && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {renderEntityKeys(newsFramingResult.entities)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>

            <AccordionDetails>
              {newsFramingDone && (
                <div>
                  <Collapse
                    in={expanded}
                    collapsedSize={150}
                    id={"element-to-check0"}
                  >
                    <AssistantTextClassification
                      text={text}
                      classification={newsFramingResult.entities}
                      configs={newsFramingResult.configs}
                      titleText={newsFramingTitle}
                      helpDescription={"news_framing_tooltip"}
                      textHtmlMap={textHtmlMap}
                    />
                  </Collapse>
                  {renderCollapse(
                    classes,
                    setDisplayOrigLang,
                    displayOrigLang,
                    textLang,
                    sharedKeyword,
                    keyword,
                    text,
                    displayExpander,
                    expanded,
                    setExpanded,
                  )}
                </div>
              )}
            </AccordionDetails>
          </StyledAccordion>

          {/* News Genre */}
          <StyledAccordion
            expanded={expandedAccordion === newsGenreTitle}
            onChange={handleChange(newsGenreTitle)}
            disabled={newsGenreLoading || newsGenreFail}
            disableGutters
          >
            <AccordionSummary
              expandIcon={getExpandIcon(newsGenreLoading, newsGenreFail)}
            >
              <Grid container wrap="wrap">
                <Grid item xs={4} align="left">
                  <Typography
                    display="inline"
                    sx={{ flexShrink: 0, align: "left" }}
                  >
                    {newsGenreTitle}
                  </Typography>
                </Grid>
                <Grid item xs={8} align="left">
                  {newsGenreLoading && <CircularProgress color={"secondary"} />}
                  {newsGenreFail && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("failed_to_load")}
                    </Typography>
                  )}
                  {newsGenreDone && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {renderEntityKeys(newsGenreResult.entities)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>

            <AccordionDetails>
              {newsGenreDone && (
                <div>
                  <Collapse
                    in={expanded}
                    collapsedSize={150}
                    id={"element-to-check1"}
                  >
                    <AssistantTextClassification
                      text={text}
                      classification={newsGenreResult.entities}
                      configs={newsGenreResult.configs}
                      titleText={newsGenreTitle}
                      helpDescription={"news_genre_tooltip"}
                      textHtmlMap={textHtmlMap}
                      displayBox="true"
                    />
                  </Collapse>
                  {renderCollapse(
                    classes,
                    setDisplayOrigLang,
                    displayOrigLang,
                    textLang,
                    sharedKeyword,
                    keyword,
                    text,
                    displayExpander,
                    expanded,
                    setExpanded,
                  )}
                </div>
              )}
            </AccordionDetails>
          </StyledAccordion>

          {/* Persuasion Techniques */}
          <StyledAccordion
            expanded={expandedAccordion === persuasionTitle}
            onChange={handleChange(persuasionTitle)}
            disabled={
              persuasionLoading ||
              persuasionFail ||
              (persuasionDone &&
                Object.keys(persuasionResult.entities).length < 1)
            }
            disableGutters
          >
            <AccordionSummary
              expandIcon={getExpandIcon(
                persuasionLoading,
                persuasionFail,
                persuasionDone &&
                  Object.keys(persuasionResult.entities).length < 1,
              )}
            >
              <Grid container wrap="wrap">
                <Grid item xs={4} align="left">
                  <Typography
                    display="inline"
                    sx={{ flexShrink: 0, align: "left" }}
                  >
                    {persuasionTitle}
                  </Typography>
                </Grid>
                <Grid item xs={8} align="left">
                  {persuasionLoading && (
                    <CircularProgress color={"secondary"} />
                  )}
                  {persuasionFail && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("failed_to_load")}
                    </Typography>
                  )}
                  {persuasionDone && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {renderEntityKeys(persuasionResult.entities)}
                    </Typography>
                  )}
                  {persuasionDone &&
                    Object.keys(persuasionResult.entities).length < 1 && (
                      <Typography
                        sx={{ color: "text.secondary", align: "left" }}
                      >
                        {keyword("none_detected")}
                      </Typography>
                    )}
                </Grid>
              </Grid>
            </AccordionSummary>

            <AccordionDetails>
              {persuasionDone && (
                <div>
                  <Collapse
                    in={expanded}
                    collapsedSize={150}
                    id={"element-to-check2"}
                  >
                    <AssistantTextSpanClassification
                      text={text}
                      classification={persuasionResult.entities}
                      configs={persuasionResult.configs}
                      titleText={persuasionTitle}
                      helpDescription={"persuasion_techniques_tooltip"}
                      textHtmlMap={textHtmlMap}
                    />
                  </Collapse>
                  {renderCollapse(
                    classes,
                    setDisplayOrigLang,
                    displayOrigLang,
                    textLang,
                    sharedKeyword,
                    keyword,
                    text,
                    displayExpander,
                    expanded,
                    setExpanded,
                  )}
                </div>
              )}
            </AccordionDetails>
          </StyledAccordion>

          {/* Subjectivity */}
          <StyledAccordion
            expanded={expandedAccordion === subjectivityTitle}
            onChange={handleChange(subjectivityTitle)}
            disabled={
              subjectivityLoading ||
              subjectivityFail ||
              (subjectivityDone &&
                Object.keys(subjectivityResult.entities).length < 1)
            }
            disableGutters
          >
            <AccordionSummary
              expandIcon={getExpandIcon(
                subjectivityLoading,
                subjectivityFail,
                subjectivityDone &&
                  Object.keys(subjectivityResult.entities).length < 1,
              )}
            >
              <Grid container wrap="wrap">
                <Grid item xs={4} align="left">
                  <Typography sx={{ flexShrink: 0, align: "left" }}>
                    {subjectivityTitle}
                  </Typography>
                </Grid>
                <Grid item xs={8} align="left">
                  {subjectivityLoading && (
                    <CircularProgress color={"secondary"} />
                  )}
                  {subjectivityFail && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("failed_to_load")}
                    </Typography>
                  )}
                  {subjectivityDone && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("subjective_sentences_detected")}{" "}
                      {calculateSubjectivity(subjectivityResult.sentences)}
                    </Typography>
                  )}
                  {subjectivityDone &&
                    Object.keys(subjectivityResult.entities).length < 1 && (
                      <Typography
                        sx={{ color: "text.secondary", align: "left" }}
                      >
                        {keyword("none_detected")}
                      </Typography>
                    )}
                </Grid>
              </Grid>
            </AccordionSummary>

            <AccordionDetails>
              {subjectivityDone && (
                <div>
                  <Collapse
                    in={expanded}
                    collapsedSize={150}
                    id={"element-to-check3"}
                  >
                    <AssistantTextClassification
                      text={text}
                      classification={subjectivityResult.entities}
                      configs={subjectivityResult.configs}
                      titleText={subjectivityTitle}
                      helpDescription={"subjectivity_tooltip"}
                      textHtmlMap={textHtmlMap}
                      subjectivity="true"
                    />
                  </Collapse>
                  {renderCollapse(
                    classes,
                    setDisplayOrigLang,
                    displayOrigLang,
                    textLang,
                    sharedKeyword,
                    keyword,
                    text,
                    displayExpander,
                    expanded,
                    setExpanded,
                  )}
                </div>
              )}
            </AccordionDetails>
          </StyledAccordion>

          {/* Previous fact-checks */}
          <StyledAccordion
            expanded={expandedAccordion === prevFactChecksTitle}
            onChange={handleChange(prevFactChecksTitle)}
            disabled={
              prevFactChecksLoading ||
              prevFactChecksFail ||
              (!prevFactChecksLoading &&
                !prevFactChecksFail &&
                !prevFactChecksDone) ||
              !role.includes("BETA_TESTER")
            }
            disableGutters
          >
            <AccordionSummary
              expandIcon={getExpandIcon(
                prevFactChecksLoading,
                prevFactChecksFail,
                null,
                role,
              )}
            >
              <Grid container wrap="wrap">
                <Grid item xs={4} align="left">
                  <Typography
                    display="inline"
                    sx={{ flexShrink: 0, align: "left" }}
                  >
                    {prevFactChecksTitle}
                  </Typography>
                </Grid>

                <Grid item xs={8} align="left">
                  {role.includes("BETA_TESTER") && prevFactChecksLoading && (
                    <CircularProgress color={"secondary"} />
                  )}
                  {role.includes("BETA_TESTER") && prevFactChecksFail && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("failed_to_load")}
                    </Typography>
                  )}
                  {role.includes("BETA_TESTER") &&
                    prevFactChecksDone &&
                    prevFactChecksResult && (
                      <Typography
                        sx={{ color: "text.secondary", align: "left" }}
                      >
                        {keyword("previous_fact_checks_found")}
                      </Typography>
                    )}
                  {role.includes("BETA_TESTER") &&
                    !prevFactChecksDone &&
                    !prevFactChecksLoading &&
                    !prevFactChecksFail &&
                    !prevFactChecksResult && (
                      <Typography
                        sx={{ color: "text.secondary", align: "left" }}
                      >
                        {keyword("reanalyse_url")}
                        {/* should now be obselete as saga is re run */}
                      </Typography>
                    )}
                  {!role.includes("BETA_TESTER") && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("login_required")}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>

            <AccordionDetails>
              {prevFactChecksDone && role.includes("BETA_TESTER") && (
                <div>
                  <Collapse
                    in={expanded}
                    collapsedSize={150}
                    id={"element-to-check4"}
                  >
                    {prevFactChecksResult
                      ? prevFactChecksResult.map((resultItem) => {
                          // date in correct format
                          const date = resultItem.published_at.slice(0, 10);

                          return (
                            <ResultDisplayItem
                              key={resultItem.id}
                              id={resultItem.id}
                              claim={resultItem.claim_en}
                              title={resultItem.title_en}
                              claimOriginalLanguage={resultItem.claim}
                              titleOriginalLanguage={resultItem.title}
                              rating={resultItem.rating}
                              date={
                                dayjs(date).format(
                                  globalLocaleData.longDateFormat("LL"),
                                ) ?? null
                              }
                              website={resultItem.website}
                              language={getLanguageName(
                                resultItem.source_language,
                              )}
                              similarityScore={resultItem.score}
                              articleUrl={resultItem.url}
                              domainUrl={resultItem.source_name}
                              imageUrl={resultItem.image_url}
                            />
                          );
                        })
                      : null}
                  </Collapse>
                  {renderCollapsePrevFactChecks(
                    classes,
                    displayExpander,
                    expanded,
                    setExpanded,
                    navigate,
                    keyword,
                  )}
                </div>
              )}
            </AccordionDetails>
          </StyledAccordion>

          {/* Machine Generated Text */}
          <StyledAccordion
            expanded={expandedAccordion === machineGeneratedTextTitle}
            onChange={handleChange(machineGeneratedTextTitle)}
            disabled={
              machineGeneratedTextLoading ||
              machineGeneratedTextFail ||
              machineGeneratedTextDone ||
              !role.includes("BETA_TESTER")
            }
            disableGutters
          >
            <AccordionSummary
              expandIcon={getExpandIcon(
                machineGeneratedTextLoading,
                machineGeneratedTextFail,
                machineGeneratedTextDone,
                role,
              )}
            >
              <Grid container wrap="wrap">
                <Grid item xs={4} align="left">
                  <Typography
                    display="inline"
                    sx={{ flexShrink: 0, align: "left" }}
                  >
                    {machineGeneratedTextTitle}
                  </Typography>
                </Grid>

                <Grid item xs={8} align="left">
                  {role.includes("BETA_TESTER") &&
                    machineGeneratedTextLoading && (
                      <CircularProgress color={"secondary"} />
                    )}
                  {role.includes("BETA_TESTER") && machineGeneratedTextFail && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("failed_to_load")}
                    </Typography>
                  )}
                  {role.includes("BETA_TESTER") &&
                    machineGeneratedTextDone &&
                    machineGeneratedTextResult && (
                      <Typography
                        sx={{ color: "text.secondary", align: "left" }}
                      >
                        {keyword(machineGeneratedTextResult.pred)}
                        {round(machineGeneratedTextResult.score, 4)}
                      </Typography>
                    )}
                  {role.includes("BETA_TESTER") &&
                    !machineGeneratedTextDone &&
                    !machineGeneratedTextLoading &&
                    !machineGeneratedTextFail &&
                    !machineGeneratedTextResult && (
                      <Typography
                        sx={{ color: "text.secondary", align: "left" }}
                      >
                        {keyword("reanalyse_url")}
                        {/* should now be obselete as saga is re run */}
                      </Typography>
                    )}
                  {!role.includes("BETA_TESTER") && (
                    <Typography sx={{ color: "text.secondary", align: "left" }}>
                      {keyword("login_required")}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>
          </StyledAccordion>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default AssistantCredSignals;
