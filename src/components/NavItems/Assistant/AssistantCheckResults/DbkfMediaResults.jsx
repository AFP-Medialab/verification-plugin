import React from "react";

import Box from "@mui/material/Box";
import { DuoOutlined } from "@mui/icons-material";
import ImageIconOutlined from "@mui/icons-material/Image";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { useSelector } from "react-redux";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const DbkfMediaResults = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const dbkfImageMatch = useSelector((state) => state.assistant.dbkfImageMatch);
  const dbkfVideoMatch = useSelector((state) => state.assistant.dbkfVideoMatch);

  console.log(dbkfImageMatch);
  console.log(dbkfVideoMatch);

  return (
    <List disablePadding={true}>
      {dbkfImageMatch
        ? dbkfImageMatch
            .filter(
              (obj1, i, arr) =>
                arr.findIndex((obj2) => obj2.id === obj1.id) === i,
            )
            .map((value, key) => (
              <ListItem key={key}>
                <ListItemAvatar>
                  <ImageIconOutlined fontSize={"large"} />
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
                        {keyword("dbkf_image_warning") +
                          parseFloat(value.similarity).toFixed(2)}
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
                        {value.claimUrl}
                      </a>
                    </Typography>
                  }
                />
              </ListItem>
            ))
        : null}

      {dbkfVideoMatch
        ? dbkfVideoMatch
            .filter(
              (obj1, i, arr) =>
                arr.findIndex((obj2) => obj2.id === obj1.id) === i,
            )
            .map((value, key) => (
              <ListItem key={key}>
                <ListItemAvatar>
                  <DuoOutlined fontSize={"large"} />
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
                        {keyword("dbkf_video_warning") +
                          " " +
                          parseFloat(value.similarity).toFixed(2)}
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
                        {value.claimUrl}
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

export default DbkfMediaResults;
