import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import {
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import {
  ExpandLessOutlined,
  ExpandMoreOutlined,
  WarningOutlined,
} from "@mui/icons-material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import Grid from "@mui/material/Grid";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LinearProgress from "@mui/material/LinearProgress";
import TranslateIcon from "@mui/icons-material/Translate";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { setWarningExpanded } from "../../../../redux/actions/tools/assistantActions";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import IconButton from "@mui/material/IconButton";
import FileCopyOutlined from "@mui/icons-material/FileCopy";
import AssistantTextClassification from "./AssistantTextClassification";

const AssistantTextResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const sharedKeyword = i18nLoadNamespace("components/Shared/utils");

  const classes = useMyStyles();
  const dispatch = useDispatch();

  // assistant media states
  const text = useSelector((state) => state.assistant.urlText);
  const textLang = useSelector((state) => state.assistant.textLang);

  const newsGenreResult = useSelector(
    (state) => state.assistant.newsGenreResult
  );
  const newsGenreLoading = useSelector(
    (state) => state.assistant.newsGenreLoading
  );
  const newsGenreDone = useSelector((state) => state.assistant.newsGenreDone);
  const newsGenreFail = useSelector((state) => state.assistant.newsGenreFail);

  const newsFramingResult = useSelector(
    (state) => state.assistant.newsFramingResult
  );
  const newsFramingLoading = useSelector(
    (state) => state.assistant.newsFramingLoading
  );
  const newsFramingDone = useSelector(
    (state) => state.assistant.newsFramingDone
  );
  const newsFramingFail = useSelector(
    (state) => state.assistant.newsFramingFail
  );

  const persuasionResult = useSelector(
    (state) => state.assistant.persuasionResult
  );
  const persuasionLoading = useSelector(
    (state) => state.assistant.persuasionLoading
  );
  const persuasionDone = useSelector((state) => state.assistant.persuasionDone);
  const persuasionFail = useSelector((state) => state.assistant.persuasionFail);

  // third party check states
  const dbkfMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const mtLoading = useSelector((state) => state.assistant.mtLoading);
  const dbkfMatchLoading = useSelector(
    (state) => state.assistant.dbkfTextMatchLoading,
  );
  const warningExpanded = useSelector(
    (state) => state.assistant.warningExpanded,
  );

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
    setExpanded(true);
  };

  useEffect(() => {
    if (translatedText) {
      setDisplayOrigLang(false);
    }
  }, [translatedText]);

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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  let persuasionTaskDescription = (
    <>
      <p>
        Identifies the persuasion techniques of the text, 23 persuasion
        techniques are considered, although the actual number of techniques per
        language may vary slightly
      </p>
      <p>
        Background colour of detected persuasion technique varies depending on
        the algorithm's confidence in its prediction.
      </p>
    </>
  );
  let genreTaskDescription = (
    <>
      <p>
        Given a news article, determine whether it is an opinion piece, aims at
        objective news reporting, or is a satire piece.
      </p>
      <p>
        Background colour of detected genre varies depending on the algorithm's
        confidence in its prediction.
      </p>
    </>
  );
  let framingTaskDescription = (
    <>
      <p>
        Given a news article, identify the frames used in the article. A frame
        is the perspective under which an issue or a piece of news is presented.
        We consider 14 frames: Economic, Capacity and resources, Morality,
        Fairness and equality, Legality, constitutionality and jurisprudence,
        Policy prescription and evaluation, Crime and punishment, Security and
        defense, Health and safety, Quality of life, Cultural identity, Public
        opinion, Political, External regulation and reputation.
      </p>
      <p>
        Background colour of detected framing varies depending on the
        algorithm's confidence in its prediction.
      </p>
    </>
  );

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={keyword("text_title")}
          action={
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
                      __html: keyword("text_tooltip"),
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
        <CardContent>
          <Collapse in={expanded} collapsedSize={150} id={"element-to-check"}>
            <Tabs
              value={textTabIndex}
              onChange={handleTabChange}
              onClick={handleTabClick}
              aria-label="basic tabs example"
            >
              <Tab label="Raw Text" {...a11yProps(0)} />
              <Tab label="Persuasion Techniques" {...a11yProps(1)} />
              <Tab label="Genre" {...a11yProps(2)} />
              <Tab label="Framing" {...a11yProps(3)} />
            </Tabs>
            <CustomTabPanel value={textTabIndex} index={0}>
              <Typography align={"left"}>
                <FormatQuoteIcon fontSize={"large"} />
                {!displayOrigLang && translatedText ? translatedText : text}
              </Typography>
            </CustomTabPanel>
            {/*Persuasion classifier*/}
            <CustomTabPanel value={textTabIndex} index={1}>
              {persuasionLoading && <CircularProgress color={"secondary"} />}
              {persuasionFail && (
                <p>Failed to load persuasion classification.</p>
              )}
              {persuasionDone && persuasionResult && (
                <AssistantTextClassification
                  text={text}
                  classification={persuasionResult.entities}
                  configs={persuasionResult.configs}
                  titleText={"Detected Persuasion Techniques"}
                  helpDescription={persuasionTaskDescription}
                />
              )}
            </CustomTabPanel>
            {/*Genre classifier*/}
            <CustomTabPanel value={textTabIndex} index={2}>
              {newsGenreLoading && <CircularProgress color={"secondary"} />}
              {newsGenreFail && <p>Failed to load genre classification.</p>}
              {newsGenreDone && newsGenreResult && (
                <AssistantTextClassification
                  text={text}
                  classification={newsGenreResult.entities}
                  configs={newsGenreResult.configs}
                  titleText={"Detected Genre"}
                  helpDescription={genreTaskDescription}
                />
              )}
            </CustomTabPanel>
            {/*Topic classifier*/}
            <CustomTabPanel value={textTabIndex} index={3}>
              {newsFramingLoading && <CircularProgress color={"secondary"} />}
              {newsFramingFail && <p>Failed to load genre classification.</p>}
              {newsFramingDone && newsFramingResult && (
                <AssistantTextClassification
                  text={text}
                  classification={newsFramingResult.entities}
                  configs={newsFramingResult.configs}
                  titleText={"Detected Framing"}
                  helpDescription={framingTaskDescription}
                />
              )}
            </CustomTabPanel>
          </Collapse>
        </CardContent>

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
      </Card>
    </Grid>
  );
};
export default AssistantTextResult;
