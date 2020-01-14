import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useCallback } from "react";
import { Paper } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Plot from "react-plotly.js";
import Box from "@material-ui/core/Box";
import CustomTable from "../../../../Shared/CustomTable/CustomTable";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinkIcon from '@material-ui/icons/Link';
import TwitterIcon from '@material-ui/icons/Twitter';
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import { cleanTwitterSnaState } from "../../../../../redux/actions/tools/twitterSnaActions";
import ReactWordcloud from "react-wordcloud";
import { select } from 'd3-selection';
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/TwitterSna.tsv";
import { saveSvgAsPng } from 'save-svg-as-png';
import { CSVLink } from "react-csv";
import Cytoscape from 'cytoscape';
import Fcose from 'cytoscape-fcose';

import CytoscapeComponent from 'react-cytoscapejs';

Cytoscape.use( Fcose );

export default function TwitterSnaResult(props) {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/TwitterSna.tsv", tsv);

    const dispatch = useDispatch();

    const [histoVisible, setHistoVisible] = useState(true);
    const [result, setResult] = useState(null);
    const [CSVheaders, setCSVheaders] = useState([{ label: keyword('sna_result_word'), key: "word" }, { label: keyword("sna_result_nb_occ"), key: "nb_occ" }, { label: keyword("sna_result_entity"), key: "entity" }]);
    const [filesNames, setfilesNames] = useState(null);

    const [histoTweets, setHistoTweets] = useState(null);
    const [cloudTweets, setCloudTweets] = useState(null);
    const [heatMapTweets, setheatMapTweets] = useState(null);
    const [pieCharts0, setPieCharts0] = useState(null);
    const [pieCharts1, setPieCharts1] = useState(null);
    const [pieCharts2, setPieCharts2] = useState(null);
    const [pieCharts3, setPieCharts3] = useState(null);
    const hidePieChartTweetsView = (index) => {
        switch (index) {
            case 0:
                setPieCharts0(null);
                break;
            case 1:
                setPieCharts1(null);
                break;
            case 2:
                setPieCharts2(null);
                break;
            case 3:
                setPieCharts3(null);
                break;
            default:
                break;
        }
    };
    const pieCharts = [pieCharts0, pieCharts1, pieCharts2, pieCharts3];

    //Set the file name for wordsCloud export
    useEffect(() => {
        setfilesNames('WordCloud_' + props.request.keywordList.join("&") + "_" + props.request.from + "_" + props.request.until);
    }, [JSON.stringify(props.request), props.request]);

    //Set result 
    useEffect(() => {

        setResult(props.result);


    }, [JSON.stringify(props.result), props.result]);

    //Initialize tweets arrays
    useEffect(() => {
        setHistoTweets(null);
        setCloudTweets(null);
        setheatMapTweets(null);
        setPieCharts0(null);
        setPieCharts1(null);
        setPieCharts2(null);
        setPieCharts3(null);
    }, [JSON.stringify(props.request), props.request])


    const displayTweetsOfWord = (word, callback) => {
        
        let columns = [
            { title: keyword('sna_result_username'), field: 'username' },
            { title: keyword('sna_result_date'), field: 'date' },
            { title: keyword('sna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
            { title: keyword('sna_result_retweet_nb'), field: 'retweetNb' },
            { title: keyword('sna_result_like_nb'), field: 'likeNb' }
        ];
        let csvArr = "data:text/csv;charset=utf-8,";

        
        // word = word.replace(/_/g, " ");
        let resData = [];
        csvArr += keyword('sna_result_username') + "," +
            keyword('sna_result_date') + "," +
            keyword('sna_result_tweet') + "," +
            keyword('sna_result_retweet_nb') + "," +
            keyword('sna_result_like_nb') + "," +
            keyword('elastic_url') + "\n";

        
        result.tweets.forEach(tweetObj => {
            
            if (tweetObj._source.tweet.toLowerCase().match(new RegExp('(^|((.)*[\.\(\)0-9\!\?\'\’\‘\"\:\,\/\\\%\>\<\«\»\ ^#]))' + word + '(([\.\(\)\!\?\'\’\‘\"\:\,\/\>\<\«\»\ ](.)*)|$)', "i"))) {

                
                var date = new Date(tweetObj._source.date);
                //let tweet = getTweetWithClickableLink(tweetObj._source.tweet,tweetObj._source.link);
                let tmpObj = {
                    username: tweetObj._source.username,
                    date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                    tweet: tweetObj._source.tweet,
                    retweetNb: tweetObj._source.nretweets,
                    likeNb: tweetObj._source.nlikes,
                    link: tweetObj._source.link
                };
                resData.push(tmpObj);
                csvArr += tweetObj._source.username + ',' +
                    date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ',"' +
                    tweetObj._source.tweet + '",' + tweetObj._source.nretweets + ',' + tweetObj._source.nlikes + ',' + tweetObj._source.link + '\n';
            }
        });
        let tmp = {
            data: resData,
            columns: columns,
            csvArr: csvArr,
            word: word
        };
        
        callback(tmp);
    }
    
    const downloadClick = (csvArr, name, histo) => {
        let encodedUri = encodeURI(csvArr);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tweets_" + props.request.keywordList.join('&') + '_' + name + ((!histo) ? (props.request.from + "_" + props.request.until) : "") + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function isInRange(pointDate, objDate, periode) {
      /* if (periode === "isHours")
            return ((((pointDate.getDate() === objDate.getDate()
                && (pointDate.getHours() >= objDate.getHours() -2 && pointDate.getHours() <= objDate.getHours() + 1)))
                || (pointDate.getDate() === objDate.getDate() + 1 && objDate.getHours() >= 23 && pointDate.getHours() <= 1))
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear());*/
                
        if (periode === "isDays")
        {
            return (pointDate.getDate() === objDate.getDate()
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear());
        }
       else if (periode === "isHours")
        {
            return (((pointDate.getDate() === objDate.getDate()
                && pointDate.getHours() -1 === objDate.getHours()))
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear());
        }     
        else 
        {
            return (((pointDate.getDate() === objDate.getDate()
                && pointDate.getHours() -2 === objDate.getHours()))
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear());
        }

    }

    const displayTweetsOfDate = (data, fromHisto) => {
        let columns = [
            { title: keyword('sna_result_username'), field: 'username' },
            { title: keyword('sna_result_date'), field: 'date' },
            { title: keyword('sna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
            { title: keyword('sna_result_retweet_nb'), field: 'retweetNb' },
        ];

        let resData = [];
        let minDate;
        let maxDate;
        let csvArr = "data:text/csv;charset=utf-8," + keyword("sna_result_username") + "," + keyword("sna_result_date") + "," + keyword("sna_result_tweet") + "," + keyword("sna_result_retweet_nb") + "," + keyword("elastic_url") + "\n";
        let isDays = (((new Date(props.request.until) - new Date(props.request.from)) / (1000 * 3600 * 24)) < 14)? "isHoursb":"isDays";
        if (data.points[0].data.x[1] === undefined) {isDays = "isHoursb"}
        if (!fromHisto) {isDays = "isHours"}

            let pointDate = new Date(fromHisto? data.points[0].x : (data.points[0].x + ' ' + data.points[0].y));

            result.tweets.forEach(tweetObj => {
             //   if (tweetObj._source.username === data.points[0].data.name || !fromHisto) {

                    let objDate = new Date(tweetObj._source.date);
                    if (isInRange(pointDate, objDate, isDays)) {
                        if (minDate === undefined)
                            minDate = objDate;
                        if (maxDate === undefined)
                            maxDate = objDate;
                        let date = new Date(tweetObj._source.date);
                        resData.push(
                            {
                                username: <a href={"https://twitter.com/" + tweetObj._source.username}
                                    target="_blank">{tweetObj._source.username}</a>,
                                date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                                tweet: tweetObj._source.tweet,
                                retweetNb: tweetObj._source.nretweets,
                                link: tweetObj._source.link
                            }
                        );
                        csvArr += tweetObj._source.username + ',' +
                            date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' +
                            tweetObj._source.tweet + '",' + tweetObj._source.nretweets + "," + tweetObj._source.link + '\n';


                        if (minDate > objDate) {
                            minDate = objDate
                        }
                        if (maxDate < objDate) {
                            maxDate = objDate;
                        }
                    }
             //  }
            });
         //  i++;
      //  });
        return {
            data: resData,
            columns: columns,
            csvArr: csvArr,
        };
    };

    const onHistogramClick = (data) => {
        setHistoTweets(displayTweetsOfDate(data, true));
    }

    const onHeatMapClick = (data) => {
        let truc = displayTweetsOfDate(data, false);
        setheatMapTweets(truc);
    }

    const getTweetWithClickableLink = (cellData) => {
        let urls = cellData.tweet.match(/((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?|pic\.twitter\.com\/([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g);
        if (urls === null)
            return cellData.tweet;

        let tweetText = cellData.tweet.split(urls[0]);
        let element = <div>{tweetText[0]} <a href={urls[0]} target="_blank">{urls[0]}</a>{tweetText[1]}</div>;
        return element;
    }



    //        tweet += '<div align="right"><a href="' + link + '" target="_blank" ><img src="img/twitter_logo.png" style="height: 40px"/></a></div>';
    // return tweet;
    //}

   

    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("sna_result_go_to_tweet"),
        onClick: (event, rowData) => {
            window.open(rowData.link, '_blank');
        }
    }]

    const onPieChartClick = (data, nbType, index) => {

        if (index === 3) {
            // window.open("https://twitter.com/search?q=" + data.points[0].label.replace('#', "%23"), '_blank');
            displayTweetsOfWord(data.points[0].label, setPieCharts3);
            return;
        }


        let columns = [
            { title: keyword('sna_result_date'), field: 'date' },
            { title: keyword('sna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
        ];
        let csvArr = "data:text/csv;charset=utf-8," + keyword('sna_result_date') + "," + keyword('sna_result_tweet');
        if (nbType !== "retweets_cloud_chart_title") {
            columns.push({
                title: keyword('sna_result_like_nb'),
                field: "nbLikes"
            });
            csvArr += ',' + keyword('sna_result_like_nb');
        }
        if (nbType !== "likes_cloud_chart_title") {
            columns.push({
                title: keyword('sna_result_retweet_nb'),
                field: "nbReteets"
            });
            csvArr += ',' + keyword('sna_result_retweet_nb');
        }
        csvArr += ',' + keyword('elastic_url') + "\n";

        let resData = [];
        result.tweets.forEach(tweetObj => {
            if (tweetObj._source.username === data.points[0].label) {
                let date = new Date(tweetObj._source.date);
                let tmpObj = {
                    date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                    tweet: tweetObj._source.tweet,
                    link: tweetObj._source.link
                };
                csvArr += date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' + tweetObj._source.tweet + '",';

                if (nbType !== "retweets_cloud_chart_title") {
                    tmpObj.nbLikes = tweetObj._source.nlikes;
                    csvArr += tmpObj.nbLikes;
                }
                if (nbType !== "likes_cloud_chart_title") {
                    tmpObj.nbReteets = tweetObj._source.nretweets;
                    csvArr += tmpObj.nbReteets;
                }
                csvArr += ',' + tmpObj.link + '\n';
                resData.push(tmpObj);
            }
        });

        
        let newRes = {
            data: resData,
            columns: columns,
            csvArr: csvArr,
            username: data.points[0].label
        };

        switch (index) {
            case 0:
                setPieCharts0(newRes);
                break;
            case 1:
                setPieCharts1(newRes);
                break;
            case 2:
                setPieCharts2(newRes);
                break;
            case 3:
                setPieCharts3(newRes);
                break;
            default:
                break;

        }

    };

    const getCallback = useCallback((callback) => {

        return function (word, event) {
            
            const isActive = callback !== "onWordMouseOut";
            const element = event.target;
            const text = select(element);
            text
                .on("click", () => {
                    if (isActive) {
                        
                        displayTweetsOfWord(word.text, setCloudTweets)
                    }
                })
                .transition()
                .attr("background", "white")
                .attr("text-decoration", isActive ? "underline" : "none");
        };
    }, [JSON.stringify(result)]);

    const tooltip = word => {
        if (word.entity !== null)
            return "The word " + word.text + " appears " + word.value + " times" + " and is a " + word.entity + ".";
        else
            return "The word " + word.text + " appears " + word.value + " times" + ".";
    }

    const getCallbacks = () => {
        return {
            getWordColor: word => word.color,
            getWordTooltip: word =>
                tooltip(word),
            onWordClick: getCallback("onWordClick"),
            onWordMouseOut: getCallback("onWordMouseOut"),
            onWordMouseOver: getCallback("onWordMouseOver")
        }
    };

    //Download as PNG
    function downloadAsPNG() {
        let svg = document.getElementById("top_words_cloud_chart");
        let name = filesNames + '.png';
        
        
        saveSvgAsPng(svg.children[1].children[0].children[0], name, { backgroundColor: "white" });


    }

    //Download as SVG
    function downloadAsSVG() {

        let name = filesNames + '.svg';
        var svgEl = document.getElementById("top_words_cloud_chart").children[1].children[0].children[0];
        //  d3.select("#we-verify").attr("style", "font-size: 20px;");
        svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        var svgData = svgEl.outerHTML;
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = name;
        downloadLink.click();

        //  d3.select("#we-verify").attr("style", "display: none");
    }

    function getCSVData() {
        if (!props.result.cloudChart)
            return "";
        let csvData = props.result.cloudChart.json.map(wordObj => { return { word: wordObj.text, nb_occ: wordObj.value, entity: wordObj.entity } });
        return csvData;
    }


    if (result === null)
        return <div />;


    
    
    const elements = [
        { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
        { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } }
        ];
        
         const edges = [ { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }]
    const layout = { name: 'random' };
    

    let call = getCallbacks();
    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
            {
                result.histogram &&
                <ExpansionPanel expanded={histoVisible} onChange={() => setHistoVisible(!histoVisible)}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading}>{keyword(result.histogram.title)}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {}
                        <div style={{ width: '100%', }}>
                            { ((result.histogram.json.length === 0) &&
                                 <Typography variant={"body2"}>{keyword("sna_no_data")}</Typography>) }
                                 {(result.histogram.json.length !== 0) &&
                            <Plot useResizeHandler
                                style={{ width: '100%', height: "450px" }}
                                data={result.histogram.json}
                                layout={result.histogram.layout}
                                config={result.histogram.config}
                                onClick={(e) => onHistogramClick(e)}
                                onPurge={(a, b) => {
                                    console.log(a);
                                    console.log(b);
                                }}
                            />
}
                            <Box m={2} />
                            {
                                histoTweets &&
                                <div>
                                    <Grid container justify="space-between" spacing={2}
                                        alignContent={"center"}>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"secondary"}
                                                onClick={() => setHistoTweets(null)}
                                            >
                                                {
                                                    keyword('sna_result_hide')
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => downloadClick(histoTweets.csvArr, histoTweets.data[0].date.split(' ')[0], true)}>
                                                {
                                                    keyword('sna_result_download')
                                                }
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box m={2} />
                                    <CustomTable
                                        title={keyword("sna_result_slected_tweets")}
                                        colums={histoTweets.columns}
                                        data={histoTweets.data}
                                        actions={goToTweetAction}
                                    />
                                </div>
                                            
                            }
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }

            {
                result && result.tweetCount &&
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading} >{keyword("tweetCounter_title")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Box alignItems="center" justifyContent="center" width={"100%"}>
                            <Grid container justify="space-around" spacing={2}
                                alignContent={"center"}>
                                <Grid item>
                                    <Typography variant={"h6"}>Tweets</Typography>
                                    <Typography variant={"h2"}>{result.tweetCount.count}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"h6"}>Retweets</Typography>
                                    <Typography variant={"h2"}>{result.tweetCount.retweet}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"h6"}>Likes</Typography>
                                    <Typography variant={"h2"}>{result.tweetCount.like}</Typography>
                                </Grid>
                            </Grid>

                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }
                 {
                result.heatMap &&
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography className={classes.heading}>{keyword('sna_result_heatMap')}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Box alignItems="center" justifyContent="center" width={"100%"}>
                                    { 
                                        ((result.heatMap.isAllnul) &&
                                        <Typography variant={"body2"}>{keyword("sna_no_data")}</Typography>) ||

                                        <Plot
                                         style={{ width: '100%', height: "450px" }}
                                         data={result.heatMap.plot}
                                         config={result.histogram.config}
                                         onClick={(e) => onHeatMapClick(e)}
                                        />
                                    }
                                        {
                                            heatMapTweets &&
                                            <div>
                                                <Grid container justify="space-between" spacing={2}
                                                    alignContent={"center"}>
                                                    <Grid item>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"secondary"}
                                                            onClick={() => setheatMapTweets(null)}>
                                                            {
                                                                keyword('sna_result_hide')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"primary"}
                                                            onClick={() => downloadClick(heatMapTweets.csvArr, "NAME OF FILE")}>
                                                            {
                                                                keyword('sna_result_download')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <Box m={2} />
                                                <CustomTable title={keyword("sna_result_slected_tweets")}
                                                    colums={heatMapTweets.columns}
                                                    data={heatMapTweets.data}
                                                    actions={goToTweetAction}
                                                />
                                            </div>
                                        }
                                    </Box>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        
                }
            {
                result.pieCharts &&
                result.pieCharts.map((obj, index) => {
                    if ((props.request.userList.length === 0 || index === 3))
                        return (
                            <ExpansionPanel key={index}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={"panel" + index + "a-content"}
                                    id={"panel" + index + "a-header"}
                                >
                                    <Typography className={classes.heading}>{keyword(obj.title)}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Box alignItems="center" justifyContent="center" width={"100%"}>
                                    { 
                                    ((obj.json === null) &&
                                    <Typography variant={"body2"}>{keyword("sna_no_data")}</Typography>)}
                                        {(obj.json !== null) &&
                                        <Plot
                                            data={obj.json}
                                            layout={obj.layout}
                                            config={obj.config}
                                            onClick={e => {
                                                onPieChartClick(e, obj.title, index)
                                            }}
                                        />
                                        }
                                        {
                                            pieCharts[index] &&
                                            <div>
                                                <Grid container justify="space-between" spacing={2}
                                                    alignContent={"center"}>
                                                    <Grid item>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"secondary"}
                                                            onClick={() => hidePieChartTweetsView(index)}>
                                                            {
                                                                keyword('sna_result_hide')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"primary"}
                                                            onClick={() => downloadClick(pieCharts[index].csvArr, (index < 3) ? pieCharts[index].username : pieCharts3.word)}>
                                                            {
                                                                keyword('sna_result_download')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <Box m={2} />
                                                <CustomTable title={keyword("sna_result_slected_tweets")}
                                                    colums={pieCharts[index].columns}
                                                    data={pieCharts[index].data}
                                                    actions={goToTweetAction}
                                                />
                                            </div>
                                        }
                                    </Box>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )
                })
            }
            {
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading}>{"Graph ADD TSV"}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    <Box>
                        <div>
                        <CytoscapeComponent elements={CytoscapeComponent.normalizeElements({
                            nodes: elements, edges: edges})} layout={layout} style={ { width: '600px', height: '600px' } } />
                        </div>
                    </Box>
                    </ExpansionPanelDetails>

                </ExpansionPanel>
            }
            {
                result && result.cloudChart &&
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading}>{keyword(result.cloudChart.title)}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Box alignItems="center" justifyContent="center" width={"100%"}>
                            <div id="top_words_cloud_chart" height={"500"} width={"100%"} >
                            { 
                                    (console.log(result.cloudChart) || (result.cloudChart.json.length === 0) &&
                                    <Typography variant={"body2"}>{keyword("sna_no_data")}</Typography>)}
                                        {(result.cloudChart.json.length !== 0) &&
                                <Grid container justify="space-between" spacing={2}
                                    alignContent={"center"}>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadAsPNG()}>
                                            {
                                                keyword('sna_result_download_png')
                                            }
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <CSVLink
                                            data={getCSVData()} headers={CSVheaders} filename={filesNames + ".csv"} className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                            {
                                                "CSV"
                                                // keyword('sna_result_download_csv')
                                            }
                                        </CSVLink>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadAsSVG()}>
                                            {
                                                keyword('sna_result_download_svg')
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                                }
                                {
                                    (result.cloudChart.json.length !== 0) &&
                                    <div height={"300%"} width={"100%"}>
                                        <ReactWordcloud key={JSON.stringify(result)} options={result.cloudChart.options} callbacks={call} words={result.cloudChart.json} />
                                    </div>
                                   
                                }

                            </div>
                            <Box m={2} />
                            {
                                cloudTweets &&
                                <div>
                                    <Grid container justify="space-between" spacing={2}
                                        alignContent={"center"}>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"secondary"}
                                                onClick={() => setCloudTweets(null)}
                                            >
                                                {
                                                    keyword('sna_result_hide')
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => downloadClick(cloudTweets.csvArr, cloudTweets.word)}>
                                                {
                                                    keyword('sna_result_download')
                                                }
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box m={2} />
                                    <CustomTable
                                        title={keyword("sna_result_slected_tweets")}
                                        colums={cloudTweets.columns}
                                        data={cloudTweets.data}
                                        actions={goToTweetAction}
                                    />
                                </div>
                            }
                        </Box>
                    </ExpansionPanelDetails>

                </ExpansionPanel>
            }
            <Box m={3} />
            {
                result.urls &&
                <CustomTable
                    title={keyword("sna_result_url_in_tweets")}
                    colums={result.urls.columns}
                    data={result.urls.data}
                    actions={[
                        {
                            icon: LinkIcon,
                            tooltip: keyword("sna_result_go_to"),
                            onClick: (event, rowData) => {
                                window.open(rowData.url, '_blank');
                            }
                        }
                    ]}
                />
            }
        </Paper>
    );
};