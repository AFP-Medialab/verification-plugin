import React from "react";
import {useSelector} from "react-redux";
import {Paper} from "@material-ui/core";

import makeStyles from "@material-ui/core/styles/makeStyles";
import CustomTile from "../../customTitle/customTitle"
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import videoUrl from "../../tutorial/images/VideoURLmenu.png";
import insta from "../../tutorial/images/InstagramDemo.png";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        textAlign: "center",
    },
}));

const Analysis = () => {
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Box justifyContent="center" display="flex" flexDirection="column">
                <CustomTile> {keyword("api_title")}  </CustomTile>
                <br/>
                <Box item>
                    <img src={videoUrl} alt={""} className={classes.media}/>
                </Box>
                <Typography variant="body1">{keyword("tuto_1")}</Typography>

                <div className={"content"} dangerouslySetInnerHTML={{__html: keyword("tuto_2")}}></div>
                <Typography variant="body1">{keyword("tuto_3")}</Typography>


            </Box>
        </Paper>
    );
};
export default Analysis;