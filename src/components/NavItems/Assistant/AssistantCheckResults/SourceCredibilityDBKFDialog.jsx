import React, { useState } from "react";

import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {
  TransHtmlDoubleLineBreak,
  TransSourceCredibilityTooltip,
  TransUrlDomainAnalysisLink,
} from "../TransComponents";

const SourceCredibilityDBKFDialog = (props) => {
  //central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
  const classes = useMyStyles();
  const [open, setOpen] = useState(false);

  // props
  const source = props.source;
  const evidence = props.evidence;
  const color = props.color;
  const sourceType = props.sourceType;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Details">
        <ListAltOutlinedIcon
          style={{ cursor: "pointer" }}
          onClick={handleClickOpen}
        />
      </Tooltip>
      <Dialog onClose={handleClose} maxWidth={"lg"} open={open}>
        <DialogTitle>
          <Grid container>
            <Grid size={{ xs: 11 }}>
              <Typography variant="body1" component="div">
                <Chip label={keyword(sourceType)} color={color} size="small" />{" "}
                {keyword("source_cred_popup_header_domain")} {source}
              </Typography>
            </Grid>
            <Grid
              size={{ xs: 1 }}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {/* tooltip help */}
              <Tooltip
                interactive={"true"}
                leaveDelay={50}
                style={{ display: "flex", marginLeft: "auto" }}
                title={
                  <>
                    <TransSourceCredibilityTooltip keyword={keyword} />
                    <TransHtmlDoubleLineBreak keyword={keyword} />
                    <TransUrlDomainAnalysisLink keyword={keyword} />
                  </>
                }
                classes={{ tooltip: classes.assistantTooltip }}
              >
                <HelpOutlineOutlinedIcon color={"action"} />
              </Tooltip>

              {/* close button */}
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers>
          <List sx={{ listStyle: "decimal", ml: 4 }}>
            {evidence.map((result, index) => (
              <ListItem key={index} sx={{ display: "list-item" }}>
                <Typography>
                  <Link target="_blank" href={result} color="inherit">
                    {result}
                  </Link>
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SourceCredibilityDBKFDialog;
