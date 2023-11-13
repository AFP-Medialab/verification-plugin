import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { changeLanguage } from "../../../redux/reducers/languageReducer";
import { changeDefaultLanguage } from "../../../redux/reducers/defaultLanguageReducer";
import DefaultLanguageDialog from "./defaultLanguageDialog";
import { setStorageTrue } from "../../../redux/reducers/cookiesReducers";
import TranslateIcon from "@mui/icons-material/Translate";
import { useTranslation } from "react-i18next";
import useLoadSupportedLanguage from "Hooks/useLoadSupportedLanguages";

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
    <div>
      {props.variant !== "notext" && (
        <span
          id="language"
          style={{
            color: "#596977",
            fontSize: "14px",
            fontWeight: "500",
            marginRight: "2px",
          }}
        >
          {languagesSupport[storeLanguage]}
        </span>
      )}

      <Tooltip title={t("translations")} placement="bottom">
        <IconButton onClick={handleClick}>
          <TranslateIcon fontSize="medium" style={{ color: "#596977" }} />
        </IconButton>
      </Tooltip>

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
    </div>
  );
};

export default Languages;
