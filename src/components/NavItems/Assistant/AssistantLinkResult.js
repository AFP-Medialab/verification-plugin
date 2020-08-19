import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import LinkIcon from "@material-ui/icons/Link";
import List from "@material-ui/core/List";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";


import tsv from "../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import useSourceCredibilityApi from "./useSourceCredibilityApi";

const AssistantLinkResult = (props) => {

    const classes = useMyStyles();
    const dispatch = useDispatch()
    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);

    const linkList = props.linkList
    const title = props.title
    const byline = props.byline
    const existingResult = props.existingResult
    const storageMethod = props.storageMethod

    const sourceCredibilityApi = useSourceCredibilityApi()
    const [inProgress, setInProgress] = useState(false);
    const [jsonResult, setJsonResult] = useState(null);
    const [noResultsFound, setNoResultsFound] = useState(false);


    if ((existingResult === null && jsonResult === null && !inProgress)) {
        setInProgress(true)
        sourceCredibilityApi.callSourceCredibility(linkList).then(result => {
            if(result.entities.DomainCredibility === undefined){
                setNoResultsFound(true)
            }
            setJsonResult(result)
            setInProgress(false)
            dispatch(storageMethod(JSON.stringify(result)))
        })
    }

    useEffect(()=>{
        if (existingResult!=null) {
            let existingJson = JSON.parse(existingResult)
            if(existingJson.entities.DomainCredibility === undefined){
                setNoResultsFound(true)
            }
            setJsonResult(existingJson)
        }
    }, [existingResult])


    return (
        !noResultsFound ?
            <Grid item xs={12}>
            <Card>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.twitterHeading}>
                            <CheckCircleOutlineIcon className={classes.twitterIcon}/>{title}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align={"right"}>
                        <Tooltip title= {<div className={"content"} dangerouslySetInnerHTML={{__html: keyword("link_tooltip")}}></div> }
                            classes={{ tooltip: classes.assistantTooltip }}>
                            <HelpOutlineOutlinedIcon className={classes.toolTipIcon}/>
                        </Tooltip>
                    </Grid>
                </Grid>
                {inProgress ? <LinearProgress variant={"indeterminate"}/> : null}

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography className={classes.heading}>{byline}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {jsonResult != null ?
                        <GridList cellHeight={'auto'} className={classes.gridList} cols={1} align={"left"}>
                            {jsonResult.entities.URL.map((value, key) => (
                                <GridListTile key={key} cols={1}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                            <Grid item xs={6}>
                                                <LinkIcon className={classes.twitterIcon}/>
                                                <Link variant="body2">{value.url}</Link>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align={"right"} style={{ color: value["credibility-color"] }}>
                                                    {value["credibility-score"] ? value["credibility-score"] : "Unknown"}
                                                </Typography>
                                            </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <GridList cellHeight={'auto'} className={classes.gridList} cols={1} align={"left"}>
                                                <List>
                                                {jsonResult.entities.DomainCredibility
                                                    .filter(domain => domain["credibility-domain"] === value["credibility-domain"])
                                                    .map((value, key) => (
                                                        <ListItem key={key}>
                                                            <Grid item xs={6}>
                                                                <Typography>
                                                                    {value["credibility-source"]}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Typography align={"right"}>
                                                                    {value["credibility-score"]}
                                                                </Typography>
                                                            </Grid>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </GridList>
                                        </AccordionDetails>
                                    </Accordion>
                                </GridListTile>
                            ))}
                        </GridList> : null}
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Grid> : null
    )
}
export default AssistantLinkResult;

