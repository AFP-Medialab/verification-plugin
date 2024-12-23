import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid2, IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setWarningExpanded } from "../../../../redux/actions/tools/assistantActions";
import DbkfTextResults from "../AssistantCheckResults/DbkfTextResults";
import DbkfMediaResults from "../AssistantCheckResults/DbkfMediaResults";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import { WarningAmber } from "@mui/icons-material";

const AssistantWarnings = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();
  const dispatch = useDispatch();

  const warningExpanded = useSelector(
    (state) => state.assistant.warningExpanded,
  );

  return (
    <Card variant={"outlined"} className={classes.assistantWarningBorder}>
      <Grid2 container>
        <Grid2 size={{ xs: 12 }} style={{ display: "flex" }}>
          <CardMedia>
            <Box m={1}>
              <WarningAmber color={"warning"} fontSize={"large"} />
            </Box>
          </CardMedia>
          <Box m={1} />
          <div>
            <Typography component={"span"} variant={"h6"} color={"warning"}>
              <Box mt={1.5} fontWeight="fontWeightBold">
                {keyword("warning_title")}
              </Box>
            </Typography>
          </div>
          <IconButton
            className={classes.assistantIconRight}
            onClick={() => dispatch(setWarningExpanded(!warningExpanded))}
          >
            <ExpandMoreIcon color={"warning"} />
          </IconButton>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Collapse
            in={warningExpanded}
            className={classes.assistantBackground}
          >
            <Box m={1} />
            <DbkfTextResults />

            <DbkfMediaResults />
          </Collapse>
        </Grid2>
      </Grid2>
    </Card>
  );
};
export default AssistantWarnings;
