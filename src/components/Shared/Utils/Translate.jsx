import TranslateIcon from '@mui/icons-material/Translate';
import Button from "@mui/material/Button";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import IconButton from "@mui/material/IconButton";
import tsv from "../../../LocalDictionary/components/Shared/utils.tsv"
import { useStore } from 'react-redux';
import Tooltip from "@mui/material/Tooltip";

export const Translate = ({text, type, className}) => {
    const keyword = useLoadLanguage("components/Shared/utils.tsv", tsv)
    const assistantKeyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
     // forward text on to google translate
     const store = useStore();
     const googleTranslate = function (text) {
        let translate_url = `https://translate.google.com/?sl=auto&tl=${store.getState().language}&text=${encodeURIComponent(text)}&op=translate`
        window.open(translate_url, "_blank")
    }

    return (
        type === "BUTTON" ?
        <Button variant="outlined" color="primary"
            size={"large"}
            fullWidth
            onClick={() => {
                googleTranslate(text)
            }}>
            <TranslateIcon style={{ "marginRight": "10px" }} />{keyword("translate")}
        </Button>
        :
        <Tooltip title={assistantKeyword("translate")}>
            <IconButton className={className} onClick={() => googleTranslate(text)}>
                <TranslateIcon color={"primary"}/>
            </IconButton>
        </Tooltip>
        
    )
}