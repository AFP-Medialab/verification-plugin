import React, {useState} from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useDispatch, useSelector} from "react-redux";
import TranslateIcon from '@material-ui/icons/Language';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import {changeDefaultLanguage, changeLanguage} from "../../../redux/actions";
import DefaultLanguageDialog from "./defaultLanguageDialog";
import {setTrue} from "../../../redux/actions/cookiesActions";
import tsv from "../../../LocalDictionary/components/NavItems/languages.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";


const Languages = () => {
    const dictionary = useSelector(state => state.dictionary);
    const onlineTsv = process.env.REACT_APP_TRANSLATION_GITHUB + "components/NavItems/languages.tsv";
    const keyword = useLoadLanguage("components/NavItems/languages.tsv", tsv);

    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState("en");

    const keywordByLang = (language) => {
        return (dictionary && dictionary[onlineTsv] && dictionary[onlineTsv][language]) ? dictionary[onlineTsv][language]["lang_label"] : "";
    };

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
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
            <Tooltip title={keyword("translations")} placement="bottom">
                <IconButton aria-label="add to favorites" onClick={handleClick}>
                    <TranslateIcon fontSize="large"/>
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