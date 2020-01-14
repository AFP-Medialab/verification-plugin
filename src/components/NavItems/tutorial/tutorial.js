import React from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import insta from "./images/InstagramDemo.png";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/Tutorial.tsv";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import popUpEn from "./images/popUpImage/popUp_EN.png";
import popUpFr from "./images/popUpImage/popUp_FR.png";
import popUpEs from "./images/popUpImage/popUp_ES.png";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";

const Tutorial = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/Tutorial.tsv", tsv);
    const language = useSelector(state => state.language);

    let popImg;
    switch (language) {
        case "fr":
            popImg = popUpFr;
            break;
        case "es":
            popImg = popUpEs;
            break;
        default:
            popImg  = popUpEn;
            break;
    }

    return (
        <Paper className={classes.root}>
            <Box justifyContent="center" display="flex" flexDirection="column">
                <CustomTile text={keyword("tuto_title")}/>
                <br/>
                <Typography variant="h3">{keyword("tuto_h_1")}</Typography>
                <Box item={"true"}>
                    <img src={popImg} alt={""} className={classes.InteractiveMedia}/>
                </Box>
                <Typography variant="body1">{keyword("tuto_1")}</Typography>


                <List justify={"center"}>
                    <ListItem  >
                        <ListItemText>
                            {keyword("open_website")}
                        </ListItemText>
                        <ListItemText>
                            {keyword("open_website_description")}
                        </ListItemText>
                    </ListItem>
                    <ListItem >
                        <ListItemText>
                            {keyword("video_urls")}
                        </ListItemText>
                        <ListItemText>
                            {keyword("video_urls_description")}
                        </ListItemText>
                    </ListItem>
                    <ListItem >
                        <ListItemText>
                            {keyword("images_url")}
                        </ListItemText>
                        <ListItemText>
                            {keyword("images_url_description")}
                        </ListItemText>
                    </ListItem>
                </List>

                <Typography variant="body1">{keyword("tuto_3")}</Typography>
                <Box item={"true"}>
                    <img src={insta} alt={""}  className={classes.InteractiveMedia}/>
                </Box>
                <h2>{keyword("tuto_h_2")}</h2>
                <div className={"content"}  dangerouslySetInnerHTML={{__html: keyword("tuto_4")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_5")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_6")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_7")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_8")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_9")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_10")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_11")}}></div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_12")}}></div>
            </Box>
        </Paper>
    );
};
export default Tutorial;