import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";

import TranslateIcon from "@mui/icons-material/Translate";

import useLoadSupportedLanguage from "Hooks/useLoadSupportedLanguages";

import { setStorageTrue } from "../../../redux/reducers/cookiesReducers";
import { changeDefaultLanguage } from "../../../redux/reducers/defaultLanguageReducer";
import { changeLanguage } from "../../../redux/reducers/languageReducer";
import DefaultLanguageDialog from "./defaultLanguageDialog";

const Languages = (props) => {
  const { t, i18n } = useTranslation("components/NavItems/languages");
  useLoadSupportedLanguage();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const storeLanguage = useSelector((state) => state.language);
  const languagesSupport = useSelector(
    (state) => state.languagesSupport.languagesList,
  );

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = () => {
    setAnchorEl(document.getElementById("language"));
  };

  const handleCloseItem = (defaultLang) => {
    setAnchorEl(null);
    setOpen(false);
    i18n.changeLanguage(lang);
    dispatch(changeLanguage(lang));
    if (defaultLang) {
      dispatch(setStorageTrue());
      dispatch(changeDefaultLanguage(lang));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Stack
        direction="column"
        spacing={1}
        height={"100%"}
        justifyContent="center"
        alignItems="center"
      >
        <IconButton onClick={handleClick}>
          <TranslateIcon fontSize="medium" />
        </IconButton>
        {props.variant !== "notext" && (
          <span
            id="language"
            style={{
              color: "var(--mui-palette-text-primary)",
              fontSize: "14px",
              fontWeight: "500",
              marginRight: "2px",
            }}
          >
            {languagesSupport[storeLanguage]}
          </span>
        )}
      </Stack>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(languagesSupport).map((lang) => {
          return (
            <MenuItem
              key={lang}
              onClick={() => {
                setOpen(true);
                setLang(lang);
              }}
            >
              {languagesSupport[lang]}
            </MenuItem>
          );
        })}
      </Menu>
      <DefaultLanguageDialog
        open={open}
        onCancel={handleClose}
        onClose={handleCloseItem}
      />
    </Box>
  );
};

export default Languages;
