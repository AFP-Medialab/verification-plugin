import React, { useMemo } from "react";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import ClearIcon from "@mui/icons-material/Clear";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import { setSNAWordCloudLanguages } from "@/redux/reducers/tools/snaDataReducer";
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
 * @param {string[]} languages ISO 639-1 language codes for stop-word filtering
 */
export const VisxWordcloud = ({ words, wordClickFunction, languages }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/NewSNA");
  const keywordLanguages = i18nLoadNamespace(
    "components/NavItems/tools/stopWords",
  );

  const dispatch = useDispatch();

  const languageMap = getLanguages(keywordLanguages);

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

  const handleLanguageChange = (event) => {
    const value = event.target.value;
    dispatch(
      setSNAWordCloudLanguages(
        typeof value === "string" ? value.split(",") : value,
      ),
    );
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="left"
        alignItems="center"
        gap={1}
        mb={2}
      >
        <FormControl size="small" sx={{ minWidth: 200, maxWidth: 350 }}>
          <InputLabel id="wordcloud-language-label">
            {keyword("wordcloud_language_label")}
          </InputLabel>
          <Select
            labelId="wordcloud-language-label"
            id="wordcloud-language-select"
            multiple
            value={languages}
            onChange={handleLanguageChange}
            input={
              <OutlinedInput label={keyword("wordcloud_language_label")} />
            }
            renderValue={(selected) =>
              selected.length === 0 ? (
                <em>{keyword("wordcloud_language_none")}</em>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((code) => (
                    <Chip
                      key={code}
                      label={languageMap[code]?.display_name ?? code}
                      size="small"
                    />
                  ))}
                </Box>
              )
            }
          >
            {Object.entries(languageMap)
              .sort(([, a], [, b]) =>
                a.display_name.localeCompare(b.display_name),
              )
              .map(([code, { display_name }]) => (
                <MenuItem key={code} value={code}>
                  <Checkbox checked={languages.includes(code)} />
                  <ListItemText primary={display_name} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        {languages.length > 0 && (
          <Tooltip title={keyword("wordcloud_language_clear")}>
            <IconButton
              size="small"
              onClick={() => dispatch(setSNAWordCloudLanguages([]))}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
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
