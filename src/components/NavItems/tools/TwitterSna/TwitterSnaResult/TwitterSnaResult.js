import useMyStyles from "../../../../utility/MaterialUiStyles/useMyStyles";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Paper} from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Plot from "react-plotly.js";
import Box from "@material-ui/core/Box";
import CustomTable from "../../../../utility/CustomTable/CustomTable";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinkIcon from '@material-ui/icons/Link';
import CloseResult from "../../../../CloseResult/CloseResult";
import {cleanThumbnailsState} from "../../../../../redux/actions/tools/thumbnailsActions";
import {cleanTwitterSnaState} from "../../../../../redux/actions/tools/twitterSnaActions";

export default function TwitterSnaResult(props) {

    const classes = useMyStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    const dispatch = useDispatch();

    const [histoVisible, setHistoVisible] = useState(true);
    const [histoTweetsVisible, setHistoTweetsVisible] = useState(true);

    const [result, setResult] = useState(null);

    const [histoTweets, setHistoTweets] = useState(null);
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

    useEffect(() => {
        return () => {setResult(null) };
    }, []);

    useEffect(() => {
        console.log("was");
        console.log(result);
        if (result === null) {
            setResult(props.result);
            console.log("will set to");
            console.log(props.result);
        }
    }, [JSON.stringify(props.result)]);

    if (result === null)
        return <div/>;

    const downloadClick = (csvArr) => {
        let encodedUri = encodeURI(csvArr);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tweets.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function isInRange(pointDate, objDate, isDays) {
        if (!isDays)
            return ((((pointDate.getDate() === objDate.getDate()
                && (pointDate.getHours() >= objDate.getHours() - 2 && pointDate.getHours() <= objDate.getHours() + 2)))
                || (pointDate.getDate() === objDate.getDate() + 1 && objDate.getHours() >= 22 && pointDate.getHours() <= 2))
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear());
        else
            return (pointDate.getDate() === objDate.getDate()
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear());
    }

    const onHistogramClick = (data) => {
        let columns = [
            {title: 'Username (add tsv)', field: 'username'},
            {title: 'Date (add tsv)', field: 'date'},
            {title: 'Tweet (add tsv)', field: 'tweet'},
            {title: 'Nb of retweets (add tsv)', field: 'retweetNb'},
        ];

        let resData = [];
        let minDate;
        let maxDate;
        let csvArr = "data:text/csv;charset=utf-8,Username,Date,Tweet,Nb of retweets\n";
        let isDays = (((new Date(data.points[0].data.x[0])).getDate() - (new Date(data.points[0].data.x[1])).getDate()) !== 0);
        let i = 0;
        data.points.forEach(point => {
            let pointDate = new Date(point.x);
            result.tweets.forEach(tweetObj => {
                if (tweetObj._source.username === point.data.name) {
                    let objDate = new Date(tweetObj._source.date);
                    if (isInRange(pointDate, objDate, isDays)) {
                        if (minDate === undefined)
                            minDate = objDate;
                        if (maxDate === undefined)
                            maxDate = objDate;
                        let date = new Date(tweetObj._source.date);
                        resData.push(
                            {
                                username: <a href={"https://twitter.com/" + point.data.name}
                                             target="_blank">{point.data.name}</a>,
                                date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                                tweet: tweetObj._source.tweet,
                                retweetNb: tweetObj._source.nretweets,
                            }
                        );

                        if (minDate > objDate) {
                            minDate = objDate
                        }
                        if (maxDate < objDate) {
                            maxDate = objDate;
                        }
                    }
                }
            });
            i++;
        });
        setHistoTweets({
            data: resData,
            columns: columns,
            csvArr: csvArr,
        });
    };

    const onPieChartClick = (data, nbType, index) => {
        if (index === 3) {
            window.open("https://twitter.com/search?q=" + data.points[0].label.replace('#', "%23"), '_blank');
            return;
        }

        let columns = [
            {title: 'Date (add tsv)', field: 'date'},
            {title: 'Tweet (add tsv)', field: 'tweet'},
        ];
        let csvArr = "data:text/csv;charset=utf-8,Date,Tweet";
        if (nbType !== "retweets_cloud_chart_title") {
            columns.push({
                title: "Nb of likes (add tsv)",
                field: "nbLikes"
            });
            csvArr += ',Nb of likes';
        }
        if (nbType !== "likes_cloud_chart_title") {
            columns.push({
                title: "Nb of retweets (add tsv)",
                field: "nbReteets"
            });
            csvArr += ',Nb of retweets';
        }
        csvArr += "\n";

        let resData = [];
        result.tweets.forEach(tweetObj => {
            if (tweetObj._source.username === data.points[0].label) {
                let date = new Date(tweetObj._source.date);
                let tmpObj = {
                    date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                    tweet: tweetObj._source.tweet,
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
                csvArr += '\n';
                resData.push(tmpObj);
            }
        });

        let newRes = {
            data: resData,
            columns: columns,
            csvArr: csvArr
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

    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanTwitterSnaState())}/>
            <ExpansionPanel expanded={histoVisible} onChange={() => setHistoVisible(!histoVisible)}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={"panel0a-content"}
                    id={"panel0a-header"}
                >
                    <Typography className={classes.heading}>{keyword(result.histogram.title)}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div style={{width: '100%',}}>
                        <Plot useResizeHandler
                              style={{width: '100%', height: "450px"}}
                              data={result.histogram.json}
                              layout={result.histogram.layout}
                              config={result.histogram.config}
                              onClick={(e) => onHistogramClick(e)}
                              onPurge={(a,b) => {
                                  console.log(a);
                                  console.log(b);
                              }}
                        />
                        <Box m={2}/>
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
                                            Hide (add tsv)
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadClick(histoTweets.csvArr)}>
                                            Download (add tsv)
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Box m={2}/>
                                <Box hidden={!histoTweetsVisible}>
                                    <CustomTable title={"Selected Tweets (add tsv)"}
                                                 colums={histoTweets.columns}
                                                 data={histoTweets.data}/>
                                    actions={[]}
                                </Box>
                            </div>
                        }
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={"panel0a-content"}
                    id={"panel0a-header"}
                >
                    <Typography className={classes.heading}>{keyword("tweetCounter_title")}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Box alignItems="center" justifyContent="center" width={"100%"}>
                        <Typography variant={"h3"}>{result.tweetCount}</Typography>
                    </Box>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            {
                result.pieCharts &&
                result.pieCharts.map((obj, index) => {
                    return (
                        <ExpansionPanel key={index}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls={"panel" + index + "a-content"}
                                id={"panel" + index + "a-header"}
                            >
                                <Typography className={classes.heading}>{keyword(obj.title)}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Box alignItems="center" justifyContent="center" width={"100%"}>
                                    <Plot
                                        data={obj.json}
                                        layout={obj.layout}
                                        config={obj.config}
                                        onClick={e => {
                                            onPieChartClick(e, obj.title, index)
                                        }}
                                    />
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
                                                        Hide (add tsv)
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={() => downloadClick(pieCharts[index].csvArr)}>
                                                        Download (add tsv)
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                            <Box m={2}/>

                                            <Box hidden={!histoTweetsVisible}>
                                                <CustomTable title={"Selected Tweets (add tsv)"}
                                                             colums={pieCharts[index].columns}
                                                             data={pieCharts[index].data}
                                                             ations={pieCharts[index].actions}
                                                />
                                            </Box>
                                        </div>
                                    }
                                </Box>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    )
                })
            }
            <Box m={3}/>
            <CustomTable
                title={"Linked Url (add tsv)"}
                colums={result.urls.columns}
                data={result.urls.data}
                actions={[
                    {
                        icon: LinkIcon,
                        tooltip: 'Go to url (add tsv)',
                        onClick: (event, rowData) => {
                            window.open(rowData.url, '_blank');
                        }
                    }
                ]}
            />
        </Paper>
    );
};