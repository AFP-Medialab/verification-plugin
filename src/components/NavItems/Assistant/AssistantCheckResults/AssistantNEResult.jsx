import React, { useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
//import ReactWordcloud from "react-wordcloud";
import { TagCloud } from "react-tagcloud";
import { select } from "d3-selection";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantNEResult = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();

  const neResult = useSelector((state) => state.assistant.neResultCategory);
  const neResultCount = useSelector((state) => state.assistant.neResultCount);
  const neLoading = useSelector((state) => state.assistant.neLoading);

  const [selectedIndex, setSelectedIndex] = useState(null);
  //console.log("neResult ", neResult);
  //console.log("neResultCount ", neResultCount);
  const handleCollapse = (index) => {
    index === selectedIndex ? setSelectedIndex(null) : setSelectedIndex(index);
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
      switch (word.category) {
        case "Person":
          return "blue";
        case "Location":
          return "red";
        case "Organization":
          return "green";
        case "Hashtag":
          return "orange";
        case "UserId":
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
  function getWordColor(tag) {
    switch (tag.category) {
      case "Person":
        return "blue";
      case "Location":
        return "red";
      case "Organization":
        return "green";
      case "Hashtag":
        return "orange";
      case "UserId":
        return "purple";
      default:
        return "black";
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
      fontSize,
      ...style,
    };

    let tagClassName = "tag-cloud-tag";
    if (className) {
      tagClassName += " " + className;
    }

    return (
      <span key={key} style={tagStyle} className={tagClassName}>
        {tag.value}
      </span>
    );
  };

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={keyword("named_entity_title")}
        />
        {neLoading && <LinearProgress />}
        <CardContent>
          <Grid container>
            <Grid item xs={4} style={{ maxHeight: 300, overflowY: "auto" }}>
              <List>
                {neResult.map((value, index) => (
                  <Box key={index}>
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleCollapse(index)}
                    >
                      <ListItemText
                        primary={
                          <Typography component={"div"} align={"left"}>
                            <Box fontWeight="fontWeightBold">
                              {value["category"]}
                            </Box>
                          </Typography>
                        }
                      />
                      {index === selectedIndex ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </ListItem>
                    <Collapse in={index === selectedIndex}>
                      <List component="div" disablePadding>
                        {value["words"].map((v, k) => (
                          <ListItem key={k}>
                            <ListItemText>
                              <Link
                                href={
                                  "https://www.google.com/search?q=" + v.value
                                }
                                rel="noopener noreferrer"
                                target={"_blank"}
                              >
                                {v.value} &nbsp;
                              </Link>
                              ({v.count})
                            </ListItemText>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ))}
              </List>
            </Grid>
            <Grid item xs={1} align={"center"}>
              <Divider orientation="vertical" />
            </Grid>
            <Grid item xs={7} align={"center"}>
              {/*<ReactWordcloud words={neResultCount} callbacks={callbacks} options={options}/>*/}
              <TagCloud
                tags={neResultCount}
                minSize={20}
                maxSize={45}
                renderer={customRenderer}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default AssistantNEResult;
