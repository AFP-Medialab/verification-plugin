import React from "react";

import Box from "@mui/material/Box";

import { scaleLog } from "@visx/scale";
import { Text } from "@visx/text";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";

function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

const fixedValueGenerator = () => 0.5;

export function getVisxWordcloud(words, wordClickFunction) {
  const spiralType = "archimedean";
  const withRotation = true;

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ],
    range: [10, 100],
  });

  const fontSizeSetter = (datum) => fontScale(datum.value);

  return (
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
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
              onClick={() => wordClickFunction(w)}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
    </Box>
  );
}
