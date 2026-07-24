import React, { useMemo } from "react";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import { setSNAWordCloudLanguage } from "@/redux/reducers/tools/snaDataReducer";
import { scaleLog } from "@visx/scale";
import { Text } from "@visx/text";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";

import { getLanguages } from "./languages";

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

const fixedValueGenerator = () => 0.5;

/**
 * @param {object[]} words array of words containing the fields 'text', 'value', 'entries'
 * @param {function} wordClickFunction called on word click with the word object
 * @param {string} language ISO 639-1 language code for stop-word filtering
 * @param {function} onLanguageChange called with the new language code when the user changes the selector
 */
export const VisxWordcloud = ({ words, wordClickFunction, language }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/NewSNA");
  const keywordLanguages = i18nLoadNamespace(
    "components/NavItems/tools/stopWords",
  );

  const dispatch = useDispatch();

  const languages = getLanguages(keywordLanguages);

  const spiralType = "archimedean";
  const withRotation = true;

  const fontScale = useMemo(() => {
    const values = words.map((w) => w.value);
    return scaleLog({
      domain: [Math.min(...values), Math.max(...values)],
      range: [10, 100],
    });
  }, [words]);

  if (!words?.length) return null;

  const fontSizeSetter = (datum) => fontScale(datum.value);

  const StyledText = styled(Text)({
    cursor: "pointer",
    transition: "font-size 0.2s ease, opacity 0.2s ease",
    "&:hover": {
      fontSize: "1.1em",
    },
  });

  const setLanguage = (language) => {
    dispatch(setSNAWordCloudLanguage(language));
  };

  return (
    <>
      <Box display="flex" justifyContent="left" mb={2}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="wordcloud-language-label">
            {keyword("wordcloud_language_label")}
          </InputLabel>
          <Select
            labelId="wordcloud-language-label"
            id="wordcloud-language-select"
            value={language}
            label={keyword("wordcloud_language_label")}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="">
              <em>{keyword("wordcloud_language_none")}</em>
            </MenuItem>
            {Object.entries(languages).map(([code, { display_name }]) => (
              <MenuItem key={code} value={code}>
                {display_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="center">
        <Wordcloud
          words={words}
          width={800}
          height={500}
          fontSize={fontSizeSetter}
          font={"Impact"}
          padding={2}
          spiral={spiralType}
          rotate={withRotation ? getRotationDegree : 0}
          random={fixedValueGenerator}
        >
          {(cloudWords) =>
            cloudWords.map((w, i) => (
              <StyledText
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={"middle"}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
                onClick={() => wordClickFunction(w)}
                className="word-in-wordcloud"
              >
                {w.text}
              </StyledText>
            ))
          }
        </Wordcloud>
      </Box>
    </>
  );
};
