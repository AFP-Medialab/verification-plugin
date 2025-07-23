import React from "react";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { SNAButton } from "components/NavItems/tools/SNA/utils/SNAButton";
import {
  getSelectedSourcesNameMaps,
  keepOnlyNumberFields,
  onlyUnique,
} from "components/NavItems/tools/SNA/utils/accessSavedCollections";
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

export const accountActivitySettings = (settingsArgs) => {
  let keyword = settingsArgs.keyword;
  let dataSources = settingsArgs.dataSources;
  let selected = settingsArgs.selected;
  let activitySelect = settingsArgs.activitySelect;
  let setActivitySelect = settingsArgs.setActivitySelect;

  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );

  if (selectedSources.length === 0) return <> </>;

  const numberFieldsinSources = selectedSources
    .map((source) => keepOnlyNumberFields(source.content[0]))
    .flat();

  const commonFields = numberFieldsinSources
    .filter((field) =>
      selectedSources.every((source) => source.headers.includes(field)),
    )
    .filter(onlyUnique);

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
          {commonFields.map((field) => (
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

export const generateAccountActivityChart = (globalArgs, activityChartData) => {
  let onlyShowTop = globalArgs.onlyShowTop;
  let keyword = globalArgs.keyword;
  let setOnlyShowTop = globalArgs.setOnlyShowTop;
  let setDetailContent = globalArgs.setDetailContent;
  let setOpenDetailModal = globalArgs.setOpenDetailModal;
  let selectedContent = globalArgs.selectedContent;
  let detailDisplayFilter = globalArgs.detailDisplayFilter;
  let dataSources = globalArgs.dataSources;
  let selected = globalArgs.selected;
  let groupingFactor = globalArgs.groupingFactor;
  let activitySelect = globalArgs.activitySelect;

  let chartData = onlyShowTop
    ? activityChartData.slice(0, TOP_USER_COUNT)
    : activityChartData;

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

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-35)"
        >
          {slicedLabel}
        </text>
      </g>
    );
  };

  const CustomizedToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let payloadLabel = label;
      let barLabel = nameMaps.has(payloadLabel)
        ? nameMaps.get(payloadLabel)
        : payloadLabel;
      return (
        <div className="custom-tooltip-activity-chart">
          <p>{barLabel}</p>
          <p>{`Value: ${payload[0].value}`}</p>
        </div>
      );
    }
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto", paddingLeft: "20px" }}>
      {onlyShowTop ? (
        <></>
      ) : (
        SNAButton(
          () => setOnlyShowTop(true),
          keyword("snaTools_showLessBarChartButton"),
        )
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
        />
        <Tooltip
          content={CustomizedToolTip}
          cursor={{
            fill: "white",
          }}
        />
        <Legend />
        <Bar dataKey={"count"} fill="#8884d8" name={activitySelect} />
      </BarChart>
    </Box>
  );
};

export const generateAccountActivityData = (selectedContent, analysisArgs) => {
  let activitySelect = analysisArgs.activitySelect;

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
