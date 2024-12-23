import React, { useState } from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import { CardHeader, Grid2, styled, Skeleton } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Remove from "@mui/icons-material/Remove";
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

import { useNavigate } from "react-router-dom";
import { getLanguageName } from "../../../Shared/Utils/languageUtils";
import TextFooter from "./TextFooter.jsx";
import { TextFooterPrevFactChecks } from "./TextFooter.jsx";

const renderEntityKeys = (entities, keyword) => {
  // translate array into readable string
  let translatedEntities = [];
  Object.keys(entities).map((entity, index) =>
    entity != "Important_Sentence"
      ? translatedEntities.push(keyword(entity))
      : null,
  );
  return translatedEntities.join("; ");
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

  return [" (", scoresSUBJ.length, "/", sentences.length, ")"]
    .toString()
    .replaceAll(",", "");
};

const getExpandIcon = (
  loading,
  fail,
  doneWithEmptyResult = null,
  role = null,
) => {
  if (
    loading ||
    fail ||
    doneWithEmptyResult ||
    (role && !role.includes("BETA_TESTER"))
  ) {
    // "doneWithEmptyResult" is for when subjectivityDone = true and Object.keys(result.entities).length < 1
    // "doneWithEmptyResult" is for when prevFactChecksDone = true and result.length < 1
    return <Remove />;
  } else {
    return <ExpandMoreIcon />;
  }
};

