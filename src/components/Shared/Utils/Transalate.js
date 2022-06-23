import TranslateIcon from '@material-ui/icons/Translate';
import Button from "@material-ui/core/Button";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import IconButton from "@material-ui/core/IconButton";
import tsv from "../../../LocalDictionary/components/Shared/utils.tsv"


export const Translate = ({text, type}) => {
    const keyword = useLoadLanguage("components/Shared/utils.tsv", tsv)
     // forward text on to google translate
     const googleTranslate = function (text) {
        let translate_url = "https://translate.google.com/?sl=auto&text=" + encodeURIComponent(text) + "&op=translate"
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
        <IconButton onClick={() => googleTranslate(text)}>
            <TranslateIcon color={"primary"}/>
        </IconButton>
        
    )
}