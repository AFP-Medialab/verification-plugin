import React, {useState} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useSelector, useDispatch} from "react-redux";
import {changeLanguage} from "../../../redux/actions";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/languages.tsv";
import TranslateIcon from '@material-ui/icons/Language';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const Languages = () => {
    const dictionary = useSelector(state => state.dictionary);
    const onlineTsv = process.env.REACT_APP_TRANSLATION_GITHUB + "components/NavItems/languages.tsv";
    const keyword = useLoadLanguage("components/NavItems/languages.tsv", tsv);

    const keywordByLang = (language) => {
        return (dictionary && dictionary[onlineTsv] && dictionary[onlineTsv][language])? dictionary[onlineTsv][language]["lang_label"]: "";
    };

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseItem = (lang) => {
        setAnchorEl(null);
        dispatch(changeLanguage(lang));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const language_list = (dictionary && dictionary[onlineTsv])? Object.keys(dictionary[onlineTsv]) : [];

    return (
        <div>
            <Tooltip title={keyword("translations")} placement="bottom">
                <IconButton aria-label="add to favorites"
                            onClick={handleClick}
                >
                    <TranslateIcon/>
                </IconButton>
            </Tooltip>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {
                    language_list.map((key) => {
                        return <MenuItem key={key} onClick={() => handleCloseItem(key)}> {keywordByLang(key) } </MenuItem>
                    })
                }
            </Menu>
        </div>
    );
};

export default Languages;