import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { ExpandLessOutlined, ExpandMoreOutlined } from "@mui/icons-material";

import useMyStyles from "@Shared/MaterialUiStyles/useMyStyles";
import { TextCopy } from "@Shared/Utils/TextCopy";
import { Translate } from "@Shared/Utils/Translate";
import { getLanguageName } from "@Shared/Utils/languageUtils";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

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
  const keyword = i18nLoadNamespace("components/Shared/utils");
  return (
    <Box>
      <Divider />
      <Grid container spacing={2}>
        {/* language detected */}
        <Grid
          size={9}
          align={"left"}
          sx={{
            pt: 1,
          }}
        >
          <Typography
            className={classes.toolTipIcon}
            onClick={() => setDisplayOrigLang(!displayOrigLang)}
            sx={{
              display: "inline",
            }}
          >
            {getLanguageName(textLang, textLang) ?? textLang}
          </Typography>
        </Grid>

        {/* copy to clipboard */}
        <Grid
          size={{ xs: 1 }}
          align={"right"}
          sx={{
            display: "flex",
            pt: 1.5,
          }}
        >
          <Tooltip title={keyword("copy_to_clipboard")}>
            <div>
              <TextCopy text={text} index={text} />
            </div>
          </Tooltip>
        </Grid>

        {/* translate */}
        <Grid
          size={{ xs: 1 }}
          align={"right"}
          sx={{
            display: "flex",
            pt: 2,
          }}
        >
          <Tooltip title={keyword("translate")}>
            <div>
              <Translate text={text} />
            </div>
          </Tooltip>
        </Grid>

        {/* expand/minimise text */}
        <Grid
          size={{ xs: 1 }}
          align={"right"}
          sx={{
            display: "flex",
            pt: 1,
          }}
        >
          <ExpandMinimise
            classes={classes}
            expandMinimiseText={expandMinimiseText}
            setExpanded={setExpanded}
            expanded={expanded}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function TextFooterPrevFactChecks({
  navigate,
  keyword,
  setExpanded,
  expanded,
}) {
  const handleClick = (path) => {
    // instead need to set parameter then load text in SemanticSearch/index.jsx
    navigate("/app/" + path + "/assistantText");
  };
  const classes = useMyStyles();
  const expandMinimiseText = keyword("expand_minimise_text");

  return (
    <Box>
      <Divider />
      <Grid container>
        {/* empty */}
        <Grid size={{ xs: 1 }} align={"start"}>
          <></>
        </Grid>

        {/* see more details */}
        <Grid size={{ xs: 10 }} align={"center"}>
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
        </Grid>

        {/* expand/minimise text */}
        <Grid size={1} align={"left"}>
          <ExpandMinimise
            classes={classes}
            expandMinimiseText={expandMinimiseText}
            setExpanded={setExpanded}
            expanded={expanded}
          />
        </Grid>
      </Grid>
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
