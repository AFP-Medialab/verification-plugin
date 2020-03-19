import {useDispatch, useSelector} from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Paper from "@material-ui/core/Paper";
import React from "react";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import {cleanAnalysisState} from "../../../../../redux/actions/tools/analysisActions";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import TableHead from "@material-ui/core/TableHead";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import ImageReverseSearch from "../../ImageReverseSearch";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import MyMap from "../../../../Shared/MyMap/MyMap";

const FacebookResults = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);


    const reverseSearch = (website) => {
        for (let image of thumbnails) {
            ImageReverseSearch(website, image.url);
        }
    };

    const dispatch = useDispatch();
    const report = props.report;
    const verificationComments = (report.comments) ? report.comments : [];
    const thumbnails = (report.thumbnails.others);

    return (

        <div>
            {
                report !== null && report.thumbnails !== undefined &&
                report.thumbnails.preferred.url &&
                <Paper className={classes.root}>
                    <CloseResult onClick={() => dispatch(cleanAnalysisState())}/>
                    <Typography variant={"h5"}>
                        {report.video.title}
                    </Typography>
                    <Typography variant={"subtitle1"}>
                        {report.video.created_time}
                    </Typography>
                    <img
                        src={report.thumbnails.preferred.url}
                        onClick={() => {
                            window.open(report.thumbnails.preferred.google_reverse_image_search, '_blank');
                        }}
                        className={classes.image}
                        alt={"img"}
                    />
                    <Box m={2}/>
                    <Divider/>
                    <Box m={2}/>
                    <Typography variant="body2" color="textSecondary" component="p" className={classes.text}>
                        {
                            report.video.description
                        }
                    </Typography>
                    <Box m={2}/>
                    {
                        report["video"] &&
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                {
                                    report.video_id &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("facebook_video_name_1")}
                                        </TableCell>
                                        <TableCell align="right">{report.video_id}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report.video.title &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("facebook_video_name_2")}
                                        </TableCell>
                                        <TableCell align="right">{report.video.title}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report.video.length &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("facebook_video_name_3")}
                                        </TableCell>
                                        <TableCell align="right">{report.video.length}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report.video.content_category &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("facebook_video_name_4")}
                                        </TableCell>
                                        <TableCell align="right">{report.video.content_category}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report.video.content_tags &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("facebook_video_name_5")}
                                        </TableCell>
                                        <TableCell align="right">{"" + report.video.content_tags.join(", ")}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report.video.likes &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("facebook_video_name_7")}
                                        </TableCell>
                                        <TableCell align="right">{report.video.likes}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report.video.updated_time &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("facebook_video_name_8")}
                                        </TableCell>
                                        <TableCell align="right">{report.video.updated_time}</TableCell>
                                    </TableRow>
                                }
                                {
                                    report.video.created_time &&
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            {keyword("facebook_video_name_9")}
                                        </TableCell>
                                        <TableCell align="right">{report.video.created_time}</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    }
                    <div>
                        <Box m={4}/>
                        <Typography variant={"h6"}>
                            {keyword("facebook_comment_title")}
                        </Typography>
                        <Box m={2}/>
                        {
                            report.verification_cues &&
                            <Table className={classes.table} size="small" aria-label="a dense table">

                                <TableBody>
                                    {
                                        report.verification_cues.num_comments &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("facebook_comment_name_1")}
                                            </TableCell>
                                            <TableCell
                                                align="right">{report.verification_cues.num_comments}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        report.verification_cues.num_verification_comments != 0 &&
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("facebook_comment_name_2")}
                                            </TableCell>
                                            <TableCell
                                                align="right">{report.verification_cues.num_verification_comments}</TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        }
                        <Box m={2}/>
                        {
                            verificationComments.length > 0 &&
                            <ExpansionPanel>
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
                                                            <TableCell
                                                                align="right">{comment.publishedAt}
                                                            </TableCell>
                                                            <TableCell
                                                                align="right">{comment.textDisplay}
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
                    <Box m={4}/>
                    {
                        report.mentioned_locations &&
                        report.mentioned_locations.detected_locations &&
                        report.mentioned_locations.detected_locations.length > 0 &&
                        <div>
                            <MyMap locations={report.mentioned_locations.detected_locations}/>
                            <Box m={4}/>
                        </div>
                    }
                    {
                        thumbnails !== undefined &&
                        <div>
                            <Box m={4}/>
                            <Typography variant={"h6"}>
                                {keyword("navbar_thumbnails")}
                            </Typography>
                            <Box m={1}/>
                            <OnClickInfo keyword={"keyframes_tip"}/>
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
                            {
                                report["verification_cues"] && report["verification_cues"]["twitter_search_url"] &&
                                <Button className={classes.button} variant="contained" color={"primary"}
                                        onClick={() => window.open(report["verification_cues"]["twitter_search_url"])}>{keyword("button_reverse_twitter")}</Button>
                            }
                        </div>
                    }

                </Paper>
            }
        </div>
    )

};
export default FacebookResults;