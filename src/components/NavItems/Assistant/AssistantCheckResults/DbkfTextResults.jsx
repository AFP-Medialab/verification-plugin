import React from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Typography from "@mui/material/Typography";

import { useSelector } from "react-redux";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const DbkfTextResults = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
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
                    <Link
                      href={value.externalLink}
                      key={key}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {value.text}
                    </Link>
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
