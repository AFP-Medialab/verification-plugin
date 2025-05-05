import React from "react";

import Box from "@mui/material/Box";
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
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Teal
  "#FFBB28", // Amber
  "#FF8042", // Orange
  "#8884D8", // Purple
  "#A28BE3", // Lavender
  "#FF6492", // Pink
  "#70D6FF", // Sky Blue
  "#FFB5E8", // Light Pink
  "#9AE19D", // Mint Green
  "#FFD93D", // Yellow
  "#FF6B6B", // Coral Red
  "#6B5B95", // Dark Purple
  "#4ECDC4", // Aqua
  "#556270", // Charcoal Blue
];

const MAX_USERS = 12;

const RADIAN = Math.PI / 180;

const renderTopLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  index,
  payload,
}) => {
  if (!payload.showLabel || percent < 0.01) return null;

  const angle = -midAngle * RADIAN;
  const radius = outerRadius + 20;

  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      fontSize={13}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {payload.username}
    </text>
  );
};

const AccountActivity = (props) => {
  let dataSources = props.dataSources;
  let selected = props.selected;
  let activityChart = props.activityChart;
  let setActivityChart = props.setActivityChart;
  let activitySelect = props.activitySelect;
  let setActivitySelect = props.setActivitySelect;
  let selectedSources = dataSources.filter((source) =>
    selected.includes(source.id),
  );

  const measureActivity = () => {
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
    let groupedContent = Object.groupBy(
      selectedContent,
      ({ username }) => username,
    );
    // let accountActivity = Object.entries(groupedContent).map((x) => ({
    //   username: nameMaps.has(x[0]) ? nameMaps.get(x[0]) : x[0],
    //   entries: x[1].length,
    //   likes: x[1].reduce((acc, current) => acc + current.likes, 0),
    //   retweets: x[1].reduce((acc, current) => acc + current.retweets, 0),
    //   Likes: x[1].reduce((acc, current) => acc*1 + current["Likes"], 0),
    //   Shares: x[1].reduce((acc, current) => acc*1 + current["Shares"], 0),
    //   "Total Interactions": x[1].reduce((acc, current) => acc*1 + current["Total Interactions"], 0),
    // }));

    const pieData = Object.entries(groupedContent)
      .map(([username, entries]) => ({
        username: nameMaps.has(username) ? nameMaps.get(username) : username,
        entries: entries.length,
        likes: entries.reduce((acc, cur) => acc + parseInt(cur.likes || 0), 0),
        retweets: entries.reduce(
          (acc, cur) => acc + parseInt(cur.retweets || 0),
          0,
        ),
        Likes: entries.reduce(
          (acc, current) => acc + parseInt(current["Likes"] || 0),
          0,
        ),
        Shares: entries.reduce(
          (acc, current) => acc + parseInt(current["Shares"] || 0),
          0,
        ),
        "Total Interactions": entries.reduce(
          (acc, current) => acc + parseInt(current["Total Interactions"] || 0),
          0,
        ),
      }))
      .sort((a, b) => b[activitySelect] - a[activitySelect]);

    const firstUsers = pieData.slice(0, MAX_USERS);
    const others = pieData.slice(MAX_USERS);

    if (others.length > 0) {
      const otherEntry = {
        username: "Other",
        entries: others.reduce((acc, u) => acc + u.entries, 0),
        likes: others.reduce((acc, u) => acc + parseInt(u.likes), 0),
        retweets: others.reduce((acc, u) => acc + parseInt(u.retweets), 0),
        Likes: others.reduce(
          (acc, current) => acc + parseInt(current["Likes"]),
          0,
        ),
        Shares: others.reduce(
          (acc, current) => acc + parseInt(current["Shares"]),
          0,
        ),
        "Total Interactions": others.reduce(
          (acc, current) => acc + parseInt(current["Total Interactions"]),
          0,
        ),
        isOther: true,
      };
      firstUsers.push(otherEntry);
    }
    let topUsers = firstUsers.map((d, i) => ({
      ...d,
      showLabel: i < 5, // only top 5 get labels
    }));
    console.log(topUsers);
    // console.log(accountActivity);
    let activityData = topUsers.map((x, idx) => ({
      id: idx,
      value: x.entries,
      label: x.username,
    }));
    console.log(activityData);
    const chartWidth = pieData.length * 60;
    const handleBarClick = (data) => {
      if (data.isOther) {
        setActivityChart(
          <div style={{ width: "100%", overflowX: "auto" }}>
            <BarChart
              width={chartWidth}
              height={400}
              data={pieData}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="username"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={200}
              />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={activitySelect}
                fill="#8884d8"
                name={activitySelect}
              />
            </BarChart>
          </div>,
        );
      }
    };

    setActivityChart(
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={topUsers}
          margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          onClick={({ activePayload }) => {
            if (activePayload?.[0]?.payload?.isOther)
              handleBarClick(activePayload[0].payload);
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="username"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={activitySelect} fill="#8884d8" name={activitySelect} />
        </BarChart>
      </ResponsiveContainer>,
    );

    // setActivityChart(
    //   <ResponsiveContainer width="100%" height={450}>
    //     <PieChart width={600} height={400}>
    //       <Pie
    //         data={topUsers}
    //         dataKey={activitySelect}
    //         nameKey="username"
    //         cx="50%"
    //         cy="50%"
    //         outerRadius={120}
    //         label={renderTopLabel}
    //       >
    //         {pieData.map((entry, index) => (
    //           <Cell
    //             key={`cell-${index}`}
    //             fill={COLORS[index % COLORS.length]}
    //           />
    //         ))}
    //       </Pie>
    //       <Tooltip />
    //       <Legend />
    //     </PieChart>
    //   </ResponsiveContainer>,
    // );
  };

  const selectItems = [
    {
      key: "likes",
      item: (
        <MenuItem key={"activity-select-likes"} value={"likes"}>
          Likes
        </MenuItem>
      ),
    },
    {
      key: "retweets",
      item: (
        <MenuItem key={"activity-select-retweets"} value={"retweets"}>
          Retweets
        </MenuItem>
      ),
    },
    {
      key: "Likes",
      item: (
        <MenuItem key={"activity-select-Likes"} value={"Likes"}>
          Likes
        </MenuItem>
      ),
    },
    {
      key: "Shares",
      item: (
        <MenuItem key={"activity-select-shares"} value={"Shares"}>
          Shares
        </MenuItem>
      ),
    },
    {
      key: "Total Interactions",
      item: (
        <MenuItem
          key={"activity-select-interactions"}
          value={"Total Interactions"}
        >
          Total Interactions
        </MenuItem>
      ),
    },
  ];

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography pl={2}> Users with the most </Typography>
        <FormControl>
          <Select
            id="useractivity-select"
            value={activitySelect}
            onChange={(e) => setActivitySelect(e.target.value)}
          >
            <MenuItem value={"entries"}>Entries</MenuItem>
            {selectItems
              .filter((y) =>
                selectedSources.every((x) => x.headers.includes(y.key)),
              )
              .map((x) => x.item)}
          </Select>
        </FormControl>
        <Button onClick={measureActivity}>Show graph</Button>
      </Stack>
      <Box p={2} />
      {activityChart ? activityChart : <></>}
    </>
  );
};

export default AccountActivity;
