import React from "react";
import {useDispatch} from "react-redux";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import FaceIcon from "@material-ui/icons/Face";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Iframe from "react-iframe";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import CloseResult from "../../Shared/CloseResult/CloseResult";
import {cleanAssistantState} from "../../../redux/actions/tools/assistantActions";
import history from "../../Shared/History/History";
import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";

const AssistantResult = (props) => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const result = props["result"];
    const url = props["image"];
    const dispatch = useDispatch();
    
    if (result.length == 0)
        return (
            <Paper>
                <box m={3}/>
                <CloseResult onClick={() => dispatch(cleanAssistantState())}/>
                <Card><CardContent className={classes.assistantText}>
                    <Typography variant={"h6"} align={"left"}>
                        <FaceIcon size={"small"}/> {keyword("assistant_error")}
                    </Typography>
                </CardContent></Card>

            </Paper>
        );

    const handleClick = (path, url) => {
        history.push("/app/" + path + "/" + encodeURIComponent(url))
    };

    const preprocessLinkForEmbed = (url) => {
        let embedURL = url;
        if (!embedURL.includes("/embed/")) {
            let ids = embedURL.match("(v=|youtu.be\/)([a-zA-Z0-9_-]+)[&|\?]?");
            if (ids) {
                let id = ids[ids.length-1];
                console.log("ID:", id);
                embedURL = "http://www.youtube.com/embed/" + id;
            }
        }
        return embedURL;
    }

    // some .. very nested code for results
    // explore cleaner code!
    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanAssistantState())}/>
            <Grid container spacing={2}>
                <Grid item xs = {6} hidden={url==""}>
                    <Card variant = "outlined">
                        <CardContent>
                            <Typography variant="h5" component="h2" color="black">
                                Media to Process
                            </Typography>
                            <Typography className={classes.title} color="primary">
                               {url}
                            </Typography>
                        </CardContent>
                        <CardMedia>
                            <Iframe
                                frameBorder="0"
                                url = {preprocessLinkForEmbed(url)}
                                allow="fullscreen"
                                height="400"
                                width="100%"
                            />
                            <div data-href={url}/>
                        </CardMedia>
                    </Card>
                </Grid>
                <Grid  item xs = {6}>
                    <Card variant = "outlined">
                        <Box m = {2} >
                            <Typography variant="h5" component="h2" color="black">
                                {keyword("things_you_can_do_header")}
                            </Typography>
                            <Typography className={classes.title} color="primary">
                                {keyword("things_you_can_do")}
                            </Typography>
                        </Box>
                        <Box m = {2}>
                            <Grid container spacing={2}>
                                {result.map((action) => {
                                    return (
                                        <Grid container m = {4}>
                                            <Card className={classes.assistantCards}  variant = "outlined"
                                                  onClick={() => handleClick(action.path, url) }>
                                                <CardActionArea><CardContent>
                                                        <Typography className={classes.title} m={2}>{keyword(action.text)}</Typography>
                                                        <Button aria-colspan={2} size = "medium">
                                                            {<Icon className={classes.iconRootDrawer} fontSize={"large"}>
                                                                <img className={classes.imageIconDrawer} src={action.icon}/>
                                                            </Icon>}
                                                            {keyword(action.title)}
                                                        </Button>
                                                </CardContent></CardActionArea>
                                            </Card>
                                        </Grid>
                                    )})}
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};
export default AssistantResult;