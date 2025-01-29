import React from "react";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";

/**
 *
 * @param tool {Tool} The tool presented in the element
 * @param isElementSelected {boolean} Boolean to highlight the element if it is selected
 * @param onClick {function} Function to call when the element is clicked
 * @param isSideMenuOpen {boolean} Boolean to show a miniature view / full text view of the element
 * @param keyword Translation function
 * @param level {number} The level to offset nested elements. 0 is the base level.
 * @returns {Element}
 * @constructor
 */
const SideMenuElement = ({
  tool,
  isElementSelected,
  onClick,
  isSideMenuOpen,
  keyword,
  level,
}) => {
  const classes = useMyStyles();

  /**
   * Changes the color of the icon dynamically if the topMenuItem is selected
   * @param tool {Tool}
   * @returns {{fontSize: string, fill: (string)}|{fontSize: string}}
   */
  const iconConditionalStyling = () => {
    if (!tool.titleKeyword)
      return {
        fontSize: "24px",
      };

    return {
      fill: isElementSelected ? "#00926c" : "#4c4c4c",
      color: isElementSelected ? "#00926c" : "#4c4c4c",
      fontSize: "24px",
    };
  };

  return (
    <ListItemButton
      selected={isElementSelected}
      onClick={onClick}
      sx={{ pl: level > 0 && isSideMenuOpen ? 2 * level + 4 : 2 }}
    >
      {isSideMenuOpen ? (
        <>
          <ListItemIcon
            sx={{
              marginRight: "12px",
              minWidth: "unset",
            }}
          >
            <tool.icon sx={iconConditionalStyling} />
          </ListItemIcon>
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

export default SideMenuElement;
