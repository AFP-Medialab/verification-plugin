import React, {useState} from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import tsv from "../../LocalDictionary/components/PopUp.tsv";
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../Hooks/useLoadLanguage";
import weVerifyLogo from "./images/logo-we-verify.png";
import invidLogo from "./images/InVID-logo.svg";

const navigator = (window.browser) ? window.browser : window.chrome;

const PopUp = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/PopUp.tsv", tsv);
    const createScript = (tag, field, varName) => {
        let script =
            "if (!" + varName +"){" +
            "var "+ varName+" = [];" +
            "for (let elt of document.getElementsByTagName('" + tag + "')) {" +
            "	if (elt." + field + ") {" +
            "    let url = elt." + field + ";" +
            "	 if (url.startsWith('blob'))" +
            "      continue;" +
            "	 if (!url.startsWith('http')) {" +
            "		url = new URL(url).href;" +
            "	 }" +
            "    if (!"+varName+".includes(url))" +
            "      "  +varName+".push(url);" +
            "  }" +
            "}" +
            "}" +
            varName + ";";
        return script;
    };

    const [pageUrl, setPageUrl] = useState(null);
    const [imageList, setImageList] = useState(null);
    const [videoList, setVideoList] = useState(null);


    const getUrls = (tag, field, varName, setFunction) => {
        let urlList = [];
        const script = createScript(tag, field, varName);
        navigator.tabs.executeScript({
            code: script
        }, (result) => {
            if (result) {
                for (let url of result[0])
                    urlList.push(url);
            }
            setFunction(urlList)
        })
    };

    const urlOpenAssistant = () => {
        let stringImageList = imageList != null ? imageList.join(",") : null;
        let stringVideoList = videoList != null ? videoList.toString() : null;

        window.localStorage.setItem("imageList", stringImageList);
        window.localStorage.setItem("videoList", stringVideoList);

        window.open("/popup.html#/app/assistant/" + encodeURIComponent(pageUrl))
    }

    const loadData = () => {
        // get images and videos
        if (imageList == null) {getUrls("img", "src", "wvImageList", setImageList)};
        if (videoList == null) {getUrls("video", "src", "wvVideoList", setVideoList)};

        //get url of window
        navigator.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let url = tabs[0].url;
            setPageUrl(url);
        })
    }

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
                        {/*TODO: keyword("open_assistant")*/}
                        {"Assistant"}
                    </Button>
                </Grid>
                <Box m={1}/>
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" fullWidth={true} width={"100%"} onMouseOver={()=>loadData()} onClick={
                        () => urlOpenAssistant()}>
                        {/*TODO: keyword("open_assistant_on_page")*/}
                        {"Assistant for Current Page"}
                    </Button>
                </Grid>
            </Grid>

            <Box m={1}/>
        </div>
    )
};
export default PopUp;