import React from "react";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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

const Hashtags = (props) => {
  let MAX_USERS = 40;
  let hashtagGraph = props.hashtagGraph;
  let setHashtagGraph = props.setHashtagGraph;
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

  const analyzeHashtags = () => {
    let existingHashtags = selectedContent
      .map((x) =>
        x.hashtags?.replace("‚", ",").replace("‚", ",").split(",").flat(),
      )
      .flat();
    let groupedHashtags = existingHashtags.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    console.log(groupedHashtags);
    let sorted = Object.entries(groupedHashtags)
      .map((k) => ({ name: k[0], occurences: k[1] }))
      .sort((a, b) => b.occurences - a.occurences)
      .filter((x) => x.name.length > 0); // sort descending

    const firstUsers = sorted.slice(0, MAX_USERS);
    const others = sorted.slice(MAX_USERS);
    if (others.length > 0) {
      const otherEntry = others.reduce(
        (acc, curr) => ({
          name: "Other",
          occurences: acc.occurences + curr.occurences,
          isOther: true,
        }),
        { name: "Other", occurences: 0 },
      );

      firstUsers.push(otherEntry);
    }
    const chartWidth = sorted.length * 60;
    const handleBarClick = (data) => {
      if (data.isOther) {
        setHashtagGraph(
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

    setHashtagGraph(
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={firstUsers}
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
          <Bar dataKey="occurences" fill="#8884d8" name="Uses" />
        </BarChart>
      </ResponsiveContainer>,
    );
  };

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>
          {" "}
          Hashtags used in collection and their frequency{" "}
        </Typography>
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
          onClick={analyzeHashtags}
        >
          Show graph
        </Button>
      </Stack>
      {hashtagGraph ? hashtagGraph : <></>}
    </>
  );
};

export default Hashtags;
