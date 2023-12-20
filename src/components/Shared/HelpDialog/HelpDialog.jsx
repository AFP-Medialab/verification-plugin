import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Transition from "react-transition-group/Transition";
import { HelpOutline } from "@mui/icons-material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const HelpDialog = (props) => {
  const [open, setOpen] = useState(false);

  // a list of keywords found in a tsv file. pass in tsv labels and tsv file location
  const title = props.title;
  const paragraphs = props.paragraphs;
  const keyword = i18nLoadNamespace("components/NavItems/tools/Assistant");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <HelpOutline onClick={handleClickOpen} />
      <Dialog maxWidth={"xl"} TransitionComponent={Transition} open={open}>
        <DialogTitle>
          <Typography variant={"h4"}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            {keyword(title)}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {paragraphs.map((text, index) => (
            <Typography gutterBottom key={index}>
              {
                <div
                  className={"content"}
                  dangerouslySetInnerHTML={{ __html: keyword(text) }}
                ></div>
              }
            </Typography>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpDialog;
