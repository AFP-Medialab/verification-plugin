import React, { useState } from "react";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Link from "@mui/material/Link";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import Typography from "@mui/material/Typography";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { Chip, Grid2, Tooltip } from "@mui/material";
import {
  TransSourceCredibilityTooltip,
  TransHtmlDoubleLineBreak,
  TransUrlDomainAnalysisLink,
} from "../reusableTrans";

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
          <Grid2 container>
            <Grid2 size={{ xs: 11 }} direction="row">
              <Typography variant="body1" component="div">
                <Chip label={keyword(sourceType)} color={color} size="small" />{" "}
                {keyword("source_cred_popup_header_domain")} {source}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 1 }} display="flex" justifyContent="flex-end">
              {/* tooltip help */}
              <Tooltip
                interactive={"true"}
                leaveDelay={50}
                style={{ display: "flex", marginLeft: "auto" }}
                title={
                  <>
                    <TransSourceCredibilityTooltip keyword={keyword} />
                    <TransHtmlDoubleLinkBreak keyword={keyword} />
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
            </Grid2>
          </Grid2>
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
