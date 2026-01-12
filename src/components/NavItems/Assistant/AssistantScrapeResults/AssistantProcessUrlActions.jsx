import React from "react";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@/components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";
import {
  resetGeolocation as resetGeolocationImage,
  setGeolocationUrl,
} from "@/redux/reducers/tools/geolocationReducer";
import { useSetInputFromAssistant } from "Hooks/useUrlOrFile";

const AssistantProcessUrlActions = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const dispatch = useDispatch();

  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const processUrl = useSelector((state) => state.assistant.processUrl);
  const processUrlActions = useSelector(
    (state) => state.assistant.processUrlActions,
  );
  const setAssistantSelection = useSetInputFromAssistant();
  const imageVideoSelected = useSelector(
    (state) => state.assistant.imageVideoSelected,
  );

  const handleClick = (action) => {
    const resultUrl = action.useInputUrl ? inputUrl : processUrl;

    if (action.resetUrl) {
      dispatch(action.resetUrl());
    }
    if (action.setUrl) {
      dispatch(action.setUrl(resultUrl));
    }
    if (!imageVideoSelected) {
      // if url to media, make sure url is correctly set
      setAssistantSelection(resultUrl);
    }

    if (action.download) {
      // Creates an A tag for downloading the video
      let dl = document.createElement("a");
      dl.setAttribute("href", resultUrl);
      dl.setAttribute("download", "");
      dl.click();
    } else if (action.path === null) {
      // Do nothing if path is null
    } else {
      // Go to other tools with fileInput or formInput
      navigate("/app/" + action.path + "?fromAssistant");
    }
  };

  return processUrlActions.length > 0 ? (
    <div>
      <Typography align={"left"} variant={"h5"}>
        {keyword("recommended_tools")}
      </Typography>
      <Divider />
      <List
        sx={{
          overflowY: "auto",
          height: "500px",
        }}
      >
        {processUrlActions.map((action, index) => {
          return (
            <Box
              key={index}
              style={{ cursor: "pointer" }}
              sx={{
                m: 2,
              }}
            >
              <Card className={classes.assistantHover} variant={"outlined"}>
                <ListItem onClick={() => handleClick(action)}>
                  <ListItemAvatar>
                    {typeof action.icon === "string" && (
                      <Avatar variant={"square"} src={action.icon} />
                    )}
                    {typeof action.icon !== "string" && action.icon}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography component={"span"}>
                        <Box
                          data-testid={action.title}
                          sx={{
                            fontWeight: "fontWeightBold",
                          }}
                        >
                          {keyword(action.title)}
                        </Box>
                      </Typography>
                    }
                    secondary={
                      <Typography color={"textSecondary"} component={"span"}>
                        <Box
                          sx={{
                            fontStyle: "italic",
                          }}
                        >
                          <Trans t={keyword} i18nKey={action.text} />
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
    </div>
  ) : null;
};
export default AssistantProcessUrlActions;
