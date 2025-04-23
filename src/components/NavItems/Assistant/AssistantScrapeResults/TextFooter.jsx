import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import { TextCopy } from "../../../Shared/Utils/TextCopy";
import { Translate } from "../../../Shared/Utils/Translate";
import { getLanguageName } from "../../../Shared/Utils/languageUtils";

export default function TextFooter({
  classes,
  setDisplayOrigLang,
  displayOrigLang,
  textLang,
  expandMinimiseText,
  text,
  displayExpander,
  setExpanded,
  expanded,
}) {
  const keyword = i18nLoadNamespace("components/Shared/utils");
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
            {getLanguageName(textLang, textLang) ?? textLang}
          </Typography>
        </Grid2>

        {/* copy to clipboard */}
        <Grid2 size={{ xs: 1 }} align={"right"} display="flex" pt={1.5}>
          <Tooltip title={keyword("copy_to_clipboard")}>
            <div>
              <TextCopy text={text} index={text} />
            </div>
          </Tooltip>
        </Grid2>

        {/* translate */}
        <Grid2 size={{ xs: 1 }} align={"right"} display="flex" pt={2}>
          <Tooltip title={keyword("translate")}>
            <div>
              <Translate text={text} />
            </div>
          </Tooltip>
        </Grid2>

        {/* expand/minimise text */}
        <Grid2 size={{ xs: 1 }} align={"right"} display="flex" pt={1}>
          <ExpandMinimise
            classes={classes}
            expandMinimiseText={expandMinimiseText}
            displayExpander={displayExpander}
            setExpanded={setExpanded}
            expanded={expanded}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
}

export function TextFooterPrevFactChecks({ navigate, keyword }) {
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
      </Grid2>
    </Box>
  );
}

export function ExpandMinimise({
  classes,
  expandMinimiseText,
  setExpanded,
  expanded,
  type,
}) {
  return type === "BUTTON" ? (
    <Button
      variant="outlined"
      color="primary"
      size={"large"}
      fullWidth
      onClick={() => {
        setExpanded(!expanded);
      }}
    >
      {expanded ? (
        <ExpandLessOutlined
          className={classes.toolTipIcon}
          color="primary"
          style={{ display: "inline-flex" }}
        />
      ) : (
        <ExpandMoreOutlined
          className={classes.toolTipIcon}
          color="primary"
          style={{ display: "inline-flex" }}
        />
      )}
      {expandMinimiseText}
    </Button>
  ) : (
    <IconButton
      onClick={() => setExpanded(!expanded)}
      sx={{
        "&:hover": {
          backgroundColor: "inherit",
        },
      }}
    >
      {expanded ? (
        <ExpandLessOutlined
          className={classes.toolTipIcon}
          color="primary"
          style={{ display: "inline-flex" }}
        />
      ) : (
        <ExpandMoreOutlined
          className={classes.toolTipIcon}
          color="primary"
          style={{ display: "inline-flex" }}
        />
      )}
    </IconButton>
  );
}
