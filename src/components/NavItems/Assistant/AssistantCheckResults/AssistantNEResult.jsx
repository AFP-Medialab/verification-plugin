import React, { useState } from "react";
import { useSelector } from "react-redux";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Grid2,
  ListItemButton,
  LinearProgress,
  Typography,
  Link,
} from "@mui/material";
import { TagCloud } from "react-tagcloud";
import { select } from "d3-selection";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { DataGrid, getGridSingleSelectOperators } from "@mui/x-data-grid";

const AssistantNEResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();

  const neResult = useSelector((state) => state.assistant.neResultCategory);
  const neResultCount = useSelector((state) => state.assistant.neResultCount);
  const neLoading = useSelector((state) => state.assistant.neLoading);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const handleCollapse = (index) => {
    index === selectedIndex ? setSelectedIndex(null) : setSelectedIndex(index);
  };
  const [visibleCategories, setVisibleCategories] = useState(
    neResult.reduce((acc, key) => {
      acc[key.category.toLowerCase()] = false;
      return acc;
    }, {}),
  );

  function getWordColor(tag, active = true) {
    if (!tag || !tag.category) {
      return "black";
    }
    if (active) {
      switch (tag.category.toLowerCase()) {
        case "person":
          return "blue";
        case "location":
          return "red";
        case "organization":
          return "green";
        case "hashtag":
          return "orange";
        case "userid":
          return "purple";
        default:
          return "black";
      }
    }
    switch (tag.category.toLowerCase()) {
      case "person":
        return "darkblue";
      case "location":
        return "darkred";
      case "organization":
        return "darkgreen";
      case "hashtag":
        return "darkorange";
      case "userid":
        return "darkpurple";
      default:
        return "gray";
    }
  }

  const namedEntityTypeList = [
    ...new Set(neResultCount.map((res) => keyword(res.category))),
  ].sort();

  const columns = [
    {
      field: "value",
      headerName: keyword("name"),
      type: "string",
      align: "left",
      headerAlign: "center",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "category",
      headerName: keyword("category"),
      type: "singleSelect",
      valueOptions: namedEntityTypeList,
      align: "center",
      headerAlign: "center",
      minWidth: 5,
      flex: 1,
      renderCell: (params) => {
        return (
          <Chip
            label={keyword(params.row.category)}
            sx={{ color: "white", backgroundColor: getWordColor(params.row) }}
            size="small"
          />
        );
      },
    },
    {
      field: "count",
      type: "number",
      headerName: keyword("count"),
      headerAlign: "center",
      minWidth: 4,
      flex: 1,
    },
  ];

  return (
    <Grid2 size={{ xs: 12 }}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={keyword("named_entity_title")}
        />
        {neLoading && <LinearProgress />}
        <CardContent>
          <div style={{ height: 400, width: "100%", minWidth: 0 }}>
            <DataGrid
              rows={neResultCount.map((obj, index) => ({
                ...obj,
                id: index + 1,
              }))}
              columns={columns}
              rowHeight={60}
              disableRowSelectionOnClick
              initialState={{
                sorting: {
                  sortModel: [{ field: "category", sort: "desc" }],
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Grid2>
  );
};

export default AssistantNEResult;
