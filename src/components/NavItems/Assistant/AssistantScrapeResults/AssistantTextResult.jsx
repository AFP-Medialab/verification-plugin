import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import LinearProgress from "@mui/material/LinearProgress";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { WarningAmber } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import { setWarningExpanded } from "@/redux/actions/tools/assistantActions";

import {
  TransCredibilitySignalsLink,
  TransHtmlDoubleLineBreak,
  TransMachineGeneratedTextTooltip,
  TransSupportedToolsLink,
} from "../TransComponents";
import AssistantTextClassification from "./AssistantTextClassification";
import AssistantTextSpanClassification from "./AssistantTextSpanClassification";
import TextFooter from "./TextFooter.jsx";
import { treeMapToElements } from "./assistantUtils";

const AssistantTextResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const expandMinimiseText = keyword("expand_minimise_text");

  const classes = useMyStyles();
  const dispatch = useDispatch();

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
        <Collapse in={expanded} collapsedSize={500} id={"element-to-check"}>
          {/* tabs setup */}
          <Tabs
            value={textTabIndex}
            onChange={handleTabChange}
            aria-label="extracted text tabs"
            variant="scrollable"
          >
            <Tab label={keyword("raw_text")} {...a11yProps(0)} />
            <Tab
              label={
                <div>
                  {newsFramingTitle}
                  {newsFramingLoading && <LinearProgress />}
                </div>
              }
              {...a11yProps(1)}
              disabled={newsFramingFail || newsFramingLoading}
            />
            <Tab
              label={
                <div>
                  {newsGenreTitle}
                  {newsGenreLoading && <LinearProgress />}
                </div>
              }
              {...a11yProps(2)}
              disabled={newsGenreFail || newsGenreLoading}
            />
            <Tab
              label={
                <div>
                  {persuasionTitle}
                  {persuasionLoading && <LinearProgress />}
                </div>
              }
              {...a11yProps(3)}
              disabled={persuasionFail || persuasionLoading}
            />
            <Tab
              label={
                <div>
                  {subjectivityTitle}
                  {subjectivityLoading && <LinearProgress />}
                </div>
              }
              {...a11yProps(4)}
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
              {...a11yProps(5)}
              disabled={
                machineGeneratedTextChunksFail ||
                machineGeneratedTextChunksLoading ||
                machineGeneratedTextSentencesFail ||
                machineGeneratedTextSentencesLoading
              }
            />
          </Tabs>

          {/* extracted raw text */}
          <CustomTabPanel value={textTabIndex} index={0}>
            <Typography component={"div"} sx={{ textAlign: "start" }}>
              {textHtmlOutput ?? text}
            </Typography>
          </CustomTabPanel>

          {/* news framing (topic) */}
          <CustomTabPanel value={textTabIndex} index={1}>
            {newsFramingDone && (
              <AssistantTextClassification
                text={text}
                classification={newsFramingResult.entities}
                configs={newsFramingResult.configs}
                titleText={newsFramingTitle}
                categoriesTooltipContent={
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
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                  </>
                }
                textHtmlMap={textHtmlMap}
                credibilitySignal={keyword("news_framing_title")}
              />
            )}
          </CustomTabPanel>

          {/* news genre */}
          <CustomTabPanel value={textTabIndex} index={2}>
            {newsGenreDone && (
              <AssistantTextClassification
                text={text}
                classification={newsGenreResult.entities}
                configs={newsGenreResult.configs}
                titleText={newsGenreTitle}
                categoriesTooltipContent={
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
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                  </>
                }
                textHtmlMap={textHtmlMap}
                credibilitySignal={keyword("news_genre_title")}
              />
            )}
          </CustomTabPanel>

          {/* persuasion */}
          <CustomTabPanel value={textTabIndex} index={3}>
            {persuasionDone && (
              <AssistantTextSpanClassification
                text={text}
                classification={persuasionResult.entities}
                configs={persuasionResult.configs}
                titleText={persuasionTitle}
                categoriesTooltipContent={
                  <>
                    <Trans
                      t={keyword}
                      i18nKey="persuasion_techniques_tooltip"
                      components={{
                        ul: <ul />,
                        li: <li />,
                      }}
                    />
                    <TransCredibilitySignalsLink keyword={keyword} />
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                  </>
                }
                textHtmlMap={textHtmlMap}
              />
            )}
          </CustomTabPanel>

          {/* subjectivity */}
          <CustomTabPanel value={textTabIndex} index={4}>
            {subjectivityDone && (
              <AssistantTextClassification
                text={text}
                classification={subjectivityResult.entities}
                configs={subjectivityResult.configs}
                titleText={subjectivityTitle}
                categoriesTooltipContent={
                  <>
                    <Trans t={keyword} i18nKey="subjectivity_tooltip" />
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                    <TransCredibilitySignalsLink keyword={keyword} />
                  </>
                }
                textHtmlMap={textHtmlMap}
                credibilitySignal={keyword("subjectivity_title")}
              />
            )}
          </CustomTabPanel>

          {/* machine generated text */}
          <CustomTabPanel value={textTabIndex} index={5}>
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
                  categoriesTooltipContent={
                    <>
                      <TransMachineGeneratedTextTooltip keyword={keyword} />
                      <TransCredibilitySignalsLink keyword={keyword} />
                    </>
                  }
                  textHtmlMap={textHtmlMap}
                  credibilitySignal={keyword("machine_generated_text_title")}
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
