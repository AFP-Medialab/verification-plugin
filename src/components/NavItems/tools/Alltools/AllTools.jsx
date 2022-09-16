import Grid from "@mui/material/Grid";
import React, {useState} from "react";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Iframe from "react-iframe";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import history from "../../../Shared/History/History";
import Typography from "@mui/material/Typography";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import tsvWarning from "../../../../LocalDictionary/components/Shared/OnWarningInfo.tsv";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";
import ToolCard from "./ToolCard"
import Card from "@mui/material/Card";
import IconImage  from '../../../NavBar/images/SVG/Image/Images.svg';
import IconVideo  from '../../../NavBar/images/SVG/Video/Video.svg';
import IconSearch from '../../../NavBar/images/SVG/Search/Search.svg';
import IconData  from '../../../NavBar/images/SVG/DataAnalysis/Data_analysis.svg';
import IconTools from '../../../NavBar/images/SVG/Navbar/Tools.svg';
import Box from "@mui/material/Box";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import { useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}


const AllTools = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);
    const keywordNavbar = useLoadLanguage("components/NavBar.tsv", tsv);
    const keywordWarning = useLoadLanguage("components/Shared/OnWarningInfo.tsv", tsvWarning);
    
    const tools = props.tools;
    const [videoUrl, setVideoUrl] = useState(null);

    const userAuthenticated = useSelector(
        (state) => state.userSession && state.userSession.userAuthenticated
    );
    const [openAlert, setOpenAlert] = React.useState(false);
    const currentLang = useSelector(state => state.language);

    const handleClick = (path, mediaTool, restrictions) => {
        //console.log(type);

        if (restrictions !== undefined && restrictions.includes("lock")) {
            if (userAuthenticated) {
                //console.log("LOGGED");
                handlePush(path, mediaTool);
            } else {
                setOpenAlert(true);
            }
        }else{
            //console.log(path);
            handlePush(path, mediaTool);
        }

    };

    const handlePush = (path, mediaTool) => {
        console.log("path   ", path)
        if(path === "factcheck" || path === "xnetwork"){
            window.open(process.env.REACT_APP_TSNA_SERVER + path, "_blank") 
        }
        else {
            history.push({
                pathname: "/app/tools/" + path,
                state: { media: mediaTool }
            })
        }
    };
    

    //console.log(tools);

    const toolsVideo = [];
    const toolsImages = [];
    const toolsSearch = [];
    const toolsData = [];
    

    tools.forEach((value) => {

        if (value.type === keywordNavbar("navbar_category_video")){
            toolsVideo.push(value);
        }

        if (value.type === keywordNavbar("navbar_category_image")) {
            toolsImages.push(value);
        }

        if (value.type === keywordNavbar("navbar_category_search")) {
            toolsSearch.push(value);
        }

        if (value.type === keywordNavbar("navbar_category_data")) {
            toolsData.push(value);
        }

        

    })

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };


    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const role = useSelector((state) => state.userSession.user.roles);
    const betaTester = role.includes('BETA_TESTER')

    return (
        <div>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="warning">
                    {keywordWarning("warning_advanced_tools")}
                </Alert>
            </Snackbar>

            <HeaderTool name={keyword("navbar_tools")} icon={<IconTools style={{ fill: "#51A5B2" }} />} advanced="true"/>

            <Card>
                <Tabs value={value} onChange={handleChange} indicatorColor={'primary'}>
                    <Tab label={
                        <Box mt={1}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                <Grid item>
                                    <IconVideo width="40px" height="40px" style={{ fill: "#596977" }} />
                                </Grid>

                                <Grid item>
                                    <Box m={1} />
                                </Grid>

                                <Grid item>
                                    <Typography variant="h6" style={{ color: "#596977", textTransform: "capitalize" }}>{keyword("category_video")}</Typography>
                                </Grid>

                            </Grid>
                        </Box>
                    }/>
                    <Tab label={
                        <Box mt={1}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                <Grid item>
                                    <IconImage width="40px" height="40px" style={{ fill: "#596977" }} />
                                </Grid>

                                <Grid item>
                                    <Box m={1} />
                                </Grid>

                                <Grid item>
                                    <Typography variant="h6" style={{ color: "#596977", textTransform: "capitalize" }}>{keyword("category_image")}</Typography>
                                </Grid>

                            </Grid>
                        </Box>
                    } />
                    <Tab label={
                        <Box mt={1}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                <Grid item>
                                    <IconSearch width="40px" height="40px" style={{ fill: "#596977" }} />
                                </Grid>

                                <Grid item>
                                    <Box m={1} />
                                </Grid>

                                <Grid item>
                                    <Typography variant="h6" style={{ color: "#596977", textTransform: "capitalize" }}>{keyword("category_search")}</Typography>
                                </Grid>

                            </Grid>
                        </Box>
                    } />
                    <Tab label={
                        <Box mt={1}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                <Grid item>
                                    <IconData width="40px" height="40px" style={{ fill: "#596977" }} />
                                </Grid>

                                <Grid item>
                                    <Box m={1} />
                                </Grid>

                                <Grid item>
                                    <Typography variant="h6" style={{ color: "#596977", textTransform: "capitalize" }}>{keyword("category_data")}</Typography>
                                </Grid>

                            </Grid>
                        </Box>
                    } />
                </Tabs>

                <Box m={1} />
                
                <div style={{minHeight: "340px"}}>
                    <TabPanel value={value} index={0}>
                        <Grid container justifyContent="flex-start" spacing={2} className={classes.toolCardsContainer}>

                            {
                                toolsVideo.map((value, key) => {
                                    var element = 
                                        <Grid className={classes.toolCardStyle} item key={key} onClick={() => handleClick(value.path, "video", value.toolRestrictions)}>
                                            <ToolCard
                                                name={keyword(value.title)}
                                                description={keyword(value.description)}
                                                icon={value.iconColored}
                                                iconsAttributes={value.icons}
                                                path="../../../NavBar/images/SVG/Image/Gif.svg" />

                                        </Grid>
                                    //console.log(value);
                                    if (value.toolRestrictions.includes("beta")) {
                                        if (betaTester) {
                                            return (
                                                element
                                            )
                                        } else {
                                            return (
                                                null
                                            )
                                        }
                                    } else {
                                        return (
                                            element
                                        )
                                    }
                                    
                                })
                            }

                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container justifyContent="flex-start" spacing={2} className={classes.toolCardsContainer}>

                            {
                                toolsImages.map((value, key) => {
                                    var element = 
                                        <Grid className={classes.toolCardStyle} item key={key} onClick={() => handleClick(value.path, "image", value.toolRestrictions)}>
                                            <ToolCard
                                                name={keyword(value.title)}
                                                description={keyword(value.description)}
                                                icon={value.iconColored}
                                                iconsAttributes={value.icons} />
                                        </Grid>
                                    //console.log(value);
                                    if (value.toolRestrictions.includes("beta")) {
                                        if (betaTester) {
                                            return (
                                                element
                                            )
                                        } else {
                                            return (
                                                null
                                            )
                                        }
                                    } else {
                                        return (
                                            element
                                        )
                                    }
                                })
                            }

                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Grid container justifyContent="flex-start" spacing={2} className={classes.toolCardsContainer}>

                            {
                                toolsSearch.map((value, key) => {
                                    var element = 
                                        <Grid className={classes.toolCardStyle} item key={key} onClick={() => handleClick(value.path, "search", value.toolRestrictions)}>
                                            <ToolCard
                                                name={keyword(value.title)}
                                                description={keyword(value.description)}
                                                icon={value.iconColored}
                                                iconsAttributes={value.icons} />
                                        </Grid>
                                    if (value.toolRestrictions.includes("beta")) {
                                        if (betaTester) {
                                            return (
                                                element
                                            )
                                        } else {
                                            return (
                                                null
                                            )
                                        }
                                    } else {
                                        return (
                                            element
                                        )
                                    }
                                })
                            }

                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <Grid container justifyContent="flex-start" spacing={2} className={classes.toolCardsContainer}>

                            {
                                toolsData.map((value, key) => {
                                    var element;
                                    if (value.title === "navbar_twitter_crowdtangle"){
                                        element = 
                                            <Grid className={classes.toolCardStyle} item key={key} onClick={() => window.open(process.env.REACT_APP_TSNA_SERVER + "csvSna?lang="+currentLang, "_blank")}>
                                                <ToolCard
                                                    name={keyword(value.title)}
                                                    description={keyword(value.description)}
                                                    icon={value.iconColored}
                                                    iconsAttributes={value.icons} />
                                            </Grid>
                                        
                                    }else{

                                        element = 
                                            <Grid className={classes.toolCardStyle} item key={key} onClick={() => handleClick(value.path, "data", value.toolRestrictions)}>
                                                <ToolCard
                                                    name={keyword(value.title)}
                                                    description={keyword(value.description)}
                                                    icon={value.iconColored}
                                                    iconsAttributes={value.icons} />
                                            </Grid>
                                        
                                    }

                                    if (value.toolRestrictions.includes("beta")) {
                                        if (betaTester) {
                                            return (
                                                element
                                            )
                                        }else{
                                            return(
                                                null
                                            )
                                        }
                                    } else {
                                        return (
                                            element
                                        )
                                    }
                                    
                                })
                            }

                        </Grid>
                    </TabPanel>
                </div>
            </Card>


            <Box m={3} />
            


            <Box m={4} />


            <Dialog
                height={"400px"}
                fullWidth
                maxWidth={"md"}
                open={videoUrl !== null}
                onClose={() => setVideoUrl(null)}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogContent>
                    <Iframe
                        frameBorder="0"
                        url={videoUrl}
                        allow="fullscreen"
                        height="400"
                        width="100%"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setVideoUrl(null)} color="primary">
                        {keyword("close")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
export default AllTools;