import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
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
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import IconButton from "@mui/material/IconButton";
import FileCopyOutlined from "@mui/icons-material/FileCopy";

const AssistantTextResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const sharedKeyword = i18nLoadNamespace("components/Shared/utils");

  const classes = useMyStyles();
  const dispatch = useDispatch();

  // assistant media states
  const text = useSelector((state) => state.assistant.urlText);
  const textLang = useSelector((state) => state.assistant.textLang);
  const translatedText = useSelector((state) => state.assistant.mtResult);

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
