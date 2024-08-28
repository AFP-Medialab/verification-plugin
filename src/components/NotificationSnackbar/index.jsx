import { React } from "react";
import { Alert, Snackbar } from "@mui/material";
import { i18nLoadNamespace } from "../Shared/Languages/i18nLoadNamespace";

const NotificationSnackbar = ({ openAlert, setOpenAlert }) => {
  const tWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  return (
    <Snackbar
      open={openAlert}
      autoHideDuration={6000}
      onClose={handleCloseAlert}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      sx={{ mr: 8 }}
    >
      <Alert onClose={handleCloseAlert} severity="warning">
        {tWarning("warning_advanced_tools")}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
