import React, { useCallback, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { alpha, styled } from "@mui/material/styles";

import {
  Archive,
  FileUpload,
  Inventory,
  MoreVert,
  Replay,
} from "@mui/icons-material";

import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";

const ShortcutMenuItem = ({
  icon,
  label,
  onClick,
  disabled = false,
  shortcutKey,
}) => (
  <MenuItem
    onClick={onClick}
    disableRipple
    disabled={disabled}
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Stack direction="row" spacing={1} alignItems="flex-start">
      {icon}
      {label}
    </Stack>
    <Box
      sx={{
        marginLeft: 2,
        fontFamily: "monospace",
        fontSize: "0.875rem",
        color: "text.secondary",
        opacity: 0.7,
        fontWeight: "bold",
      }}
    >
      {shortcutKey}
    </Box>
  </MenuItem>
);

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
  handleGoToBuildingWacz,
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

  const menuItems = [
    {
      key: "0",
      icon: <Replay />,
      label: keyword("menu_restart"),
      onClick: () => handleClose(handleGoToFirstStep),
      disabled: !isRestartEnabled,
    },
    {
      key: "1",
      icon: <Inventory />,
      label: keyword("menu_wacz_build_step"),
      onClick: () => handleClose(handleGoToBuildingWacz),
    },
    {
      key: "2",
      icon: <Archive />,
      label: keyword("menu_wbm_step"),
      onClick: () => handleClose(handleGoToWbmStep),
      disabled: !isGoToWbmStepEnabled,
    },
    {
      key: "3",
      icon: <FileUpload />,
      label: keyword("menu_wacz_step"),
      onClick: () => handleClose(handleGoToWaczUpload),
    },
  ];

  const handleKeyDown = useCallback(
    (event) => {
      const match = menuItems.find(
        (item) => item.key === event.key && !item.disabled,
      );
      if (match) match.onClick();
    },
    [menuItems],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div>
      <Tooltip title={keyword("menu_tooltip")}>
        <Button
          id="navigation-shortcuts-button"
          aria-controls={open ? "navigation-shortcuts-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="outlined"
          sx={{
            minWidth: 0,
            width: 40,
            height: 40,
            borderRadius: "50%",
            padding: 0,
          }}
          onClick={handleClick}
        >
          <MoreVert />
        </Button>
      </Tooltip>

      <StyledMenu
        id="navigation-shortcuts--menu"
        MenuListProps={{
          "aria-labelledby": "navigation-shortcuts-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuItems.map(({ key, icon, label, onClick, disabled }, idx) => (
          <React.Fragment key={key}>
            {idx === 1 && <Divider sx={{ my: 0.5 }} />}
            <ShortcutMenuItem
              icon={icon}
              label={label}
              onClick={onClick}
              disabled={disabled}
              shortcutKey={key}
            />
          </React.Fragment>
        ))}
      </StyledMenu>
    </div>
  );
}
