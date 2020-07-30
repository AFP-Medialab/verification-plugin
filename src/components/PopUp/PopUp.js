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

    const [pageUrl, setPageUrl] = useState(null);


    const urlOpenAssistant = () => {
        window.open("/popup.html#/app/assistant/" + encodeURIComponent(pageUrl))
    }

    const loadData = () => {
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