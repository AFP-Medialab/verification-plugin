import {Paper} from "@material-ui/core";
import CustomTile from "../../../Shared/CustomTitle/CustomTitle";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useGetImages from "./Hooks/useGetImages";
import LinearProgress from "@material-ui/core/LinearProgress";
import ForensicResults from "./Results/ForensicResult";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import {useParams} from 'react-router-dom'
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";
import {submissionEvent} from "../../../Shared/GoogleAnalytics/GoogleAnalytics";
import LocalFile from "../Forensic/LocalFile/LocalFile";
import {KNOWN_LINKS} from "../../Assistant/AssistantRuleBook";
import { ReactComponent as ForensicIcon } from '../../../NavBar/images/SVG/Image/Forensic.svg';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import FileIcon from '@material-ui/icons/InsertDriveFile';


const Forensic = () => {
    const {url} = useParams();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);
    const keyword2 = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);


    const theme = createMuiTheme({
        overrides: {

            MuiCardHeader: {
                root: {
                    backgroundColor: "#05A9B4",
                },
                title: {
                    color: 'white',
                    fontSize: 20,
                    fontweight: 500,
                }
            },

            MuiTab: {
                wrapper: {
                    fontSize: 12,

                },
                root: {
                    minWidth: "25%!important",
                }
            },

        },

        palette: {
            primary: {
                light: '#5cdbe6',
                main: '#05a9b4',
                dark: '#007984',
                contrastText: '#fff',
            },
        },

    });

    // state used to toggle localFile view
    const [localFile, setLocalFile] = useState(false);
    const toggleLocal = () => {
        setLocalFile(!localFile);
    };

    const resultUrl = useSelector(state => state.forensic.url);
    const resultData = useSelector(state => state.forensic.result);
    const isLoading = useSelector(state => state.forensic.loading);
    const gifAnimationState = useSelector(state => state.forensic.gifAnimation);

    //console.log(gifAnimationState);

    const [input, setInput] = useState(resultUrl);
    const [image, setImage] = useState("");
    const [urlDetected, setUrlDetected] = useState(false)
    const [loaded, setLoaded] = useState(false);

    useGetImages(image);

    
    const submitUrl = () => {
        if (input && input !== "") {
            setLoaded(true);
            submissionEvent(input);
            setImage(input);
        }
    };

    useEffect(() => {
        if (url) {
            if (url === KNOWN_LINKS.OWN) {
                setLocalFile(true)
            } else {
                const uri = decodeURIComponent(url);
                setInput(uri)
            }
        }
        setUrlDetected(true)

    }, [url]);

    useEffect(() => {
        if (urlDetected){
            submitUrl()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urlDetected])

    useEffect(() => {
        setImage("")
    }, [image]);

    const loading = useSelector(state => state.forensic.loading);

    const [classButtonURL, setClassButtonURL] = useState(null);
    const [classButtonLocal, setClassButtonLocal] = useState(null);

    const [classIconURL, setClassIconURL] = useState(classes.bigButtonIcon);
    const [classIconLocal, setClassIconLocal] = useState(classes.bigButtonIcon);

    const [showURL, setShowURL] = useState(false);
    const [showLocal, setShowLocal] = useState(false);

    if (!showURL && !showLocal && classButtonURL != classes.bigButtonDiv && classButtonLocal != classes.bigButtonDiv) {
        setClassButtonURL(classes.bigButtonDiv);
        setClassButtonLocal(classes.bigButtonDiv);
    }


    const clickURL = (event) => {
        setClassButtonURL(classes.bigButtonDivSelectted);
        setClassIconURL(classes.bigButtonIconSelectted);

        setClassButtonLocal(classes.bigButtonDiv);
        setClassIconLocal(classes.bigButtonIcon);

        setShowURL(true);
        setShowLocal(false);

        setLocalFile(false);
    }

    const clickLocal = (event) => {
        setClassButtonURL(classes.bigButtonDiv);
        setClassIconURL(classes.bigButtonIcon);

        setClassButtonLocal(classes.bigButtonDivSelectted);
        setClassIconLocal(classes.bigButtonIconSelectted);

        setShowURL(false);
        setShowLocal(true);

        setLocalFile(true);
    }






    return (
        <div>
            <ThemeProvider theme={theme}>

            {//=== Title ===
            }

            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
            >

                <ForensicIcon style={{ fill: "#51A5B2" }} />
                <Typography variant="h4" color={'primary'}>
                    {keyword2("navbar_forensic")}
                </Typography>

            </Grid>

            <Box ml={1}>
                <Typography variant="body1">
                    {keyword2("navbar_forensic_description")}
                </Typography>
            </Box>
            <Box m={3} />
            
            
            <Card  style={{ display: loaded ? "none" : "block" }}>
                <CardHeader
                    title={
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center">

                            <span>Source of the image</span>

                        </Grid>
                    }
                    className={classes.headerUpladedImage}
                />
                <div className={classes.root2}>

                    <Box p={4} >

                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={6}>

                                <Box p={3} className={classButtonURL} onClick={clickURL}>
                                    <Grid
                                        container
                                        direction="row"
                                        alignItems="center"

                                    >
                                        <Grid item>
                                            <Box ml={1} mr={2}>
                                                <LinkIcon className={classIconURL} />
                                            </Box>

                                        </Grid>

                                        <Grid item>
                                            <Grid
                                                container
                                                direction="column"
                                                justify="flex-start"
                                                alignItems="flex-start"
                                            >
                                                <Grid item>
                                                    <Typography variant="body1" style={{ fontWeight: 600 }}>URL Link</Typography>
                                                </Grid>

                                                <Box mt={1} />

                                                <Grid item>
                                                    <Typography variant="body1">The image to analyze is provided with a URL Link</Typography>
                                                </Grid>

                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Box>

                            </Grid>


                            <Grid item xs={6}>

                                <Box p={3} className={classButtonLocal} onClick={clickLocal}>
                                    <Grid
                                        container
                                        direction="row"
                                        alignItems="center"

                                    >
                                        <Grid item>
                                            <Box ml={1} mr={2}>
                                                <FileIcon className={classIconLocal} />
                                            </Box>

                                        </Grid>

                                        <Grid item>
                                            <Grid
                                                container
                                                direction="column"
                                                justify="flex-start"
                                                alignItems="flex-start"
                                            >
                                                <Grid item>
                                                    <Typography variant="body1" style={{ fontWeight: 600 }}>Local file</Typography>
                                                </Grid>

                                                <Box mt={1} />

                                                <Grid item>
                                                    <Typography variant="body1">The image to analyze is provided with a local file</Typography>
                                                </Grid>

                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Box>

                            </Grid>

                        </Grid>


                        <Box display={localFile ? "none" : "block"}>
                            


                            <TextField
                                value={input}
                                id="standard-full-width"
                                label={keyword("forensic_input")}
                                style={{ margin: 8 }}
                                placeholder={""}
                                fullWidth
                                variant="outlined"
                                disabled={isLoading}
                                onChange={e => {
                                    setInput(e.target.value)
                                }}
                            />
                            
                            <Button variant="contained" color="primary" onClick={submitUrl} disabled={isLoading}>
                                {keyword("button_submit")}
                            </Button>
                            <Box m={2} />
                            <LinearProgress hidden={!isLoading} />
                        </Box>
                        <Box display={!localFile ? "none" : "block"}>
                            <Button variant="contained" color="primary" onClick={toggleLocal}>
                                {keyword("forensic_card_back")}
                            </Button>
                            <LocalFile />
                        </Box>


                    </Box>





                
                </div>
            </Card>
            
            {loading &&
                <LinearProgress />
            }
            
            {
                resultData &&
                <ForensicResults 
                    result={resultData}
                    url={resultUrl}
                    loaded={loaded}
                    gifAnimation={gifAnimationState}
                    />
            }
        </ThemeProvider>
        </div>
    );
};
export default Forensic;