import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/defaultLanguage.tsv";

const DefaultLanguageDialog = (props) => {
  const keyword = useLoadLanguage(
    "components/NavItems/defaultLanguage.tsv",
    tsv
  );
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
