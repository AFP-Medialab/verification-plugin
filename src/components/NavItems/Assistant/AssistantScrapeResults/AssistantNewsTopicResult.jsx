import React from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ListItem from "@mui/material/ListItem";
import CircleIcon from "@mui/icons-material/Circle";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Tooltip from "@mui/material/Tooltip";

const AssistantNewsTopicResult = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv
  );

  const newsTopics = useSelector((state) => state.assistant.newsTopicResult);

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography variant={"h5"}>
              {" "}
              {keyword("extracted_topics")}
            </Typography>
          }
          action={
            <div style={{ display: "flex" }}>
              <Tooltip
                interactive={"true"}
                title={
                  <div
                    className={"content"}
                    dangerouslySetInnerHTML={{
                      __html: keyword("news_topic_tooltip"),
                    }}
                  />
                }
                classes={{ tooltip: classes.assistantTooltip }}
              >
                <HelpOutlineOutlinedIcon className={classes.toolTipIcon} />
              </Tooltip>
            </div>
          }
        />
        <CardContent
          style={{
            maxHeight: 300,
            wordBreak: "break-word",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {newsTopics != null ? (
            <List>
              {newsTopics.map((topic, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CircleIcon />
                  </ListItemIcon>
                  <ListItemText>{topic[0].replaceAll("_", " ")}</ListItemText>
                </ListItem>
              ))}
            </List>
          ) : null}
        </CardContent>
      </Card>
    </Grid>
  );
};
export default AssistantNewsTopicResult;
