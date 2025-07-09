import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import {
  CONTENT_TYPE,
  KNOWN_LINKS,
  selectCorrectActions,
} from "./AssistantRuleBook";

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
      <Grid size={{ xs: 6 }}>
        <Box
          sx={{
            mx: 2,
            my: 0.5,
          }}
        >
          <Typography
            variant={"h6"}
            style={{ fontWeight: "bold" }}
            sx={{
              textAlign: "start",
            }}
          >
            {title}
          </Typography>
        </Box>
        <List>
          {actionList.map((action, index) => {
            return (
              <Box
                key={index}
                sx={{
                  m: 2,
                }}
              >
                <Card className={classes.assistantHover} variant="outlined">
                  <ListItem
                    onClick={() => {
                      handleClick(action.path, cType);
                    }}
                  >
                    <ListItemAvatar>{action.icon}</ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          component={"span"}
                          sx={{
                            textAlign: "start",
                          }}
                        >
                          <Box
                            sx={{
                              fontWeight: "fontWeightBold",
                            }}
                          >
                            {keyword(action.title)}
                          </Box>
                        </Typography>
                      }
                      secondary={
                        <Typography
                          color={"textSecondary"}
                          component={"span"}
                          sx={{
                            textAlign: "start",
                          }}
                        >
                          <Box
                            sx={{
                              fontStyle: "italic",
                            }}
                          >
                            {keyword(action.text)}
                          </Box>
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
    <Card variant="outlined">
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
          <Grid size={{ xs: 6 }}>
            {generateList(
              keyword("upload_image"),
              CONTENT_TYPE.IMAGE,
              imageActions,
            )}
          </Grid>
          <Grid size={{ xs: 6 }}>
            {generateList(
              keyword("upload_video"),
              CONTENT_TYPE.VIDEO,
              videoActions,
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default AssistantFileSelected;
