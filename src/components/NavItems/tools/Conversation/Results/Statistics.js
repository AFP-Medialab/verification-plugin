import React from "react";
import {useSelector} from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Grid from "@material-ui/core/Grid";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import {Box, Divider} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

//import Plot from 'react-plotly.js';
import Plotly from 'plotly.js-dist-min'

import createPlotlyComponent from 'react-plotly.js/factory';
import { ReactComponent as AboutIcon } from "../../../../NavBar/images/SVG/Navbar/About.svg"

const Plot = createPlotlyComponent(Plotly);

const TweetStatistics = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const tweet = useSelector(state => state.conversation.tweet);

    const stance = useSelector(state => state.conversation.stance)

    // convert the stance labels to whatever they are in the current language
    // TODO figure out why this needs the || protection, i.e. why does it get
    //      run multiple times causing the labels to get messed up?
    for (var i = 0 ; i < stance["labels"].length ; ++i) {
        stance["labels"][i] = keyword("stance_"+stance["labels"][i]) || stance["labels"][i];

        if (tweet.timeline) {
            tweet.timeline[i]["name"] = keyword("stance_"+tweet.timeline[i]["name"]) || tweet.timeline[i]["name"];
        }
            
    }

    let layout = {
        barmode: "stack",
        autosize:true,
        showlegend: true,
        xaxis: {
            range: tweet.range
        }
    }

    if (tweet.rangeSlider) {
       layout.xaxis.rangeslider = { }
    }

    return (
        <Box mt={3}>
        <Card>
                <CardHeader
                    title={keyword("section_statistics")}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>
        
        
        <Grid
                container
                direction="row"
                spacing={3}
                alignItems="flex-start">

<Grid item xs={4} >
                <Typography variant="h6"><Tooltip title={keyword("tooltip_piechart")}><AboutIcon style={{ fill: "black", height: "1.5em", width: "1.5em", verticalAlign:"text-bottom" }}/></Tooltip> {keyword("distribution_piechart")}</Typography>
                
                <Plot style= {{width:"100%"}} data={[stance]} layout={ { autosize:true, showlegend: false }} useResizeHandler={true} config = {{'displayModeBar': false}} />
                
                </Grid>
                <Divider orientation="vertical" flexItem variant="middle" style={{marginRight:"-1px", marginLeft:0}}/>
                <Grid item xs={8}>
                <Typography variant="h6"><Tooltip title={keyword("tooltip_histogram")}><AboutIcon style={{ fill: "black", height: "1.5em", width: "1.5em", verticalAlign:"text-bottom" }}/></Tooltip> {keyword("distribution_histogram")}</Typography>
                {tweet.timeline ?
                
                    <Plot style= {{width:"100%"}} data={tweet.timeline} layout={layout} useResizeHandler={true} config = {{'displayModeBar': false}} />
                
                    :
                    <Typography variant="body1">{keyword("summary_histogram_day")}</Typography>
                }
                </Grid>
        </Grid>
        </Box>
        </Card>
        </Box>
    )
}

export default TweetStatistics;