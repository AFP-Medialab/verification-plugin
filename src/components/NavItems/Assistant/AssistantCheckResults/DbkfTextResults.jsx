import React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Typography from "@mui/material/Typography";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import { useSelector } from "react-redux";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";

const DbkfTextResults = () => {
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv
  );
  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);

  return (
    <List disablePadding={true}>
      {dbkfTextMatch
        ? dbkfTextMatch.map((value, key) => (
            <ListItem key={key}>
              <ListItemAvatar>
                <TextFieldsIcon fontSize={"large"} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div>
                    <Typography
                      variant={"body1"}
                      color={"textPrimary"}
                      component={"div"}
                      align={"left"}
                    >
                      {keyword("dbkf_text_warning")}
                    </Typography>
                    <Box mb={0.5} />
                  </div>
                }
                secondary={
                  <Typography
                    variant={"caption"}
                    component={"div"}
                    color={"textSecondary"}
                  >
                    <a
                      href={value.claimUrl}
                      key={key}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {value.text}
                    </a>
                  </Typography>
                }
              />
            </ListItem>
          ))
        : null}
    </List>
  );
};
export default DbkfTextResults;
