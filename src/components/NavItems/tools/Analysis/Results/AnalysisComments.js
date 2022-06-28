import React, { useState } from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Linkify from 'react-linkify';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Typography from "@material-ui/core/Typography";
import styles from "./layout.module.css"
import { TextCopy } from "../../../../Shared/Utils/TextCopy";
import { Translate } from "../../../../Shared/Utils/Transalate";

const CommentsPanel = (props) => {

  const [count_comments, setCount_comments] = useState(1);
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
  };
  
  const classes = props.classes;
  const keyword = props.keyword;
  var nextPage = props.report.pagination.next;
  var totalPage = Math.ceil(props.nb_comments/10)
  const url = useState(nextPage);
  var last_page_all_comments;
  if(props.nb_comments!==0){
    last_page_all_comments=totalPage
  }
  else{
    last_page_all_comments=1
  }
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
  var next_page_comments=url[0].substring(0, real+1)+(count_comments+1)+"&type="+props.com_type
  var previous_page_comments=url[0].substring(0, real+1)+(count_comments-1)+"&type="+props.com_type
  var last_page_all_comments1=url[0].substring(0, real+1)+(last_page_all_comments)+"&type="+props.com_type
  var first_page_all_comments1=url[0].substring(0, real+1)+(1)+"&type="+props.com_type

  const handleClick_first_page = (event) => {
    if(count_comments!==1){
      
      axios.get("https://mever.iti.gr" + first_page_all_comments1).then((response) => {
        setCount_comments(1);
        dispatch(props.setCommentsAction(response.data));
        
      })
      .catch(err => {
      
      })
    }
  };
  const handleClick_last_page = (event) => {
    if(count_comments!==last_page_all_comments){
    
    
      axios.get("https://mever.iti.gr" + last_page_all_comments1).then((response) => {
        setCount_comments(last_page_all_comments);
        dispatch(props.setCommentsAction(response.data));
      })
      .catch(err => {
      
      })
    }
  };
  const handleClick_next_page = (event) => {
    if(count_comments!==last_page_all_comments){
      axios.get("https://mever.iti.gr" + next_page_comments).then((response) => {
        if(!response.data.error){
          setCount_comments(count_comments + 1);
          dispatch(props.setCommentsAction(response.data));
        }
      })
      .catch(err => {
      
      })
    };
  };

  const handleClick_previous_page = (event) => {
      if(count_comments>1){
      setCount_comments(count_comments - 1);
      axios.get("https://mever.iti.gr" + previous_page_comments).then((response) => {
        if(!response.data.error){
          dispatch(props.setCommentsAction(response.data));
        }
      })
      .catch(err => {
      
      })
  };
  };
  const dispatch = useDispatch();

    return (
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
        >
            <Typography className={classes.heading}>{keyword(props.title)+" ("+props.nb_comments+")"}</Typography>
            <Typography className={classes.secondaryHeading}> </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                  <TableRow>
                      <TableCell align="center">{keyword("user")}</TableCell>
                      <TableCell
                          className={styles.size} align="center">{keyword("twitter_user_name_13")}</TableCell>
                      <TableCell
                          align="center">{keyword("twitter_user_name_5")}</TableCell>
                      <TableCell/>
                  </TableRow>
              </TableHead>
              <TableBody className={
                  styles.container
              }>
                  {
                      props.commentsData.map((comment, key) => {
                          return (
                              <TableRow key={key}>
                                  <TableCell component="th" scope="row">
                                  {
                                  comment["authorURL"] ?
                                      <a href={comment["authorURL"]}
                                      rel="noopener noreferrer"
                                      target="_blank">{comment["authorDisplayName"]}</a>
                                      :
                                      comment["authorDisplayName"]
                                      }
                                  </TableCell>
                                  <TableCell
                                      align="center">{comment["publishedAt"]}
                                  </TableCell>
                                  <TableCell
                                      align="left"><Linkify 
                                      componentDecorator={(decoratedHref, decoratedText, key) => (
                                        <a target="blank" href={decoratedHref} key={key}>
                                            {decoratedText}
                                        </a>
                                        )}
        
                                      >{comment.textDisplay}</Linkify>
                                  </TableCell>
                                  <TableCell>
                                    <TextCopy text={comment.textDisplay} index={key} />
                                    <Translate text={comment.textDisplay} />
                                  </TableCell>
                              </TableRow>);
                      })
                  }
              </TableBody>
          </Table>
      </AccordionDetails>
      {totalPage > 1 &&
      <>
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
      </> 
    }
  </Accordion> 
    )
}

const AnalysisComments = (props) => {
    const keyword = props.keyword;
    const report = props.report;
    const verificationComments = report.comments ? report.comments : [];
    const linkComments = report.link_comments ? report.link_comments : [];
    const verifiedComments = report.verification_comments ? report.verification_comments : [];
    return (
      (verificationComments.length >= 1 || verifiedComments.length >= 1 || linkComments.length >= 1) &&
        <div>
            <Box m={4}/>
            <Typography variant={"h6"}>
                {keyword(props.title)}
            </Typography>
            
            <Box m={2}/>
            {
                verificationComments.length >= 1 &&
                <CommentsPanel 
                  title={props.type === "TWITTER" ? "twitter_reply" : "api_comments"}
                  classes={props.classes}
                  keyword={keyword}
                  report={props.report}
                  nb_comments={props.report.pagination.total_comments}
                  setCommentsAction={props.setAnalysisComments}
                  commentsData={verificationComments}
                  com_type={"coms"}
                  />                    
             }
            <Box m={2} />
            {
              verifiedComments.length >= 1 &&
               <CommentsPanel 
                title={props.type === "TWITTER" ?"twitter_reply_verified" : "api_comments_verified"}
                classes={props.classes}
                keyword={keyword}
                report={props.report}
                nb_comments={props.report.verification_cues.num_verification_comments}
                setCommentsAction={props.setAnalysisVerifiedComments}
                commentsData={verifiedComments} 
                com_type={"vercoms"} />
                
            }
            <Box m={2} />
            {
              linkComments.length >= 1 &&
              <CommentsPanel 
                title={props.type === "TWITTER" ? "twitter_reply_link" : "link_comments"}
                classes={props.classes}
                keyword={keyword}
                report={props.report}
                nb_comments={props.report.verification_cues.num_link_comments}
                setCommentsAction={props.setAnalysisLinkComments}
                commentsData={linkComments} 
                com_type={"linkcoms"} />
            }
    </div>)
}
export default AnalysisComments