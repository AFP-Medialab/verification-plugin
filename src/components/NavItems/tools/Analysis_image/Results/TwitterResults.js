import {useDispatch} from "react-redux";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import {cleanAnalysisState} from "../../../../../redux/actions/tools/image_analysisActions";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { setAnalysisComments } from "../../../../../redux/actions/tools/image_analysisActions";
import {setAnalysisLinkComments} from "../../../../../redux/actions/tools/image_analysisActions"
import {setAnalysisVerifiedComments} from "../../../../../redux/actions/tools/image_analysisActions"
import CardMedia from "@material-ui/core/CardMedia";
import AnalysisComments from "../../Analysis/Results/AnalysisComments";


const TwitterResults = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);
   
    const dispatch = useDispatch();
    const report = props.report;
    
    return (
        <div>
            {
                report !== null  &&
                <Card>
                    <CardHeader
                        title={keyword("cardheader_results")}
                        className={classes.headerUpladedImage}
                    />
                    <div className={classes.root2}>

                        <CloseResult onClick={() => dispatch(cleanAnalysisState())}/>
                        
                        <CardMedia
                          className={classes.imageAnalysis}
                          image={report["image"]["media"][0]}
                        />

                        <Typography variant={"subtitle1"}>
                            {report["image"]["created_at"]}
                        </Typography>
                        
                        <Box m={2}/>
                        <Divider/>
                        <Box m={2}/>
                        <Typography variant={"h6"}>
                        {keyword("profile_creator") + ": " + report["source"]["user_name"]}
                        </Typography>
                        {
                            report["image"] &&
                            <Typography variant="body2" color="textSecondary" component="p" className={classes.text}>
                                {
                                    report["image"]["full_text"]
                                }
                            </Typography>
                        }
                        <Box m={2}/>
                        <Divider/>
                        {
                            report["image"] &&
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableBody>
                                {report.id && (
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                            {keyword("image_id")}
                                            </TableCell>
                                            <TableCell align="right">{report.id}</TableCell>
                                        </TableRow>
                                        )}
                                        {report.platform && (
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                            {keyword("platform")}
                                            </TableCell>
                                            <TableCell align="right">{report.platform}</TableCell>
                                        </TableRow>
                                        )}
                                    {
                                        (!report["image"]["source"]) ? null :
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("twitter_video_name_3")}
                                                </TableCell>
                                                <TableCell align="right">{report["image"]["source"]}</TableCell>
                                            </TableRow>
                                    }
                                    {
                                        (!report["image"]["created_at"]) ? null :
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("facebook_video_name_9")}
                                                </TableCell>
                                                <TableCell align="right">{report["image"]["created_at"]}</TableCell>
                                            </TableRow>
                                    }
                                    {
                                        (!report["image"]["media"]["0"]) ? null :
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("image_link")}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <a href={report["image"]["media"]["0"]}
                                                                        rel="noopener noreferrer"
                                                                        target="_blank">{report["image"]["media"]["0"]}</a>
                                                                        </TableCell>
                                            </TableRow>
                                    }
                                    {
                                        (!report["image"]["favorite_count"]) ? null :
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("twitter_video_name_4")}
                                                </TableCell>
                                                <TableCell align="right">{report["image"]["favorite_count"]}</TableCell>
                                            </TableRow>
                                    }
                                    {
                                        (!report["image"]["retweet_count"]) ? null :
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("twitter_video_name_5")}
                                                </TableCell>
                                                <TableCell align="right">{report["image"]["retweet_count"]}</TableCell>
                                            </TableRow>
                                    }
                                    {
                                        (!(report["image"]["hashtags"] && report["image"]["hashtags".length > 0])) ? null :
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("twitter_video_name_6")}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        report["image"]["hashtags"].map((value, key) => {
                                                            return <span key={key}>{value}</span>
                                                        })
                                                    }
                                                </TableCell>
                                            </TableRow>
                                    }
                                    {
                                        (!(report["image"]["urls"] && report["image"]["urls"].length > 0)) ? null :
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("twitter_video_name_7")}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        report["image"]["urls"].map((value, key) => {
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
                                        (!(report["image"]["user_mentions"] && report["image"]["user_mentions".length > 0])) ? null :
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("twitter_video_name_8")}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        report["image"]["user_mentions"].map((value, key) => {
                                                            return <span key={key}>{value + " "}</span>
                                                        })
                                                    }
                                                </TableCell>
                                            </TableRow>
                                    }
                                    
                                </TableBody>
                            </Table>
                        }
                        
                        {
                            report["verification_comments"] &&
                            <AnalysisComments 
                              type="TWITTER"
                              classes={classes} 
                              title="twitter_replies"
                              keyword={keyword} report={report} 
                              setAnalysisComments={setAnalysisComments} 
                              setAnalysisLinkComments={setAnalysisLinkComments}
                              setAnalysisVerifiedComments={setAnalysisVerifiedComments} />
                        }
                        <Box m={4}/>
                        
                        
                    </div>
                </Card>
            }
        </div>
    );
};
export default TwitterResults;