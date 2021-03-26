import {Paper} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import React, {useState, useEffect} from "react";
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
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import {cleanForensicState} from "../../../../../redux/actions/tools/forensicActions";
import Radio from "@material-ui/core/Radio";
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Forensic.tsv";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import ReactCompareImage from 'react-compare-image';
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';


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
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

const ForensicResults = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Forensic.tsv", tsv);
    const dispatch = useDispatch();
    const [landscape, setLandscape] = useState(true);

    const OnClickShowFilters = () => { 

        if (landscape === false){
            setLandscape(true);
        }
        else {
            setLandscape(false);
        }
            
    }

    
    //const dataParamsTexts = ["dqReport", "elaReport", "dwNoiseReport", "blockingReport", "gridsReport", "gridsInversedReport", "medianNoiseReport"];
    const dataParams = ["adq1_report", "ela_report", "wavelet_report", "blk_report", "median_report", "cmfd_report", "dct_report", "fusion_report", "mantranet_report", "splicebuster_report", "zero_report", "laplacian_report", "rcmfd_report"];
    const result = props.result;
    console.log(props.result);

    const [expanded, setExpanded] = React.useState(dataParams.reduce((o, key, id) => ({...o, [id]: false}), {}));
    const images = dataParams.map((value) => {
        console.log(value);
        if(value === "zero_report"){
            return result[value]["forgery"];
        }else{
            return result[value]["map"];
        }
    });

    const cagiNormal = result.cagi_report.mapG;
    const cagiInversed = result.cagi_report.mapGI;
    const [cagiNormalExpanded, setCagiNormalExpand] = useState(false);
    const [cagiInversedExpanded, setCagiInversedExpand] = useState(false);
    images.push(cagiNormal);
    images.push(cagiInversed);

    const ghostImages = result.ghost_report.maps;
    const [selectedGhostImage, setSelectedGhostImage] = useState("0");
    const [ghostExpanded, setGhostExpand] = useState(false);
    images.push(...ghostImages);

    
    console.log(images);  

    const handleExpandClick = (key) => {
        const previous = expanded[key];
        setExpanded({
            ...expanded,
            [key]: !previous,
        });
    };

    const [filteredImage, setFilteredImage] = useState(props.url);
    const [filterName, setFilterName] = useState("forensic_title_none");

    const changeFilter = (index, text) => {
        setFilteredImage(images[index]);
        setFilterName(text);
        scrollToTop();
    };

    const scrollToTop = () => window.scrollTo(0, 320)
    useEffect(() => {
        setFilteredImage(props.url);
        setFilterName("forensic_title_none");
    }, [result, props.url]);


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
            root:{
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

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    

    const [value, setValue] = React.useState(0)

    //console.log("props");
    //console.log(props);
    console.log(images);

    const [imageDsiplayed, setImageDisplayed] = useState(props.url);

    function displayFilter(index) {
        console.log("Change filter");
        setImageDisplayed(images[index]);
    }

    function displayOriginalImage(e) {
        console.log("Original image");
        setImageDisplayed(props.url);
    }


    

    return (
    <div>
        <div className={classes.newForensics}>
            <ThemeProvider theme={theme}>
                <Box mt={5} mb={5}>
                    <Grid container spacing={3}>

                        <Grid item xs={6}>
                            <Card>
                                <CardHeader
                                    title="Uploaded Image"
                                    subheader=""
                                />
                                <CardMedia
                                component="img"
                                className={classes.uploadedImage}
                                image={imageDsiplayed}
                                />
                                
                            </Card>

                            <Box m={3}></Box>

                            <Card className={classes.lensesCard}>
                                <CardHeader
                                    title="Lenses"
                                    subheader=""
                                />
                                
                                <Box p={3}>

                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[1]}
                                                onMouseOver={() => displayFilter(1)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%" className={classes.lensesTitles}>{keyword("forensic_title_ela_report")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[11]}
                                                onMouseOver={() => displayFilter(11)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%" className={classes.lensesTitles}>{keyword("forensic_title_laplacian_report")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[4]}
                                                onMouseOver={() => displayFilter(4)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%" className={classes.lensesTitles}>{keyword("forensic_title_median_report")}</Box>
                                        </Grid>
                                    </Grid>

                                </Box>
                                
                                
                            </Card>
                        </Grid>

                        <Grid item xs={6}>
                            <Card className={classes.filtersCard}>
                                <CardHeader
                                    title="Filters"
                                    subheader=""
                                    
                                />

                                <Tabs value={value} onChange={handleChange} indicatorColor={'primary'}>
                                    <Tab label="Compression"  {...a11yProps(0)}/>
                                    <Tab label="Noise"  {...a11yProps(1)}/>
                                    <Tab label="AI"  {...a11yProps(2)}/>
                                    <Tab label="Cloning"  {...a11yProps(3)}/>
                                </Tabs>

                                <TabPanel value={value} index={0}>

                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[10]}
                                                onMouseOver={() => displayFilter(10)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_zero_report")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[0]}
                                                onMouseOver={() => displayFilter(0)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_adq1_report")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[3]}
                                                onMouseOver={() => displayFilter(3)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_blk_report")}</Box>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[6]}
                                                onMouseOver={() => displayFilter(6)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_dctReport")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[13]}
                                                onMouseOver={() => displayFilter(13)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_cagiNormal")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[14]}
                                                onMouseOver={() => displayFilter(14)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_cagiInversed")}</Box>
                                        </Grid>
                                    </Grid>


                                    <Box mt={2} mb={2}>
                                        <Divider />
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <InfoIcon style={{ color: "#333333" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_compression_description")}</Box>
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <CheckCircleIcon style={{ color: "#8BC34A" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_compression_look")}</Box>
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <CancelIcon style={{ color: "#EB5757" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_compression_ignore")}</Box>
                                    </Box>
                                    
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[9]}
                                                onMouseOver={() => displayFilter(9)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_splicebuster_report")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[2]}
                                                onMouseOver={() => displayFilter(2)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_wavelet_report")}</Box>
                                        </Grid>
                                    </Grid>
                                    <Box mt={2} mb={2}>
                                        <Divider />
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <InfoIcon style={{ color: "#333333" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_noise_description")}</Box>
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <CheckCircleIcon style={{ color: "#8BC34A" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_noise_look")}</Box>
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <CancelIcon style={{ color: "#EB5757" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_noise_ignore")}</Box>
                                    </Box>
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[8]}
                                                onMouseOver={() => displayFilter(8)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_mantranet_report")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[7]}
                                                onMouseOver={() => displayFilter(7)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_fusion_report")}</Box>
                                        </Grid>
                                    </Grid>
                                    <Box mt={2} mb={2}>
                                        <Divider />
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <InfoIcon style={{ color: "#333333" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_ai_description")}</Box>
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <CheckCircleIcon style={{ color: "#8BC34A" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_ai_look")}</Box>
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <CancelIcon style={{ color: "#EB5757" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_ai_ignore")}</Box>
                                    </Box>
                                </TabPanel>
                                <TabPanel value={value} index={3}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[8]}
                                                onMouseOver={() => displayFilter(8)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_cmfd_report")}</Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={images[12]}
                                                onMouseOver={() => displayFilter(12)}
                                                onMouseLeave={displayOriginalImage}
                                            />
                                            <Box align="center" width="100%">{keyword("forensic_title_rcmfd_report")}</Box>
                                        </Grid>
                                    </Grid>
                                    <Box mt={2} mb={2}>
                                        <Divider />
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <InfoIcon style={{ color: "#333333" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_cloning_description")}</Box>
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <CheckCircleIcon style={{ color: "#8BC34A" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_cloning_look")}</Box>
                                    </Box>

                                    <Box display="flex" mb={2}>
                                        <Box mr={2}>
                                            <CancelIcon style={{ color: "#EB5757" }} />
                                        </Box>
                                        <Box>{keyword("forensic_family_cloning_ignore")}</Box>
                                    </Box>
                                </TabPanel>

                                
                            </Card>
                        </Grid>

                    </Grid> 
                </Box>
            </ThemeProvider>
              
        </div> 

    </div>
    )
};
export default ForensicResults;




/*
<Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanForensicState())}/>
            <Box m={1}/>
            <OnClickInfo keyword={"forensic_tip"}/>
            <Box m={3}/>
            
            <div style={{maxWidth: '640px', margin: "0 auto"}}>
                <ReactCompareImage
                    leftImage={props.url}
                    rightImage={filteredImage}
                    handle={(props.url !== filteredImage) ? null : <React.Fragment/>}
                    sliderLineWidth={(props.url === filteredImage) ? 0 : 0.6}
                />
            </div>
            
            <Box m={1}/>
            <Typography variant={"h5"}>{keyword("applied_filter") + keyword(filterName)}</Typography>
            {
                (props.url !== filteredImage) &&
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => {
                        setFilteredImage(props.url);
                        setFilterName("forensic_title_none")
                    }}
                >
                    {
                        keyword("clear_filter")
                    }
                </Button>
            }
            <Box m={2}/>
            
            {
                !landscape &&
            <Button variant="contained" color="primary" onClick={() => {OnClickShowFilters()}}>
                    {
                        keyword("forensic_ratio_b_portrait")
                    }
                </Button>
            }
            {
                landscape &&
            <Button variant="contained" color="primary" onClick={() => {OnClickShowFilters()}}>
                    {
                        keyword("forensic_ratio_b_landscape")
                    }
                </Button>
            }
            <Grid container justify="center" spacing={2}>
                {
                     landscape &&
                    dataParams.map((value, key) => {
                        //console.log(value);
                        //console.log(key);
                        //console.log(keyword("forensic_title_dqReport"));
                        //console.log(keyword("forensic_title_cmfd_report"));
                        if(value === "zero_report"){
                            return (
                                <Box key={key} m={1} width={"30%"}>
                                    <Card className={classes.forensicCard}>
                                        <CardHeader
                                            title={keyword("forensic_title_" + value)}
                                            subheader=""
                                        />
                                        <Tooltip title={keyword("apply_filter")} placement="bottom">
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={result[value]["forgery"]}
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
                        }else{
                            return (
                                <Box key={key} m={1} width={"30%"}>
                                    <Card className={classes.forensicCard}>
                                        <CardHeader
                                            title={keyword("forensic_title_" + value)}
                                            subheader=""
                                        />
                                        <Tooltip title={keyword("apply_filter")} placement="bottom">
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={result[value]["map"]}
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
                        }
                        
                    })
                }
                {
                   !landscape &&
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
                                            className={classes.forensicMediaNotLandscape}
                                            image={result[value]["map"]}
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
                {
                <Box m={1} width={"30%"}>
                    <Card className={classes.forensicCard}>
                        <CardHeader
                            title={keyword("forensic_title_ghostReport")}
                            subheader=""
                        />
                        {
                            landscape &&
                            ghostImages.map((image, index) => {
                                return (
                                    <Box key={index} hidden={selectedGhostImage !== index.toString()}>
                                        <Tooltip title={keyword("apply_filter")} placement="bottom">
                                            <CardMedia
                                                className={classes.forensicMediaLandscape}
                                                image={image}
                                                onClick={() => changeFilter(images.length - ghostImages.length + index, "forensic_title_ghostReport")}
                                            />
                                        </Tooltip>
                                    </Box>
                                )
                            })
                        }
                        {
                            !landscape &&
                            ghostImages.map((image, index) => {
                                return (
                                    <Box key={index} hidden={selectedGhostImage !== index.toString()}>
                                        <Tooltip title={keyword("apply_filter")} placement="bottom">
                                            <CardMedia
                                                className={classes.forensicMediaNotLandscape}
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
                }
                {
                <Box key={"key"} m={1} width={"30%"}>
                    <Card className={classes.forensicCard}>
                        <CardHeader
                            title={keyword("forensic_title_cagiNormal")}
                            subheader=""
                        />
                        <Tooltip title={keyword("apply_filter")} placement="bottom">
                            <CardMedia
                                className={classes.forensicMediaLandscape}
                                image={cagiNormal}
                                onClick={() => changeFilter(5, "forensic_title_cagiNormal")}
                            />
                        </Tooltip>
                        <CardActions disableSpacing>
                            <Tooltip title={keyword("apply_filter")} placement="bottom">
                                <IconButton aria-label="add to favorites"
                                            onClick={() => {
                                                changeFilter(5, "forensic_title_cagiNormal")
                                            }}>
                                    <VisibilityIcon/>
                                </IconButton>
                            </Tooltip>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: cagiNormalExpanded,
                                })}
                                onClick={() => setCagiNormalExpand(!cagiNormalExpanded)}
                                aria-expanded={cagiNormalExpanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon/>
                            </IconButton>
                        </CardActions>
                        <Collapse in={cagiNormalExpanded} timeout="auto"
                                  unmountOnExit>
                            <CardContent>
                                <Typography paragraph>
                                    {keyword("forensic_card_cagiNormal")}
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Box>
                }
                {
                <Box key={"key2"} m={1} width={"30%"}>
                    <Card className={classes.forensicCard}>
                        <CardHeader
                            title={keyword("forensic_title_cagiInversed")}
                            subheader=""
                        />
                        <Tooltip title={keyword("apply_filter")} placement="bottom">
                            <CardMedia
                                className={classes.forensicMediaLandscape}
                                image={cagiInversed}
                                onClick={() => changeFilter(6, "forensic_title_cagiInversed")}
                            />
                        </Tooltip>
                        <CardActions disableSpacing>
                            <Tooltip title={keyword("apply_filter")} placement="bottom">
                                <IconButton aria-label="add to favorites"
                                            onClick={() => {
                                                changeFilter(6, "forensic_title_cagiInversed")
                                            }}>
                                    <VisibilityIcon/>
                                </IconButton>
                            </Tooltip>
                            <IconButton
                                className={clsx(classes.expand, {
                                    [classes.expandOpen]: cagiInversedExpanded,
                                })}
                                onClick={() => setCagiInversedExpand(!cagiInversedExpanded)}
                                aria-expanded={expanded[cagiInversedExpanded]}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon/>
                            </IconButton>
                        </CardActions>
                        <Collapse in={cagiInversedExpanded} timeout="auto"
                                  unmountOnExit>
                            <CardContent>
                                <Typography paragraph>
                                    {keyword("forensic_card_cagiInversed")}
                                </Typography>
                            </CardContent>
                        </Collapse>
                    </Card>
                </Box>
                }
            </Grid>
        </Paper>



*/