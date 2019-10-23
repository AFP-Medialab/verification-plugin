import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {useSelector, useDispatch} from "react-redux";
import {changeLanguage} from "../../actions";
import loadTSVFile from "./loadTSVFile";

const Languages = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !==  null)? dictionary[lang][key]: "";
    };
    const keywordByLang = (language, key) => {
        return (dictionary !==  null)? dictionary[language][key]: "";
    };

    const dispatch = useDispatch();
    if (dictionary === null) {
        loadTSVFile(dispatch);
    }

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

    const language_list = (dictionary !== null)? Object.keys(dictionary) : [];

    return (
        <div>
            <Button color={"primary"} variant={"outlined"} size={"small"} aria-controls={"simple-menu"} aria-haspopup={true} fullWidth={false} onClick={handleClick}>
                {keyword("lang_code") }
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
                        return <MenuItem key={key} onClick={() => handleCloseItem(key)}> {keywordByLang(key,"name") } </MenuItem>
                    })
                }
            </Menu>
        </div>
    );
};

export default Languages;