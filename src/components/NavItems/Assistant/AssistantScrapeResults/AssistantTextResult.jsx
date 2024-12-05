import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@mui/material/Card";
import {
  Box,
  CardHeader,
  Grid2,
  Tabs,
  Tab,
  Skeleton,
  Stack,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";

import { WarningOutlined } from "@mui/icons-material";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { setWarningExpanded } from "../../../../redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { treeMapToElements } from "./assistantUtils";

import TextFooter from "./TextFooter.jsx";
import AssistantTextClassification from "./AssistantTextClassification";
import AssistantTextSpanClassification from "./AssistantTextSpanClassification";

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
  const dbkfMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const mtLoading = useSelector((state) => state.assistant.mtLoading);
  const dbkfMatchLoading = useSelector(
    (state) => state.assistant.dbkfTextMatchLoading,
  );
  const warningExpanded = useSelector(
    (state) => state.assistant.warningExpanded,
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

  // checking if user logged in
  const role = useSelector((state) => state.userSession.user.roles);

  // display states
  const textBox = document.getElementById("element-to-check");
  const [expanded, setExpanded] = useState(false);
  const [displayOrigLang, setDisplayOrigLang] = useState(true);
  const [displayExpander, setDisplayExpander] = useState(true);
  const [textTabIndex, setTextTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTextTabIndex(newValue);
  };
  const handleTabClick = (event) => {
    // leave unset?
    //setExpanded(true);
  };

  useEffect(() => {
    // if (translatedText) {
    //   setDisplayOrigLang(false);
    // }
    const elementToCheck = document.getElementById("element-to-check");
    if (elementToCheck.offsetHeight < elementToCheck.scrollHeight) {
      setDisplayExpander(true);
    }

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

  return (
    <Card data-testid="assistant-text-scraped-text">
      <CardHeader
        className={classes.assistantCardHeader}
        title={keyword("text_title")}
        action={
          // top left warning and tooltip
          <div style={{ display: "flex" }}>
            <div hidden={dbkfMatch === null}>
              <Tooltip title={keyword("text_warning")}>
                <WarningOutlined
                  className={classes.toolTipWarning}
                  onClick={() => {
                    dispatch(setWarningExpanded(!warningExpanded));
                    window.scrollTo(0, 0);
                  }}
                />
              </Tooltip>
            </div>
            <Tooltip
              interactive={"true"}
              title={
                <div
                  className={"content"}
                  dangerouslySetInnerHTML={{
                    __html:
                      keyword("text_tooltip") +
                      "<br>" +
                      keyword("supported_tools_link") +
                      "<br>" +
                      keyword("credibility_signals_link"),
                  }}
                />
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
            </Tooltip>
          </div>
        }
      />
      {dbkfMatchLoading && mtLoading && (
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
            onClick={handleTabClick}
            aria-label="extracted text tabs"
            variant="fullWidth"
          >
            <Tab label={keyword("raw_text")} {...a11yProps(0)} />
            <Tab
              label={newsFramingTitle}
              {...a11yProps(1)}
              disabled={newsFramingFail || newsFramingLoading}
            />
            <Tab
              label={newsGenreTitle}
              {...a11yProps(2)}
              disabled={newsGenreFail || newsGenreLoading}
            />
            <Tab
              label={persuasionTitle}
              {...a11yProps(3)}
              disabled={persuasionFail || persuasionLoading}
            />
            <Tab
              label={subjectivityTitle}
              {...a11yProps(4)}
              disabled={subjectivityFail || subjectivityLoading}
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
            {newsFramingLoading && (
              <Stack direction="column" spacing={4} p={4}>
                <Skeleton variant="rounded" height={40} />
                <Skeleton variant="rounded" width="50%" height={40} />
              </Stack>
            )}
            {newsFramingDone && (
              <AssistantTextClassification
                text={text}
                classification={newsFramingResult.entities}
                configs={newsFramingResult.configs}
                titleText={newsFramingTitle}
                helpDescription={
                  keyword("news_framing_tooltip") +
                  keyword("credibility_signals_link")
                }
                textHtmlMap={textHtmlMap}
                credibilitySignal={keyword("news_framing_title")}
              />
            )}
          </CustomTabPanel>

          {/* news genre */}
          <CustomTabPanel value={textTabIndex} index={2}>
            {newsGenreLoading && (
              <Stack direction="column" spacing={4} p={4}>
                <Skeleton variant="rounded" height={40} />
                <Skeleton variant="rounded" width="50%" height={40} />
              </Stack>
            )}
            {newsGenreDone && (
              <AssistantTextClassification
                text={text}
                classification={newsGenreResult.entities}
                configs={newsGenreResult.configs}
                titleText={newsGenreTitle}
                helpDescription={
                  keyword("news_genre_tooltip") +
                  keyword("credibility_signals_link")
                }
                textHtmlMap={textHtmlMap}
                credibilitySignal={keyword("news_genre_title")}
              />
            )}
          </CustomTabPanel>

          {/* persuasion */}
          <CustomTabPanel value={textTabIndex} index={3}>
            {persuasionLoading && (
              <Stack direction="column" spacing={4} p={4}>
                <Skeleton variant="rounded" height={40} />
                <Skeleton variant="rounded" width="50%" height={40} />
              </Stack>
            )}
            {persuasionDone && (
              <AssistantTextSpanClassification
                text={text}
                classification={persuasionResult.entities}
                configs={persuasionResult.configs}
                titleText={persuasionTitle}
                helpDescription={
                  keyword("persuasion_techniques_tooltip") +
                  keyword("credibility_signals_link")
                }
                textHtmlMap={textHtmlMap}
              />
            )}
          </CustomTabPanel>

          {/* subjectivity */}
          <CustomTabPanel value={textTabIndex} index={4}>
            {subjectivityLoading && (
              <Stack direction="column" spacing={4} p={4}>
                <Skeleton variant="rounded" height={40} />
                <Skeleton variant="rounded" width="50%" height={40} />
              </Stack>
            )}
            {subjectivityDone && (
              <AssistantTextClassification
                text={text}
                classification={subjectivityResult.entities}
                configs={subjectivityResult.configs}
                titleText={subjectivityTitle}
                helpDescription={
                  keyword("subjectivity_tooltip") +
                  "<br><br>" +
                  keyword("credibility_signals_link")
                }
                textHtmlMap={textHtmlMap}
                credibilitySignal={keyword("subjectivity_title")}
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
          displayExpander={displayExpander}
          setExpanded={setExpanded}
          expanded={expanded}
        />
      </CardContent>
    </Card>
  );
};
export default AssistantTextResult;
