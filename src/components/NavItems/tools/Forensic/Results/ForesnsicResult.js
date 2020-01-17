import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from "@material-ui/core/Collapse";
import clsx from 'clsx';
import 'react-image-lightbox/style.css';
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import {cleanForensicState} from "../../../../../redux/actions/tools/forensicActions";
import Radio from "@material-ui/core/Radio";
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import ReactCompareImage from 'react-compare-image';
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";


const ForensicResults = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);
    const dispatch = useDispatch();

    const dataParams = ["dqReport", "elaReport", "dwNoiseReport", "blockingReport", "gridsReport", "gridsInversedReport", "medianNoiseReport"];
    const result = props.result;

    const [expanded, setExpanded] = React.useState(dataParams.reduce((o, key, id) => ({...o, [id]: false}), {}));
    const images = dataParams.map((value) => {
        return result[value]["map"];
    });

    const ghostImages = result.ghostReport.maps;
    const [selectedGhostImage, setSelectedGhostImage] = useState("0");
    const [ghostExpanded, setGhostExpand] = useState(false);
    images.push(...ghostImages);

    const handleExpandClick = (key) => {
        const previous = expanded[key];
        setExpanded({
            ...expanded,
            [key]: !previous,
        });
    };

    const [filteredImage, setFilteredImage] = useState(result.displayImage);
    const [filterName, setFilterName] = useState("forensic_title_none");

    const changeFilter = (index, text) => {
        setFilteredImage(images[index]);
        setFilterName(text);
        scrollToTop();
    };

    const scrollToTop = () => window.scrollTo(0, 320)


    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanForensicState())}/>
            <div style={{maxWidth: '640px', margin: "0 auto"}}>
                <ReactCompareImage
                    leftImage={result.displayImage}
                    rightImage={filteredImage}
                    handle={(result.displayImage !== filteredImage) ? null : <React.Fragment/>}
                    sliderLineWidth={(result.displayImage === filteredImage) ? 0 : 0.6}
                />
            </div>
            <Box m={1}/>
            <Typography variant={"h5"}>{keyword("applied_filter") + keyword(filterName)}</Typography>
            {
                (result.displayImage !== filteredImage) &&
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                        setFilteredImage(result.displayImage);
                        setFilterName("forensic_title_none")
                    }}
                >
                    {
                        keyword("clear_filter")
                    }
                </Button>
            }
            <Box m={2}/>
            <Grid container justify="center" spacing={2}>
                {
                    dataParams.map((value, key) => {
                        return (
                            <Box key={key} m={1} width={"30%"}>
                                <Card className={classes.forensicCard}>
                                    <CardHeader
                                        title={keyword("forensic_title_" + value)}
                                        subheader=""
                                    />
                                    <Tooltip title={keyword("apply_filter")} placement="bottom">
                                        <CardMedia
                                            className={classes.forensicMedia}
                                            image={result[value]["map"]}
                                            title={keyword("forensic_title_" + value)}
                                            onClick={() => changeFilter(key, "forensic_title_" + value)}
                                        />
                                    </Tooltip>
                                    <CardActions disableSpacing>
                                        <Tooltip title={keyword("apply_filter")} placement="bottom">
                                            <IconButton aria-label="add to favorites"
                                                        onClick={() => {
                                                            changeFilter(key, "forensic_title_" + value)
                                                        }}>
                                                <VisibilityIcon/>
                                            </IconButton>
                                        </Tooltip>
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
                <Box m={1} width={"30%"}>
                    <Card className={classes.forensicCard}>
                        <CardHeader
                            title={keyword("forensic_title_ghostReport")}
                            subheader=""
                        />
                        {
                            ghostImages.map((image, index) => {
                                return (
                                    <Box key={index} hidden={selectedGhostImage !== index.toString()}>
                                        <Tooltip title={keyword("apply_filter")} placement="bottom">
                                            <CardMedia
                                                className={classes.forensicMedia}
                                                image={image}
                                                onClick={() => changeFilter(images.length - ghostImages.length + index, "forensic_title_ghostReport")}
                                            />
                                        </Tooltip>
                                    </Box>
                                )
                            })
                        }
                        <div>
                            {
                                ghostImages.map((image, index) => {
                                    return (
                                        <Radio
                                            key={index}
                                            checked={selectedGhostImage === index.toString()}
                                            onChange={() => setSelectedGhostImage(index.toString())}
                                            value={index.toString()}
                                            color="default"
                                            name="radio-button-demo"
                                            inputProps={{'aria-label': 'E'}}
                                            icon={<RadioButtonUncheckedIcon fontSize="small"/>}
                                            checkedIcon={<RadioButtonCheckedIcon fontSize="small"/>}
                                        />
                                    )
                                })
                            }
                        </div>
                        <CardActions disableSpacing>
                            <Tooltip title={keyword("apply_filter")} placement="bottom">
                                <IconButton aria-label="add to favorites"
                                            onClick={() => changeFilter(images.length - ghostImages.length, "forensic_title_ghostReport")}>
                                    <VisibilityIcon/>
                                </IconButton>
                            </Tooltip>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: ghostExpanded,
                                })}
                                onClick={() => setGhostExpand(!ghostExpanded)}
                                aria-expanded={ghostExpanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon/>
                            </IconButton>
                        </CardActions>
                        <Collapse in={ghostExpanded} timeout="auto"
                                  unmountOnExit>
                            <CardContent>
                                <Typography paragraph>
                                    {keyword("forensic_card_ghostReport")}
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Box>
            </Grid>
        </Paper>
    )
};
export default ForensicResults;