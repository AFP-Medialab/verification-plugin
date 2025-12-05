import React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const DefaultLanguageDialog = (props) => {
  const keyword = i18nLoadNamespace("components/NavItems/defaultLanguage");
  const { open, onCancel, onClose } = props;

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = (defaultLang) => {
    onClose(defaultLang);
  };

  return (
    <Dialog open={open}>
      <DialogContent dividers>
        <Typography>{keyword("set_as_default")}</Typography>
        <Typography> {keyword("enable_cookies")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleOk(true)} color="primary">
          {keyword("yes")}
        </Button>
        <Button onClick={() => handleOk(false)} color="primary">
          {keyword("no")}
        </Button>
        <Button onClick={handleCancel} color="primary">
          {keyword("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DefaultLanguageDialog;
