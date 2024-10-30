import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "@mui/material/Card";
import { CardHeader, Grid2 } from "@mui/material";
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

const AssistantTextResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  //const sharedKeyword = i18nLoadNamespace("components/Shared/utils");
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

  // display states
  const textBox = document.getElementById("element-to-check");
  const [expanded, setExpanded] = useState(false);
  const [displayOrigLang, setDisplayOrigLang] = useState(true);
  const [displayExpander, setDisplayExpander] = useState(true);

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
        <Collapse in={expanded} collapsedSize={300} id={"element-to-check"}>
          <Typography component={"div"} sx={{ textAlign: "start" }}>
            {/*{!displayOrigLang && translatedText ? translatedText : text}*/}
            {textHtmlOutput ?? text}
          </Typography>
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
