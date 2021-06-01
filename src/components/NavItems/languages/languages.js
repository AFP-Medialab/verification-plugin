import React, {useState} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useDispatch, useSelector} from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import {changeDefaultLanguage, changeLanguage} from "../../../redux/actions";
import DefaultLanguageDialog from "./defaultLanguageDialog";
import {setTrue} from "../../../redux/actions/cookiesActions";
import tsv from "../../../LocalDictionary/components/NavItems/languages.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import TranslateIcon from '@material-ui/icons/Translate';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";


const Languages = () => {
    const dictionary = useSelector(state => state.dictionary);
    const onlineTsv = process.env.REACT_APP_TRANSLATION_GITHUB + "components/NavItems/languages.tsv";
    const keyword = useLoadLanguage("components/NavItems/languages.tsv", tsv);

    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState("en");

    const keywordByLang = (language) => {
        console.log("IDIOMA" + language);
        return (dictionary && dictionary[onlineTsv] && dictionary[onlineTsv][language]) ? dictionary[onlineTsv][language]["lang_label"] : "";
    };

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(document.getElementById("language"));
    };

    const handleCloseItem = (defaultLang) => {
        setAnchorEl(null);
        setOpen(false);
        dispatch(changeLanguage(lang));
        if (defaultLang) {
            dispatch(setTrue())
            dispatch(changeDefaultLanguage(lang))
        }
    };

    const handleClose = () => {
        setOpen(false)
        setAnchorEl(null);
    };

    const language_list = (dictionary && dictionary[onlineTsv]) ? Object.keys(dictionary[onlineTsv]) : [];

    return (
        <div>
                
            <span   id="language" 
                    style={{color: "#596977", 
                            fontSize: "16px", 
                            fontWeight: "500", 
                            marginRight: "5px", 
                            }}>

                            {keywordByLang(lang)}
            </span>

            <Tooltip title={keyword("translations")} placement="bottom">
                <IconButton onClick={handleClick}>
                    <TranslateIcon fontSize="large" style={{ color: "#596977" }} />
                </IconButton>
            </Tooltip>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {language_list.map((key) => {
                        return <MenuItem key={key}
                                         onClick={() => {
                                             setOpen(true)
                                             setLang(key)
                                         }}>
                                    {keywordByLang(key)}
                        </MenuItem>
                    })
                }
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