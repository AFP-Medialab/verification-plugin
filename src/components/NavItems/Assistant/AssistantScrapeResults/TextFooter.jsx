import React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import { TextCopy } from "@Shared/Utils/TextCopy";
import { Translate } from "@Shared/Utils/Translate";
import { getLanguageName } from "@Shared/Utils/languageUtils";

export default function TextFooter({
  classes,
  setDisplayOrigLang,
  displayOrigLang,
  textLang,
  text,
}) {
  const keyword = i18nLoadNamespace("components/Shared/utils");
  const locale = useSelector((state) => state.language);
  return (
    <Box>
      <Divider />
      <Grid container spacing={2}>
        {/* language detected */}
        <Grid
          size={10}
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
            {getLanguageName(textLang, locale) ?? textLang}
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
      </Grid>
    </Box>
  );
}
