import React, {useState} from "react";
import Slide from "@material-ui/core/Slide";
import {Paper} from "@material-ui/core";
import {useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Iframe from "react-iframe";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImageReverseSearch from "../tools/ImageReverseSearch";
import history from '../../Shared/History/History';
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/Interactive.tsv";
import Link from "@material-ui/core/Link";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";

const Interactive = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/Interactive.tsv", tsv);
    const answersAvailable = useSelector(state => state.interactiveExplanation);

    const carouselItems = () => {
        let res = [];
        let cpt = 1;
        while (keyword("quiz_item_url_" + cpt) !== "") {
            res.push(
                {
                    url: keyword("quiz_item_url_" + cpt),
                    title: keyword("quiz_item_title_" + cpt),
                    answer: keyword("quiz_item_answer_" + cpt),
                    answerUrl: keyword("quiz_item_answer_" + cpt + "_url"),
                    ext: keyword("quiz_item_url_" + cpt).split(".").pop()
                }
            );
            cpt++;
        }
        return res;
    };
    const carousel = carouselItems();


    const [carouselIndex, setCarouselIndex] = useState(0);
    const [answerExpanded, setAnswerExpanded] = useState(false);

    const handleExpanded = () => {
        if (answersAvailable)
            setAnswerExpanded(!answerExpanded);
        else
            alert(keyword("quiz_unlock_message"))
    };

    const previous = () => {
        setCarouselIndex((carouselIndex === 0) ? carousel.length - 1 : carouselIndex - 1);
    };

    const next = () => {
        setCarouselIndex((carouselIndex === carousel.length - 1) ? 0 : carouselIndex + 1);
    };


    return (
        <Paper className={classes.root}>
            <Box justifyContent="center" display="flex" flexDirection="column">
                <CustomTile text={keyword("quiz_title")}/>
                {
                    carousel.map((obj, key) => {
                        const isImage = obj.ext === "jpg" || obj.ext === "jpeg" || obj.ext === "png" || obj.ext === "bmp" || obj.ext === "gif"
                        return (

                            <div key={key} hidden={key !== carouselIndex}>
                                <div align={"center"}>
                                    {
                                        (isImage) ?
                                            <img src={obj.url} className={classes.InteractiveMedia} alt={obj.url}/>
                                            :
                                            <Iframe frameBorder="0" src={obj.url}
                                                    width="80%"
                                                    height={window.innerHeight / 2}/>
                                    }
                                </div>
                                <Grid container justify="space-between" spacing={2}
                                      alignContent={"center"}>
                                    <Grid item>
                                        <Fab color={"primary"} onClick={previous} >
                                            <NavigateBeforeIcon fontSize={"large"} style={{ color: "white" }}/>
                                        </Fab>
                                    </Grid>
                                    <Grid item align="center">
                                    </Grid>
                                    <Grid item>
                                        <Fab color={"primary"} onClick={next} >
                                            <NavigateNextIcon fontSize={"large"} style={{ color: "white" }}/>
                                        </Fab>
                                    </Grid>
                                </Grid>
                                {
                                    (isImage) ?
                                        <Grid container justify="center" spacing={2}
                                              alignContent={"center"}>
                                            <Grid item>
                                                <Button p={3} variant="contained" color="primary" onClick={() => {
                                                    ImageReverseSearch("google", obj.url);
                                                }}>
                                                    {keyword("quiz_similarity")}
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button p={3} variant="contained" color="primary" onClick={() => {
                                                    history.push("tools/forensic/" + encodeURIComponent(obj.url))
                                                }}>
                                                    {keyword("quiz_forensic")}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        :
                                        <Button p={3} variant="contained" color="primary" onClick={() => {
                                            history.push("tools/keyframes/" + encodeURIComponent(obj.url))
                                        }}>
                                            {keyword("quiz_keyframes")}
                                        </Button>

                                }

                                <Box m={3}/>
                                <Typography variant={"h5"}>{obj.title}</Typography>
                                <ExpansionPanel expanded={answerExpanded} onChange={handleExpanded}>
                                    <ExpansionPanelSummary
                                        expandIcon={(answersAvailable) ? <ExpandMoreIcon/> : null}
                                        aria-controls="panel4bh-content"
                                        id="panel4bh-header"
                                    >
                                        <Grid container justify="space-between" spacing={2}
                                              alignContent={"center"}>
                                            <Grid item>
                                                <Typography className={classes.heading} align={"justify"}>
                                                    {keyword("quiz_explanations")}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                {
                                                    (answersAvailable) ?
                                                        <LockOpenIcon/>
                                                        :
                                                        <LockOutlinedIcon/>
                                                }
                                            </Grid>
                                        </Grid>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Typography align={"justify"}>
                                            {obj.answer}
                                            <Link target="_blank" href={obj.answerUrl}>
                                                {obj.answerUrl}
                                            </Link>
                                        </Typography>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </div>
                        )
                    })
                }
            </Box>
        </Paper>
    );
};
export default Interactive;