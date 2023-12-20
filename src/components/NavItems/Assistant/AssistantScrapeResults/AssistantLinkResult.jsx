import React from "react";
import { useSelector } from "react-redux";

import Card from "@mui/material/Card";
import { CardHeader } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import Link from "@mui/material/Link";
import LinkIcon from "@mui/icons-material/Link";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantLinkResult = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const linkList = useSelector((state) => state.assistant.linkList);

  return (
    <Grid item xs={12}>
      <Card>
        <CardHeader
          className={classes.assistantCardHeader}
          title={
            <Typography variant={"h5"}>
              {" "}
              {keyword("extracted_urls")}{" "}
            </Typography>
          }
        />
        <CardContent
          style={{
            maxHeight: 300,
            wordBreak: "break-word",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {linkList != null ? (
            <List>
              {linkList.map((urlEntity, key) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    <LinkIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link color={"inherit"} href={urlEntity}>
                        {urlEntity}
                      </Link>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : null}
        </CardContent>
      </Card>
    </Grid>
  );
};
export default AssistantLinkResult;
