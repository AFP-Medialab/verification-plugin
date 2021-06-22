import { useDispatch } from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import React, { useState } from "react";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import { cleanAnalysisState } from "../../../../../redux/actions/tools/image_analysisActions";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import TableHead from "@material-ui/core/TableHead";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Button from "@material-ui/core/Button";
import ImageReverseSearch from "../../ImageReverseSearch";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
//import AsynchMyMap from "../../../../Shared/MyMap/AsynchMyMap";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import styles from "../../Analysis/Results/layout.module.css";
import axios from "axios";
import { setAnalysisComments } from "../../../../../redux/actions/tools/image_analysisActions";
import {setAnalysisLinkComments} from "../../../../../redux/actions/tools/image_analysisActions"
import {setAnalysisVerifiedComments} from "../../../../../redux/actions/tools/image_analysisActions"
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

const FacebookResults = (props) => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "components/NavItems/tools/Analysis.tsv",
    tsv
  );
  const [count_comments, setCount_comments] = useState(1);
  const [count_verified_comments, setCount_verified_comments] = useState(1);
  const [count_link_comments, setCount_link_comments] = useState(1);

  
  
  var nextPage = props.report.pagination.next;
  const url = useState(nextPage);
  console.log("url ",url[0])
  var last_page_all_comments=Math.ceil(props.report.verification_cues.num_comments/10)
  var last_page_verified_comments=Math.ceil(props.report.verification_cues.num_verification_comments/10)
  var last_page_link_comments=Math.ceil(props.report.verification_cues.num_link_comments/10)

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

  var last_page_all_comments1=url[0].substring(0, real+1)+(last_page_all_comments)+"&type=coms"
  var last_page_verified_comments1=url[0].substring(0, real+1)+(last_page_verified_comments)+"&type=vercoms"
  var last_page_link_comments1=url[0].substring(0, real+1)+(last_page_link_comments)+"&type=linkcoms"

  var first_page_all_comments1=url[0].substring(0, real+1)+(1)+"&type=coms"
  var first_page_verified_comments1=url[0].substring(0, real+1)+(1)+"&type=vercoms"
  var first_page_link_comments1=url[0].substring(0, real+1)+(1)+"&type=linkcoms"

  const handleClick_first_page = (event) => {
    if(count_comments!==1){
      
      console.log("CALL ",axios.get("https://mever.iti.gr" + first_page_all_comments1))
      axios.get("https://mever.iti.gr" + first_page_all_comments1).then((response) => {
        console.log("response.data ",response.data)
        setCount_comments(1);
        dispatch(setAnalysisComments(response.data));
        
      });
    }
  };
  const handleClick_last_page = (event) => {
    if(count_link_comments!==last_page_all_comments){
    
    
      console.log("CALL ",axios.get("https://mever.iti.gr" + last_page_all_comments1))
      axios.get("https://mever.iti.gr" + last_page_all_comments1).then((response) => {
        console.log("response.data ",response.data)
        setCount_comments(last_page_all_comments);
        dispatch(setAnalysisComments(response.data));
      });
    }
  };

  const handleClick_first_page1 = (event) => {
    if(count_link_comments!==1){
      
      console.log("CALL ",axios.get("https://mever.iti.gr" + first_page_link_comments1))
      axios.get("https://mever.iti.gr" + first_page_link_comments1).then((response) => {
        console.log("response.data ",response.data)
        setCount_link_comments(1);
        dispatch(setAnalysisLinkComments(response.data));
        
      });
    }
  };
  const handleClick_last_page1 = (event) => {
    if(count_link_comments!==last_page_link_comments){
    
    
      console.log("CALL ",axios.get("https://mever.iti.gr" + last_page_link_comments1))
      axios.get("https://mever.iti.gr" + last_page_link_comments1).then((response) => {
        console.log("response.data ",response.data)
          setCount_link_comments(last_page_link_comments);
          dispatch(setAnalysisLinkComments(response.data));
 
      });
    }
  };

  const handleClick_first_page2 = (event) => {
    if(count_verified_comments!==1){
      
      console.log("CALL ",axios.get("https://mever.iti.gr" + first_page_verified_comments1))
      axios.get("https://mever.iti.gr" + first_page_verified_comments1).then((response) => {
        console.log("response.data ",response.data)
        setCount_verified_comments(1);
        dispatch(setAnalysisVerifiedComments(response.data));
        
      });
    }
  };
  const handleClick_last_page2 = (event) => {
    if(count_verified_comments!==last_page_verified_comments){
    
    
      console.log("CALL ",axios.get("https://mever.iti.gr" + last_page_verified_comments1))
      axios.get("https://mever.iti.gr" + last_page_verified_comments1).then((response) => {
        console.log("response.data ",response.data)
        setCount_verified_comments(last_page_verified_comments);
        dispatch(setAnalysisVerifiedComments(response.data));
 
      });
    }
  };
 
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

  const dispatch = useDispatch();
  const report = props.report;
  console.log("Report ", report);
  //console.log("report.pagination.next ",report.pagination.next)
  const verificationComments = report.comments ? report.comments : [];
  const linkComments = report.link_comments ? report.link_comments : [];
  const verifiedComments = report.verification_comments ? report.verification_comments : [];
  console.log("linkComments ",linkComments)

  //console.log("linkComments ",linkComments)
 // console.log("verifiedComments ",verifiedComments)


  //console.log("nothing ", nothing)
  return (
    <div>
      {report !== null &&
       
        (
          <Card>
            <CardHeader
              title={keyword("cardheader_results")}
              className={classes.headerUpladedImage}
            />
            <div className={classes.root2}>
              <CloseResult onClick={() => dispatch(cleanAnalysisState())} />
              <Typography variant={"h6"}>
                {keyword("image_description")}
              </Typography>
              
              <Box m={2} />
              <Divider />
              <Box m={2} />
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                className={classes.text}
              >
                {report.image.source}
              </Typography>
              <Box m={2} />
              {report["image"] && (
                <Table
                  className={classes.table}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableBody>
                    {report.image_id && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("image_id")}
                        </TableCell>
                        <TableCell align="right">{report.image_id}</TableCell>
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
                    {report.source.from && (
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                            {keyword("source")}
                                            </TableCell>
                                            <TableCell align="right">{report.source.from}</TableCell>
                                        </TableRow>
                                        )}                    
                    
                    {report.image.length && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_3")}
                        </TableCell>
                        <TableCell align="right">
                          {report.image.length}
                        </TableCell>
                      </TableRow>
                    )}
                    {/*report.image.caption && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_4")}
                        </TableCell>
                        <TableCell align="right">
                          {report.image.caption}
                        </TableCell>
                      </TableRow>
                    )*/}
                    {report.image.can_tag && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_5")}
                        </TableCell>
                        <TableCell align="right">
                          {"" + report.image.can_tag.join(", ")}
                        </TableCell>
                      </TableRow>
                    )}
                    {/*report.image.caption && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_7")}
                        </TableCell>
                        <TableCell align="right">
                          {report.image.caption}
                        </TableCell>
                      </TableRow>
                    )*/}
                    {report.image.created_time && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_9")}
                        </TableCell>
                        <TableCell align="right">
                          {report.image.created_time}
                        </TableCell>
                      </TableRow>
                    )}
                    {report.image.updated_time && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("facebook_video_name_8")}
                        </TableCell>
                        <TableCell align="right">
                          {report.image.updated_time}
                        </TableCell>
                      </TableRow>
                    )}
                    {report.verification_cues.twitter_search_url && (
                      <TableRow>
                        <TableCell component="th" scope="row">
                          {keyword("twitter_search")}
                        </TableCell>
                        <TableCell align="right">
                        <a href={report.verification_cues.twitter_search_url}
                                rel="noopener noreferrer"
                                target="_blank">
                          {report.verification_cues.twitter_search_url}</a>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
              <div>
                <Box m={4} />
                <Typography variant={"h6"}>
                  {keyword("facebook_comment_title")}
                </Typography>
                <Box m={2} />
                {report.verification_cues && (
                  <Table
                    className={classes.table}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableBody>
                      {report.verification_cues.num_comments && (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {keyword("image_comment_count")}
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
                )}
                <Box m={2} />
                {verificationComments.length > 0 && (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>
                        {keyword("api_comments")}
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
                          <TableCell className={styles.size} align="center">
                              {keyword("twitter_user_title")}
                              </TableCell>
                            <TableCell className={styles.size} align="center">
                              {keyword("twitter_user_name_13")}
                            </TableCell>
                            <TableCell align="center">
                              {keyword("twitter_user_name_5")}
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody
                          className={
                            styles.container
                          } /* class="fixed_headers" */
                        >
                          {verificationComments.map((comment, key) => {
                            //  console.log("comment ", comment)
                            //   console.log("key ", key)

                            return (
                              <TableRow key={key}>
                                <TableCell align="center" size="small">
                                  {comment.authorDisplayName}
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
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_first_page}
                    >                     
                      <SkipPreviousIcon/>
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_previous_page}
                    >
                      <NavigateBeforeIcon/>
                      {/*keyword("previous_button")*/}
                    </Button>
                    <div className={styles.inline}>
                    {"  "+ count_comments +"  "+keyword("page_number")+"  "+ last_page_all_comments+"  "}
                    </div>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_next_page}
                    >
                      <NavigateNextIcon/>                    
                      {/*keyword("next_button")*/}
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_last_page}
                    >                     
                      <SkipNextIcon/> 
                    </Button>
                  </Accordion>
                )}
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
                            
                            <TableCell className={styles.size} align="center">
                              {keyword("twitter_user_title")}
                            </TableCell>
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
                                
                                <TableCell align="center" scope="row" size="small">
                                  {comment.authorDisplayName}
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
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_first_page2}
                    >                     
                      <SkipPreviousIcon/>
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_previous_page2}
                    >  
                     <NavigateBeforeIcon/>                    
                      {/*keyword("previous_button")*/}
                    </Button>
                    <div className={styles.inline}>
                    {"  "+ count_verified_comments +"  "+keyword("page_number")+"  "+ last_page_verified_comments+"  "}
                    </div>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_next_page2}
                    >
                      <NavigateNextIcon/>                    
                      {/*keyword("next_button")*/}
                    </Button>
                    
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_last_page2}
                    >                     
                      <SkipNextIcon/> 
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
                          <TableCell className={styles.size} align="center">
                              {keyword("twitter_user_title")}
                            </TableCell>
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
                                <TableCell align="center" scope="row" size="small">
                                  {comment.authorDisplayName}
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
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_first_page1}
                    >                     
                      <SkipPreviousIcon/>
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_previous_page1}
                    >  
                     <NavigateBeforeIcon/>                    
                      {/*keyword("previous_button")*/}
                    </Button>
                    <div className={styles.inline}>
                    { "  "+ count_link_comments +"  "+keyword("page_number")+"  "+ last_page_link_comments+"  "}
                    </div>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_next_page1}
                    >
                      <NavigateNextIcon/>                    
                      {/*keyword("next_button")*/}
                    </Button>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color={"primary"}
                      className={classes.button}
                      onClick={handleClick_last_page1}
                    >                     
                      <SkipNextIcon/> 
                    </Button>
                  </Accordion>
                }


                




                
              </div>
              
            </div>
          </Card>
        )}
    </div>
  );
};
export default FacebookResults;