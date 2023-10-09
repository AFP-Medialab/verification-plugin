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

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import Divider from "@mui/material/Divider";
import { KNOWN_LINKS } from "../AssistantRuleBook";
import { useNavigate } from "react-router-dom";

const AssistantProcessUrlActions = () => {
  const classes = useMyStyles();
  const navigate = useNavigate();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv,
  );

  const inputUrl = useSelector((state) => state.assistant.inputUrl);
  const processUrl = useSelector((state) => state.assistant.processUrl);
  const contentType = useSelector((state) => state.assistant.processUrlType);
  const processUrlActions = useSelector(
    (state) => state.assistant.processUrlActions,
  );

  const handleClick = (path, resultUrl) => {
    if (resultUrl != null) {
      navigate(
        "/app/" +
          path +
          "/" +
          encodeURIComponent(resultUrl) +
          "/" +
          contentType,
      );
      //history.push("/app/" + path + "/" + encodeURIComponent(resultUrl) + "/" + contentType)
    } else {
      navigate("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + contentType);
      //history.push("/app/" + path + "/" + KNOWN_LINKS.OWN + "/" + contentType)
    }
  };

  return processUrlActions.length > 0 ? (
    <div>
      <Typography align={"left"} variant={"h5"}>
        {keyword("things_you_can_do_header")}
      </Typography>
      <Typography align={"left"} variant={"subtitle2"}>
        {keyword("things_you_can_do")}
      </Typography>
      <Divider />
      <List>
        {processUrlActions.map((action, index) => {
          return (
            <Box m={2} key={index}>
              <Card className={classes.assistantHover} variant={"outlined"}>
                <ListItem
                  onClick={() =>
                    handleClick(
                      action.path,
                      action.useInputUrl ? inputUrl : processUrl,
                    )
                  }
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
    </div>
  ) : null;
};
export default AssistantProcessUrlActions;
