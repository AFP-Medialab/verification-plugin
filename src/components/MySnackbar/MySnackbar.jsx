import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { amber, green } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import WarningIcon from "@mui/icons-material/Warning";
import useClasses from "../Shared/MaterialUiStyles/useClasses";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles1 = (theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
});

// variant can be : "success", "error", "warning", "info"
const MySnackbar = (props) => {
  const [open, setOpen] = React.useState(true);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.onClick();
    setOpen(false);
  };
  const classes = useClasses(useStyles1);
  const { message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  const currentLang = useSelector((state) => state.language);
  const isCurrentLanguageLeftToRight = currentLang !== "ar";

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <SnackbarContent
          className={classes[variant]}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={onClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
          {...other}
        />
      </Snackbar>
    </div>
  );
};

MySnackbar.propTypes = {
  onClick: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.string.isRequired,
};

export default MySnackbar;
