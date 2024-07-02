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

const SourceCredibilityDBKFDialog = (props) => {
  //central
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");
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
      <ListAltOutlinedIcon
        style={{ cursor: "pointer" }}
        onClick={handleClickOpen}
      />
      <Dialog onClose={handleClose} maxWidth={"lg"} open={open}>
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
