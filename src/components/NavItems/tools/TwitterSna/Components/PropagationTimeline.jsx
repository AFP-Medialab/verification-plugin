import ReactECharts from "echarts-for-react";
import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { GridExpandMoreIcon } from "@mui/x-data-grid";
import dayjs from "dayjs";

const PropagationTimeline = (props) => {
  let dataSources = props.dataSources;
  let selected = props.selected;
  let setPlot = props.setPlot;
  let plot = props.plot;

  const setPropagationTimeline = () => {
    console.log(dataSources);
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
    let plotPoints = selectedContent.map((x) => ({
      user: nameMaps.has(x.username) ? nameMaps.get(x.username) : x.username,
      shareTime: x.date,
      likes: x.likes ? x.likes : 0,
      quotes: x.quotes ? x.quotes : 0,
      retweets: x.retweets ? x.retweets : 0,
      replies: x.replies ? x.replies : 0,
      views: x.views ? x.views : 0,
      shares: x.shares ? x.shares : 0,
      "Total Interactions": x["Total Interactions"]
        ? x["Total Interactions"]
        : 0,
    }));

    const countsByDate = {};

    plotPoints.forEach((item) => {
      const date = dayjs(item.shareTime).isValid()
        ? dayjs(item.shareTime)
        : dayjs(new Date(item.shareTime));
      const dateKey = date.format("YYYY-MM-DD");

      if (!countsByDate[dateKey]) {
        countsByDate[dateKey] = { count: 0 };
      }

      countsByDate[dateKey].count += 1;
    });

    const chartData = Object.entries(countsByDate)
      .map(([date, metrics]) => [
        dayjs(date).valueOf(), // Timestamp
        metrics.count,
      ])
      .sort((a, b) => a[0] - b[0]);

    const option = {
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          const date = dayjs(params[0].value[0]).format("YYYY-MM-DD");
          const count = params[0].value[1];
          return `${date}<br/>Entries: ${count}`;
        },
        axisPointer: {
          type: "cross",
        },
      },
      xAxis: {
        type: "time",
        name: "Date",
        nameLocation: "middle",
        nameGap: 30,
      },
      yAxis: {
        type: "value",
        name: "Entries",
        nameLocation: "middle",
        nameGap: 40,
      },
      dataZoom: [
        {
          type: "slider",
          show: true,
          xAxisIndex: 0,
        },
        {
          type: "inside",
          xAxisIndex: 0,
        },
      ],
      series: [
        {
          type: "line",
          smooth: true,
          symbol: "none",
          lineStyle: {
            width: 3,
          },
          areaStyle: {
            color: "rgba(130,202,157,0.2)",
          },
          data: chartData,
        },
      ],
      grid: {
        left: "5%",
        right: "5%",
        bottom: "15%",
        containLabel: true,
      },
    };

    setPlot(
      <div style={{ width: "100%", height: "500px" }}>
        <ReactECharts option={option} />
      </div>,
    );
  };

  return (
    <>
      <Box>
        <Box p={2}></Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography pl={2}>
            {" "}
            Distribution of tweets in collection over time:
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
            onClick={setPropagationTimeline}
          >
            Show graph
          </Button>
        </Stack>
      </Box>
      <Box p={2}></Box>
      {plot ? plot : <></>}
    </>
  );
};

export default PropagationTimeline;
