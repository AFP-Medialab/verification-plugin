import React, { PureComponent } from "react";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import {
  getSelectedSourcesNameMaps,
  keepOnlyNumberFields,
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
  return selectedContent.filter(
    (x) => String(x.username) === String(clickPayload.username),
  );
};

export const accountActivitySettings = (
  keyword,
  dataSources,
  selected,
  activitySelect,
  setActivitySelect,
) => {
  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );

  if (selectedSources.length === 0) return <> </>;

  const numberFieldsinSources = selectedSources
    .map((source) => keepOnlyNumberFields(source.content[0]))
    .flat();

  const commonFields = numberFieldsinSources.filter((field) =>
    selectedSources.every((source) => source.headers.includes(field)),
  );

  return (
    <>
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
    </>
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
  groupingFactor,
  onlyShowTop,
  activityChartData,
  keyword,
  detailDisplayFilter,
  activitySelect,
  setActivityGraph,
  setDetailContent,
  setOpenDetailModal,
  selectedContent,
  selected,
  dataSources,
) => {
  let chartData = onlyShowTop
    ? activityChartData.slice(0, TOP_USER_COUNT)
    : activityChartData;

  if (onlyShowTop)
    chartData.push({
      username: keyword("snaTools_barChartOtherLabel"),
      count: activityChartData
        .slice(TOP_USER_COUNT)
        .reduce((acc, curr) => acc + curr.count, 0),
      isOther: true,
    });
  const handleBarClick = (clickPayload) => {
    clickPayload.isOther
      ? setActivityGraph(
          generateAccountActivityChart(
            groupingFactor,
            false,
            activityChartData,
            keyword,
            detailDisplayFilter,
            activitySelect,
            setActivityGraph,
            setDetailContent,
            setOpenDetailModal,
            selectedContent,
            selected,
            dataSources,
          ),
        )
      : genericDetailDisplayHandler(
          clickPayload,
          setDetailContent,
          setOpenDetailModal,
          selectedContent,
          detailDisplayFilter,
        );
  };
  const nameMaps = getSelectedSourcesNameMaps(dataSources, selected);

  class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, payload } = this.props;

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
    }
  }
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
    <div style={{ width: "100%", overflowX: "auto" }}>
      <BarChart
        data={chartData}
        width={onlyShowTop ? 1200 : chartData.length * 60}
        height={400}
        margin={{
          top: 20,
          right: 30,
          left: 20,
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
        <YAxis />
        <Tooltip
          content={CustomizedToolTip}
          cursor={{
            fill: "white",
          }}
        />
        <Legend />
        <Bar dataKey={"count"} fill="#8884d8" name={activitySelect} />
      </BarChart>
    </div>
  );
};

export const generateAccountActivityData = (
  selectedContent,
  activitySelect,
) => {
  let contentGroupedByUser = Object.groupBy(
    selectedContent,
    ({ username }) => username,
  );
  let countsByUser = Object.keys(contentGroupedByUser)
    .map((username) => ({
      username: username,
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
