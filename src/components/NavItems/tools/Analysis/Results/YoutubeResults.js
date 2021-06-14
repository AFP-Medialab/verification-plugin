import React, { useState } from "react";
import {useDispatch} from "react-redux";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableHead from "@material-ui/core/TableHead";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import ImageReverseSearch from "../../ImageReverseSearch";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import {cleanAnalysisState} from "../../../../../redux/actions/tools/analysisActions";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import TimeToLocalTime from "./TimeToLocalTime";
//import AsynchMyMap from "../../../../Shared/MyMap/AsynchMyMap";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import styles from "./layout.module.css";
import axios from "axios";
import { setAnalysisComments } from "../../../../../redux/actions/tools/analysisActions";
import {setAnalysisLinkComments} from "../../../../../redux/actions/tools/analysisActions"
import {setAnalysisVerifiedComments} from "../../../../../redux/actions/tools/analysisActions"


const YoutubeResults = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Analysis.tsv", tsv);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [count_comments, setCount_comments] = useState(1);
    const [count_verified_comments, setCount_verified_comments] = useState(1);
    const [count_link_comments, setCount_link_comments] = useState(1);
    const reverseSearch = (website) => {
        for (let image of thumbnails) {
            ImageReverseSearch(website, image.url);
        }
    };
    
    var nextPage = props.report.pagination.next;
    const url = useState(nextPage);

    var index=0
    var real
  
    for(var i=0;i<url[0].length;i++){
      if(url[0][i]==="="){
        index=index+1
        if(index===2){
          real=i
          break;
        }
      }
    }

    
    
        var next_page_comments=url[0].substring(0, real+1)+(count_comments+1)+"&type=coms"
        var previous_page_comments=url[0].substring(0, real+1)+(count_comments-1)+"&type=coms"
        var next_page_verified=url[0].substring(0, real+1)+(count_verified_comments+1)+"&type=vercoms"
        var previous_page_verified=url[0].substring(0, real+1)+(count_verified_comments-1)+"&type=vercoms"
        var next_page_link=url[0].substring(0,real+1)+(count_link_comments+1)+"&type=linkcoms"
        var previous_page_link=url[0].substring(0,real+1)+(count_link_comments-1)+"&type=linkcoms"
    

    const handleClick_next_page = (event) => {
        console.log("page_verified INSIDE ",next_page_comments)
          console.log("CALL ",axios.get("https://mever.iti.gr" + next_page_comments))
          axios.get("https://mever.iti.gr" + next_page_comments).then((response) => {
            console.log("response.data ",response.data)
            if(!response.data.error){
              setCount_comments(count_comments + 1);
              console.log("PAGE NUMBER: ",count_comments)
              dispatch(setAnalysisComments(response.data));
            }
          });
      };
    
      const handleClick_previous_page = (event) => {
          if(count_comments>1){
          setCount_comments(count_comments - 1);
          console.log("PAGE NUMBER: ",count_comments)
          console.log("page_link INSIDE ",previous_page_comments)
          console.log("CALL ",axios.get("https://mever.iti.gr" + previous_page_comments))
          axios.get("https://mever.iti.gr" + previous_page_comments).then((response) => {
            console.log("response.data ",response.data)
            if(!response.data.error){
              dispatch(setAnalysisComments(response.data));
            }
          });
      };
      };
      
      const handleClick_next_page2 = (event) => {
        
          console.log("page_verified INSIDE ",next_page_verified)
          console.log("CALL ",axios.get("https://mever.iti.gr" + next_page_verified))
          axios.get("https://mever.iti.gr" + next_page_verified).then((response) => {
            console.log("response.data ",response.data)
            if(!response.data.error){
              setCount_verified_comments(count_verified_comments + 1);
              console.log("PAGE NUMBER: ",count_verified_comments)
              dispatch(setAnalysisVerifiedComments(response.data));
            }
          });   
      } 
    
      const handleClick_previous_page2 = (event) => {
        if(count_verified_comments>1){
          setCount_verified_comments(count_verified_comments - 1);
          console.log("PAGE NUMBER: ",count_verified_comments)
          console.log("page_link INSIDE ",previous_page_verified)
          console.log("CALL ",axios.get("https://mever.iti.gr" + previous_page_verified))
          axios.get("https://mever.iti.gr" + previous_page_verified).then((response) => {
            console.log("response.data ",response.data)
            if(!response.data.error){
              dispatch(setAnalysisVerifiedComments(response.data));
            }
          });
      };
        }
    
        const handleClick_next_page1 = (event) => {
            console.log("page_verified INSIDE ",next_page_comments)
          console.log("page_link INSIDE ", next_page_link)
          console.log("CALL ",axios.get("https://mever.iti.gr" + next_page_link))
          axios.get("https://mever.iti.gr" + next_page_link).then((response) => {
            console.log("response.data ",response.data)
            if(!response.data.error){
              setCount_link_comments(count_link_comments + 1);
              console.log("PAGE NUMBER: ",count_link_comments)
              dispatch(setAnalysisLinkComments(response.data));
            }
            
          });
          
        };
    
        const handleClick_previous_page1 = (event) => {
              if(count_link_comments>1){
                  
                    setCount_link_comments(count_link_comments - 1);
                    console.log("PAGE NUMBER: ",count_link_comments)
                console.log("page_link INSIDE ", previous_page_link)
                console.log("page_verified INSIDE ",previous_page_link)
                console.log("CALL ",axios.get("http://mever.iti.gr" + previous_page_link))
                axios.get("http://mever.iti.gr" + previous_page_link).then((response) => {
                  console.log("response.data ",response.data)
                  if(!response.data.error){
                    dispatch(setAnalysisLinkComments(response.data));
                  }
                });
            
            
          }
        };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////




















    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const dispatch = useDispatch();
    const report = props.report;
    console.log("report ",report)
    //const verificationComments = report["verification_comments"];
    const verificationComments = report.comments ? report.comments : [];
    const linkComments = report.link_comments ? report.link_comments : [];
    const verifiedComments = report.verification_comments ? report.verification_comments : [];
    console.log("linkComments ",linkComments)

    const thumbnails = (report["thumbnails"]["others"]);

    

    const videoTable = [
        {
            title: keyword("youtube_video_name2_1"),
            value: report["video"]["viewCount"]
        },
        {
            title: keyword("youtube_video_name2_2"),
            value: report["video"]["likeCount"]
        },
        {
            title: keyword("youtube_video_name2_3"),
            value: report["video"]["dislikeCount"]
        },
        {
            title: keyword("youtube_video_name2_4"),
            value: report["video"]["duration"]
        },
        {
            title: keyword("youtube_video_name2_5"),
            value: report["video"]["licensedContent"]
        },
        {
            title: keyword("youtube_video_name2_6"),
            value: <TimeToLocalTime time={report["video"]["publishedAt"]}/>
        }
    ];

    const sourceTable = [
        {
            title: keyword("youtube_channel_name_2"),
            value: <TimeToLocalTime time={report["source"]["publishedAt"]}/>
        },
        {
            title: keyword("youtube_channel_name_3"),
            value: report["source"]["viewCount"]
        },
        {
            title: keyword("youtube_channel_name_4"),
            value: <a
                href={report["source"]["url"]}
                rel="noopener noreferrer"
                target="_blank">{report["source"]["url"]}</a>
        },
        {
            title: keyword("youtube_channel_name_5"),
            value: report["source"]["subscriberCount"]
        },
    ];

    return (
        <div>
            {
                report !== null && report["thumbnails"] !== undefined &&
                report["thumbnails"]["preferred"]["url"] &&
                <Card>
                    <CardHeader
                        title={keyword("cardheader_results")}
                        className={classes.headerUpladedImage}
                    />
                    <div className={classes.root2}>


                        <CloseResult onClick={() => dispatch(cleanAnalysisState())}/>
                        <Typography variant={"h5"}>
                            {report["video"]["title"]}
                        </Typography>
                        <Typography variant={"subtitle1"}>
                            {report["video"]["publishedAt"]}
                        </Typography>
                        <img
                            src={report["thumbnails"]["preferred"]["url"]}
                            title={report["video"]["title"]}
                            alt={"img"}
                        />
                        <Box m={2}/>
                        <Divider/>
                        <Box m={2}/>
                        <Typography variant={"h6"}>
                            {keyword("youtube_video_name1_2")}
                        </Typography>
                        <Typography variant="body2" component="p" className={classes.text}>
                            {
                                report["video"]["description"]
                            }
                        </Typography>
                        <Box m={2}/>
                        <Divider/>
                        {
                            report["video"] &&
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableBody>
                                    {
                                        videoTable.map((obj, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row">
                                                        {obj.title}
                                                    </TableCell>
                                                    <TableCell align="right">{obj.value}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        }
                        {
                            report["source"] &&
                            <div>
                                <Box m={4}/>
                                <Typography variant={"h6"}>
                                    {keyword("youtube_channel_title") + " " + report["source"]["title"]}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p" className={classes.text}>
                                    {
                                        report["source"]["description"]
                                    }
                                </Typography>
                                <Table className={classes.table} size="small" aria-label="a dense table">
                                    <TableBody>
                                        {
                                            sourceTable.map((obj, index) => {
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row">
                                                            {obj.title}
                                                        </TableCell>
                                                        <TableCell align="right">{obj.value}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                        }

                        
                        
                  
                                <Box m={2} />

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
                                    {report.verification_cues.num_comments && (
                                                <TableRow>
                                                <TableCell component="th" scope="row">
                                                    {keyword("facebook_comment_name_1")}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {report.verification_cues.num_comments}
                                                </TableCell>
                                                </TableRow>
                                            )}
                                        {report.verification_cues.num_verification_comments !==
                                            0 && (
                                            <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("facebook_comment_name_2")}
                                            </TableCell>
                                            <TableCell align="right">
                                                {report.verification_cues.num_verification_comments}
                                            </TableCell>
                                            </TableRow>
                                        )}
                                        {report.verification_cues.num_link_comments !==
                                            0 && (
                                            <TableRow>
                                            <TableCell component="th" scope="row">
                                                {keyword("comments_links")}
                                            </TableCell>
                                            <TableCell align="right">
                                                {report.verification_cues.num_link_comments}
                                            </TableCell>
                                            </TableRow>
                                        )}
                                        
                                    </TableBody>
                                </Table>
                                <Box m={2} />

                                {
                                    verificationComments.length > 0 &&
                                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                        >
                                            <Typography className={classes.heading}>{keyword("api_comments")}</Typography>
                                            <Typography className={classes.secondaryHeading}></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Table className={classes.table} size="small" aria-label="a dense table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>{keyword("twitter_user_title")}</TableCell>
                                                        <TableCell
                                                           className={styles.size} align="center">{keyword("twitter_user_name_13")}</TableCell>
                                                        <TableCell
                                                            align="center">{keyword("twitter_user_name_5")}</TableCell>
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
                                                                        align="center">{comment["publishedAt"]}
                                                                    </TableCell>
                                                                    <TableCell
                                                                        align="left">{comment["textDisplay"]}
                                                                    </TableCell>
                                                                </TableRow>);
                                                        })
                                                    }
                                                </TableBody>
                                            </Table>
                                        </AccordionDetails>
                                        <Box>{keyword("page_number") + count_comments}</Box>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_previous_page}
                    >
                      {keyword("previous_button")}
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_next_page}
                    >
                      {keyword("next_button")}
                    </Button>
                                    </Accordion>
                                }
                                <Box m={2} />
                {
                  //verifiedComments.length > 0 &&
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>
                        {keyword("api_comments_verified")}
                      </Typography>
                      <Typography className={classes.secondaryHeading}>
                        {" "}
                        
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                          <TableCell>{keyword("twitter_user_title")}</TableCell>
                            <TableCell className={styles.size} align="center">
                              {keyword("twitter_user_name_13")}
                            </TableCell>
                            <TableCell align="center">
                              {keyword("twitter_user_name_5")}
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody className={styles.container}>
                          {verifiedComments.map((comment, key) => {
                            return (
                              <TableRow key={key}>
                                   <TableCell component="th" scope="row">
                                                                        <a href={"https://www.youtube.com/channel/" + comment["comid"]}
                                                                        rel="noopener noreferrer"
                                                                        target="_blank">{comment["authorDisplayName"]}</a>
                                                                    </TableCell>
                                <TableCell align="center" size="small">
                                  {comment.publishedAt}
                                </TableCell>
                                <TableCell align="left" size="small">
                                  {comment.textDisplay}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                    <Box>{keyword("page_number") + count_verified_comments}</Box>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_previous_page2}
                    >
                      {keyword("previous_button")}
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_next_page2}
                    >
                      {keyword("next_button")}
                    </Button>
                  </Accordion>
                }
                <Box m={2} />
                {
                  //linkComments.length > 0 &&
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>
                        {keyword("link_comments")}
                      </Typography>
                      <Typography className={classes.secondaryHeading}>
                        {" "}
                        
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Table
                        className={classes.table}
                        size="small"
                        aria-label="a dense table"
                      >
                        <TableHead>
                          <TableRow>
                          <TableCell>{keyword("twitter_user_title")}</TableCell>
                            <TableCell className={styles.size} align="center">
                              {keyword("twitter_user_name_13")}
                            </TableCell>
                            <TableCell align="center">
                              {keyword("twitter_user_name_5")}
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody className={styles.container}>
                          {linkComments.map((comment, key) => {
                            return (
                              <TableRow key={key}>
                                   <TableCell component="th" scope="row">
                                                                        <a href={"https://www.youtube.com/channel/" + comment["comid"]}
                                                                        rel="noopener noreferrer"
                                                                        target="_blank">{comment["authorDisplayName"]}</a>
                                                                    </TableCell>
                                <TableCell align="center" size="small">
                                  {comment.publishedAt}
                                </TableCell>
                                <TableCell align="left" size="small">
                                  {comment.textDisplay}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                    <Box>{keyword("page_number") + count_link_comments}</Box>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_previous_page1}
                    >
                      {keyword("previous_button")}
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_next_page1}
                    >
                      {keyword("next_button")}
                    </Button>
                  </Accordion>
                }
                                                
                               
                            </div>
                        }

                        <Box m={4}/>
                        {
                           /* report.mentioned_locations &&
                            report.mentioned_locations.detected_locations &&
                            report.mentioned_locations.detected_locations.length > 0 &&
                            <div>
                            <AsynchMyMap locations={report.mentioned_locations.detected_locations}/>
                            <Box m={4}/>
                            </div>
                        */ }


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
                    </div>
                </Card>
            }
        </div>
    );
};
export default YoutubeResults;