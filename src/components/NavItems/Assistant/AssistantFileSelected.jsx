import React from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import {
  CONTENT_TYPE,
  KNOWN_LINKS,
  selectCorrectActions,
} from "./AssistantRuleBook";
import Divider from "@mui/material/Divider";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import { useNavigate } from "react-router-dom";
const AssistantFileSelected = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv
  );

  const getActionList = (contentType) => {
    let known_link = KNOWN_LINKS.OWN;
    return selectCorrectActions(contentType, known_link, known_link, "");
  };

  const imageActions = getActionList(CONTENT_TYPE.IMAGE);
  const videoActions = getActionList(CONTENT_TYPE.VIDEO);

  const handleClick = (path, cType) => {
    //history.push("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + cType)
    navigate("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + cType);
  };

  const generateList = (title, cType, actionList) => {
    return (
      <Grid item xs={6}>
        <Box mx={2} my={0.5}>
          <Typography
            align={"left"}
            variant={"h6"}
            style={{ fontWeight: "bold" }}
          >
            {title}
          </Typography>
        </Box>
        <List>
          {actionList.map((action, index) => {
            return (
              <Box m={2} key={index}>
                <Card className={classes.assistantHover} variant={"outlined"}>
                  <ListItem
                    onClick={() => {
                      handleClick(action.path, cType);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar variant={"square"} src={action.icon} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography component={"span"}>
                          <Box fontWeight="fontWeightBold">
                            {keyword(action.title)}
                          </Box>
                        </Typography>
                      }
                      secondary={
                        <Typography color={"textSecondary"} component={"span"}>
                          <Box fontStyle="italic">{keyword(action.text)}</Box>
                        </Typography>
                      }
                    />
                  </ListItem>
                </Card>
              </Box>
            );
          })}
        </List>
      </Grid>
    );
  };

  return (
    <Card>
      <CardHeader
        className={classes.assistantCardHeader}
        title={
          <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
            {keyword("assistant_choose_tool")}
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          {generateList(
            keyword("upload_image"),
            CONTENT_TYPE.IMAGE,
            imageActions
          )}
          <Divider
            orientation="vertical"
            flexItem
            style={{ marginRight: "-1px", marginTop: "20px" }}
          />
          {generateList(
            keyword("upload_video"),
            CONTENT_TYPE.VIDEO,
            videoActions
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
export default AssistantFileSelected;
