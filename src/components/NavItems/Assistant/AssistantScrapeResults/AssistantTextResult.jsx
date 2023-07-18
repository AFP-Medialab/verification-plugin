import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
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
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import sharedTsv from "../../../../LocalDictionary/components/Shared/utils.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import IconButton from "@mui/material/IconButton";
import FileCopyOutlined from "@mui/icons-material/FileCopy";

const AssistantTextResult = () => {
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv
  );
  const sharedKeyword = useLoadLanguage(
    "components/Shared/utils.tsv",
    sharedTsv
  );

  const classes = useMyStyles();
  const dispatch = useDispatch();

  // assistant media states
  const text = useSelector((state) => state.assistant.urlText);
  const textLang = useSelector((state) => state.assistant.textLang);
  const translatedText = useSelector((state) => state.assistant.mtResult);

  // third party check states
  const dbkfMatch = useSelector((state) => state.assistant.dbkfTextMatch);
  const newsTopicResult = useSelector(
    (state) => state.assistant.newsTopicResult
  );
  const newsGenreResult = useSelector(
    (state) => state.assistant.newsGenreResult
  );
  const hpLoading = useSelector((state) => state.assistant.hpLoading);
  const mtLoading = useSelector((state) => state.assistant.mtLoading);
  const newsTopicLoading = useSelector(
    (state) => state.assistant.newsTopicLoading
  );
  const dbkfMatchLoading = useSelector(
    (state) => state.assistant.dbkfTextMatchLoading
  );
  const newsGenreLoading = useSelector(
    (state) => state.assistant.newsGenreLoading
  );

  const warningExpanded = useSelector(
    (state) => state.assistant.warningExpanded
  );

  // display states
  const textBox = document.getElementById("element-to-check");
  const [expanded, setExpanded] = useState(false);
  const [displayOrigLang, setDisplayOrigLang] = useState(true);
  const [displayExpander, setDisplayExpander] = useState(false);

  // figure out if component displaying text needs collapse icon
  useEffect(() => {
    const elementToCheck = document.getElementById("element-to-check");
    if (elementToCheck.offsetHeight < elementToCheck.scrollHeight) {
      setDisplayExpander(true);
    }
  }, [textBox]);

  useEffect(() => {
    if (translatedText) {
      setDisplayOrigLang(false);
    }
  }, [translatedText]);

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={keyword("text_title")}
          action={
            <div style={{ display: "flex" }}>
              <div hidden={newsGenreResult === null}>
                {newsGenreResult
                  ? newsGenreResult.map((genre, index) => (
                      <Typography style={{ marginTop: 10 }} key={index}>
                        {genre[0][0] + genre[0].slice(1).toLowerCase()}
                      </Typography>
                    ))
                  : null}
              </div>
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
        {
          <LinearProgress
            variant={"indeterminate"}
            color={"secondary"}
            hidden={
              !(
                dbkfMatchLoading ||
                hpLoading ||
                newsTopicLoading ||
                newsGenreLoading
              )
            }
          />
        }
        <CardContent>
          <Collapse in={expanded} collapsedSize={100} id={"element-to-check"}>
            <Typography align={"left"}>
              <FormatQuoteIcon fontSize={"large"} />
              {!displayOrigLang && translatedText ? translatedText : text}
            </Typography>
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
                        "_blank"
                      )
                    }
                  >
                    <TranslateIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Grid>
            <Grid item xs={5}>
              <Box
                display="flex"
                justifyContent="flex-end"
                style={{ margin: 0 }}
              >
                {newsTopicResult
                  ? newsTopicResult.map((topic, index) => (
                      <Chip
                        className={classes.assistantChip}
                        key={index}
                        variant={"outlined"}
                        label={topic[0].replaceAll("_", " ")}
                      />
                    ))
                  : null}
              </Box>
            </Grid>
            <Grid item xs={1}>
              <Box
                display="flex"
                justifyContent="flex-end"
                style={{ margin: 1 }}
              >
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
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};
export default AssistantTextResult;
