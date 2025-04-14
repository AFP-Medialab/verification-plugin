import * as React from "react";

import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { alpha, styled } from "@mui/material/styles";

import { Archive, FileUpload, MoreVert, Replay } from "@mui/icons-material";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

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
      "var(--mui-palette-background-paper) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
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
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");
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
      <Tooltip title={keyword("menu_tooltip")}>
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
      </Tooltip>

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
          {keyword("menu_restart")}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => handleClose(handleGoToWbmStep)}
          disableRipple
          disabled={!isGoToWbmStepEnabled}
        >
          <Archive />
          {keyword("menu_wbm_step")}
        </MenuItem>
        <MenuItem
          onClick={() => handleClose(handleGoToWaczUpload)}
          disableRipple
        >
          <FileUpload />
          {keyword("menu_wacz_step")}
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
