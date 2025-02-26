import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
//import ReactWordcloud from "react-wordcloud";
import { TagCloud } from "react-tagcloud";

import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid2 from "@mui/material/Grid2";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";

import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {
  TransHtmlDoubleLineBreak,
  TransNamedEntityRecogniserLink,
} from "../TransComponents";

const AssistantNEResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();

  const neResult = useSelector((state) => state.assistant.neResultCategory);
  const neResultCount = useSelector((state) => state.assistant.neResultCount);
  const neLoading = useSelector((state) => state.assistant.neLoading);

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

  function getWordColor(tag) {
    switch (tag.category.toLowerCase()) {
      case "person":
        return "#648FFF";
      // return "blue";
      case "location":
        return "#DC267F";
      // return "red";
      case "organization":
        return "#FFB000";
      // return "green";
      case "hashtag":
        return "#FE6100";
      // return "orange";
      case "userid":
        return "#785EF0";
      // return "purple";
      default:
        return "black";
      // return "black";
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
    const tagStyle = {
      ...styles,
      "&:hover": {
        color: "red !important",
      },
      color: getWordColor(tag),
      textDecorationColor: getWordColor(tag),
      visibility: visibleCategories[tag.category.toLowerCase()]
        ? "hidden"
        : "visible",
      fontSize,
      ...style,
    };

    let tagClassName = classes.tagCloudTag;
    if (className) {
      tagClassName += " " + className;
    }

    return (
      <Tooltip key={tag.key || tag.value} title={tag.count} arrow>
        <Link
          style={tagStyle}
          className={tagClassName}
          href={"https://www.google.com/search?q=" + tag.value}
          rel="noopener noreferrer"
          target={"_blank"}
        >
          {tag.value}
        </Link>
      </Tooltip>
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
                  <TransHtmlDoubleLineBreak keyword={keyword} />
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
          <ButtonGroup sx={{ paddingBottom: "15px" }}>
            {neResult.map((tag, index) => (
              <Button
                className={
                  visibleCategories[tag.category.toLowerCase()]
                    ? classes.namedEntityButtonHidden
                    : ""
                }
                style={{
                  color: "white",
                  border: "none",
                  backgroundColor: getWordColor(tag),
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
