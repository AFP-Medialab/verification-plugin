import React from "react";

import Box from "@mui/material/Box";
import { Grid2, Link } from "@mui/material";
import Divider from "@mui/material/Divider";
import { UnfoldMore } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { getLanguageName } from "../../../Shared/Utils/languageUtils";
import { TextCopy } from "../../../Shared/Utils/TextCopy";
import { Translate } from "../../../Shared/Utils/Translate";

export default function TextFooter({
  classes,
  setDisplayOrigLang,
  displayOrigLang,
  textLang,
  expandMinimiseText,
  text,
  setExpanded,
  expanded,
}) {
  return (
    <Box>
      <Divider />
      <Grid2 container spacing={2}>
        {/* language detected */}
        <Grid2 size={9} align={"left"} pt={1}>
          <Typography
            display="inline"
            className={classes.toolTipIcon}
            onClick={() => setDisplayOrigLang(!displayOrigLang)}
          >
            {getLanguageName(textLang) ?? textLang}
          </Typography>
        </Grid2>

        {/* copy to clipboard */}
        <Grid2 size={{ xs: 1 }} align={"right"} display="flex" pt={1.5}>
          <TextCopy text={text} index={text} />
        </Grid2>

        {/* translate */}
        <Grid2 size={{ xs: 1 }} align={"center"} display="flex" pt={2}>
          <Translate text={text} />
        </Grid2>

        {/* expand/minimise text */}
        <Grid2 size={{ xs: 1 }} align={"left"} display="flex" pt={1}>
          <ExpandMinimise
            classes={classes}
            expandMinimiseText={expandMinimiseText}
            setExpanded={setExpanded}
            expanded={expanded}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export function TextFooterPrevFactChecks({
  classes,
  expandMinimiseText,
  setExpanded,
  expanded,
  navigate,
  keyword,
}) {
  const handleClick = (path) => {
    // instead need to set parameter then load text in SemanticSearch/index.jsx
    navigate("/app/" + path + "/assistantText");
  };

  return (
    <Box>
      <Divider />
      <Grid2 container>
        {/* empty */}
        <Grid2 size={{ xs: 1 }} align={"start"}>
          <></>
        </Grid2>

        {/* see more details */}
        <Grid2 size={{ xs: 10 }} align={"center"}>
          <Typography
            component={"div"}
            sx={{ color: "text.secondary", align: "start" }}
          >
            <p></p>
            {keyword("more_details")}{" "}
            <Link
              sx={{ cursor: "pointer" }}
              onClick={() => handleClick("tools/semanticSearch")}
            >
              {keyword("semantic_search_title")}
            </Link>
          </Typography>
        </Grid2>

        {/* expand/minimise text */}
        <Grid2 size={1} align={"left"}>
          <ExpandMinimise
            classes={classes}
            expandMinimiseText={expandMinimiseText}
            setExpanded={setExpanded}
            expanded={expanded}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export function ExpandMinimise({
  classes,
  expandMinimiseText,
  setExpanded,
  expanded,
}) {
  return (
    <Tooltip title={expandMinimiseText}>
      <UnfoldMore
        className={classes.toolTipIcon}
        onClick={() => {
          setExpanded(!expanded);
        }}
        sx={{ cursor: "pointer" }}
        color={"primary"}
      />
    </Tooltip>
  );
}
