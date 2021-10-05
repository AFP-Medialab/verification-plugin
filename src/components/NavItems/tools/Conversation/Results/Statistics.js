import React from "react";
import {useSelector} from "react-redux";
import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import Grid from "@material-ui/core/Grid";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

import {Box} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";

import Typography from "@material-ui/core/Typography";

import Plot from 'react-plotly.js';


import { ReactComponent as AboutIcon } from "../../../../NavBar/images/SVG/Navbar/About.svg"

const TweetStatistics = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);

    const tweet = useSelector(state => state.conversation.tweet);

    const stance = useSelector(state => state.conversation.stance)

    // convert the stance labels to whatever they are in the current language
    for (var i = 0 ; i < stance["labels"].length ; ++i) {
        stance["labels"][i] = keyword("stance_"+stance["labels"][i]);

        if (tweet.timeline)
            tweet.timeline[i]["name"] = keyword("stance_"+tweet.timeline[i]["name"]);
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

<Grid item xs={4} style={{borderRight: "1px solid silver"}}>
                <Typography variant="h6"><AboutIcon style={{ fill: "black", height: "1.5em", width: "1.5em", verticalAlign:"text-bottom" }}/> {keyword("distribution_piechart")}</Typography>
                
                <Plot style= {{width:"100%"}} data={[stance]} layout={ { autosize:true, showlegend: false }} useResizeHandler={true} config = {{'displayModeBar': false}} />
                
                </Grid>
                <Grid item xs={8}>
                <Typography variant="h6"><AboutIcon style={{ fill: "black", height: "1.5em", width: "1.5em", verticalAlign:"text-bottom" }}/> {keyword("distribution_histogram")}</Typography>
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