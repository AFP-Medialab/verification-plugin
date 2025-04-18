import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";

import useLoadSupportedLanguage from "Hooks/useLoadSupportedLanguages";

import { setStorageTrue } from "../../../redux/reducers/cookiesReducers";
import { changeDefaultLanguage } from "../../../redux/reducers/defaultLanguageReducer";
import { changeLanguage } from "../../../redux/reducers/languageReducer";
import DefaultLanguageDialog from "./defaultLanguageDialog";

const Languages = () => {
  const { i18n } = useTranslation("components/NavItems/languages");
  useLoadSupportedLanguage();
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const storeLanguage = useSelector((state) => state.language);
  const languagesSupport = useSelector(
    (state) => state.languagesSupport.languagesList,
  );

  const dispatch = useDispatch();

  const handleChange = (event) => {
    const newLang = event.target.value;
    setOpen(true);
    setLang(newLang);
  };

  const handleCloseItem = (defaultLang) => {
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
  };

  return (
    <Box>
      <Stack
        direction="column"
        spacing={0}
        height={"100%"}
        justifyContent="center"
        alignItems="center"
      >
        <Select
          value={storeLanguage}
          onChange={handleChange}
          displayEmpty
          size="small"
          sx={{
            minWidth: 120,
            color: "var(--mui-palette-text-primary)",
          }}
        >
          {Object.keys(languagesSupport).map((lang) => (
            <MenuItem key={lang} value={lang}>
              {languagesSupport[lang]}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <DefaultLanguageDialog
        open={open}
        onCancel={handleClose}
        onClose={handleCloseItem}
      />
    </Box>
  );
};

export default Languages;
