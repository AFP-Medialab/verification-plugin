import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useSelector, useDispatch} from "react-redux";
import {changeLanguage} from "../../../redux/actions";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/languages.tsv";

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
            <Button color={"primary"} variant={"outlined"} size={"small"} aria-controls={"simple-menu"} aria-haspopup={true} fullWidth={false} onClick={handleClick}>
                {keyword("lang_code") || ""}
            </Button>
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