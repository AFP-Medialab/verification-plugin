import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useColorScheme } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { WarningAmber } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { setWarningExpanded } from "@/redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { v4 as uuidv4 } from "uuid";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {
  TransCredibilitySignalsLink,
  TransHtmlDoubleLineBreak,
  TransMachineGeneratedTextTooltip,
  TransPersuasionTechniquesTooltip,
  TransSupportedToolsLink,
} from "../TransComponents";
import AssistantTextClassification from "./AssistantTextClassification";
import AssistantTextSpanClassification from "./AssistantTextSpanClassification";
import TextFooter from "./TextFooter.jsx";
import {
  createGaugeChart,
  getMgtColours,
  getPersuasionCategoryColours,
  getPersuasionCategoryTechnique,
  primaryRgb,
  rgbToString,
  treeMapToElements,
} from "./assistantUtils";

const AssistantTextResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const expandMinimiseText = keyword("expand_minimise_text");

  const classes = useMyStyles();
  const dispatch = useDispatch();

  // for dark mode
  const { mode, systemMode } = useColorScheme();
  const resolvedMode = systemMode || mode;

  // assistant media states
  const text = useSelector((state) => state.assistant.urlText);
  const textLang = useSelector((state) => state.assistant.textLang);
  const textHtmlMap = useSelector((state) => state.assistant.urlTextHtmlMap);
  const [textHtmlOutput, setTextHtmlOutput] = useState(null);

  // third party check states
  const dbkfTextMatch = null; //useSelector((state) => state.assistant.dbkfTextMatch);
  const mtLoading = useSelector((state) => state.assistant.mtLoading);
  const dbkfTextMatchLoading = useSelector(
    (state) => state.assistant.dbkfTextMatchLoading,
  );

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

  // machine generated text
  const machineGeneratedTextTitle = keyword("machine_generated_text_title");
  const machineGeneratedTextChunksResult = useSelector(
    (state) => state.assistant.machineGeneratedTextChunksResult,
  );
  const machineGeneratedTextChunksLoading = useSelector(
    (state) => state.assistant.machineGeneratedTextChunksLoading,
  );
  const machineGeneratedTextChunksDone = useSelector(
    (state) => state.assistant.machineGeneratedTextChunksDone,
  );
  const machineGeneratedTextChunksFail = useSelector(
    (state) => state.assistant.machineGeneratedTextChunksFail,
  );
  const machineGeneratedTextSentencesResult = useSelector(
    (state) => state.assistant.machineGeneratedTextSentencesResult,
  );
  const machineGeneratedTextSentencesLoading = useSelector(
    (state) => state.assistant.machineGeneratedTextSentencesLoading,
  );
  const machineGeneratedTextSentencesDone = useSelector(
    (state) => state.assistant.machineGeneratedTextSentencesDone,
  );
  const machineGeneratedTextSentencesFail = useSelector(
    (state) => state.assistant.machineGeneratedTextSentencesFail,
  );

  // previous fact-checks
  const prevFactChecksResult = useSelector(
    (state) => state.assistant.prevFactChecksResult,
  );

  // display states
  const textBox = document.getElementById("element-to-check");
  const [expanded, setExpanded] = useState(false);
  const [displayOrigLang, setDisplayOrigLang] = useState(true);
  const [textTabIndex, setTextTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTextTabIndex(newValue);
  };

  useEffect(() => {
    if (textHtmlMap !== null) {
      // HTML text is contained in an xml document, we need to parse it and
      // extract all contents in the <main> node#
      setTextHtmlOutput(treeMapToElements(text, textHtmlMap));
    }
  }, [textBox]);

  // custom tab panel
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  // accessibility
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  function scrollToElement(id, padding = 0) {
    const element = document.getElementById(id);
    if (element) {
      const targetPosition =
        element.getBoundingClientRect().top + window.scrollY - padding;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  }

  // Summaries
  const importantSentenceKey = "Important_Sentence";

  const newsFramingSummary = newsFramingResult
    ? Object.entries(newsFramingResult.entities)
        .map(([key, items]) => [
          key,
          Math.max(...items.map((item) => parseFloat(item.score))),
        ])
        .filter(([key, score]) => score >= 0.8)
        .sort(([, a], [, b]) => b - a)
        .map(([key]) => key)
        .filter((key) => key != importantSentenceKey)
    : null;

  const newsGenreSummary = newsGenreResult
    ? Object.keys(newsGenreResult.entities).filter(
        (key) => key != importantSentenceKey,
      )
    : null;

  const persuasionSummary = persuasionResult
    ? Object.entries(persuasionResult.entities)
        .filter(([key, value]) =>
          value.some((item) => parseFloat(item.score) > 0.8),
        )
        .sort(([, a], [, b]) => b.length - a.length)
        .map(([key]) => key)
    : null;
  const persuasionTechniqueCategoryColours = persuasionResult
    ? getPersuasionCategoryColours(persuasionResult.configs)
    : null;

  const subjectivitySummary = subjectivityResult
    ? Object.keys(subjectivityResult.entities).filter(
        (key) => key != importantSentenceKey,
      )
    : null;

  const [colours, coloursDark] = machineGeneratedTextChunksResult
    ? getMgtColours(machineGeneratedTextChunksResult.configs)
    : [null, null];
  const mgtOverallScoreLabel = "mgt_overall_score";
  const machineGeneratedTextSummary =
    machineGeneratedTextChunksResult && machineGeneratedTextSentencesResult
      ? createGaugeChart(
          mgtOverallScoreLabel,
          machineGeneratedTextChunksResult.entities[mgtOverallScoreLabel]
            ? machineGeneratedTextChunksResult.entities[mgtOverallScoreLabel][0]
                .score
            : null,
          resolvedMode,
          resolvedMode === "dark" ? coloursDark : colours,
          keyword,
          ["gauge_no_detection", "gauge_detection"],
        )
      : null;

  // summary loading
  function summaryLoading(credibilitySignal) {
    return (
      <ListItem key={`${credibilitySignal}_summaryLoading`}>
        <Skeleton width="100%" height="100%" />
      </ListItem>
    );
  }

  // summary failed
  function summaryFailed(credibilitySignal) {
    return (
      <ListItem key={`${credibilitySignal}_summaryFailed`}>
        <Typography sx={{ textAlign: "start" }}>
          {keyword("failed_to_load")}
        </Typography>
      </ListItem>
    );
  }

  // summary empty
  function summaryEmpty(credibilitySignal, keyword) {
    return (
      <ListItem key={`${credibilitySignal}_summaryEmpty`}>
        <Typography sx={{ textAlign: "start" }}>
          {credibilitySignal === newsFramingTitle &&
            keyword("no_detected_topics")}
          {credibilitySignal === subjectivityTitle &&
            keyword("no_detected_sentences")}
          {credibilitySignal === persuasionTitle &&
            keyword("no_detected_techniques")}
        </Typography>
      </ListItem>
    );
  }

  // tooltips
  const newsFramingTooltip = (
    <>
      <Trans
        t={keyword}
        i18nKey="news_framing_tooltip"
        components={{
          ul: <ul />,
          li: <li />,
        }}
      />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  const newsGenreTooltip = (
    <>
      <Trans
        t={keyword}
        i18nKey="news_genre_tooltip"
        components={{
          ul: <ul />,
          li: <li />,
        }}
      />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  const persuasionTooltip = (
    <>
      <TransPersuasionTechniquesTooltip keyword={keyword} />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  const subjectivityTooltip = (
    <>
      <Trans t={keyword} i18nKey="subjectivity_tooltip" />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  const machineGeneratedTextTooltip = (
    <>
      <TransMachineGeneratedTextTooltip keyword={keyword} />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  return (
    <Card variant="outlined" data-testid="assistant-text-scraped-text">
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("text_title")}
        action={
          // top right warning and tooltip
          <div style={{ display: "flex" }}>
            <div
              hidden={dbkfTextMatch === null && prevFactChecksResult === null}
            >
              <Tooltip title={keyword("text_warning")}>
                <WarningAmber
                  color={"warning"}
                  className={classes.toolTipWarning}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    dispatch(setWarningExpanded(true));
                    scrollToElement("warnings", 100);
                  }}
                />
              </Tooltip>
            </div>
            <Tooltip
              interactive={"true"}
              title={
                <>
                  <Trans
                    t={keyword}
                    i18nKey="text_tooltip"
                    components={{
                      b: <b />,
                      ul: <ul />,
                      li: <li />,
                    }}
                  />
                  <TransSupportedToolsLink keyword={keyword} />
                  <TransHtmlDoubleLineBreak keyword={keyword} />
                  <TransCredibilitySignalsLink keyword={keyword} />
                </>
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
            </Tooltip>
          </div>
        }
      />
      {dbkfTextMatchLoading && mtLoading && (
        <LinearProgress variant={"indeterminate"} color={"secondary"} />
      )}
      <CardContent
        style={{
          wordBreak: "break-word",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Collapse in={expanded} collapsedSize={620} id={"element-to-check"}>
          {/* tabs setup */}
          <Tabs
            value={textTabIndex}
            onChange={handleTabChange}
            aria-label="extracted text tabs"
            variant="scrollable"
          >
            <Tab label={keyword("summary_title")} {...a11yProps(0)} />
            <Tab label={keyword("raw_text")} {...a11yProps(1)} />
            <Tab
              label={
                <div>
                  {newsFramingTitle}
                  {newsFramingLoading && <LinearProgress />}
                </div>
              }
              {...a11yProps(2)}
              disabled={newsFramingFail || newsFramingLoading}
            />
            <Tab
              label={
                <div>
                  {newsGenreTitle}
                  {newsGenreLoading && <LinearProgress />}
                </div>
              }
              {...a11yProps(3)}
              disabled={newsGenreFail || newsGenreLoading}
            />
            <Tab
              label={
                <div>
                  {persuasionTitle}
                  {persuasionLoading && <LinearProgress />}
                </div>
              }
              {...a11yProps(4)}
              disabled={persuasionFail || persuasionLoading}
            />
            <Tab
              label={
                <div>
                  {subjectivityTitle}
                  {subjectivityLoading && <LinearProgress />}
                </div>
              }
              {...a11yProps(5)}
              disabled={subjectivityFail || subjectivityLoading}
            />
            <Tab
              label={
                <div>
                  {machineGeneratedTextTitle}
                  {(machineGeneratedTextChunksLoading ||
                    machineGeneratedTextSentencesLoading) && <LinearProgress />}
                </div>
              }
              {...a11yProps(6)}
              disabled={
                machineGeneratedTextChunksFail ||
                machineGeneratedTextChunksLoading ||
                machineGeneratedTextSentencesFail ||
                machineGeneratedTextSentencesLoading
              }
            />
          </Tabs>

          {console.log("top=", newsFramingResult)}
          {console.log("gen=", newsGenreResult)}
          {console.log("per=", persuasionResult)}
          {console.log("sub=", subjectivityResult)}
          {console.log("mgt=", machineGeneratedTextChunksResult)}

          {/* summaries */}
          <CustomTabPanel value={textTabIndex} index={0}>
            <Grid container spacing={2}>
              {/* column 1 */}
              <Grid size={{ xs: 4 }}>
                <Stack spacing={2}>
                  {/* news framing summary */}
                  <Card>
                    <CardActionArea
                      onClick={() =>
                        newsFramingResult ? setTextTabIndex(2) : null
                      }
                    >
                      <CardHeader
                        className={classes.assistantCardHeader}
                        title={newsFramingTitle}
                        action={
                          <div style={{ display: "flex" }}>
                            <Tooltip
                              interactive={"true"}
                              title={newsFramingTooltip}
                              classes={{ tooltip: classes.assistantTooltip }}
                            >
                              <HelpOutlineOutlinedIcon
                                className={classes.toolTipIcon}
                              />
                            </Tooltip>
                          </div>
                        }
                      />
                      <CardContent>
                        <List key="news_framing_list_summary">
                          {newsFramingLoading &&
                            summaryLoading(newsFramingTitle)}
                          {newsFramingDone
                            ? Object.keys(newsFramingResult.entities).length > 0
                              ? newsFramingSummary.map((topic, index) => (
                                  <div key={`${index}_div`}>
                                    {index != "0" && (
                                      <Divider key={`${index}_Divider`} />
                                    )}
                                    <ListItem
                                      key={`${index}_ListItem`}
                                      sx={{
                                        background: rgbToString(primaryRgb),
                                        color: "white",
                                      }}
                                    >
                                      <ListItemText primary={keyword(topic)} />
                                    </ListItem>
                                  </div>
                                ))
                              : summaryEmpty(newsFramingTitle, keyword)
                            : null}
                          {newsFramingFail && summaryFailed(newsFramingTitle)}
                        </List>
                      </CardContent>
                    </CardActionArea>
                  </Card>

                  {/* subjectivity summary */}
                  <Card>
                    <CardActionArea
                      onClick={() =>
                        subjectivityResult ? setTextTabIndex(5) : null
                      }
                    >
                      <CardHeader
                        className={classes.assistantCardHeader}
                        title={subjectivityTitle}
                        action={
                          <div style={{ display: "flex" }}>
                            <Tooltip
                              interactive={"true"}
                              title={subjectivityTooltip}
                              classes={{ tooltip: classes.assistantTooltip }}
                            >
                              <HelpOutlineOutlinedIcon
                                className={classes.toolTipIcon}
                              />
                            </Tooltip>
                          </div>
                        }
                      />
                      <CardContent>
                        <List>
                          {subjectivityLoading &&
                            summaryLoading(subjectivityTitle)}
                          {subjectivityDone ? (
                            Object.keys(subjectivityResult.entities).length >
                            0 ? (
                              <ListItem
                                key={`${subjectivitySummary}_ListItem`}
                                sx={{
                                  background: rgbToString(primaryRgb),
                                  color: "white",
                                }}
                              >
                                <ListItemText
                                  primary={`${keyword(subjectivitySummary[0])}: ${Math.round(subjectivityResult.entities[subjectivitySummary[0]][0].score)}%`}
                                />
                              </ListItem>
                            ) : (
                              summaryEmpty(subjectivityTitle, keyword)
                            )
                          ) : null}
                          {subjectivityFail && summaryFailed(subjectivityTitle)}
                        </List>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Stack>
              </Grid>

              {/* column 2 */}
              <Grid size={{ xs: 4 }}>
                <Stack spacing={2}>
                  {/* news genre summary */}
                  <Card>
                    <CardActionArea
                      onClick={() =>
                        newsGenreResult ? setTextTabIndex(3) : null
                      }
                    >
                      <CardHeader
                        className={classes.assistantCardHeader}
                        title={newsGenreTitle}
                        action={
                          <div style={{ display: "flex" }}>
                            <Tooltip
                              interactive={"true"}
                              title={newsGenreTooltip}
                              classes={{ tooltip: classes.assistantTooltip }}
                            >
                              <HelpOutlineOutlinedIcon
                                className={classes.toolTipIcon}
                              />
                            </Tooltip>
                          </div>
                        }
                      />
                      <CardContent>
                        <List>
                          {newsGenreLoading && summaryLoading(newsGenreTitle)}
                          {newsGenreDone && (
                            <ListItem
                              key={`${newsGenreSummary}_ListItem`}
                              sx={{
                                background: rgbToString(primaryRgb),
                                color: "white",
                              }}
                            >
                              <ListItemText
                                primary={keyword(newsGenreSummary)}
                              />
                            </ListItem>
                          )}
                          {newsGenreFail && summaryFailed(newsGenreTitle)}
                        </List>
                      </CardContent>
                    </CardActionArea>
                  </Card>

                  {/* machine generated text summary */}
                  <Card>
                    <CardActionArea
                      onClick={() =>
                        machineGeneratedTextSentencesResult &&
                        machineGeneratedTextChunksResult
                          ? setTextTabIndex(6)
                          : null
                      }
                    >
                      <CardHeader
                        className={classes.assistantCardHeader}
                        title={machineGeneratedTextTitle}
                        action={
                          <div style={{ display: "flex" }}>
                            <Tooltip
                              interactive={"true"}
                              title={machineGeneratedTextTooltip}
                              classes={{ tooltip: classes.assistantTooltip }}
                            >
                              <HelpOutlineOutlinedIcon
                                className={classes.toolTipIcon}
                              />
                            </Tooltip>
                          </div>
                        }
                      />
                      <CardContent>
                        <List>
                          {(machineGeneratedTextChunksLoading ||
                            machineGeneratedTextSentencesLoading) &&
                            summaryLoading(machineGeneratedTextTitle)}
                          {machineGeneratedTextChunksDone &&
                            machineGeneratedTextSentencesDone &&
                            machineGeneratedTextSummary}
                          {(machineGeneratedTextChunksFail ||
                            machineGeneratedTextSentencesFail) &&
                            machineGeneratedTextChunksDone &&
                            machineGeneratedTextSentencesDone &&
                            summaryFailed(machineGeneratedTextTitle)}
                        </List>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Stack>
              </Grid>

              {/* column 3 */}
              {/* persuasion summary */}
              <Grid size={{ xs: 4 }}>
                <Card>
                  <CardActionArea
                    onClick={() =>
                      persuasionResult ? setTextTabIndex(4) : null
                    }
                  >
                    <CardHeader
                      className={classes.assistantCardHeader}
                      title={persuasionTitle}
                      action={
                        <div style={{ display: "flex" }}>
                          <Tooltip
                            interactive={"true"}
                            title={persuasionTooltip}
                            classes={{ tooltip: classes.assistantTooltip }}
                          >
                            <HelpOutlineOutlinedIcon
                              className={classes.toolTipIcon}
                            />
                          </Tooltip>
                        </div>
                      }
                    />
                    <CardContent>
                      <List key={uuidv4()}>
                        {persuasionLoading && summaryLoading(persuasionTitle)}
                        {persuasionDone
                          ? Object.keys(persuasionResult.entities).length > 0
                            ? persuasionSummary.map((persuasion, index) => (
                                <div key={`${index}_div`}>
                                  {index != "0" && (
                                    <Divider key={`${index}_Divider`} />
                                  )}
                                  <ListItem
                                    key={`${index}_ListItem`}
                                    sx={{
                                      background: rgbToString(
                                        persuasionTechniqueCategoryColours[
                                          getPersuasionCategoryTechnique(
                                            persuasion,
                                          )[0]
                                        ],
                                      ),
                                      color: "white",
                                    }}
                                  >
                                    <ListItemText
                                      key={`${index}_ListItemText`}
                                      primary={
                                        keyword(
                                          getPersuasionCategoryTechnique(
                                            persuasion,
                                          )[0],
                                        ) +
                                        ": " +
                                        keyword(
                                          getPersuasionCategoryTechnique(
                                            persuasion,
                                          )[1],
                                        )
                                      }
                                    />
                                  </ListItem>
                                </div>
                              ))
                            : summaryEmpty(persuasionTitle, keyword)
                          : null}
                        {persuasionFail && summaryFailed(persuasionTitle)}
                      </List>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* extracted raw text */}
          <CustomTabPanel value={textTabIndex} index={1}>
            <Typography component={"div"} sx={{ textAlign: "start" }}>
              {textHtmlOutput ?? text}
            </Typography>
          </CustomTabPanel>

          {/* news framing (topic) */}
          <CustomTabPanel value={textTabIndex} index={2}>
            {newsFramingDone && (
              <AssistantTextClassification
                text={text}
                classification={newsFramingResult.entities}
                configs={newsFramingResult.configs}
                titleText={newsFramingTitle}
                categoriesTooltipContent={newsFramingTooltip}
                textHtmlMap={textHtmlMap}
                credibilitySignal={newsFramingTitle}
                setTextTabIndex={setTextTabIndex}
              />
            )}
          </CustomTabPanel>

          {/* news genre */}
          <CustomTabPanel value={textTabIndex} index={3}>
            {newsGenreDone && (
              <AssistantTextClassification
                text={text}
                classification={newsGenreResult.entities}
                configs={newsGenreResult.configs}
                titleText={newsGenreTitle}
                categoriesTooltipContent={newsGenreTooltip}
                textHtmlMap={textHtmlMap}
                credibilitySignal={newsGenreTitle}
                setTextTabIndex={setTextTabIndex}
              />
            )}
          </CustomTabPanel>

          {/* persuasion */}
          <CustomTabPanel value={textTabIndex} index={4}>
            {persuasionDone && (
              <AssistantTextSpanClassification
                text={text}
                classification={persuasionResult.entities}
                configs={persuasionResult.configs}
                titleText={persuasionTitle}
                categoriesTooltipContent={persuasionTooltip}
                textHtmlMap={textHtmlMap}
                setTextTabIndex={setTextTabIndex}
              />
            )}
          </CustomTabPanel>

          {/* subjectivity */}
          <CustomTabPanel value={textTabIndex} index={5}>
            {subjectivityDone && (
              <AssistantTextClassification
                text={text}
                classification={subjectivityResult.entities}
                configs={subjectivityResult.configs}
                titleText={subjectivityTitle}
                categoriesTooltipContent={subjectivityTooltip}
                textHtmlMap={textHtmlMap}
                credibilitySignal={subjectivityTitle}
                setTextTabIndex={setTextTabIndex}
              />
            )}
          </CustomTabPanel>

          {/* machine generated text */}
          <CustomTabPanel value={textTabIndex} index={6}>
            {machineGeneratedTextChunksDone &&
              machineGeneratedTextSentencesDone && (
                <AssistantTextClassification
                  text={text}
                  classification={machineGeneratedTextSentencesResult.entities}
                  overallClassification={
                    machineGeneratedTextChunksResult.entities
                  }
                  configs={machineGeneratedTextSentencesResult.configs}
                  titleText={machineGeneratedTextTitle}
                  categoriesTooltipContent={machineGeneratedTextTooltip}
                  textHtmlMap={textHtmlMap}
                  credibilitySignal={machineGeneratedTextTitle}
                  setTextTabIndex={setTextTabIndex}
                />
              )}
          </CustomTabPanel>
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
      </CardContent>
    </Card>
  );
};
export default AssistantTextResult;
