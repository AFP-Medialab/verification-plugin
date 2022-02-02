import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ImageGridList from "../../../../Shared/ImageGridList/ImageGridList";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { useKeyframes } from "../Hooks/usekeyframes";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import { cleanKeyframesState, setKeyframesLoading } from "../../../../../redux/actions/tools/keyframesActions";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import { useLoading, loadImageSize } from "../../../../../Hooks/useInput"
import { Accordion, AccordionDetails, AccordionSummary, LinearProgress, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Link from "@material-ui/core/Link";

const KeyFramesResults = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Keyframes.tsv", tsv);
    const dispatch = useDispatch();

    const [detailed, setDetailed] = useState(false);
    const [simpleList, detailedList] = useKeyframes(props.result);
    const [findHeight, setFindHeight] = useState(false);
    const [cols, setCols] = useState(3);
    const [height, setHeight] = useState(0);
    const similarityResults = useSelector(state => state.keyframes.similarity);
    const isLoadingSimilarity = useSelector(state => state.keyframes.similarityLoading);

    const theme = createTheme({
        overrides: {

            MuiImageList: {
                root: {
                    maxHeight: "none!important",
                },
            },

        },

    });

    const toggleDetail = () => {
        setDetailed(!detailed);
    };
    const imageClick = (event) => {
        let search_url = "https://www.google.com/searchbyimage?image_url=";
        let url = event

        if (url !== "") {
            window.chrome.tabs.create({ url: search_url + url });
        }
    };
    const zoom = (zoom) => {
        if (zoom === 1 && cols > 1) {
            setCols(cols - 1);
        };
        if (zoom === -1) {
            setCols(cols + 1);
        };
    }

    const computeHeight = async () => {
        loadImageSize(simpleList, cols)
            .then((height) => { setHeight(height); setFindHeight(true) })
            .then((height) => { return height })
            .catch((e) => { return null });
    };

    const [getHeight, isLoading] = useLoading(computeHeight);
    // const response = getHeight();
    useEffect(() => {
        if (simpleList) {
            getHeight();
        }
        // eslint-disable-next-line 
    }, [simpleList]);

    useEffect(() => {
        if (findHeight) {
            dispatch(setKeyframesLoading(false));
        }
    }, [findHeight, dispatch]);

    return (
        <>
            {
                !isLoading &&

                <>


                    <Card>

                        {
                            similarityResults && !isLoadingSimilarity && similarityResults.length > 0 &&

                            <Box>
                                <Accordion style={{border: "2px solid #05A9B4"}}>

                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon style={{ color: "#17717e" }} />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Box p={1} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                            <ReportProblemOutlinedIcon style={{ color: "#17717e",marginRight: "8px" }} />
                                            <Typography variant="h6" align="left" style={{ color: "#17717e" }}>
                                                    {keyword("found_dbkf")}
                                            </Typography>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails style={{ flexDirection: "column" }}>

                                        <Box p={2}>

                                            <Typography variant="body1" align="left">
                                                    {keyword("dbkf_articles")}
                                            </Typography>

                                            <Box m={1} />

                                            {
                                                similarityResults.map((value, key) => {
                                                    return (
                                                        <Typography variant="body1" align="left" style={{ color: "#17717e" }} key={key}>
                                                            <Link target="_blank" href={value.externalLink} style={{ color: "#17717e" }} >{value.externalLink}</Link>
                                                        </Typography>
                                                    )
                                                })
                                            }

                                        </Box>

                                        

                                    </AccordionDetails>

                                </Accordion>
                            </Box>

                        }
                        {
                            isLoadingSimilarity &&

                            <Box p={4}>

                                <LinearProgress hidden={!isLoadingSimilarity} />
                                <Box m={1} />
                                <Typography variant="body1" align="center" hidden={!isLoadingSimilarity}>
                                        {keyword("loading_dbkf")}
                                </Typography>

                            </Box>
                        }

                    </Card>

                    <Box m={3} />




                    <Card>
                        <CardHeader
                            title={keyword("cardheader_results")}
                            className={classes.headerUpladedImage}
                        />

                        <div className={classes.root2}>
                            <CloseResult onClick={() => dispatch(cleanKeyframesState())} />
                            <Box m={2} />
                            <OnClickInfo keyword={"keyframes_tip"} />
                            <Box m={2} />
                            <Divider />
                            <Box m={2} />
                            {findHeight &&
                                <Grid container justifyContent="center" spacing={2}
                                    alignContent={"center"}>
                                    <Grid item>
                                        <Button variant="contained" color={"primary"} onClick={() => toggleDetail()}>
                                            {
                                                !detailed ? keyword("keyframe_title_get_detail")
                                                    : keyword("keyframe_title_get_simple")
                                            }
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color={"primary"} onClick={() => zoom(1)}>
                                            {
                                                keyword("zoom_in")
                                            }
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color={"primary"} onClick={() => zoom(-1)}>
                                            {
                                                keyword("zoom_out")
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                            <Box m={2} />
                            <ThemeProvider theme={theme}>
                            {
                                detailed &&
                                //<ImageGridList list={detailedList} height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
                                <ImageGridList list={detailedList} height={height} cols={cols} handleClick={imageClick} style={{maxHeigth: "none"}}/>
                            }
                            {
                                !detailed &&
                                //<ImageGridList list={simpleList}  height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
                                <ImageGridList list={simpleList} height={height} cols={cols} handleClick={imageClick} style={{maxHeigth: "none"}}/>
                            }
                            </ThemeProvider>
                        </div>
                    </Card>
                </>
            }
        </>
    )
};
export default React.memo(KeyFramesResults);