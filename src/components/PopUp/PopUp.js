import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import weVerifyLogo from "./images/logo-we-verify.png";
import invidLogo from "./images/InVID-logo.svg";

import tsv from "../../LocalDictionary/components/PopUp.tsv";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../Hooks/useLoadLanguage";
import {changeLanguage} from "../../redux/actions";
import {getSupportedBrowserLanguage} from "../Shared/Languages/getSupportedBrowserLanguage";

const navigator = (window.browser) ? window.browser : window.chrome;

const PopUp = () => {
    const classes = useMyStyles();
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("components/PopUp.tsv", tsv);
    const currentLang = useSelector(state => state.language);
    const defaultLanguage = useSelector(state => state.defaultLanguage);


    const [pageUrl, setPageUrl] = useState(null);


    const urlOpenAssistant = () => {
        window.open("/popup.html#/app/assistant/" + encodeURIComponent(pageUrl))
    }


    const createScript = () => {
        let script =
            "var images = document.getElementsByTagName(\"img\")\n" +
            "var image = images ? images[0].src : \"\" \n" +
            "var scripts = document.getElementsByTagName(\"script\")\n" +
            "var arr = [].slice.call(scripts)\n" +
            "var script_to_use = arr.filter(ar=>ar.outerText.toString().includes(\"edge_media_to_caption\"))[0].outerText\n" +
            "var text_regex = /(?<=edge_media_to_caption\":\\{\"edges\":\\[\\{\"node\"\:\\{\"text\":\").*(?=\"\\}\\}\\]\\},\"can_see_insights_as_brand\")/\n" +
            "var video_regex = /(?<=video_url\":\").*(?=\",\"video_view_count)/\n" +
            "var text_found = script_to_use.match(text_regex) ? script_to_use.match(text_regex)[0] : \"\"\n"+
            "var video_found = script_to_use.match(video_regex) ?  script_to_use.match(video_regex)[0] : \"\"\n"+
            "video_found = video_found.replace(/\\\\u0026/g, \"&\")\n" +
            "var results = [text_found,\"plugin-split\",image,\"plugin-split\",video_found] \n" +
            "results;\n"
        return script;
    };

    const getInstagramUrls = () => {
        const script = createScript();
        navigator.tabs.executeScript({
            code: script
        }, (results) => {
            if (results) {
                window.localStorage.setItem("instagram_result", results)
            }
        })
    };

    const loadData = () => {
        //get url of window
        navigator.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let url = tabs[0].url;
            setPageUrl(url);
            if (url.includes("instagram")){
                getInstagramUrls()
            }
        })
    }

    useEffect(() => {
        let supportedBrowserLang = getSupportedBrowserLanguage()

        if (defaultLanguage !== null) {
            if (defaultLanguage !== currentLang)  dispatch(changeLanguage(defaultLanguage))
        }

        else if (supportedBrowserLang !== undefined && supportedBrowserLang !== currentLang) {
            dispatch(changeLanguage(supportedBrowserLang))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={classes.popUp}>
            <Grid container>
                <Grid item xs={6}>
                    <img src={invidLogo} alt={invidLogo} style={{width: "100px"}}/>
                </Grid>
                <Grid item xs={6}>
                    <img src={weVerifyLogo} alt={weVerifyLogo} style={{width: "100px"}}/>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" fullWidth={true} width={"100%"} onClick={
                        () => window.open("/popup.html#/app/tools/all")
                    }>
                        {keyword("open_website")}
                    </Button>
                </Grid>
                <Box m={1}/>
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" fullWidth={true} width={"100%"} onClick={
                        () => window.open("/popup.html#/app/assistant/")}>
                        {keyword("open_assistant")}
                    </Button>
                </Grid>
                <Box m={1}/>
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" fullWidth={true} width={"100%"} onMouseOver={()=>loadData()} onClick={
                        () => urlOpenAssistant()}>
                        {keyword("open_assistant_on_page")}
                    </Button>
                </Grid>
                <Box m={1}/>
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" fullWidth={true} width={"100%"} onClick={
                        () => window.open("/popup.html#/app/classroom/")}>
                        {keyword("open_classroom")}
                    </Button>
                </Grid>
            </Grid>

            <Box m={1}/>
        </div>
    )
};
export default PopUp;