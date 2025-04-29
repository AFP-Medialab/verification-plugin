import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
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

  const measureActivity = () => {
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
    let groupedContent = Object.groupBy(
      selectedContent,
      ({ username }) => username,
    );
    let accountActivity = Object.entries(groupedContent).map((x) => ({
      username: nameMaps.has(x[0]) ? nameMaps.get(x[0]) : x[0],
      entries: x[1].length,
      likes: x[1].reduce((acc, current) => acc + current.likes, 0),
      retweets: x[1].reduce((acc, current) => acc + current.retweets, 0),
    }));

    const pieData = Object.entries(groupedContent)
      .map(([username, entries]) => ({
        username: nameMaps.has(username) ? nameMaps.get(username) : username,
        entries: entries.length,
        likes: entries.reduce((acc, cur) => acc + (cur.likes || 0), 0),
        retweets: entries.reduce((acc, cur) => acc + (cur.retweets || 0), 0),
      }))
      .sort((a, b) => b.entries - a.entries);

    const firstUsers = pieData.slice(0, MAX_USERS);
    const others = pieData.slice(MAX_USERS);

    if (others.length > 0) {
      const otherEntry = {
        username: "Other",
        entries: others.reduce((acc, u) => acc + u.entries, 0),
        likes: others.reduce((acc, u) => acc + u.likes, 0),
        retweets: others.reduce((acc, u) => acc + u.retweets, 0),
      };
      firstUsers.push(otherEntry);
    }
    let topUsers = firstUsers.map((d, i) => ({
      ...d,
      showLabel: i < 5, // only top 5 get labels
    }));
    console.log(accountActivity);
    let activityData = topUsers.map((x, idx) => ({
      id: idx,
      value: x.entries,
      label: x.username,
    }));
    console.log(activityData);
    setActivityChart(
      <ResponsiveContainer width="100%" height={450}>
        <PieChart width={600} height={400}>
          <Pie
            data={topUsers}
            dataKey="entries"
            nameKey="username"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={renderTopLabel}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>,
    );
  };

  return (
    <>
      <Button onClick={measureActivity}>test</Button>
      <Box p={2} />
      {activityChart ? activityChart : <></>}
    </>
  );
};

export default AccountActivity;
