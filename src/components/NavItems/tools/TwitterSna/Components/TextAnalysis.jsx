import React from "react";

import Button from "@mui/material/Button";

const TextAnalysis = (props) => {
  let dataSources = props.dataSources;
  let selected = props.selected;
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

  const countWords = () => {
    let acc = {};
    let s = selectedContent
      .map((x) => {
        let ret = x.text
          ? x.text
              .toLowerCase()
              .split(" ")
              .filter((x) => !x.includes("https:") && !x.includes("#"))
              .reduce(function (acc, curr) {
                return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
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

    let tfidf = sorted.map((x) => ({
      word: x[0],
      tfidf:
        x[1].occurences * Math.log(1 + selectedContent.length / x[1].documents),
    }));
    console.log(tfidf.sort((a, b) => b.tfidf - a.tfidf));
  };

  return (
    <>
      <Button onClick={countWords}>Count words</Button>
    </>
  );
};

export default TextAnalysis;
