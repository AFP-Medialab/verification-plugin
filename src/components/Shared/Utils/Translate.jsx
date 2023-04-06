import React from "react";
import { useSelector } from "react-redux";
import TranslateIcon from "@mui/icons-material/Translate";
import Button from "@mui/material/Button";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import IconButton from "@mui/material/IconButton";
import tsv from "../../../LocalDictionary/components/Shared/utils.tsv";

export const Translate = ({ text, type }) => {
  const keyword = useLoadLanguage("components/Shared/utils.tsv", tsv);
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
    <IconButton onClick={() => googleTranslate(text)}>
      <TranslateIcon color={"primary"} />
    </IconButton>
  );
};

export const isCurrentLanguageLeftToRight = () => {
  const language = useSelector((state) => state.language);
  return language !== "ar";
};
