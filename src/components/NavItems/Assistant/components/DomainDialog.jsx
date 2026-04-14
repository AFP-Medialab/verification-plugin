import React, { useState } from "react";

import Box from "@mui/material/Box";
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

import useMyStyles from "@/components/Shared/MaterialUiStyles/useMyStyles";

import {
  TransHtmlDoubleLineBreak,
  TransSourceCredibilityTooltip,
  TransUrlDomainAnalysisLink,
  TransUsfdAuthor,
} from "./TransComponents";

export function DomainDialog({
  keyword,
  value,
  trafficLightColor,
  sourceType,
}) {
  const classes = useMyStyles();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Tooltip with more details icon */}
      <Tooltip title="Details">
        <ListAltOutlinedIcon
          style={{ cursor: "pointer" }}
          onClick={handleClickOpen}
        />
      </Tooltip>

      {/* dialog box which appears when clicking tooltip icon above */}
      <Dialog onClose={handleClose} maxWidth={"lg"} open={open}>
        <DialogTitle>
          <Grid container>
            <Grid size={{ xs: 11 }}>
              <Typography variant="body1" component="div">
                <Chip
                  label={keyword(sourceType)}
                  color={trafficLightColor}
                  size="small"
                />{" "}
                {keyword("source_cred_popup_header_domain")} {value.source}
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
              <Box sx={{ pt: 0.75 }}>
                <Tooltip
                  interactive={"true"}
                  leaveDelay={50}
                  style={{ display: "flex", marginLeft: "auto" }}
                  title={
                    <>
                      <TransSourceCredibilityTooltip keyword={keyword} />
                      <TransHtmlDoubleLineBreak keyword={keyword} />
                      <TransUsfdAuthor keyword={keyword} />
                      <TransHtmlDoubleLineBreak keyword={keyword} />
                      <TransUrlDomainAnalysisLink keyword={keyword} />
                    </>
                  }
                  classes={{ tooltip: classes.assistantTooltip }}
                >
                  <HelpOutlineOutlinedIcon color={"action"} />
                </Tooltip>
              </Box>

              {/* close button */}
              <Box sx={{ pr: 1 }}>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers>
          <List sx={{ listStyle: "decimal", ml: 4 }}>
            {value.evidence.map((result, index) => (
              <ListItem key={index} sx={{ display: "list-item" }}>
                <Typography>
                  <Link target="_blank" href={result} color="inherit">
                    {result}
                  </Link>
                </Typography>
              </ListItem>
            ))}
          </List>
          {value.labels === "present in GDI reports" && (
            <Typography variant={"subtitle2"} sx={{ align: "start" }}>
              <Box sx={{ fontStyle: "italic", m: 1 }}>
                {keyword("gdi_reports_warning")}
              </Box>
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
