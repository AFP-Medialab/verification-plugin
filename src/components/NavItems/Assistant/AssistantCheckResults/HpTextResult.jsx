import React from "react";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import TextFieldsIcon from "@mui/icons-material/TextFields";

import { useSelector } from "react-redux";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const HpTextResult = () => {
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv,
  );
  const hpResult = useSelector((state) => state.assistant.hpResult);

  return hpResult != null ? (
    <List disablePadding={true}>
      <ListItem>
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
                {keyword("hp_warning")}
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
              {hpResult}
            </Typography>
          }
        />
      </ListItem>
    </List>
  ) : null;
};
export default HpTextResult;