const AssistantCredSignals = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const sharedKeyword = i18nLoadNamespace("components/Shared/utils");
  const classes = useMyStyles();
  const expandMinimiseText = keyword("expand_minimise_text");

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
  const newsFramingTitle = keyword("news_framing_title");
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
  const newsGenreTitle = keyword("news_genre_title");
  const newsGenreResult = useSelector(
    (state) => state.assistant.newsGenreResult,
  );
  const newsGenreLoading = useSelector(
    (state) => state.assistant.newsGenreLoading,
  );
  const newsGenreDone = useSelector((state) => state.assistant.newsGenreDone);
  const newsGenreFail = useSelector((state) => state.assistant.newsGenreFail);

  // persuasion techniques
  const persuasionTitle = keyword("persuasion_techniques_title");
  const persuasionResult = useSelector(
    (state) => state.assistant.persuasionResult,
  );
  const persuasionLoading = useSelector(
    (state) => state.assistant.persuasionLoading,
  );
  const persuasionDone = useSelector((state) => state.assistant.persuasionDone);
  const persuasionFail = useSelector((state) => state.assistant.persuasionFail);

  // subjectivity
  const subjectivityTitle = keyword("subjectivity_title");
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
  const prevFactChecksTitle = keyword("previous_fact_checks_title");
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
  const machineGeneratedTextTitle = keyword("machine_generated_text_title");
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
            <Grid2 container spacing={1} wrap="wrap" width="100%">
              <Grid2 size={{ xs: 4 }} align="start">
                <Typography
                  display="inline"
                  sx={{ flexShrink: 0, align: "start" }}
                >
                  {newsFramingTitle}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 8 }} align="start">
                {newsFramingLoading && (
                  <Skeleton variant="rounded" width="50%" height={40} />
                )}
                {newsFramingFail && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("failed_to_load")}
                  </Typography>
                )}
                {newsFramingDone && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {renderEntityKeys(newsFramingResult.entities, keyword)}
                  </Typography>
                )}
              </Grid2>
            </Grid2>
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
                {/* footer */}
                <TextFooter
                  classes={classes}
                  setDisplayOrigLang={setDisplayOrigLang}
                  displayOrigLang={displayOrigLang}
                  textLang={textLang}
                  expandMinimiseText={expandMinimiseText}
                  text={text}
                  setExpanded={setExpanded}
                  expanded={expanded}
                />
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
            <Grid2 container spacing={1} wrap="wrap" width="100%">
              <Grid2 size={{ xs: 4 }} align="start">
                <Typography
                  display="inline"
                  sx={{ flexShrink: 0, align: "start" }}
                >
                  {newsGenreTitle}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 8 }} align="start">
                {newsGenreLoading && (
                  <Skeleton variant="rounded" width="50%" height={40} />
                )}
                {newsGenreFail && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("failed_to_load")}
                  </Typography>
                )}
                {newsGenreDone && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {renderEntityKeys(newsGenreResult.entities, keyword)}
                  </Typography>
                )}
              </Grid2>
            </Grid2>
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
                {/* footer */}
                <TextFooter
                  classes={classes}
                  setDisplayOrigLang={setDisplayOrigLang}
                  displayOrigLang={displayOrigLang}
                  textLang={textLang}
                  expandMinimiseText={expandMinimiseText}
                  text={text}
                  setExpanded={setExpanded}
                  expanded={expanded}
                />
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
            <Grid2 container spacing={1} wrap="wrap" width="100%">
              <Grid2 size={{ xs: 4 }} align="start">
                <Typography
                  display="inline"
                  sx={{ flexShrink: 0, align: "start" }}
                >
                  {persuasionTitle}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 8 }} align="start">
                {persuasionLoading && (
                  <Skeleton variant="rounded" width="50%" height={40} />
                )}
                {persuasionFail && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("failed_to_load")}
                  </Typography>
                )}
                {persuasionDone && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {renderEntityKeys(persuasionResult.entities, keyword)}
                  </Typography>
                )}
                {persuasionDone &&
                  Object.keys(persuasionResult.entities).length < 1 && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword("none_detected")}
                    </Typography>
                  )}
              </Grid2>
            </Grid2>
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
                {/* footer */}
                <TextFooter
                  classes={classes}
                  setDisplayOrigLang={setDisplayOrigLang}
                  displayOrigLang={displayOrigLang}
                  textLang={textLang}
                  expandMinimiseText={expandMinimiseText}
                  text={text}
                  setExpanded={setExpanded}
                  expanded={expanded}
                />
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
            <Grid2 container spacing={1} wrap="wrap" width="100%">
              <Grid2 size={{ xs: 4 }} align="start">
                <Typography sx={{ flexShrink: 0, align: "start" }}>
                  {subjectivityTitle}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 8 }} align="start">
                {subjectivityLoading && (
                  <Skeleton variant="rounded" width="50%" height={40} />
                )}
                {subjectivityFail && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("failed_to_load")}
                  </Typography>
                )}
                {subjectivityDone &&
                  Object.keys(subjectivityResult.entities).length >= 1 && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword("subjective_sentences_detected")}{" "}
                      {calculateSubjectivity(subjectivityResult.sentences)}
                    </Typography>
                  )}
                {subjectivityDone &&
                  Object.keys(subjectivityResult.entities).length < 1 && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword("none_detected")}
                    </Typography>
                  )}
              </Grid2>
            </Grid2>
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
                {/* footer */}
                <TextFooter
                  classes={classes}
                  setDisplayOrigLang={setDisplayOrigLang}
                  displayOrigLang={displayOrigLang}
                  textLang={textLang}
                  expandMinimiseText={expandMinimiseText}
                  text={text}
                  setExpanded={setExpanded}
                  expanded={expanded}
                />
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
            !role.includes("BETA_TESTER") ||
            (prevFactChecksDone && prevFactChecksResult.length < 1)
          }
          disableGutters
        >
          <AccordionSummary
            expandIcon={getExpandIcon(
              prevFactChecksLoading,
              prevFactChecksFail,
              prevFactChecksDone && prevFactChecksResult.length < 1,
              role,
            )}
          >
            <Grid2 container spacing={1} wrap="wrap" width="100%">
              <Grid2 size={{ xs: 4 }} align="start">
                <Typography
                  display="inline"
                  sx={{ flexShrink: 0, align: "start" }}
                >
                  {prevFactChecksTitle}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 8 }} align="start">
                {role.includes("BETA_TESTER") && prevFactChecksLoading && (
                  <Skeleton variant="rounded" width="50%" height={40} />
                )}
                {role.includes("BETA_TESTER") && prevFactChecksFail && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("failed_to_load")}
                  </Typography>
                )}
                {role.includes("BETA_TESTER") &&
                  prevFactChecksDone &&
                  prevFactChecksResult.length > 0 && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
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
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword("reanalyse_url")}
                      {/* should now be obselete as saga is re run */}
                    </Typography>
                  )}
                {!role.includes("BETA_TESTER") && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("login_required")}
                  </Typography>
                )}
                {prevFactChecksDone && prevFactChecksResult.length < 1 && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("none_detected")}
                  </Typography>
                )}
              </Grid2>
            </Grid2>
          </AccordionSummary>

          <AccordionDetails>
            {prevFactChecksDone &&
              prevFactChecksResult.length > 0 &&
              role.includes("BETA_TESTER") && (
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
                  <TextFooterPrevFactChecks
                    classes={classes}
                    expandMinimiseText={expandMinimiseText}
                    setExpanded={setExpanded}
                    expanded={expanded}
                    navigate={navigate}
                    keyword={keyword}
                  />
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
            <Grid2 container spacing={1} wrap="wrap" width="100%">
              <Grid2 size={{ xs: 4 }} align="start">
                <Typography
                  display="inline"
                  sx={{ flexShrink: 0, align: "start" }}
                >
                  {machineGeneratedTextTitle}
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 8 }} align="start">
                {role.includes("BETA_TESTER") &&
                  machineGeneratedTextLoading && (
                    <Skeleton variant="rounded" width="50%" height={40} />
                  )}
                {role.includes("BETA_TESTER") && machineGeneratedTextFail && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("failed_to_load")}
                  </Typography>
                )}
                {role.includes("BETA_TESTER") &&
                  machineGeneratedTextDone &&
                  machineGeneratedTextResult && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword(machineGeneratedTextResult.pred)}
                      {/* {round(machineGeneratedTextResult.score, 4)} */}
                    </Typography>
                  )}
                {role.includes("BETA_TESTER") &&
                  !machineGeneratedTextDone &&
                  !machineGeneratedTextLoading &&
                  !machineGeneratedTextFail &&
                  !machineGeneratedTextResult && (
                    <Typography
                      sx={{ color: "text.secondary", align: "start" }}
                    >
                      {keyword("reanalyse_url")}
                      {/* should now be obselete as saga is re run */}
                    </Typography>
                  )}
                {!role.includes("BETA_TESTER") && (
                  <Typography sx={{ color: "text.secondary", align: "start" }}>
                    {keyword("login_required")}
                  </Typography>
                )}
              </Grid2>
            </Grid2>
          </AccordionSummary>
        </StyledAccordion>
      </CardContent>
    </Card>
  );
};
export default AssistantCredSignals;
