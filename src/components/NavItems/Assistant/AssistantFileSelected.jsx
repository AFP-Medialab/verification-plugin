import React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CardHeader, Grid2 } from "@mui/material";
import CardContent from "@mui/material/CardContent";
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
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import { useNavigate } from "react-router-dom";

const AssistantFileSelected = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const getActionList = (contentType) => {
    let known_link = KNOWN_LINKS.OWN;
    const role = useSelector((state) => state.userSession.user.roles);
    return selectCorrectActions(contentType, known_link, known_link, "", role);
  };

  const imageActions = getActionList(CONTENT_TYPE.IMAGE);
  const videoActions = getActionList(CONTENT_TYPE.VIDEO);

  const handleClick = (path, cType) => {
    //history.push("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + cType)
    navigate("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + cType);
  };

  const generateList = (title, cType, actionList) => {
    return (
      <Grid2 size={{ xs: 6 }}>
        <Box mx={2} my={0.5}>
          <Typography
            textAlign={"start"}
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
                    <ListItemAvatar>{action.icon}</ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography textAlign={"start"} component={"span"}>
                          <Box fontWeight="fontWeightBold">
                            {keyword(action.title)}
                          </Box>
                        </Typography>
                      }
                      secondary={
                        <Typography
                          textAlign={"start"}
                          color={"textSecondary"}
                          component={"span"}
                        >
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
      </Grid2>
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
        <Grid2 container spacing={3}>
          <Grid2 size={{ xs: 6 }}>
            {generateList(
              keyword("upload_image"),
              CONTENT_TYPE.IMAGE,
              imageActions,
            )}
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            {generateList(
              keyword("upload_video"),
              CONTENT_TYPE.VIDEO,
              videoActions,
            )}
          </Grid2>
        </Grid2>
      </CardContent>
    </Card>
  );
};
export default AssistantFileSelected;
