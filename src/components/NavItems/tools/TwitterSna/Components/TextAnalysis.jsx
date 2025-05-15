import React from "react";
import ReactWordcloud from "react-wordcloud";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { name } from "dayjs/locale/en";

const { removeStopwords, fra, eng } = require("stopword");

const TextAnalysis = (props) => {
  let wordCloud = props.wordCloud;
  let setWordCloud = props.setWordCloud;
  let dataSources = props.dataSources;
  let selected = props.selected;
  let langSelect = props.langSelect;
  let setLangSelect = props.setLangSelect;

  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );
  let selectedContent = selectedSources.map((source) => source.content).flat();
  let nameMaps = new Map(
    selectedSources
      .map((source) =>
        source.accountNameMap ? source.accountNameMap : new Map(),
      )
      .flatMap((m) => [...m]),
  );

  let setOpenDetailModal = props.setOpenDetailModal;
  let setDetailContent = props.setDetailContent;

  const countWords = () => {
    let acc = {};
    let s = selectedContent
      .map((x) => {
        let ret = x.text
          ? removeStopwords(
              x.text
                .toLowerCase()
                .split(" ")
                .filter(
                  (x) =>
                    !x.includes("https:") &&
                    !x.includes("#") &&
                    !x.includes("@") &&
                    x != "rt" &&
                    x != "&amp " &&
                    x.length > 1,
                ),
              langSelect === "ENG" ? eng : fra,
            ).reduce(function (acc, curr) {
              return acc[curr] ? (acc[curr] += 1) : (acc[curr] = 1), acc;
            }, {})
          : {};
        return ret;
      })
      .flat();
    s.map((x) =>
      Object.keys(x).map((w) => {
        if (acc[w]) {
          acc[w].occurences += x[w];
          acc[w].documents++;
        } else {
          acc[w] = {
            occurences: x[w],
            documents: 1,
          };
        }
      }),
    );

    console.log(acc);
    let sorted = Object.entries(acc)
      .map((k) => ({
        name: k[0],
        occurences: k[1].occurences,
        documents: k[1].documents,
      }))
      .sort((a, b) => b.occurences - a.occurences)
      .filter((x) => x.name.length > 0);

    console.log(sorted);

    // let tfidf = sorted.map((x) => ({
    //   word: x.name,
    //   tfidf: x.occurences * Math.log(1 + selectedContent.length / x.documents),
    // }));
    // console.log(tfidf.sort((a, b) => b.tfidf - a.tfidf));
    const options = {
      //  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
      enableTooltip: true,
      deterministic: true,
      fontFamily: "impact",
      fontSizes: [15, 80],
      fontStyle: "normal",
      fontWeight: "normal",
      padding: 1,
      rotations: 3,
      rotationAngles: [15, -15],
      scale: "sqrt",
      spiral: "rectangular",
      transitionDuration: 1000,
    };
    let wordCloudData = sorted
      .slice(0, 100)
      .map((x) => ({ text: x.name, value: x.occurences }));
    let wordCloudCallbacks = {
      onWordClick: (word) => {
        console.log(word);
        setDetailContent(
          selectedContent.filter((x) => x.text?.includes(word.text)),
        );
        setOpenDetailModal(true);
      },
    };
    setWordCloud(
      <ReactWordcloud
        words={wordCloudData}
        options={options}
        callbacks={wordCloudCallbacks}
      />,
    );
  };

  return (
    <>
      <Stack direction={"row"} spacing={2} alignItems="center">
        <Typography> Show the most commmonly used words. Language: </Typography>
        <FormControl>
          <Select
            id="textlanguage-select"
            value={langSelect}
            onChange={(e) => setLangSelect(e.target.value)}
          >
            <MenuItem value={"ENG"}>English</MenuItem>
            <MenuItem value={"FRA"}>French</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          sx={{
            color: "green",
            borderColor: "green",
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "rgba(0, 128, 0, 0.1)", // light green on hover
              borderColor: "darkgreen",
            },
          }}
          onClick={countWords}
        >
          Count words
        </Button>
      </Stack>
      <Box p={2} />
      {wordCloud ? wordCloud : <></>}
    </>
  );
};

export default TextAnalysis;
