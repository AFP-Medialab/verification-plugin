import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ImageGridList from "../../../../Shared/ImageGridList/ImageGridList";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { useKeyframes } from "../Hooks/usekeyframes";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import { cleanKeyframesState } from "../../../../../redux/actions/tools/keyframesActions";
//import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Keyframes.tsv";
import tsv2 from "../../../../../LocalDictionary/components/Shared/OnClickInfo.tsv"
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
//import { useLoading, loadImageSize } from "../../../../../Hooks/useInput"
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, LinearProgress, Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import Link from "@material-ui/core/Link";

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Popover from '@material-ui/core/Popover';
import CloseIcon from '@material-ui/icons/Close';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import DetailedIcon from '@material-ui/icons/ViewComfyRounded';
import SimpleIcon from '@material-ui/icons/ViewStreamRounded';


const KeyFramesResults = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Keyframes.tsv", tsv);
    const keywordHelp = useLoadLanguage("components/Shared/OnClickInfo.tsv", tsv2);
    const dispatch = useDispatch();

    const [detailed, setDetailed] = useState(false);
    const [simpleList, detailedList] = useKeyframes(props.result);
    //const [findHeight, setFindHeight] = useState(false);
    const [cols, setCols] = useState(3);
    //const [height, setHeight] = useState(0);
    const similarityResults = useSelector(state => state.keyframes.similarity);
    //const isLoading = useSelector(state => state.keyframes.loading);
    const isLoadingSimilarity = useSelector(state => state.keyframes.similarityLoading);

    const theme = createTheme({

        palette: {
            primary: {
                light: '#5cdbe6',
                main: '#05a9b4',
                dark: '#007984',
                contrastText: '#fff',
            },
            secondary: {
                main: '#ffaf33',
            },
            error: {
                main: 'rgb(198,57,59)'
            }
        },
        overrides: {

            MuiImageList: {
                root: {
                    maxHeight: "none!important",
                    height: "auto!important"
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

        if (zoom === -1) {
            if(cols!== 12){
                if (cols === 4) {
                    setCols(6);
                } else if (cols === 6) {
                    setCols(12);
                } else {
                    setCols(cols + 1);
                }
            }
            
        }
        if (zoom === 1) {
            if (cols !== 1) {
                if (cols === 12) {
                    setCols(6);
                } else if (cols === 6) {
                    setCols(4);
                } else {
                    setCols(cols - 1);
                }
            }
        }

    }

    const [loadingSimple, setLoadingSimple] = useState(true);
    const [loadingDetailed, setLoadingDetailed] = useState(true);
    const [classSimple, setClassSimple] = useState(classes.hideElement);
    const [classDetailed, setClassDetailed] = useState(classes.hideElement);


    const showElementsSimple = () => {
        setLoadingSimple(false);
        setClassSimple(classes.showElement)
    }

    const showElementsDetailed = () => {
        setLoadingDetailed(false);
        setClassDetailed(classes.showElement)
    }


    /*
    const computeHeight = async () => {
        loadImageSize(simpleList, cols)
            .then((height) => { setHeight(height); setFindHeight(true) })
            .then((height) => { return height })
            .catch((e) => { return null });
    };  
    */
    //const [getHeight, isLoading] = useLoading(computeHeight);
    // const response = getHeight();

    /*
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

    */

    //Help
    //============================================================================================
    const [anchorHelp, setAnchorHelp] = React.useState(null);
    const openHelp = Boolean(anchorHelp);
    const help = openHelp ? 'simple-popover' : undefined;


    function clickHelp(event) {
        setAnchorHelp(event.currentTarget);
    }

    function closeHelp() {
        setAnchorHelp(null);
    }

    return (


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

                    </Card>

                    <Box m={3} />



                    <CloseResult onClick={() => dispatch(cleanKeyframesState())} />

                    <Card>
                        <CardHeader
                            title={
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <span>{keyword("cardheader_results")}</span>
                                    <HelpOutlineIcon style={{ color: "#FFFFFF" }} onClick={clickHelp} />

                                    <Popover
                                        id={help}
                                        open={openHelp}
                                        anchorEl={anchorHelp}
                                        onClose={closeHelp}
                                        PaperProps={{
                                            style: {
                                                width: '300px',
                                                fontSize: 14
                                            },
                                        }}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}>

                                        <Box p={3}>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="stretch">

                                                <Typography variant="h6" gutterBottom>
                                                    {keywordHelp("title_tip")}
                                                </Typography>

                                                <CloseIcon onClick={closeHelp} />
                                            </Grid>

                                            <Box m={1} />
                                            <Typography variant="body2">
                                                {keywordHelp("keyframes_tip")}
                                            </Typography>

                                        </Box>

                                    </Popover>

                                </Grid>
                                
                                
                                }
                            className={classes.headerUpladedImage}
                        />

                        <div className={classes.root2}>
                           
                            <Grid container justifyContent="space-between" spacing={2}
                                alignContent={"center"}>
                                <Grid item>
                                    {!detailed ?
                                        <Button color={"primary"} onClick={() => toggleDetail()} endIcon={<DetailedIcon />}>
                                            {keyword("keyframe_title_get_detail")}
                                        </Button>
                                        :
                                        <Button color={"primary"} onClick={() => toggleDetail()} endIcon={<SimpleIcon />}>
                                            {keyword("keyframe_title_get_simple")}
                                        </Button>
                                    }
                                </Grid>
                                <Grid item xs style={{textAlign: "end"}}>
                                    <Button onClick={() => zoom(-1)} endIcon={<ZoomOutIcon />}>
                                        {
                                            keyword("zoom_out")
                                        }
                                    </Button>
                                </Grid>
                                <Grid item>
                                <Button onClick={() => zoom(1)} endIcon={<ZoomInIcon/>}>
                                        {
                                            keyword("zoom_in")
                                        }
                                    </Button>
                                </Grid>
                                
                            </Grid>
                            <Box m={2} />
                            <Divider />   
                            
                            <Box m={4} />
                            <ThemeProvider theme={theme}>


                            {
                                detailed && loadingDetailed &&
                                <Box m={4}>
                                    <CircularProgress />
                                </Box>
                                
                            }
                            {
                                detailed && 
                                //<ImageGridList list={detailedList} height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
                                
                                <div className={classDetailed}>
                                    <ImageGridList list={detailedList} cols={cols} handleClick={imageClick} style={{ maxHeigth: "none", height: "auto" }} setLoading={showElementsDetailed}/>
                                </div>
                            }



                            {
                                !detailed && loadingSimple &&
                                <Box m={4}>
                                    <CircularProgress />
                                </Box>
                            }
                            {
                                !detailed &&
                                //<ImageGridList list={simpleList}  height={160} onClick={(url) => ImageReverseSearch("google", url)}/>
                                <div className={classSimple}>
                                    <ImageGridList list={simpleList} cols={cols} handleClick={imageClick} style={{ maxHeigth: "none", height: "auto" }} setLoading={showElementsSimple} />
                                </div>
                            }
                            


                            </ThemeProvider>
                        </div>
                    </Card>
                </>

    )
};
export default React.memo(KeyFramesResults);