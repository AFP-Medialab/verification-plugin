import React from "react";
import TranslateIcon from "@mui/icons-material/Translate";
import Button from "@mui/material/Button";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import IconButton from "@mui/material/IconButton";

export const Translate = ({ text, type }) => {
  const keyword = i18nLoadNamespace("components/Shared/utils");
  // forward text on to google translate
  const googleTranslate = function (text) {
    let translate_url =
      "https://translate.google.com/?sl=auto&text=" +
      encodeURIComponent(text) +
      "&op=translate";
    window.open(translate_url, "_blank");
  };

  return type === "BUTTON" ? (
    <Button
      variant="outlined"
      color="primary"
      size={"large"}
      fullWidth
      onClick={() => {
        googleTranslate(text);
      }}
    >
      <TranslateIcon style={{ marginRight: "10px" }} />
      {keyword("translate")}
    </Button>
  ) : (
    <IconButton
      onClick={() => googleTranslate(text)}
      sx={{
        "&:hover": {
          backgroundColor: "inherit",
        },
      }}
    >
      <TranslateIcon color={"primary"} />
    </IconButton>
  );
};
