import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { IconButton } from "@mui/material";
import { Archive, FileUpload, MoreVert, Replay } from "@mui/icons-material";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

export default function CustomizedMenus({
  isRestartEnabled,
  isGoToWbmStepEnabled,
  handleGoToFirstStep,
  handleGoToWaczUpload,
  handleGoToWbmStep,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (fn) => {
    setAnchorEl(null);

    if (typeof fn === "function") fn();
  };

  return (
    <div>
      <IconButton
        id="customized-button"
        aria-controls={open ? "customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>

      <StyledMenu
        id="customized-menu"
        MenuListProps={{
          "aria-labelledby": "customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => handleClose(handleGoToFirstStep)}
          disableRipple
          disabled={!isRestartEnabled}
        >
          <Replay />
          {"Restart from the beginning"}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => handleClose(handleGoToWbmStep)}
          disableRipple
          disabled={!isGoToWbmStepEnabled}
        >
          <Archive />
          {"Go to Archiving with the Wayback Machine"}
        </MenuItem>

        <MenuItem
          onClick={() => handleClose(handleGoToWaczUpload)}
          disableRipple
        >
          <FileUpload />
          {"Go to WACZ upload step"}
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
