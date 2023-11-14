import React from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import { IconButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { setWarningExpanded } from "../../../../redux/actions/tools/assistantActions";
import DbkfTextResults from "../AssistantCheckResults/DbkfTextResults";
import DbkfMediaResults from "../AssistantCheckResults/DbkfMediaResults";
import HpTextResult from "../AssistantCheckResults/HpTextResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantWarnings = () => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();
  const dispatch = useDispatch();

  const warningExpanded = useSelector(
    (state) => state.assistant.warningExpanded,
  );

  return (
    <Box mb={2} pl={1}>
      <Card variant={"outlined"} className={classes.assistantWarningBorder}>
        <Grid container>
          <Grid item xs={12} style={{ display: "flex" }}>
            <CardMedia>
              <Box m={1}>
                <ErrorOutlineOutlinedIcon color={"error"} fontSize={"large"} />
              </Box>
            </CardMedia>
            <Box m={1} />
            <div>
              <Typography component={"span"} variant={"h6"} color={"error"}>
                <Box mt={1.5} fontWeight="fontWeightBold">
                  {keyword("warning_title")}
                </Box>
              </Typography>
            </div>
            <IconButton
              className={classes.assistantIconRight}
              onClick={() => dispatch(setWarningExpanded(!warningExpanded))}
            >
              <ExpandMoreIcon style={{ color: "red" }} />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Collapse
              in={warningExpanded}
              className={classes.assistantBackground}
            >
              <Box m={1} />
              <DbkfTextResults />

              <DbkfMediaResults />

              <HpTextResult />
            </Collapse>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
export default AssistantWarnings;
