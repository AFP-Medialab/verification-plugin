import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { PushPin, PushPinOutlined } from "@mui/icons-material";

import { pinTool, unpinTool } from "@/redux/reducers/tools/toolReducer";

import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";

/**
 *
 * @param tool {Tool} The tool presented in the element
 * @param isElementSelected {boolean} Boolean to highlight the element if it is selected
 * @param onClick {function} Function to call when the element is clicked
 * @param isSideMenuOpen {boolean} Boolean to show a miniature view / full text view of the element
 * @param keyword Translation function
 * @param level {number} The level to offset nested elements. 0 is the base level.
 * @param showPinButton {boolean} Whether to show the pin button for this item
 * @returns {Element}
 * @constructor
 */
const NavigationItem = ({
  tool,
  isElementSelected,
  onClick,
  isSideMenuOpen,
  keyword,
  level,
  showPinButton = false,
}) => {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  const pinnedTools = useSelector((state) => state.tool?.pinnedTools || []);

  const [isHovered, setIsHovered] = useState(false);

  const isPinned = pinnedTools.includes(tool.titleKeyword);

  /**
   * Changes the color of the icon dynamically if the topMenuItem is selected
   * @returns {{fontSize: string, fill: (string)}|{fontSize: string}}
   */
  const iconConditionalStyling = () => {
    // For tools without titleKeyword (like AFP Digital Courses), don't apply color styling
    // since they use their own SVG with embedded colors
    if (!tool.titleKeyword) return {};

    return {
      fill: isElementSelected
        ? "var(--mui-palette-primary-main)"
        : "var(--mui-palette-text-secondary)",
      color: isElementSelected
        ? "var(--mui-palette-primary-main)"
        : "var(--mui-palette-text-secondary)",
      fontSize: "24px",
    };
  };

  // Check if titleKeyword is empty - if so, only show icon without text
  const showOnlyIcon = !tool.titleKeyword || tool.titleKeyword === "";

  const handlePinClick = (e) => {
    e.stopPropagation();
    if (isPinned) {
      dispatch(unpinTool(tool.titleKeyword));
    } else {
      // Check if max pinned tools limit reached (5 tools)
      if (pinnedTools.length >= 5) {
        // TODO: Show toast notification "Maximum 5 tools can be pinned"
        return;
      }
      dispatch(pinTool(tool.titleKeyword));
    }
  };

  return (
    <ListItemButton
      selected={isElementSelected}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        pl: level > 0 && isSideMenuOpen ? 2 * level + 4 : 2,
        position: "relative",
      }}
    >
      {isSideMenuOpen ? (
        <>
          <ListItemIcon
            sx={{
              marginRight: showOnlyIcon ? "0" : "12px",
              minWidth: "unset",
              width: showOnlyIcon ? "100%" : "auto",
              display: showOnlyIcon ? "flex" : "inline-flex",
              justifyContent: "flex-start",
            }}
          >
            <tool.icon sx={iconConditionalStyling} />
          </ListItemIcon>
          {!showOnlyIcon && (
            <ListItemText
              primary={
                <Typography
                  color={isElementSelected ? "primary" : ""}
                  className={`${
                    isSideMenuOpen ? classes.drawerListText : classes.hidden
                  }`}
                >
                  {keyword(tool.titleKeyword)}
                </Typography>
              }
            />
          )}
          {showPinButton && !showOnlyIcon && (
            <Tooltip
              title={isPinned ? keyword("navbar_unpin") : keyword("navbar_pin")}
              placement="right"
            >
              <IconButton
                size="small"
                onClick={handlePinClick}
                sx={{
                  p: 1,
                  opacity: isHovered || isPinned ? 1 : 0,
                  transition: "opacity 0.2s",
                  ml: "auto",
                  color: isPinned ? "primary.main" : "action.active",
                  "&:hover": {
                    color: isPinned ? "primary.dark" : "primary.main",
                  },
                }}
              >
                {isPinned ? (
                  <PushPin fontSize="small" />
                ) : (
                  <PushPinOutlined fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <tool.icon sx={iconConditionalStyling} />
        </Stack>
      )}
    </ListItemButton>
  );
};

export default NavigationItem;
