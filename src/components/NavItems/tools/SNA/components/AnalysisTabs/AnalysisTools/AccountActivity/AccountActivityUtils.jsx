import React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getSelectedSourcesNameMaps } from "components/NavItems/tools/SNA/utils/accessSavedCollections";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TOP_USER_COUNT = 12;
const ENTRIES_FIELD_LABEL = "entries";
const MAX_TICK_LABEL_LENGTH = 20;

export const accountActivityDetailDisplayHandler = (
  selectedContent,
  clickPayload,
) => {
  return clickPayload.entries;
};

export const accountActivitySettings = ({
  keyword,
  activitySelect,
  setActivitySelect,
  commonNumberFields,
  selectedSources,
}) => {
  if (selectedSources.length === 0) return <> </>;

  return (
    <Box key="accountActivitySettings">
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>
          {keyword("snaTools_accountActivitySettingsDescription")}
        </Typography>
        <Select
          id="useractivity-select"
          value={activitySelect}
          onChange={(e) => setActivitySelect(e.target.value)}
        >
          <MenuItem value={"entries"}>
            {keyword("snaTools_accountActivityEntriesSelect")}
          </MenuItem>
          {commonNumberFields.map((field) => (
            <MenuItem value={field} key={"activitySelect_" + field}>
              {field}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Box>
  );
};

const genericDetailDisplayHandler = (
  clickPayload,
  setDetailContent,
  setOpenDetailModal,
  selectedContent,
  filteringFunction,
) => {
  let detailContent = filteringFunction(selectedContent, clickPayload);
  setDetailContent(detailContent);
  setOpenDetailModal(true);
};

export const generateAccountActivityChart = (
  {
    onlyShowTop,
    keyword,
    setOnlyShowTop,
    setDetailContent,
    setOpenDetailModal,
    selectedContent,
    detailDisplayFilter,
    dataSources,
    selected,
    groupingFactor,
    activitySelect,
  },
  activityChartData,
) => {
  let chartData = onlyShowTop
    ? activityChartData.slice(0, TOP_USER_COUNT)
    : activityChartData;

  const currentLang = useSelector((state) => state.language);

  if (onlyShowTop && activityChartData.length > TOP_USER_COUNT)
    chartData.push({
      username: keyword("snaTools_barChartOtherLabel"),
      count: activityChartData
        .slice(TOP_USER_COUNT)
        .reduce((acc, curr) => acc + curr.count, 0),
      isOther: true,
    });
  const handleBarClick = (clickPayload) => {
    clickPayload.isOther
      ? setOnlyShowTop(false)
      : genericDetailDisplayHandler(
          clickPayload,
          setDetailContent,
          setOpenDetailModal,
          selectedContent,
          detailDisplayFilter,
        );
  };
  const nameMaps = getSelectedSourcesNameMaps(dataSources, selected);

  const CustomizedAxisTick = ({ x, y, payload }) => {
    let tickLabel = nameMaps.has(payload.value)
      ? nameMaps.get(payload.value)
      : payload.value;

    let slicedLabel =
      tickLabel.length > MAX_TICK_LABEL_LENGTH
        ? tickLabel.slice(0, MAX_TICK_LABEL_LENGTH) + "..."
        : tickLabel;

    const angle = currentLang !== "ar" ? "-35" : "20";

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform={`rotate(${angle})`}
        >
          {slicedLabel}
        </text>
      </g>
    );
  };

  const CustomizedToolTip = ({ active, payload, label }, nameMaps) => {
    if (active && payload && payload.length) {
      let payloadLabel = label;
      let barLabel = nameMaps.has(payloadLabel)
        ? nameMaps.get(payloadLabel)
        : payloadLabel;
      return (
        <Box>
          <Stack direction="column" spacing={1}>
            <Typography>{barLabel}</Typography>
            <Typography>{`Value: ${payload[0].value}`}</Typography>
          </Stack>
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        paddingLeft: "20px",
        overflowY: "hidden",
      }}
    >
      {onlyShowTop ? (
        <></>
      ) : (
        <Button variant="outlined" onClick={() => setOnlyShowTop(true)}>
          {keyword("snaTools_showLessBarChartButton")}
        </Button>
      )}
      <BarChart
        sx={{ paddingLeft: "20px" }}
        data={chartData}
        width={chartData.length * 60 > 1200 ? chartData.length * 60 : 1200}
        height={400}
        margin={{
          top: 20,
          right: 30,
          left: 40,
          bottom: 100,
        }}
        onClick={({ activePayload }) => {
          if (activePayload?.[0]?.payload)
            handleBarClick(activePayload[0].payload);
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={groupingFactor}
          angle={-45}
          textAnchor="end"
          interval={0}
          height={120}
          tick={<CustomizedAxisTick />}
        />
        <YAxis
          tickFormatter={(value) =>
            Intl.NumberFormat("en-US", { notation: "compact" }).format(value)
          }
          tick={{ dx: currentLang !== "ar" ? 0 : -20 }}
        />
        <Tooltip
          content={CustomizedToolTip(nameMaps)}
          cursor={{
            fill: "rgba(128, 128, 128, 0.2)",
          }}
        />
        <Legend />
        <Bar dataKey={"count"} fill="#8884d8" name={activitySelect} />
      </BarChart>
    </Box>
  );
};

export const generateAccountActivityData = (
  selectedContent,
  { activitySelect },
) => {
  let contentGroupedByUser = Object.groupBy(
    selectedContent,
    ({ username }) => username,
  );
  let countsByUser = Object.keys(contentGroupedByUser)
    .map((username) => ({
      username: username,
      entries: contentGroupedByUser[username],
      count:
        activitySelect === ENTRIES_FIELD_LABEL
          ? contentGroupedByUser[username].length
          : contentGroupedByUser[username].reduce(
              (initialSum, currentEntry) =>
                initialSum + currentEntry[activitySelect] || 0,
              0,
            ),
    }))
    .sort((a, b) => b.count - a.count);
  return countsByUser;
};
