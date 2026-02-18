import React, { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress from "@mui/material/LinearProgress";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { WarningAmber } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import AssistantTextClassification from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantTextClassification";
import AssistantTextSpanClassification from "@/components/NavItems/Assistant/AssistantScrapeResults/AssistantTextSpanClassification";
import TextFooter from "@/components/NavItems/Assistant/AssistantScrapeResults/TextFooter";
import {
  scrollToElement,
  treeMapToElements,
} from "@/components/NavItems/Assistant/AssistantScrapeResults/assistantUtils";
import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import {
  setImportantSentenceThreshold,
  setWarningExpanded,
} from "@/redux/actions/tools/assistantActions";

import {
  TransCredibilitySignalsLink,
  TransDeutscheWelleAuthor,
  TransExtractedTextTooltip,
  TransHtmlDoubleLineBreak,
  TransKinitAuthor,
  TransMachineGeneratedTextTooltip,
  TransNewsFramingTooltip,
  TransNewsGenreTooltip,
  TransPersuasionTechniquesTooltip,
  TransSupportedToolsLink,
  TransUsfdAuthor,
} from "../TransComponents";

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
  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const mtLoading = useSelector((state) => state.assistant.mtLoading);
  const dbkfTextMatchLoading = useSelector(
    (state) => state.assistant.dbkfTextMatchLoading,
  );

  // news framing (topic)
  const newsFramingTitle = "news_framing_title";
  const newsFramingResult = useSelector(
    (state) => state.assistant.newsFramingResult,
  );
  const newsFramingLoading = useSelector(
    (state) => state.assistant.newsFramingLoading,
  );
  const newsFramingFail = useSelector(
    (state) => state.assistant.newsFramingFail,
  );

  // news genre
  const newsGenreTitle = "news_genre_title";
  const newsGenreResult = useSelector(
    (state) => state.assistant.newsGenreResult,
  );
  const newsGenreLoading = useSelector(
    (state) => state.assistant.newsGenreLoading,
  );
  const newsGenreFail = useSelector((state) => state.assistant.newsGenreFail);

  // persuasion techniques
  const persuasionTitle = "persuasion_techniques_title";
  const persuasionResult = useSelector(
    (state) => state.assistant.persuasionResult,
  );
  const persuasionLoading = useSelector(
    (state) => state.assistant.persuasionLoading,
  );
  const persuasionFail = useSelector((state) => state.assistant.persuasionFail);

  // subjectivity
  const subjectivityTitle = "subjectivity_title";
  const subjectivityResult = useSelector(
    (state) => state.assistant.subjectivityResult,
  );
  const subjectivityLoading = useSelector(
    (state) => state.assistant.subjectivityLoading,
  );
  const subjectivityFail = useSelector(
    (state) => state.assistant.subjectivityFail,
  );

  // machine generated text
  const machineGeneratedTextTitle = "machine_generated_text_title";
  const machineGeneratedTextChunksResult = useSelector(
    (state) => state.assistant.machineGeneratedTextChunksResult,
  );
  const machineGeneratedTextChunksLoading = useSelector(
    (state) => state.assistant.machineGeneratedTextChunksLoading,
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
    // reset slider value on tab change to 80
    dispatch(setImportantSentenceThreshold(80));
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

  // tooltips
  const newsFramingTooltip = (
    <>
      <TransNewsFramingTooltip keyword={keyword} />
      <TransUsfdAuthor keyword={keyword} />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  const newsGenreTooltip = (
    <>
      <TransNewsGenreTooltip keyword={keyword} />
      <TransUsfdAuthor keyword={keyword} />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  const persuasionTooltip = (
    <>
      <TransPersuasionTechniquesTooltip keyword={keyword} />
      <TransUsfdAuthor keyword={keyword} />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  const subjectivityTooltip = (
    <>
      <Trans t={keyword} i18nKey="subjectivity_tooltip" />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransDeutscheWelleAuthor keyword={keyword} />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  const machineGeneratedTextTooltip = (
    <>
      <TransMachineGeneratedTextTooltip keyword={keyword} />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransKinitAuthor keyword={keyword} />
      <TransHtmlDoubleLineBreak keyword={keyword} />
      <TransCredibilitySignalsLink keyword={keyword} />
    </>
  );

  // scroll box and collapse default height
  const cardMaxHeight = 620;

  return (
    <Card
      variant="outlined"
      data-testid="assistant-text-scraped-text"
      id="credibility-signals"
    >
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("text_title")}
        action={
          // top right warning and tooltip
          <div style={{ display: "flex" }}>
            <div
              hidden={dbkfTextMatch === null && prevFactChecksResult === null}
            >
              <Tooltip
                title={
                  <Trans
                    t={keyword}
                    i18nKey="text_warning"
                    components={{ b: <b /> }}
                  />
                }
              >
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
            <div>
              <Tooltip
                interactive={"true"}
                title={
                  <>
                    <TransExtractedTextTooltip keyword={keyword} />
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
          </div>
        }
      />
      {dbkfTextMatchLoading && mtLoading && (
        <LinearProgress variant={"indeterminate"} color={"secondary"} />
      )}
      <CardContent
        style={{
          wordBreak: "break-word",
        }}
      >
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
                {keyword(newsFramingTitle)}
                {newsFramingLoading && <LinearProgress />}
              </div>
            }
            {...a11yProps(1)}
            disabled={newsFramingFail || newsFramingLoading}
          />
          <Tab
            label={
              <div>
                {keyword(newsGenreTitle)}
                {newsGenreLoading && <LinearProgress />}
              </div>
            }
            {...a11yProps(2)}
            disabled={newsGenreFail || newsGenreLoading}
          />
          <Tab
            label={
              <div>
                {keyword(persuasionTitle)}
                {persuasionLoading && <LinearProgress />}
              </div>
            }
            {...a11yProps(3)}
            disabled={persuasionFail || persuasionLoading}
          />
          <Tab
            label={
              <div>
                {keyword(subjectivityTitle)}
                {subjectivityLoading && <LinearProgress />}
              </div>
            }
            {...a11yProps(4)}
            disabled={subjectivityFail || subjectivityLoading}
          />
          <Tab
            label={
              <div>
                {keyword(machineGeneratedTextTitle)}
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

        <Box
          sx={{
            height: expanded ? "auto" : cardMaxHeight,
            maxHeight: expanded ? "none" : cardMaxHeight, // limit height when collapsed
            overflow: expanded ? "visible" : "auto", // scroll when collapsed
            transition: "height 0.3s ease-in-out, max-height 0.3s ease-in-out",
            scrollbarGutter: "stable", // reserve space for scrollbar
            paddingRight: expanded ? "15px" : "0px", // fallback for older browsers
          }}
        >
          {/* extracted raw text */}
          <CustomTabPanel value={textTabIndex} index={0}>
            <Typography
              component={"div"}
              sx={{
                textAlign: "start",
                "& p": {
                  margin: "8px 0",
                },
              }}
            >
              {textHtmlOutput ?? text}
            </Typography>
          </CustomTabPanel>

          {/* news framing (topic) */}
          <CustomTabPanel value={textTabIndex} index={1}>
            <AssistantTextClassification
              text={text}
              classification={newsFramingResult?.entities}
              configs={newsFramingResult?.configs}
              categoriesTooltipContent={newsFramingTooltip}
              textHtmlMap={textHtmlMap}
              credibilitySignal={newsFramingTitle}
            />
          </CustomTabPanel>

          {/* news genre */}
          <CustomTabPanel value={textTabIndex} index={2}>
            <AssistantTextClassification
              text={text}
              classification={newsGenreResult?.entities}
              configs={newsGenreResult?.configs}
              categoriesTooltipContent={newsGenreTooltip}
              textHtmlMap={textHtmlMap}
              credibilitySignal={newsGenreTitle}
            />
          </CustomTabPanel>

          {/* persuasion */}
          <CustomTabPanel value={textTabIndex} index={3}>
            <AssistantTextSpanClassification
              text={text}
              classification={persuasionResult?.entities}
              configs={persuasionResult?.configs}
              categoriesTooltipContent={persuasionTooltip}
              textHtmlMap={textHtmlMap}
              credibilitySignal={persuasionTitle}
            />
          </CustomTabPanel>

          {/* subjectivity */}
          <CustomTabPanel value={textTabIndex} index={4}>
            <AssistantTextClassification
              text={text}
              classification={subjectivityResult?.entities}
              configs={subjectivityResult?.configs}
              categoriesTooltipContent={subjectivityTooltip}
              textHtmlMap={textHtmlMap}
              credibilitySignal={subjectivityTitle}
            />
          </CustomTabPanel>

          {/* machine generated text */}
          <CustomTabPanel value={textTabIndex} index={5}>
            <AssistantTextClassification
              text={text}
              classification={machineGeneratedTextSentencesResult?.entities}
              overallClassification={machineGeneratedTextChunksResult?.entities}
              configs={machineGeneratedTextSentencesResult?.configs}
              categoriesTooltipContent={machineGeneratedTextTooltip}
              textHtmlMap={textHtmlMap}
              credibilitySignal={machineGeneratedTextTitle}
            />
          </CustomTabPanel>
        </Box>

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
