import {Paper} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop/Backdrop";
import Fade from "@material-ui/core/Fade";
import ImageEditor from "@toast-ui/react-image-editor";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Loop from "../Magnifier/Loop";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {useDispatch, useSelector} from "react-redux";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from "@material-ui/core/Collapse";
import clsx from 'clsx';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import CloseResult from "../../../CloseResult/CloseResult";
import {cleanForensicState} from "../../../../redux/actions/tools/forensicActions";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 20,
        textAlign: "center",
    },
    card: {
        width: "100%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    lightBox: {
        overlay : {
            zIndex: theme.zIndex.drawer + 1,
        },
    }
}));

const ForensicResults = (props) => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    const dispatch = useDispatch();

    const dataParams = ["dqReport", "elaReport", "dwNoiseReport", "blockingReport", "gridsReport", "gridsInversedReport", "medianNoiseReport"];
    const result = props.result;

    const [expanded, setExpanded] = React.useState(dataParams.reduce((o, key, id) => ({...o, [id]: false}), {}));
    const images = dataParams.map((value) => {return result[value]["map"];});
    const [photoIndex, setPhotoIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const handleExpandClick = (key) => {
        const previous = expanded[key];
        setExpanded({
            ...expanded,
            [key]: !previous,
        });
    };


    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanForensicState())}/>
            <Grid container justify="center" spacing={2}>
                {
                    dataParams.map((value, key) => {
                        return (
                            <Box key={key} m={1} width={"30%"}>
                                <Card className={classes.card}>
                                    <CardHeader
                                        title={keyword("forensic_title_" + value)}
                                        subheader=""
                                    />
                                    <CardMedia
                                        className={classes.media}
                                        image={result[value]["map"]}
                                        title={keyword("forensic_title_" + value)}
                                    />
                                    <CardActions disableSpacing>
                                        <IconButton aria-label="add to favorites"
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setPhotoIndex(key)
                                                    }}>
                                            <ZoomInIcon/>
                                        </IconButton>
                                        <IconButton
                                            className={clsx(classes.expand, {
                                                [classes.expandOpen]: expanded[value],
                                            })}
                                            onClick={() => handleExpandClick(value)}
                                            aria-expanded={expanded[value]}
                                            aria-label="show more"
                                        >
                                            <ExpandMoreIcon/>
                                        </IconButton>
                                    </CardActions>
                                    <Collapse in={expanded[value]} timeout="auto"
                                              unmountOnExit>
                                        <CardContent>
                                            <Typography paragraph>
                                                {keyword("forensic_card_" + value)}
                                            </Typography>
                                        </CardContent>
                                    </Collapse>
                                </Card>
                            </Box>
                        )
                    })
                }
            </Grid>
            {
                open &&
                <Lightbox
                    reactModalStyle={{overlay: {zIndex: 9999999}}}
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => setOpen(false)}
                    onMovePrevRequest={() =>
                        setPhotoIndex((photoIndex + images.length - 1) % images.length)
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex( (photoIndex + 1) % images.length)
                    }
                />
            }
        </Paper>
    )
};
export default ForensicResults;