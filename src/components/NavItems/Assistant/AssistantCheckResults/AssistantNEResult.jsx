import React, { useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import { CardHeader, Grid2, ListItemButton, Tooltip } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
//import ReactWordcloud from "react-wordcloud";
import { TagCloud } from "react-tagcloud";
import { select } from "d3-selection";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { Trans } from "react-i18next";
import {
  TransHtmlDoubleLinkBreak,
  TransNamedEntityRecogniserLink,
} from "../TransComponents";

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

  const toggleCategory = (category) => {
    setVisibleCategories({
      ...visibleCategories,
      [category]: !visibleCategories[category],
    });
  };

  function getCallback(callback) {
    return function (word, event) {
      const isActive = callback !== "onWordMouseOut";
      const element = event.target;
      const text = select(element);
      text
        .on("click", () => {
          if (isActive) {
            window.open(`https://google.com/search?q=${word.text}`, "_blank");
          }
        })
        .transition()
        .attr("text-decoration", isActive ? "underline" : "none");
    };
  }

  const options = {
    rotations: 1,
    rotationAngles: [0],
    fontSizes: [15, 60],
  };

  const callbacks = {
    getWordColor: (word) => {
      switch (word.category.toLowerCase()) {
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
    },
    getWordTooltip: (word) => {
      return word.text + " (" + word.category + "): " + word.value;
    },
    onWordClick: getCallback("onWordClick"),
    onWordMouseOut: getCallback("onWordMouseOut"),
    onWordMouseOver: getCallback("onWordMouseOver"),
  };

  function getWordColor(tag, active = true) {
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

  const styles = {
    margin: "0px 3px",
    verticalAlign: "middle",
    display: "inline-block",
  };

  const customRenderer = (tag, size, color) => {
    const { className, style, ...props } = tag.props || {};
    const fontSize = size + "px";
    const key = tag.key || tag.value;
    const tagStyle = {
      ...styles,
      color: getWordColor(tag),
      textDecorationColor: getWordColor(tag),
      visibility: visibleCategories[tag.category.toLowerCase()]
        ? "hidden"
        : "visible",
      fontSize,
      ...style,
    };

    let tagClassName = "tag-cloud-tag";
    if (className) {
      tagClassName += " " + className;
    }

    return (
      <Link
        key={key}
        style={tagStyle}
        className={tagClassName}
        href={"https://www.google.com/search?q=" + tag.value}
        rel="noopener noreferrer"
        target={"_blank"}
      >
        {tag.value}
      </Link>
    );
  };

  return (
    <Grid2 size={{ xs: 12 }}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={keyword("named_entity_title")}
          action={
            <Tooltip
              interactive={"true"}
              title={
                <>
                  <Trans t={keyword} i18nKey="named_entity_tooltip" />
                  <TransHtmlDoubleLinkBreak keyword={keyword} />
                  <TransNamedEntityRecogniserLink keyword={keyword} />
                </>
              }
              classes={{ tooltip: classes.assistantTooltip }}
            >
              <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
            </Tooltip>
          }
        />
        {neLoading && <LinearProgress />}
        <CardContent>
          <ButtonGroup>
            {neResult.map((tag, index) => (
              <Button
                style={{
                  color: "white",
                  border: "none",
                  backgroundColor: getWordColor(
                    tag,
                    !visibleCategories[tag.category.toLowerCase()],
                  ),
                }}
                key={tag.category}
                onClick={() => toggleCategory(tag.category.toLowerCase())}
              >
                {tag.category}
              </Button>
            ))}
          </ButtonGroup>
          <Grid2 container>
            <Grid2 align={"center"}>
              <TagCloud
                tags={neResultCount}
                shuffle={false}
                key={JSON.stringify(visibleCategories)} // This key will change when filteredData changes
                minSize={20}
                maxSize={45}
                renderer={customRenderer}
              />
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Grid2>
  );
};

export default AssistantNEResult;
