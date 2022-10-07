import {useState} from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useDispatch, useSelector} from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import {changeLanguage} from "../../../redux/reducers/languageReducer";
import {changeDefaultLanguage} from "../../../redux/reducers/defaultLanguageReducer";
import DefaultLanguageDialog from "./defaultLanguageDialog";
import {setStorageTrue} from "../../../redux/actions/cookiesActions";
import tsv from "../../../LocalDictionary/components/NavItems/languages.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import TranslateIcon from '@mui/icons-material/Translate';

const Languages = (props) => {
    const dictionary = useSelector(state => state.dictionary);
    const onlineTsv = process.env.REACT_APP_TRANSLATION_GITHUB + "components/NavItems/languages.tsv";
    const keyword = useLoadLanguage("components/NavItems/languages.tsv", tsv);

    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState("en");
    const storeLanguage = useSelector(state => state.language);
    
    const keywordByLang = (language) => {
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
            dispatch(setStorageTrue())
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
                
            {props.variant !== "notext" &&
                <span id="language"
                    style={{
                        color: "#596977",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginRight: "2px",
                    }}>

                    {keywordByLang(storeLanguage)}
                </span>
            
            }
            

            <Tooltip title={keyword("translations")} placement="bottom">
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