import React, {useState} from "react";
import useMyStyles from "../utility/MaterialUiStyles/useMyStyles";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import weVerifyLogo from "./images/logo-we-verify.png";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid";
import ImageGridList from "../utility/ImageGridList/ImageGridList";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
//import {useSelector} from "react-redux";

const navigator = (window.browser) ? window.browser : window.chrome;


const PopUp = () => {
    const classes = useMyStyles();
    /*const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    */

    const createScript = (tag, field) => {
        let script =
            "let array = [];" +
            "for (let elt of document.getElementsByTagName('" + tag + "')) {" +
            "	if (elt." + field + ") {" +
            "    let url = elt." + field + ";" +
            "	 if (url.startsWith('blob'))" +
            "      continue;" +
            "	 if (!url.startsWith('http')) {" +
            "		url = new URL(url).href;" +
            "	 }" +
            "    if (!array.includes(url))" +
            "      array.push(url);" +
            "  }" +
            "}" +
            "array;";
        return script;
    };

    const [imageList, setImageList] = useState(null);
    const [videoList, setVideoList] = useState(null);

    const getUrls = (tag, field, setFunction) => {
        let urlList = [];
        const script = createScript(tag, field);
        navigator.tabs.executeScript({
            code: script
        }, (result) => {
            console.log("result");
            console.log(result);
            if (result) {
                for (let url of result[0])
                    urlList.push(url);
            }
            setFunction(urlList)
        })
    };

    const imageClick = () => {
        getUrls("img", "src", setImageList);
    };

    const videoClick = () => {
        getUrls("video", "src", setVideoList);
    };


    const copyToClipBoard = (string) => {
        let textArea = document.createElement("textarea");
        textArea.innerHTML = string;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    };

    return (
        <div className={classes.popUp}>
            <Grid justify={"center"}
                  spacing={3} alignItems={"center"}>
                <Grid item>
                    <img src={weVerifyLogo} alt={weVerifyLogo} style={{width: "100px"}}/>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color="primary" fullWidth={true} width={"100%"} onClick={
                        () => window.open("/popup.html#/app/tools/all")
                    }>
                        Open WebSite (add tsv)
                    </Button>
                </Grid>
            </Grid>


            <ExpansionPanel onClick={videoClick}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>Video Urls (add tsv)</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <List>
                        {
                            (videoList && videoList.length > 0) ?
                                videoList.map((url, index) => {
                                    return (
                                        <ListItem key={index}>
                                            <Grid container alignContent={"center"}
                                                  spacing={1} alignItems={"center"}>
                                                <Grid item>
                                                    <Button variant="outlined" size="small" color={"primary"}
                                                            onClick={() => copyToClipBoard(url)}>
                                                        Copy
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Link onClick={() => window.open(url)} variant="body2">
                                                        {url.substring(0, 20) + "..."}
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    )
                                })
                                :
                                "No video found (add tsv)"
                        }
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel onClick={imageClick}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography className={classes.heading}>Images Urls (add tsv)</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails p={0}>
                    {
                        (imageList && imageList.length > 0) ?
                            <ImageGridList list={imageList}/>
                            :
                            "No images found (add tsv)"
                    }
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
};
export default PopUp;