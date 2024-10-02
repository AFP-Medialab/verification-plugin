import React from "react";
import { useSelector } from "react-redux";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Divider from "@mui/material/Divider";
import { KNOWN_LINKS } from "../AssistantRuleBook";
import { useNavigate } from "react-router-dom";

const AssistantProcessUrlActions = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const processUrl = useSelector((state) => state.assistant.processUrl);
  const contentType = useSelector((state) => state.assistant.processUrlType);
  const processUrlActions = useSelector(
    (state) => state.assistant.processUrlActions,
  );

  const handleClick = (action) => {
    const resultUrl = action.useInputUrl ? inputUrl : processUrl;
    if (action.download) {
      // Creates an A tag for downloading the video
      let dl = document.createElement("a");
      dl.setAttribute("href", resultUrl);
      dl.setAttribute("download", "");
      dl.click();
    } else if (action.path === null) {
      return; // Do nothing if path is null
    } else if (resultUrl !== null) {
      navigate(
        "/app/" +
          action.path +
          "/" +
          encodeURIComponent(resultUrl) +
          "/" +
          contentType,
      );
      //history.push("/app/" + action.path + "/" + encodeURIComponent(resultUrl) + "/" + contentType)
    } else {
      navigate(
        "/app/" + action.path + "/" + KNOWN_LINKS.OWN + "/" + contentType,
      );
      //history.push("/app/" + action.path + "/" + KNOWN_LINKS.OWN + "/" + contentType)
    }
  };

  return processUrlActions.length > 0 ? (
    <div>
      <Typography align={"left"} variant={"h5"}>
        {keyword("recommended_tools")}
      </Typography>
      <Divider />
      <List>
        {processUrlActions.map((action, index) => {
          return (
            <Box m={2} key={index} style={{ cursor: "pointer" }}>
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
                          fontWeight="fontWeightBold"
                          data-testid={action.title}
                        >
                          {keyword(action.title)}
                        </Box>
                      </Typography>
                    }
                    secondary={
                      <Typography color={"textSecondary"} component={"span"}>
                        <Box fontStyle="italic">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: keyword(action.text),
                            }}
                          ></div>
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
