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
import LaunchIcon from "@mui/icons-material/Launch";
import Transition from "react-transition-group/Transition";
import Typography from "@mui/material/Typography";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const SourceCredibilityDBKFDialog = (props) => {
  //central
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Assistant.tsv",
    tsv
  );
  const [open, setOpen] = useState(false);

  // props
  const source = props.source;
  const evidence = props.evidence;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <LaunchIcon onClick={handleClickOpen} />
      <Dialog
        onClose={handleClose}
        maxWidth={"lg"}
        TransitionComponent={Transition}
        open={open}
      >
        <DialogTitle>
          <Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            {keyword("source_cred_popup_header")} {source}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {evidence.map((result, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <Typography>
                  <Link target="_blank" href={result}>
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
