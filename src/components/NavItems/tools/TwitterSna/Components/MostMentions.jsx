import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TOP_N = 40;

const MostMentions = (props) => {
  let dataSources = props.dataSources;
  let selected = props.selected;
  let mentionGraph = props.mentionGraph;
  let setMentionGraph = props.setMentionGraph;

  const getMentions = () => {
    console.log(mentionGraph);
    console.log(setMentionGraph);
    let selectedSources = dataSources.filter((source) =>
      selected.includes(source.id),
    );
    let selectedContent = selectedSources
      .map((source) => source.content)
      .flat();
    let nameMaps = new Map(
      selectedSources
        .map((source) =>
          source.accountNameMap ? source.accountNameMap : new Map(),
        )
        .flatMap((m) => [...m]),
    );
    let allMentions = selectedContent
      .map((x) => x.mentions.split(",").flat())
      .flat()
      .filter((x) => x.length > 0);
    let groupedMentions = allMentions.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    console.log(groupedMentions);
    let sorted = Object.entries(groupedMentions)
      .map((k) => ({ name: k[0], occurences: k[1] }))
      .sort((a, b) => b.occurences - a.occurences); // sort descending

    const data = sorted.slice(0, TOP_N);
    const rest = sorted.slice(TOP_N);
    if (rest.length > 0) {
      const otherEntry = rest.reduce(
        (acc, curr) => ({
          name: "Other",
          occurences: acc.occurences + curr.occurences,
          isOther: true,
        }),
        { name: "Other", occurences: 0 },
      );

      data.push(otherEntry);
    }

    const chartWidth = sorted.length * 60;
    console.log(data);

    const handleBarClick = (data) => {
      if (data.isOther) {
        setMentionGraph(
          <div style={{ width: "100%", overflowX: "auto" }}>
            <BarChart
              width={chartWidth}
              height={400}
              data={sorted}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={120}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="occurences" fill="#8884d8" name="Mentions" />
            </BarChart>
          </div>,
        );
      }
    };

    setMentionGraph(
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          onClick={({ activePayload }) => {
            if (activePayload?.[0]?.payload?.isOther)
              handleBarClick(activePayload[0].payload);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="occurences" fill="#8884d8" name="Mentions" />
        </BarChart>
      </ResponsiveContainer>,
    );
  };

  return (
    <>
      <Button onClick={getMentions}>TEST</Button>
      <Box p={2} />
      {mentionGraph ? mentionGraph : <></>}
    </>
  );
};

export default MostMentions;
