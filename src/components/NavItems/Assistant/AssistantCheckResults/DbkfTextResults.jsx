import React from "react";
import { useSelector } from "react-redux";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextFieldsIcon from "@mui/icons-material/TextFields";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const DbkfTextResults = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const dbkfTextMatch = useSelector((state) => state.assistant.dbkfTextMatch);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container spacing={1} wrap="wrap" width="100%">
          <Grid size={{ xs: 4 }} align="start">
            <Typography display="inline" sx={{ flexShrink: 0, align: "start" }}>
              {keyword("dbkf_text_title")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 8 }} align="start">
            <Typography sx={{ color: "text.secondary", align: "start" }}>
              {dbkfTextMatch.length} {keyword("results_detected")}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        <List disablePadding={true}>
          {dbkfTextMatch.map((value, key) => (
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
                    <Box
                      sx={{
                        mb: 0.5,
                      }}
                    />
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
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};
export default DbkfTextResults;
