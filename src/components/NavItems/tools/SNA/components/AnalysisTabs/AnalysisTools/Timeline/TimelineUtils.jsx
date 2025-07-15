import ReactECharts from "echarts-for-react";
import React from "react";

const dayjs = require("dayjs");

const DATE_FORMAT = "YYYY-MM-DDTHH";

const gridConfig = {
  left: "5%",
  right: "5%",
  bottom: "15%",
  containLabel: true,
};

const xAxisConfig = {
  type: "time",
  name: "Date",
  nameLocation: "middle",
  nameGap: 30,
};

const yAxisConfig = {
  type: "value",
  name: "Entries",
  nameLocation: "middle",
  nameGap: 40,
};

const dataZoomConfig = [
  {
    type: "slider",
    show: true,
    xAxisIndex: 0,
  },
  {
    type: "inside",
    xAxisIndex: 0,
  },
];

const getTooltipConfig = (keyword) => {
  return {
    trigger: "axis",
    formatter: (params) => {
      const date = dayjs(params[0].value[0]).format(DATE_FORMAT);
      const count = params[0].value[1];
      return `${date}<br/>${keyword("snaTools_entriesLabel")}: ${count}`;
    },
    axisPointer: {
      type: "cross",
    },
  };
};

const getSeriesConfig = (timelineChartData) => {
  return [
    {
      type: "line",
      smooth: true,
      symbol: "circle", // Show dots
      symbolSize: 6, // Dot size
      itemStyle: {
        color: "#82ca9d",
      },
      lineStyle: {
        width: 3,
      },
      areaStyle: {
        color: "rgba(130,202,157,0.2)",
      },
      data: timelineChartData,
    },
  ];
};

export const getTimelineChartOptions = (keyword, timelineChartData) => {
  let tooltipConfig = getTooltipConfig(keyword);
  let seriesConfig = getSeriesConfig(timelineChartData);

  return {
    tooltip: tooltipConfig,
    xAxis: xAxisConfig,
    yAxis: yAxisConfig,
    dataZoom: dataZoomConfig,
    series: seriesConfig,
    grid: gridConfig,
  };
};

const handleClick = (
  params,
  setDetailContent,
  setOpenDetailModal,
  timelineChartData,
) => {
  const clickedDate = dayjs(params.value[0]).format(DATE_FORMAT);

  setDetailContent(
    timelineChartData.filter(
      (x) => dayjs(x.date).format(DATE_FORMAT) === clickedDate,
    ),
  );
  setOpenDetailModal(true);
};

export const generateTimelineData = (selectedData) => {
  const countsByDate = {};
  selectedData.forEach((item) => {
    if (!dayjs(item.date).isValid()) return;

    const dateKey = dayjs(item.date).format(DATE_FORMAT);

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

  return chartData;
};

export const TimelineChart = (
  timelineChartOptions,
  setDetailContent,
  setOpenDetailModal,
  timelineChartData,
  selectedData,
) => (
  <div
    style={{
      width: "100%",
      height: "500px",
    }}
  >
    <ReactECharts
      option={timelineChartOptions}
      onEvents={{
        click: (params) =>
          handleClick(
            params,
            setDetailContent,
            setOpenDetailModal,
            selectedData,
          ),
      }}
    />
  </div>
);
