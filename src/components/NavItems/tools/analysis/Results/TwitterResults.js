import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableHead from "@material-ui/core/TableHead";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import ImageReverseSearch from "../../ImageReverseSearch";
import CloseResult from "../../../../CloseResult/CloseResult";
import {cleanAnalysisState} from "../../../../../redux/actions/tools/analysisActions";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 5,
        textAlign: "center",
    },
    text: {
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    }, gridList: {
        width: 500,
        height: 450,
    },
    imagesRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    button: {
        margin: theme.spacing(1),
    },
    image: {
        height: "auto",
        width: "auto",
        maxWidth: "300px",
        maxHeight: "300px"
    }
}));

const TwitterResults = (props) => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    const dispatch = useDispatch();

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const report = props.report;

    const verificationComments = report["verification_comments"];
    const thumbnails = [report["thumbnails"]["preferred"]];

    const reverseSearch = (website) => {
        for (let image of thumbnails) {
            ImageReverseSearch(website, image.url);
        }
    };

    return (
        <div>
            {
                report !== null && report["thumbnails"] !== undefined &&
                report["thumbnails"]["preferred"]["url"] &&
                <Paper className={classes.root}>
                    <CloseResult onClick={() => dispatch(cleanAnalysisState())}/>
                    <Typography variant={"h5"}>
                        {report["video"]["source"]}
                    </Typography>
                    <Typography variant={"subtitle1"}>
                        {report["video"]["created_at"]}
                    </Typography>
                    <img
                        src={report["thumbnails"]["preferred"]["url"]}
                        className={classes.image}
                        alt={"img"}
                    />
                    <Box m={2}/>
                    <Divider/>
                    <Box m={2}/>
                    <Typography variant={"h6"}>
                        {keyword("youtube_video_name1_2")}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p" className={classes.text}>
                        {
                            report["video"]["full_text"]
                        }
                    </Typography>
                    <Box m={2}/>
                    <Divider/>
                    {
                        report["video"] &&
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                {
                                    report["video"]["source"] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_3")}
                                        </TableCell>
                                        <TableCell align="right">{report["video"]["source"]}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["favorite_count"] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_4")}
                                        </TableCell>
                                        <TableCell align="right">{report["video"]["favorite_count"]}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["retweet_count"] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_5")}
                                        </TableCell>
                                        <TableCell align="right">{report["video"]["retweet_count"]}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["hashtags"] && report["video"]["hashtags".length > 0] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_7")}
                                        </TableCell>
                                        <TableCell align="right">
                                            {
                                                report["video"]["hashtags"].map((value, key) => {
                                                    return <span key={key}>{value}</span>
                                                })
                                            }
                                        </TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["urls"] && report["video"]["urls"].length > 0 &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_7")}
                                        </TableCell>
                                        <TableCell align="right">
                                            {
                                                report["video"]["urls"].map((value, key) => {
                                                    return (
                                                        <a key={key} href={value}
                                                           rel="noopener noreferrer"
                                                           target={"_blank"}>{value}
                                                        </a>
                                                    );
                                                })
                                            }
                                        </TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["user_mentions"] && report["video"]["user_mentions".length > 0] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_8")}
                                        </TableCell>
                                        <TableCell align="right">
                                            {
                                                report["video"]["user_mentions"].map((value, key) => {
                                                    return <span key={key}>{value + " "}</span>
                                                })
                                            }
                                        </TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["lang"] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_9")}
                                        </TableCell>
                                        <TableCell align="right">{report["video"]["lang"]}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report["thumbnails"]["preferred"]["url"] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_10")}
                                        </TableCell>
                                        <TableCell align="right"><a href={report["thumbnails"]["preferred"]["url"]}
                                                                    rel="noopener noreferrer"
                                                                    target={"_blank"}>{report["thumbnails"]["preferred"]["url"]}</a></TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["video_info"] && report["video"]["video_info"]["aspect_ratio"] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_11")}
                                        </TableCell>
                                        <TableCell
                                            align="right">{report["video"]["video_info"]["aspect_ratio"]}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["video_info"] && report["video"]["video_info"]["duration"] &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_12")}
                                        </TableCell>
                                        <TableCell align="right">{report["video"]["video_info"]["duration"]}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report["video"]["video_info"] && report["video"]["video_info"]["urls"] &&
                                    report["video"]["video_info"]["urls"].length > 0 &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("twitter_video_name_16")}
                                        </TableCell>
                                        <TableCell align="right">
                                            {
                                                report["video"]["video_info"]["urls"].map((value, key) => {
                                                    return <a key={key} href={value} rel="noopener noreferrer" target={"_blank"}>{value + " "}</a>
                                                })
                                            }
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    }
                    {
                        report["source"] &&
                        <div>
                            <Box m={4}/>
                            <Typography variant={"h6"}>
                                {keyword("twitter_user_title") + ": " + report["source"]["user_name"]}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p" className={classes.text}>
                                {
                                    report["source"]["user_description"]
                                }
                            </Typography>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableBody>
                                    {
                                        report["source"]["user_screen_name"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_2")}
                                            </TableCell>
                                            <TableCell align="right">{report["source"]["user_screen_name"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_location"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_3")}
                                            </TableCell>
                                            <TableCell align="right">{report["source"]["user_location"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_url"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_4")}
                                            </TableCell>
                                            <TableCell align="right"><a
                                                href={report["source"]["url"]}
                                                rel="noopener noreferrer"
                                                target="_blank">{report["source"]["user_url"]}</a></TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_protected"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_6")}
                                            </TableCell>
                                            <TableCell align="right">{report["source"]["user_protected"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_verified"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_7")}
                                            </TableCell>
                                            <TableCell align="right">{report["source"]["user_verified"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_followers_count"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_8")}
                                            </TableCell>
                                            <TableCell
                                                align="right">{report["source"]["user_followers_count"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_friends_count"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_9")}
                                            </TableCell>
                                            <TableCell
                                                align="right">{report["source"]["user_friends_count"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_listed_count"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_10")}
                                            </TableCell>
                                            <TableCell align="right">{report["source"]["user_listed_count"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_favourites_count"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_11")}
                                            </TableCell>
                                            <TableCell
                                                align="right">{report["source"]["user_favourites_count"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_statuses_count"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_12")}
                                            </TableCell>
                                            <TableCell
                                                align="right">{report["source"]["user_statuses_count"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report["source"]["user_created_at"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("twitter_user_name_13")}
                                            </TableCell>
                                            <TableCell align="right">{report["source"]["user_created_at"]}</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    }
                    {
                        report["verification_comments"] &&
                        <div>
                            <Box m={4}/>
                            <Typography variant={"h6"}>
                                {keyword("youtube_comment_title")}
                            </Typography>
                            <Box m={2}/>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableBody>
                                    {
                                        report["pagination"]["total_comments"] &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("youtube_comment_name_1")}
                                            </TableCell>
                                            <TableCell
                                                align="right">{report["pagination"]["total_comments"]}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        verificationComments !== undefined &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("youtube_comment_name_2")}
                                            </TableCell>
                                            <TableCell align="right">{verificationComments.length}</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                            <Box m={2}/>
                            {
                                <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                    <ExpansionPanelSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <Typography className={classes.heading}>{keyword("api_comments")}</Typography>
                                        <Typography className={classes.secondaryHeading}> ...</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <Table className={classes.table} size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>{keyword("twitter_user_title")}</TableCell>
                                                    <TableCell
                                                        align="right">{keyword("twitter_user_name_13")}</TableCell>
                                                    <TableCell
                                                        align="right">{keyword("twitter_user_name_5")}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    verificationComments.map((comment, key) => {
                                                        return (
                                                            <TableRow key={key}>
                                                                <TableCell component="th" scope="row">
                                                                    <a href={"https://www.youtube.com/channel/" + comment["comid"]}
                                                                       rel="noopener noreferrer"
                                                                       target="_blank">{comment["authorDisplayName"]}</a>
                                                                </TableCell>
                                                                <TableCell
                                                                    align="right">{comment["publishedAt"]}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="right">{comment["textDisplay"]}
                                                                </TableCell>
                                                            </TableRow>);
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            }
                        </div>
                    }
                    <Box m={4}/>
                    {
                        thumbnails !== undefined &&
                        <div>
                            <Box m={4}/>
                            <Typography variant={"h6"}>
                                {keyword("navbar_thumbnails")}
                            </Typography>
                            <Box m={1}/>
                            <div className={classes.imagesRoot}>
                                <GridList cellHeight={160} className={classes.gridList} cols={3}>
                                    {thumbnails.map((tile, key) => (
                                        <GridListTile key={key} cols={1}>
                                            <img src={tile.url} alt={'img'}/>
                                        </GridListTile>
                                    ))}
                                </GridList>
                            </div>
                            <Box m={2}/>
                            <Button className={classes.button} variant="contained" color={"primary"}
                                    onClick={() => reverseSearch("google")}>{keyword("button_reverse_google")}</Button>
                            <Button className={classes.button} variant="contained" color={"primary"}
                                    onClick={() => reverseSearch("yandex")}>{keyword("button_reverse_yandex")}</Button>
                            <Button className={classes.button} variant="contained" color={"primary"}
                                    onClick={() => reverseSearch("tineye")}>{keyword("button_reverse_tineye")}</Button>
                        </div>
                    }
                </Paper>
            }
        </div>
    );
};
export default TwitterResults;