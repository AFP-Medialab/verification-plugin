import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
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
import CustomTableURL from "../../../../Shared/CustomTable/CustomTableURL";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LinkIcon from '@material-ui/icons/Link';
import TwitterIcon from '@material-ui/icons/Twitter';
import SaveIcon from '@material-ui/icons/Save';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import Toolbar from "@material-ui/core/Toolbar";
import { TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import { cleanTwitterSnaState } from "../../../../../redux/actions/tools/twitterSnaActions";
import ReactWordcloud from "react-wordcloud";
import { select } from 'd3-selection';
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/TwitterSna.tsv";
import gexfFile from "../GexfFiles/graph-3872654592156710875.gexf";
import { saveSvgAsPng } from 'save-svg-as-png';
import { CSVLink } from "react-csv";
import Cytoscape from 'cytoscape';
import Fcose from 'cytoscape-fcose';
import { Sigma, RandomizeNodePositions, ForceAtlas2, SigmaEnableWebGL, LoadGEXF, RelativeSize } from 'react-sigma';
import Plotly from 'plotly.js-dist';
import RefreshGraph from './RefreshGraph';
import TwitterInfoMap from "./TwitterInfoMap";
import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
Cytoscape.use(Fcose);

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
    const [pieCharts4, setPieCharts4] = useState(null);
    const [userGraphReset, setUserGraphReset] = useState(null);
    const [userGraphClickNode, setUserGraphClickNode] = useState(null);
    const [userGraphTweets, setUserGraphTweets] = useState(null);
    const [userGraphInteraction, setUserGraphInteraction] = useState(null);
    const [coHashtagGraphTweets, setCoHashtagGraphTweets] = useState(null);

    const hideTweetsView = (index) => {
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
            case 4:
                setPieCharts4(null);
                break;
            case "userGraphIdx":
                setUserGraphTweets(null);
                break;
            case "coHashtagGraphIdx":
                setCoHashtagGraphTweets(null);
                break;
            default:
                break;
        }
    };

    const pieCharts = [pieCharts0, pieCharts1, pieCharts2, pieCharts3, pieCharts4];

    //Set the file name for wordsCloud export
    useEffect(() => {
        setfilesNames('WordCloud_' + props.request.keywordList.join("&") + "_" + props.request.from + "_" + props.request.until);
    }, [JSON.stringify(props.request), props.request]);

    //Set result 
    useEffect(() => {

        setResult(props.result);

    }, [JSON.stringify(props.result), props.result, props.result.userGraph]);

    //Initialize tweets arrays
    useEffect(() => {
        setHistoTweets(null);
        setCloudTweets(null);
        setheatMapTweets(null);
        setPieCharts0(null);
        setPieCharts1(null);
        setPieCharts2(null);
        setPieCharts3(null);
        setPieCharts4(null);
        setUserGraphReset(null);
        setUserGraphClickNode(null);
        setUserGraphTweets(null);
        setUserGraphInteraction(null);
        setCoHashtagGraphTweets(null);
    }, [JSON.stringify(props.request), props.request])

    const displayTweetsOfWord = (word, callback) => {

        let columns = [
            { title: keyword('sna_result_username'), field: 'username' },
            { title: keyword('sna_result_date'), field: 'date' },
            { title: keyword('sna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
            { title: keyword('sna_result_retweet_nb'), field: 'retweetNb' },
            { title: keyword('sna_result_like_nb'), field: 'likeNb' }
        ];
        let csvArr = "";

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
        let csvArr = keyword("sna_result_username") + "," + keyword("sna_result_date") + "," + keyword("sna_result_tweet") + "," + keyword("sna_result_retweet_nb") + "," + keyword("elastic_url") + "\n";
        let isDays = "isDays";
        if (!fromHisto) { isDays = "isHours" }

        result.tweets.forEach(tweetObj => {

            let objDate = new Date(tweetObj._source.date);
            for (let i = 0; i < data.points.length; i++) {
                let pointDate = new Date(fromHisto ? data.points[i].x : (data.points[i].x + ' ' + data.points[i].y));
                if (data.points[i].data.mode !== "lines" && isInRange(pointDate, objDate, isDays)) {
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
            }
        });
        //  i++;
        //  });
        return {
            data: resData,
            columns: columns,
            csvArr: csvArr,
        };
    };

    function getDayAsString(dayInt) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayInt];
    }

    function getHourAsString(hourInt) {
        return ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
            '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'][hourInt];
    }

    const displayTweetsOfDateHeatMap = (data) => {
        let columns = [
            { title: keyword('sna_result_username'), field: 'username' },
            { title: keyword('sna_result_date'), field: 'date' },
            { title: keyword('sna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
            { title: keyword('sna_result_retweet_nb'), field: 'retweetNb' },
        ];
        let resData = [];
        let csvArr = keyword("sna_result_username") + ',' + keyword("sna_result_date") + ',' + keyword("sna_result_tweet") + ',' + keyword("sna_result_retweet_nb") + ',' + keyword("elastic_url") + '\n';

        const filteredTweets = result.tweets.filter(function (tweetObj) {
            const date = new Date(tweetObj._source.date);
            const day = getDayAsString(date.getDay());
            const hour = getHourAsString(date.getHours());
            return hour === data.points[0].x && day === data.points[0].y;
        });

        filteredTweets.forEach(tweetObj => {
            const date = new Date(tweetObj._source.date);
            resData.push(
                {
                    username: <a href={"https://twitter.com/" + tweetObj._source.username} target="_blank">{tweetObj._source.username}</a>,
                    date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                    tweet: tweetObj._source.tweet,
                    retweetNb: tweetObj._source.nretweets,
                    link: tweetObj._source.link
                }
            );
            csvArr += tweetObj._source.username + ',' +
                date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' +
                tweetObj._source.tweet + '",' + tweetObj._source.nretweets + ',' + tweetObj._source.link + '\n';
        });

        return {
            data: resData,
            columns: columns,
            csvArr: csvArr,
        };
    };

    const displayTweetsOfUser = (data, nbType, index) => {
        let columns = [
            { title: keyword('sna_result_date'), field: 'date' },
            { title: keyword('sna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
        ];
        let csvArr = keyword('sna_result_date') + "," + keyword('sna_result_tweet');
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

        let selectedUser = null;
        if (index === "userGraphIdx") {
            selectedUser = data.data.node.id.toLowerCase();
        } else {
            selectedUser = data.points[0].label;
        }

        result.tweets.forEach(tweetObj => {
            if (tweetObj._source.username.toLowerCase() === selectedUser) {
                let date = new Date(tweetObj._source.date);
                let tmpObj = {
                    date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                    tweet: tweetObj._source.tweet,
                    link: tweetObj._source.link
                };
                csvArr += date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' + tweetObj._source.tweet + '",';

                if (nbType !== "retweets_cloud_chart_title") {
                    tmpObj.nbLikes = tweetObj._source.nlikes;
                    csvArr += tmpObj.nbLikes + ',';
                }
                if (nbType !== "likes_cloud_chart_title") {
                    tmpObj.nbReteets = tweetObj._source.nretweets;
                    csvArr += tmpObj.nbReteets + ',';
                }
                csvArr += tmpObj.link + '\n';
                resData.push(tmpObj);
            }
        });

        let newRes = {
            data: resData,
            columns: columns,
            csvArr: csvArr,
            username: selectedUser
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
            case 4:
                setPieCharts4(newRes);
                break;
            case "userGraphIdx":
                setUserGraphTweets(newRes);
                break;
            default:
                break;

        }
    }

    const displayTweetsOfMention = (selectedUser, nbType, index) => {
        let columns = [
            { title: keyword('sna_result_date'), field: 'date' },
            { title: keyword('sna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
        ];
        let csvArr = keyword('sna_result_date') + "," + keyword('sna_result_tweet');
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

        let mentionTweets = result.tweets.filter(tweet => tweet._source.mentions !== undefined);
        mentionTweets.forEach(tweetObj => {
            let lcMentionArr = tweetObj._source.mentions.map(v => v.toLowerCase());
            if (lcMentionArr.includes(selectedUser)) {
                let date = new Date(tweetObj._source.date);
                let tmpObj = {
                    date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                    tweet: tweetObj._source.tweet,
                    link: tweetObj._source.link
                };
                csvArr += date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',"' + tweetObj._source.tweet + '",';

                if (nbType !== "retweets_cloud_chart_title") {
                    tmpObj.nbLikes = tweetObj._source.nlikes;
                    csvArr += tmpObj.nbLikes + ',';
                }
                if (nbType !== "likes_cloud_chart_title") {
                    tmpObj.nbReteets = tweetObj._source.nretweets;
                    csvArr += tmpObj.nbReteets + ',';
                }
                csvArr += tmpObj.link + '\n';
                resData.push(tmpObj);
            }
        });

        let newRes = {
            data: resData,
            columns: columns,
            csvArr: csvArr,
            username: selectedUser
        };

        setPieCharts3(newRes);
    }

    const displayUserInteraction = (e) => {

        let columns = [
            { title: keyword('sna_result_username'), field: 'username' },
            { title: 'Interaction', field: 'nbInteraction', render: getTweetWithClickableLink },
        ];

        let interaction = result.userGraph.userInteraction.find((element) => element.username === e.data.node.id);
        let resData = [];
        let sortedInteraction = [];
        if (interaction !== undefined) {
            sortedInteraction = Object.entries(interaction.interacted).sort((a, b) => { return a[1] - b[1]; });
            sortedInteraction.forEach(x => {
                resData.push({ username: x[0], nbInteraction: x[1] });
            });
        }

        let newRes = {
            username: e.data.node.id,
            data: resData,
            columns: columns
        };
        setUserGraphInteraction(newRes);
    }

    function createCSVFromPieChart(obj) {
        let csvArr = "Sector,Count\n";
        for (let i = 1; i < obj.json[0].labels.length; i++) {
            csvArr += obj.json[0].labels[i] + "," + obj.json[0].values[i] + "\n";
        }
        return csvArr;
    }

    function createCSVFromURLTable(urls) {
        let csvArr = "Url,Count\n";
        urls.data.forEach(row => 
            csvArr += row.url + "," + row.count + "\n"
        );
        return csvArr;
    }

    function downloadClick(csvArr, name, histo, type = "tweets_") {
        let encodedUri = encodeURIComponent(csvArr);
        let link = document.createElement("a");
        link.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodedUri);
        link.setAttribute("download", type + name + "_" + props.request.keywordList.join('&') + '_' + ((!histo) ? (props.request.from + "_" + props.request.until) : "") + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    function isInRange(pointDate, objDate, periode) {

        if (periode === "isHours") {
            return (((pointDate.getDate() === objDate.getDate()
                && pointDate.getHours() - 1 === objDate.getHours()))
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear());
        }
        else {
            return (pointDate - objDate) === 0;
        }
    }

    const onHistogramClick = (data) => {
        setHistoTweets(displayTweetsOfDate(data, true));
    }

    const onHeatMapClick = (data) => {
        setheatMapTweets(displayTweetsOfDateHeatMap(data, false));
    }

    const onDonutsClick = (data, nbType, index) => {

        //For mention donuts
        if (index === 3) {
            displayTweetsOfMention(data.points[0].label, setPieCharts3)
        }
        // For hashtag donut
        else if (index === 4) {
            displayTweetsOfWord(data.points[0].label, setPieCharts4);
        }
        // For retweets, likes, top_user donut
        else {
            displayTweetsOfUser(data, nbType, index);
        }

    };
    const getTweetWithClickableLink = (cellData) => {
        let urls = cellData.tweet.match(/((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?|pic\.twitter\.com\/([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g);
        if (urls === null)
            return cellData.tweet;

        let tweetText = cellData.tweet.split(urls[0]);
        if (urls[0].match(/pic\.twitter\.com\/([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/))
            urls[0] = "https://" + urls[0];
        let element = <div>{tweetText[0]} <a href={urls[0]} target="_blank">{urls[0]}</a>{tweetText[1]}</div>;
        return element;
    }

    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("sna_result_go_to_tweet"),
        onClick: (event, rowData) => {
            window.open(rowData.link, '_blank');
        }
    }]

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
    function downloadAsPNG(elementId) {
        let element = document.getElementById(elementId);

        if (elementId === "top_words_cloud_chart") {
            let name = filesNames + '.png';
            saveSvgAsPng(element.children[0].children[0], name, { backgroundColor: "white", scale: 2 });
        } else {
            let positionInfo = element.getBoundingClientRect();
            let height = positionInfo.height;
            let width = positionInfo.width;
            let name = keyword(elementId) + filesNames.replace("WordCloud", "") + '.png';
            Plotly.downloadImage(elementId,
                { format: 'png', width: width * 1.2, height: height * 1.2, filename: name }
            );
        }
    }

    //Download as SVG
    function downloadAsSVG(elementId) {

        if (elementId === "top_words_cloud_chart") {
            let name = filesNames + '.svg';
            var svgEl = document.getElementById("top_words_cloud_chart").children[0].children[0];
            svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            var svgData = svgEl.outerHTML;
            var preface = '<?xml version="1.0" standalone="no"?>\r\n';
            var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
            var svgUrl = URL.createObjectURL(svgBlob);
            var downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = name;
            downloadLink.click();
        } else {
            let element = document.getElementById(elementId);
            let positionInfo = element.getBoundingClientRect();
            let height = positionInfo.height;
            let width = positionInfo.width;
            let name = keyword(elementId) + filesNames.replace("WordCloud", "");
            Plotly.downloadImage(elementId,
                { format: 'svg', width: width * 1.2, height: height * 1.2, filename: name }
            );
        }

    }

    function getCSVData() {
        if (!props.result.cloudChart.json)
            return "";
        let csvData = props.result.cloudChart.json.map(wordObj => { return { word: wordObj.text, nb_occ: wordObj.value, entity: wordObj.entity } });
        return csvData;
    }

    function onClickNodeUserGraph(e) {

        let initGraph = {
            nodes: e.data.renderer.graph.nodes(),
            edges: e.data.renderer.graph.edges()
        }

        // Set new graph (which has only the clicked node and its neighbors) after clicking
        setUserGraphClickNode(createGraphWhenClickANode(e));

        setUserGraphReset(initGraph);

        displayTweetsOfUser(e, '', "userGraphIdx");

        displayUserInteraction(e);
    }

    function onClickNodeCoHashtagGraph(e) {

        displayTweetsOfWord(e.data.node.id, setCoHashtagGraphTweets);
    }

    function onClickStage(e) {
        setUserGraphClickNode(() => {
            return null;
        });
        hideTweetsView("userGraphIdx");

        setUserGraphInteraction(null);
    }

    function createGraphWhenClickANode(e) {

        let selectedNode = e.data.node;

        let neighborNodes = e.data.renderer.graph.adjacentNodes(selectedNode.id);
        let neighborEdges = e.data.renderer.graph.adjacentEdges(selectedNode.id);
        let directedNeighborEdges = neighborEdges.map((edge) => {
            let newEdge = JSON.parse(JSON.stringify(edge));
            if (newEdge.source !== selectedNode.id) {
                newEdge.target = edge.source;
                newEdge.source = selectedNode.id;
            }
            return newEdge;
        });

        neighborNodes.push(selectedNode);

        let newGraph = {
            nodes: neighborNodes,
            edges: directedNeighborEdges
        }

        console.log("newGraph", newGraph);
        return newGraph;
    }

    function goToTwitterSnaWithUrlSearch(event, rowData) {
        rowData.forEach(data => 
            window.open("/popup.html#/app/tools/twitterSna?url=" + data.url + "&request=" + JSON.stringify(props.request))
        );
    }

    if (result === null)
        return <div />;

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
                            {(result.histogram.json && (result.histogram.json.length === 0) &&
                                <Typography variant={"body2"}>{keyword("sna_no_data")}</Typography>)}
                            {(result.histogram.json && result.histogram.json.length !== 0) &&
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
                            <Box m={1} />
                            <OnClickInfo keyword={"twittersna_timeline_tip"}/>
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
                            <Box m={3}/>
                            <OnClickInfo keyword={"twittersna_tweetnb_tip"}/>
                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }
            {
                result.pieCharts &&
                result.pieCharts.map((obj, index) => {
                    if ((props.request.userList.length === 0 || index === 3 || index === 4))
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
                                            (obj.json === null || (obj.json[0].values.length === 1 && obj.json[0].values[0] === "")) &&
                                                <Typography variant={"body2"}>{keyword("sna_no_data")}</Typography>
                                        }
                                        {
                                            obj.json !== null && !(obj.json[0].values.length === 1 && obj.json[0].values[0] === "") &&
                                            <Grid container justify="space-between" spacing={2}
                                                alignContent={"center"}>
                                                <Grid item>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={() => downloadAsPNG(obj.title)}>
                                                        {
                                                            keyword('sna_result_download_png')
                                                        }
                                                    </Button>

                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={() => downloadClick(createCSVFromPieChart(obj), 
                                                                                    keyword(obj.title), 
                                                                                    false, 
                                                                                    "")}>
                                                        
                                                        CSV
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={() => downloadAsSVG(obj.title)}>
                                                        {
                                                            keyword('sna_result_download_svg')
                                                        }
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        }
                                        {
                                            (obj.json !== null) && !(obj.json[0].values.length === 1 && obj.json[0].values[0] === "") &&
                                            <div>
                                                <Plot
                                                    data={obj.json}
                                                    layout={obj.layout}
                                                    config={obj.config}
                                                    onClick={e => {
                                                        onDonutsClick(e, obj.title, index)
                                                    }}
                                                    divId={obj.title}
                                                />
                                                <Box m={1} />
                                                <OnClickInfo keyword={obj.tip}/>
                                            </div>
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
                                                            onClick={() => hideTweetsView(index)}>
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
                        <Typography className={classes.heading}>{keyword(result.cloudChart.title)}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {
                            result && result.cloudChart && result.cloudChart.json &&
                            <Box alignItems="center" justifyContent="center" width={"100%"}>
                                <div height={"500"} width={"100%"} >
                                    {
                                        (result.cloudChart.json && result.cloudChart.json.length === 0) &&
                                        <Typography variant={"body2"}>{keyword("sna_no_data")}</Typography>}
                                    {(result.cloudChart.json && result.cloudChart.json.length !== 0) &&
                                        <Grid container justify="space-between" spacing={2}
                                            alignContent={"center"}>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    onClick={() => downloadAsPNG("top_words_cloud_chart")}>
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
                                                    onClick={() => downloadAsSVG("top_words_cloud_chart")}>
                                                    {
                                                        keyword('sna_result_download_svg')
                                                    }
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    }

                                </div>
                                <Box m={2} />
                                {
                                    result.cloudChart.json && (result.cloudChart.json.length !== 0) &&
                                    <div id="top_words_cloud_chart" height={"100%"} width={"100%"}>
                                        <ReactWordcloud key={JSON.stringify(result)} options={result.cloudChart.options} callbacks={call} words={result.cloudChart.json} />
                                        <Box m={1}/>
                                        <OnClickInfo keyword={"twittersna_wordcloud_tip"}/>
                                    </div>

                                }
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
                        }
                        {
                            result.cloudChart.json === undefined &&
                            <CircularProgress className={classes.circularProgress} />
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }
            {
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className={classes.heading}>{keyword('sna_result_heatMap')}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {
                            result && result.heatMap &&
                            <Box alignItems="center" justifyContent="center" width={"100%"}>
                                {
                                    ((result.heatMap.isAllnul) &&
                                        <Typography variant={"body2"}>{keyword("sna_no_data")}</Typography>) ||
                                    <div>
                                        <Plot
                                            style={{ width: '100%', height: "450px" }}
                                            data={result.heatMap.plot}
                                            config={result.histogram.config}
                                            onClick={(e) => onHeatMapClick(e)}
                                        />
                                        <Box m={1}/>
                                        <OnClickInfo keyword={"twittersna_heatmap_tip"}/>
                                    </div>
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
                                                    onClick={() => {
                                                        let date = new Date(heatMapTweets.data[0].date);
                                                        let dayHourStr = getDayAsString(date.getDay()) + date.getHours() + "h_";
                                                        downloadClick(heatMapTweets.csvArr, dayHourStr, false);
                                                    }}>
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
                        }
                        {
                            result.heatMap === undefined &&
                            (//<Typography variant='body2'>The heatmap is still loading please wait (ADD TSV)</Typography>

                                <CircularProgress className={classes.circularProgress} />)
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }
            {
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className={classes.heading}>{keyword("twittersna_hashtag_graph_title")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    {
                        result && result.coHashtagGraph && result.coHashtagGraph.data.nodes.length !== 0 &&
                            <div style={{ width: '100%' }}>
                                <Sigma graph={result.coHashtagGraph.data}
                                    renderer={"canvas"}
                                    style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                    onClickNode={(e) => onClickNodeCoHashtagGraph(e)}
                                    settings={{
                                        drawEdges: true,
                                        drawEdgeLabels: false,
                                        minNodeSize: 10,
                                        maxNodeSize: 30,
                                        minEdgeSize: 1,
                                        maxEdgeSize: 10,
                                        defaultNodeColor: "#3388AA",
                                        defaultEdgeColor: "#C0C0C0",
                                        edgeColor: "default"
                                    }}
                                    >
                                    <RandomizeNodePositions>
                                        <ForceAtlas2 iterationsPerRender={1} timeout={15000} />
                                    </RandomizeNodePositions>
                                </Sigma>
                                <Box m={1}/>
                                <OnClickInfo keyword={"twittersna_hashtag_graph_tip"}/>
                                <Box m={2}/>
                                {
                                    coHashtagGraphTweets &&
                                    <div>
                                        <Grid container justify="space-between" spacing={2}
                                            alignContent={"center"}>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"secondary"}
                                                    onClick={() => hideTweetsView("coHashtagGraphIdx")}>
                                                    {
                                                        keyword('sna_result_hide')
                                                    }
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    onClick={() => downloadClick(coHashtagGraphTweets.csvArr, coHashtagGraphTweets.word)}>
                                                    {
                                                        keyword('sna_result_download')
                                                    }
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Box m={2} />
                                        <CustomTable title={keyword("sna_result_slected_tweets")}
                                            colums={coHashtagGraphTweets.columns}
                                            data={coHashtagGraphTweets.data}
                                            actions={goToTweetAction}
                                        />
                                    </div>
                                }
                            </div>
                        }
                        {
                            result.coHashtagGraph === undefined &&
                            <CircularProgress className={classes.circularProgress} />
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }
            {
                props.request.userList.length === 0 && result &&
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className={classes.heading}>{keyword("twittersna_user_graph_title")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        {
                            result.userGraph &&
                            <div style={{ width: '100%' }}>
                                {
                                    (userGraphReset === null && userGraphClickNode === null && result.userGraph.data.nodes.length !== 0) &&
                                    <div>
                                        <Sigma graph={result.userGraph.data}
                                            renderer={"canvas"}
                                            style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                            onClickNode={(e) => onClickNodeUserGraph(e)}
                                            settings={{
                                                labelThreshold: 13,
                                                drawEdges: false,
                                                drawEdgeLabels: false,
                                                minNodeSize: 5,
                                                maxNodeSize: 12
                                            }}>
                                            <RandomizeNodePositions>
                                                <ForceAtlas2 iterationsPerRender={1} timeout={120000} />
                                            </RandomizeNodePositions>
                                        </Sigma>
                                        <Box m={1}/>
                                        <OnClickInfo keyword={"twittersna_user_graph_tip"}/>
                                    </div>
                                }
                                {
                                    userGraphReset !== null && userGraphClickNode !== null &&
                                    <div>
                                        <Sigma graph={userGraphClickNode}
                                            renderer={"canvas"}
                                            onClickStage={(e) => onClickStage(e)}
                                            style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                            settings={{
                                                defaultLabelColor: "#777",
                                                labelThreshold: 13,
                                                minNodeSize: 5,
                                                maxNodeSize: 12,
                                                drawEdgeLabels: true,
                                                edgeColor: 'target'
                                            }}
                                        >
                                        </Sigma>
                                        <Box m={1}/>
                                        <OnClickInfo keyword={"twittersna_user_graph_tip"}/>
                                    </div>
                                }
                                {
                                    userGraphReset !== null && userGraphClickNode === null &&
                                    <div>
                                        <Sigma graph={userGraphReset}
                                            renderer={"canvas"}
                                            style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                            onClickNode={(e) => onClickNodeUserGraph(e)}
                                            settings={{
                                                labelThreshold: 13,
                                                drawEdges: false,
                                                drawEdgeLabels: false,
                                                minNodeSize: 5,
                                                maxNodeSize: 12
                                            }}>
                                        </Sigma>
                                        <Box m={1}/>
                                            <OnClickInfo keyword={"twittersna_user_graph_tip"}/>
                                    </div>
                                }
                                {
                                    result.userGraph.legend.length !== 0 &&
                                    <div >
                                        <Paper >
                                            <ListSubheader component="div" style={{ fontSize: 18, fontWeight: 'bold' }}> Legend </ListSubheader>
                                            <List className={classes.root} >
                                                {
                                                    result.userGraph.legend.map((community) => {
                                                        return (
                                                            <ListItem key={community.communityColor + (Math.random())}>
                                                                <ListItemIcon>
                                                                    <div className="legendcolor"
                                                                        style={{ backgroundColor: community.communityColor, width: 18, height: 18, borderRadius: '50%' }}>
                                                                    </div>
                                                                </ListItemIcon>
                                                                <ListItemText primary={community.legend} />
                                                            </ListItem>
                                                        );
                                                    })
                                                }
                                            </List>
                                        </Paper>
                                    </div>
                                }
                                {
                                    userGraphTweets &&
                                    <div>
                                        <Grid container justify="space-between" spacing={2}
                                            alignContent={"center"}>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"secondary"}
                                                    onClick={() => hideTweetsView("userGraphIdx")}>
                                                    {
                                                        keyword('sna_result_hide')
                                                    }
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    onClick={() => downloadClick(userGraphTweets.csvArr, userGraphTweets.username)}>
                                                    {
                                                        keyword('sna_result_download')
                                                    }
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Box m={2} />
                                        <CustomTable title={keyword("sna_result_slected_tweets")}
                                            colums={userGraphTweets.columns}
                                            data={userGraphTweets.data}
                                            actions={goToTweetAction}
                                        />
                                    </div>
                                }
                                {
                                    userGraphInteraction &&
                                    <div style={{ position: 'absolute', top: 0, right: 0 }}>
                                        <Paper style={{ width: 300 }}>
                                            <div style={{
                                                height: 65,
                                                backgroundSize: 'cover',
                                                backgroundImage: `url(${"http://abs.twimg.com/images/themes/theme1/bg.png"})`
                                            }}>
                                            </div>
                                            <div>
                                                <List style={{ position: 'absolute', top: 40, width: '100%' }}>
                                                    <ListItem>
                                                        <ListItemAvatar>
                                                            <Avatar alt={userGraphInteraction.username}
                                                                src={"http://avatars.io/twitter/" + userGraphInteraction.username}
                                                                variant='rounded'
                                                                style={{ width: 65, height: 65 }} />
                                                        </ListItemAvatar>
                                                        <ListItemText primary={userGraphInteraction.username}
                                                            style={{ marginLeft: 10, color: '#428bca' }} />
                                                    </ListItem>
                                                </List>
                                            </div>
                                            <TableContainer style={{ marginTop: 60 }}>
                                                <Table size="small">
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell colSpan={2}
                                                                align="center"
                                                                style={{ fontSize: 18, fontWeight: 'bold', borderBottom: 'none' }}
                                                            >
                                                                Mostly conntected with:
                                                        </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={2}
                                                                align="center"
                                                                style={{ color: '#6a6a6a', borderBottom: 'none' }}>
                                                                TODO later
                                                        </TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell colSpan={2}
                                                                align="center"
                                                                style={{ fontSize: 18, fontWeight: 'bold', borderBottom: 'none' }}
                                                            >
                                                                Mostly interacted with:
                                                    </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <List className={classes.root} style={{ overflow: 'auto', maxHeight: 150 }}>
                                                {
                                                    userGraphInteraction.data.length !== 0 && userGraphInteraction.data.map((row) => {
                                                        return (
                                                            <ListItem key={row.username}>
                                                                <ListItemAvatar>
                                                                    <Avatar alt={row.username}
                                                                        src={"http://avatars.io/twitter/" + row.username} />
                                                                </ListItemAvatar>
                                                                <ListItemText primary={row.username}
                                                                    secondary={"Interactions: " + row.nbInteraction} />
                                                            </ListItem>
                                                        );
                                                    })
                                                }
                                                {
                                                    userGraphInteraction.data.length === 0 && "No interaction"
                                                }
                                            </List>
                                        </Paper>
                                    </div>
                                }

                            </div>
                        }
                        {
                            result.userGraph === undefined &&
                            <CircularProgress className={classes.circularProgress} />
                        }

                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }
            {
                props.request.userList.length === 0 && result &&
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{keyword("twittersna_user_graph_title")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    {
                        result.tweets &&
                        <TwitterInfoMap result={result} 
                                        request={props.request} 
                                        keyword={{noCommunity: keyword("sna_no_community"), noData: keyword("sna_no_data")}}
                                        cirProgClassName={classes.circularProgress} />
                    }
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }
            {
                props.request.userList.length === 0 && result &&
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className={classes.heading}>{keyword("twittersna_user_graph_title")}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Sigma
                                renderer={"canvas"}
                                style={{ textAlign: 'left', width: '100%', height: '700px' }}
                        >
                            <LoadGEXF path={gexfFile}>
                                <RandomizeNodePositions>
                                    <ForceAtlas2 iterationsPerRender={1} timeout={120000} />
                                </RandomizeNodePositions>
                                <RelativeSize initialSize={30}/>
                            </LoadGEXF>
                        </Sigma>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            }
            {
                props.request.userList.length === 0 && result &&
                <Paper>
                    <Toolbar>
                        <Typography className={classes.heading}>{keyword("twittersna_export_graph_title")}</Typography>
                        <div style={{ flexGrow: 1 }}/>
                        <Button
                            aria-label="download"
                            disabled={_.isEmpty(result.gexf)}
                            startIcon={<SaveIcon />}
                            href={result.gexf ? result.gexf.getUrl : undefined}
                            tooltip={keyword("sna_result_download")}>
                            {keyword("sna_result_download")}
                        </Button>
                    </Toolbar>
                    <Box pb={3}>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            startIcon={<BubbleChartIcon />}
                            disabled={_.isEmpty(result.gexf)}
                            href={result.gexf ? result.gexf.visualizationUrl : undefined}
                            target="_blank"
                            rel="noopener"
                            tooltip={keyword("sna_result_view_graph")}
                        >
                            {keyword("sna_result_view_graph")}
                        </Button>
                    </Box>
                </Paper>
            }

            <Box m={3} />
            {
                result.urls &&
                <Paper>
                    <Box pb={3}>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => downloadClick(createCSVFromURLTable(result.urls), "Urls", false, "")}
                        >
                            CSV
                        </Button>
                    </Box>
                    <CustomTableURL
                        title={keyword("sna_result_url_in_tweets")}
                        colums={result.urls.columns}
                        data={result.urls.data}
                        actions={[
                            {
                                icon: props => (<span className="MuiButtonBase-root 
                                                                MuiButton-root 
                                                                MuiButton-contained 
                                                                MuiButton-containedPrimary"
                                                    >
                                                    {
                                                        keyword('sna_result_submit_twitter_sna')
                                                    }
                                                    </span>),
                                tooltip: keyword("sna_result_submit_twitter_sna"),
                                onClick: (event, rowData) => {
                                    goToTwitterSnaWithUrlSearch(event, rowData)
                                }
                            }
                        ]}
                    />
                    <Box m={1}/>
                    <OnClickInfo keyword={"twittersna_urls_tip"}/>
                </Paper>
            }
        </Paper>
    );
};