import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import OnClickInfo from "../../../../Shared/OnClickInfo/OnClickInfo";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useCallback } from "react";
import { Paper } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Box from "@material-ui/core/Box";
import CustomTable from "../../../../Shared/CustomTable/CustomTable";
import CustomTableURL from "../../../../Shared/CustomTable/CustomTableURL";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TwitterIcon from '@material-ui/icons/Twitter';
import SaveIcon from '@material-ui/icons/Save';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import Toolbar from "@material-ui/core/Toolbar";
import CloseResult from "../../../../Shared/CloseResult/CloseResult";
import { cleanTwitterSnaState } from "../../../../../redux/actions/tools/twitterSnaActions";
import ReactWordcloud from "react-wordcloud";
import { select } from 'd3-selection';
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/TwitterSna.tsv";
import { saveSvgAsPng } from 'save-svg-as-png';
import { CSVLink } from "react-csv";
import { Sigma, RandomizeNodePositions, ForceAtlas2 } from 'react-sigma';
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist';
import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function TwitterSnaResult(props) {

    const Plot = createPlotlyComponent(Plotly);
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/TwitterSna.tsv", tsv);

    const dispatch = useDispatch();

    const [histoVisible, setHistoVisible] = useState(true);
    const [result, setResult] = useState(null);
    const [filesNames, setfilesNames] = useState(null);

    const [histoTweets, setHistoTweets] = useState(null);
    const [cloudTweets, setCloudTweets] = useState(null);
    const [heatMapTweets, setheatMapTweets] = useState(null);
    const [pieCharts0, setPieCharts0] = useState(null);
    const [pieCharts1, setPieCharts1] = useState(null);
    const [pieCharts2, setPieCharts2] = useState(null);
    const [pieCharts3, setPieCharts3] = useState(null);
    const [coHashtagGraphTweets, setCoHashtagGraphTweets] = useState(null);
    const [socioSemantic4ModeGraphTweets, setSocioSemantic4ModeGraphTweets] = useState(null);
    const [bubbleTweets, setBubbleTweets] = useState(null);

    const [coHashtagGraphReset, setCoHashtagGraphReset] = useState(null);
    const [coHashtagGraphClickNode, setCoHashtagGraphClickNode] = useState(null);

    const [socioSemantic4ModeGraphReset, setSocioSemantic4ModeGraphReset] = useState(null);
    const [socioSemantic4ModeGraphClickNode, setSocioSemantic4ModeGraphClickNode] = useState(null);

    const CSVheaders = [{ label: keyword('twittersna_result_word'), key: "word" }, { label: keyword("twittersna_result_nb_occ"), key: "nb_occ" }, { label: keyword("twittersna_result_entity"), key: "entity" }];

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
            default:
                break;
        }
    };

    const pieCharts = [pieCharts0, pieCharts1, pieCharts2, pieCharts3];

    const topUserProfile = useSelector(state => state.twitterSna.topUserProfile);
    const gexfExport = useSelector(state => state.twitterSna.gexfExport);

    //Set the file name for wordsCloud export
    useEffect(() => {
        setfilesNames('WordCloud_' + props.request.keywordList.join("&") + "_" + props.request.from + "_" + props.request.until);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.request), props.request]);

    //Set result 
    useEffect(() => {

        setResult(props.result);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setCoHashtagGraphTweets(null);
        setSocioSemantic4ModeGraphTweets(null);
        setBubbleTweets(null);
        setCoHashtagGraphReset(null);
        setCoHashtagGraphClickNode(null);
        setSocioSemantic4ModeGraphReset(null);
        setSocioSemantic4ModeGraphClickNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.request), props.request])

    function getDayAsString(dayInt) {
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayInt];
    }

    function getHourAsString(hourInt) {
        return ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
            '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'][hourInt];
    }

    const displayTweets = (filteredTweets, sortedColumn) => {
        let columns = [];
        if (sortedColumn === "nbLikes") {
            columns = [
                { title: keyword('twittersna_result_date'), field: 'date'},
                { title: keyword('twittersna_result_username'), field: 'screen_name'},
                { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
                { title: keyword('twittersna_result_like_nb'), field: "nbLikes", defaultSort: "desc" },
                { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb'}
            ];
        } else if (sortedColumn === "retweetNb") {
            columns = [
                { title: keyword('twittersna_result_date'), field: 'date'},
                { title: keyword('twittersna_result_username'), field: 'screen_name'},
                { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
                { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
                { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb', defaultSort: "desc" }
            ];
        } else {
            columns = [
                { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
                { title: keyword('twittersna_result_username'), field: 'screen_name'},
                { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
                { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
                { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb'}
            ];
        }

        let csvArr = keyword("twittersna_result_date") + ',' 
                    + keyword("twittersna_result_username") + ',' 
                    + keyword("twittersna_result_tweet") + ',' 
                    + keyword('twittersna_result_like_nb') + ',' 
                    + keyword("twittersna_result_retweet_nb") + ',' 
                    + keyword("elastic_url") +'\n';

        let resData = [];
        filteredTweets.forEach(tweetObj => {
            const date = new Date(tweetObj._source.datetimestamp * 1000);
            resData.push(
                {
                    date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                    screen_name: <a href={"https://twitter.com/" + tweetObj._source.screen_name} target="_blank" rel="noopener noreferrer">{tweetObj._source.screen_name}</a>,
                    tweet: tweetObj._source.full_text,
                    nbLikes: tweetObj._source.favorite_count,
                    retweetNb: tweetObj._source.retweet_count,
                    link: "https://twitter.com/" + tweetObj._source.screen_name + "/status/" + tweetObj._source.id_str
                }
            );
            csvArr += date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',' +
                        tweetObj._source.screen_name + ',"' 
                        + tweetObj._source.full_text + '",' 
                        + tweetObj._source.favorite_count + ','
                        + tweetObj._source.retweet_count + ',' 
                        + "https://twitter.com/" + tweetObj._source.screen_name + "/status/" + tweetObj._source.id_str + '\n';
        });

        return {
            data: resData,
            columns: columns,
            csvArr: csvArr,
        };
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

    function downloadClick(csvArr, name, histo, type = "Tweets_") {
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

    function filterTweetsForTimeLine(tweetDate, selectedPoints) {
        for (let i = 0; i < selectedPoints.length; i++) {
            let pointedDate = new Date(selectedPoints[i].x);
            if (selectedPoints[i].data.mode !== "lines" && isInRange(pointedDate, tweetDate, "isDays")) {
                return true;
            };
        }
    }

    const onHistogramClick = (data) => {
        if (result.tweets !== undefined) {
            let selectedPoints = data.points;
            let filteredTweets = result.tweets.filter(function(tweet) {
                let tweetDate = new Date(tweet._source.datetimestamp * 1000);
                return filterTweetsForTimeLine(tweetDate, selectedPoints);
            });
            setHistoTweets(displayTweets(filteredTweets));
        }
    }

    const onHeatMapClick = (data) => {
        let selectedHour = data.points[0].x;
        let selectedDay = data.points[0].y;
        let filteredTweets = result.tweets.filter(function (tweetObj) {
            let date = new Date(tweetObj._source.datetimestamp * 1000);
            let day = getDayAsString(date.getDay());
            let hour = getHourAsString(date.getHours());
            return hour === selectedHour && day === selectedDay;
        });
        setheatMapTweets(displayTweets(filteredTweets));
    }

    const onDonutsClick = (data, index) => {

        //For mention donuts
        if (index === 3) {
            if (result.tweets !== undefined) {
                let selectedUser = data.points[0].label;
                let filteredTweets = result.tweets.filter(tweet => tweet._source.user_mentions !== undefined && tweet._source.user_mentions.length > 0)
                    .filter(function (tweet) {
                        let lcMentionArr = tweet._source.user_mentions.map(v => v.screen_name.toLowerCase());
                        return lcMentionArr.includes(selectedUser.toLowerCase());
                    });
                let dataToDisplay = displayTweets(filteredTweets);
                dataToDisplay["selected"] = selectedUser;
                setPieCharts3(dataToDisplay);
            }
        }
        // For retweets, likes, top_user donut
        else {
            if (result.tweets !== undefined) {
                let selectedUser = data.points[0].label;
                let filteredTweets = result.tweets.filter(function (tweetObj) {
                    return tweetObj._source.screen_name.toLowerCase() === selectedUser.toLowerCase();
                });
                let dataToDisplay = index === 0 ? displayTweets(filteredTweets, "retweetNb") : (index === 1 ? displayTweets(filteredTweets, "nbLikes") : displayTweets(filteredTweets));

                dataToDisplay["selected"] = selectedUser;
                switch (index) {
                    case 0:
                        setPieCharts0(dataToDisplay);
                        break;
                    case 1:
                        setPieCharts1(dataToDisplay);
                        break;
                    case 2:
                        setPieCharts2(dataToDisplay);
                        break;
                    default:
                        break;
                }
            }
        }

    };

    const onBubbleChartClick = (data) => {
        let selectedUser = data.points[0].text.split("<br>")[0].replace("@","");
        let filteredTweets = result.tweets.filter(function (tweetObj) {
            return tweetObj._source.screen_name.toLowerCase() === selectedUser.toLowerCase();
        });
        setBubbleTweets(displayTweets(filteredTweets));

    }

    const onClickNodeCoHashtagGraph = (data) => {

        let initGraph = {
            nodes: data.data.renderer.graph.nodes(),
            edges: data.data.renderer.graph.edges()
        }

        setCoHashtagGraphClickNode(createGraphWhenClickANode(data));

        setCoHashtagGraphReset(initGraph);

        let selectedHashtag = data.data.node.id;
        let filteredTweets = result.tweets.filter(tweet => tweet._source.hashtags !== undefined && tweet._source.hashtags.length > 0)
            .filter(function (tweet) {
                let hashtagArr = tweet._source.hashtags.map((v) => { return v.toLowerCase();});
                return hashtagArr.includes(selectedHashtag.toLowerCase());
            });
        let dataToDisplay = displayTweets(filteredTweets);
        dataToDisplay["selected"] = selectedHashtag;
        setCoHashtagGraphTweets(dataToDisplay);
    }

    const onClickStageCoHashtagGraph = (e) => {
        setCoHashtagGraphClickNode(null);
        setCoHashtagGraphTweets(null);
    }

    const onClickNodeSocioSemantic4ModeGraph = (data) => {

        let initGraph = {
            nodes: data.data.renderer.graph.nodes(),
            edges: data.data.renderer.graph.edges()
        }

        setSocioSemantic4ModeGraphClickNode(createGraphWhenClickANode(data));

        setSocioSemantic4ModeGraphReset(initGraph);

        if (data.data.node.type === "Hashtag") {
            let selectedHashtag = data.data.node.id.replace("#", "");
            let filteredTweets = result.tweets.filter(tweet => tweet._source.hashtags !== undefined && tweet._source.hashtags.length > 0)
                .filter(function (tweet) {
                    let hashtagArr = tweet._source.hashtags.map((v) => { return v.toLowerCase(); });
                    return hashtagArr.includes(selectedHashtag.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "Mention") {
            let selectedUser = data.data.node.id.replace("isMTed:@", "");
            let filteredTweets = result.tweets.filter(tweet => tweet._source.user_mentions !== undefined && tweet._source.user_mentions.length > 0)
                .filter(function (tweet) {
                    let lcMentionArr = tweet._source.user_mentions.map(v => v.screen_name.toLowerCase());
                    return lcMentionArr.includes(selectedUser.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "RetweetWC") {
            let selectedUser = data.data.node.id.replace("RT:@", "");
            let filteredTweets1 = result.tweets.filter(tweet => 
                tweet._source.quoted_status_id_str !== undefined &&
                tweet._source.quoted_status_id_str !== null &&
                tweet._source.quoted_user_screen_name !== undefined);
            let filteredTweets = filteredTweets1.filter(tweet =>
                tweet._source.quoted_user_screen_name !== null &&
                tweet._source.quoted_user_screen_name.includes(selectedUser));
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "Reply") {
            let selectedUser = data.data.node.id.replace("Rpl:@", "");
            let filteredTweets = result.tweets.filter(tweet => 
                tweet._source.in_reply_to_screen_name !== undefined 
                && tweet._source.in_reply_to_screen_name !== null
                && tweet._source.screen_name.toLowerCase() === selectedUser);
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "URL") {
            let selectedURL = data.data.node.id.replace("URL:", "");
            let filteredTweets = result.tweets.filter(tweet => tweet._source.urls !== undefined && tweet._source.urls.length > 0)
                .filter(function (tweet) {
                    let urlArr = tweet._source.urls.map((url) => {
                        return getDomain(url).toLowerCase();
                    });
                    return urlArr.includes(selectedURL.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        }
    }

    const onClickStageSocioSemantic4ModeGraph = (e) => {
        setSocioSemantic4ModeGraphClickNode(null);
        setSocioSemantic4ModeGraphTweets(null);
    }

    function filterTweetsGivenWord(word) {
        let filteredTweets = result.tweets.filter(function (tweetObj) {
            return tweetObj._source.full_text.toLowerCase().match(new RegExp('(^|((.)*[.()0-9!?\'’‘":,/\\%><«» ^#]))' + word + '(([.()!?\'’‘":,/><«» ](.)*)|$)', "i"));
        });
        return filteredTweets;
    }

    const getTweetWithClickableLink = (cellData) => {
        let urls = cellData.tweet.match(/((http|https|ftp|ftps):\/\/[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,3}(\/\S*)?|pic\.twitter\.com\/([-a-zA-Z0-9()@:%_+.~#?&//=]*))/g);
        if (urls === null)
            return cellData.tweet;

        let tweetText = cellData.tweet.split(urls[0]);
        if (urls[0].match(/pic\.twitter\.com\/([-a-zA-Z0-9()@:%_+.~#?&//=]*)/))
            urls[0] = "https://" + urls[0];
        let element = <div>{tweetText[0]} <a href={urls[0]} target="_blank" rel="noopener noreferrer">{urls[0]}</a>{tweetText[1]}</div>;
        return element;
    }

    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
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
                        let selectedWord = word.text;
                        let filteredTweets = filterTweetsGivenWord(selectedWord);
                        let dataToDisplay = displayTweets(filteredTweets);
                        dataToDisplay["selected"] = selectedWord;
                        setCloudTweets(dataToDisplay);

                    }
                })
                .transition()
                .attr("background", "white")
                .attr("text-decoration", isActive ? "underline" : "none");
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(result)]);

    const tooltip = word => {
        if (word.entity !== null)
            return "The word " + word.text + " appears " + word.value + " times and is a " + word.entity + ".";
        else
            return "The word " + word.text + " appears " + word.value + " times.";
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

    function goToTwitterSnaWithUrlSearch(event, rowData) {
        rowData.forEach(data => 
            window.open("/popup.html#/app/tools/twitterSna?url=" + data.url + "&request=" + JSON.stringify(props.request))
        );
    }

    function getColorOfMostActiveUserBubble(value) {
        switch (true) {
            case (value < 5):
                // return "#5da4d6";
                return "#2f7fb8";
            case (value < 15):
                return "#ff900e";
            default:
                return "#ff3636";
        }
    }

    function createBubbleChartOfMostActiveUsers(userProfile, request) {
        let tweetCountObj = _.countBy(result.tweets.map((tweet) => {return tweet._source.screen_name.toLowerCase(); }));
        let nbDays = Math.floor(( Date.parse(request['until']) - Date.parse(request['from']) ) / 86400000);
        nbDays = nbDays > 1 ? nbDays : 1;
        let objArr = userProfile.map((obj) => {
            return {
                screen_name: obj._source.screen_name,
                followers_count: obj._source.followers_count,
                datetimestamp: obj._source.datetimestamp,
                indexedat: obj._source.indexedat,
                verified: obj._source.verified
            }; 
        });

        let groupByUserArr = objArr.reduce((r, a) => {
            r[a.screen_name] = [...r[a.screen_name] || [], a];
            return r;
           }, {});
        let closestDateObjArr = Object.entries(groupByUserArr).map((row) => { 
            let filteredUndef = row[1].filter(obj => obj.indexedat !== undefined);
            filteredUndef.map((obj) => {
                obj.distanceDateTime = Math.abs((Date.parse(request['until']) / 1000) - obj.indexedat);
                return obj;
            });
            return _.orderBy(filteredUndef, ['distanceDateTime'], ['asc'])[0];
         })

        let sortedObjArr = _.orderBy(closestDateObjArr, ['datetimestamp', 'screen_name'], ['asc', 'asc']);

        let x = [];
        let y = [];
        let text = [];
        let color = []
        let size = [];
        let symbol = [];

        sortedObjArr.forEach((obj) => {
            let date = new Date(obj.datetimestamp * 1000);
            let dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            let nbTweets = tweetCountObj[obj.screen_name.toLowerCase()];
            let avgTweetsPerDate = nbTweets/nbDays;

            x.push(dateStr);
            y.push(obj.followers_count);
            text.push('@' + obj.screen_name + '<br>Posted <b>' + nbTweets + '</b> tweets in ' + nbDays + ' days');
            color.push(getColorOfMostActiveUserBubble(avgTweetsPerDate));
            size.push(nbTweets);
            symbol.push( (obj.verified ? "diamond" : "circle") );
        });

        let data = [
            { 
                mode: "markers",
                x: x, 
                y: y, 
                text: text,
                hovertemplate: '%{text}<br>Account created: %{x}<br>Followers: %{y}<br>',
                marker: { 
                    color: color,
                    size: size,
                    sizeref: (Math.max(...size) < 10 ? 1 : 2 * Math.max(...size) / (60**2)),
                    sizemode: 'area',
                    sizemin: 5,
                    symbol: symbol
                },
                name: ""
            } 
        ]

        let layout = {
            title: {
                text: keyword("bubble_chart_title") + "<br>" + request.keywordList.join(", ") + " - " + request["from"] + " - " + request["until"],
                font: {
                    family: 'Arial, sans-serif',
                    size: 18
                },
                xanchor: 'center'
            },
            annotations: [{
                xref: 'paper',
                yref: 'paper',
                x: 1,
                y: -0.180,
                text: 'weverify.eu',
                showarrow: false
                },
            ],
            xaxis: {
                title: keyword("twittersna_acd"),
                titlefont: {
                    family: 'Arial, sans-serif',
                    size: 18,
                    color: '#C0C0C0'
                },
            },
            yaxis: {
                title: keyword("twittersna_nb_followers"),
                titlefont: {
                    family: 'Arial, sans-serif',
                    size: 18,
                    color: '#C0C0C0'
                },
                range:[0, Math.max(...y) + 10],
                rangemode: 'tozero'
            }
        }

        let config = {
            displayModeBar: true,
            toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_Bubble",
              },
            modeBarButtons: [
                ["toImage"], 
                ["zoom2d"],
                ["pan2d"],
                ["resetScale2d"],
                ['drawline'],
                ['drawopenpath'],
                ['drawclosedpath'],
                ['drawcircle'],
                ['drawrect'],
                ['eraseshape']
            ],
            displaylogo: false,
        }

        return {
            data: data,
            layout: layout,
            config: config
        }
    }

    function createGraphWhenClickANode(e) {

        let selectedNode = e.data.node;

        let neighborNodes = e.data.renderer.graph.adjacentNodes(selectedNode.id);
        let neighborEdges = e.data.renderer.graph.adjacentEdges(selectedNode.id);

        let neighborNodeIds = neighborNodes.map((node) => { return node.id; });
        neighborNodeIds.push(selectedNode.id);
        let neighborEdgeIds = neighborEdges.map((edge) => { return edge.id; });

        let clonedNodes = JSON.parse(JSON.stringify(e.data.renderer.graph.nodes()));
        let clonedEdges = JSON.parse(JSON.stringify(e.data.renderer.graph.edges()));

        let updatedNodes = clonedNodes.map((node) => {
            if (!neighborNodeIds.includes(node.id)) {
                node.color = "#C0C0C0";
            }
            return node;
        })

        let updatedEdges = clonedEdges.map((edge) => {
            if (neighborEdgeIds.includes(edge.id)) {
                edge.color = "#000000";
            } else {
                edge.color = "#C0C0C0";
            }
            return edge;
        })

        let newGraph = {
            nodes: updatedNodes,
            edges: updatedEdges
        }

        console.log("newGraph", newGraph);
        return newGraph;
    }

    function getDomain(url) {
        var domain;

        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }

        if (domain.indexOf("www.") > -1) {
            domain = domain.split('www.')[1];
        }

        domain = domain.split(':')[0];
        domain = domain.split('?')[0];

        return domain;
    }

    if (result === null)
        return <div />;

    let call = getCallbacks();
    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
            {
                result.histogram &&
                <Accordion expanded={histoVisible} onChange={() => setHistoVisible(!histoVisible)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading}>{keyword(result.histogram.title)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {}
                        <div style={{ width: '100%', }}>
                            {(result.histogram.json && (result.histogram.json.length === 0) &&
                                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>)}
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
                                                    keyword('twittersna_result_hide')
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => downloadClick(histoTweets.csvArr, histoTweets.data[0].date.split(' ')[0], true)}>
                                                {
                                                    keyword('twittersna_result_download')
                                                }
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box m={2} />
                                    <CustomTable
                                        title={keyword("twittersna_result_slected_tweets")}
                                        colums={histoTweets.columns}
                                        data={histoTweets.data}
                                        actions={goToTweetAction}
                                    />
                                </div>
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
            }
            {
                result && result.tweetCount &&
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading} >{keyword("tweetCounter_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
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
                    </AccordionDetails>
                </Accordion>
            }
            {
                result.pieCharts &&
                result.pieCharts.map((obj, index) => {
                    if ((props.request.userList.length === 0 || index === 3))
                        return (
                            <Accordion key={index}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={"panel" + index + "a-content"}
                                    id={"panel" + index + "a-header"}
                                >
                                    <Typography className={classes.heading}>{keyword(obj.title)}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box alignItems="center" justifyContent="center" width={"100%"}>
                                        {
                                            (obj.json === null || (obj.json[0].values.length === 1 && obj.json[0].values[0] === "")) &&
                                                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
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
                                                            keyword('twittersna_result_download_png')
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
                                                            keyword('twittersna_result_download_svg')
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
                                                        onDonutsClick(e, index)
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
                                                                keyword('twittersna_result_hide')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"primary"}
                                                            onClick={() => downloadClick(pieCharts[index].csvArr, (index === 3) ? "mentioned_" + pieCharts[index].selected : pieCharts[index].selected)}>
                                                            {
                                                                keyword('twittersna_result_download')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <Box m={2} />
                                                <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                                    colums={pieCharts[index].columns}
                                                    data={pieCharts[index].data}
                                                    actions={goToTweetAction}
                                                />
                                            </div>
                                        }
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        )
                    else
                        return null;
                })
            }
            {
                props.request.userList.length === 0 && result &&
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading}>{keyword("bubble_chart_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            topUserProfile && topUserProfile.length !== 0 &&
                            <div style={{ width: '100%', }}>
                                { 
                                    [createBubbleChartOfMostActiveUsers(topUserProfile, props.request)].map((bubbdleChart) => {
                                        return (
                                            <div key={Math.random()}>
                                                <Plot useResizeHandler
                                                    style={{ width: '100%', height: "600px" }}
                                                    data={bubbdleChart.data}
                                                    layout={bubbdleChart.layout}
                                                    config={bubbdleChart.config}
                                                    onClick={(e) => onBubbleChartClick(e)}
                                                />
                                                <Box m={1} />
                                                <OnClickInfo keyword={"twittersna_bubble_chart_tip"} />
                                                <Box m={2} />
                                            </div>
                                        )
                                    })
                                }
                                {
                                    bubbleTweets &&
                                    <div>
                                        <Grid container justify="space-between" spacing={2}
                                            alignContent={"center"}>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"secondary"}
                                                    onClick={() => setBubbleTweets(null)}>
                                                    {
                                                        keyword('twittersna_result_hide')
                                                    }
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    onClick={() => downloadClick(bubbleTweets.csvArr, bubbleTweets.selected)}>
                                                    {
                                                        keyword('twittersna_result_download')
                                                    }
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Box m={2} />
                                        <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                            colums={bubbleTweets.columns}
                                            data={bubbleTweets.data}
                                            actions={goToTweetAction}
                                        />
                                    </div>
                                }
                            </div>
                        }
                        {
                            ((topUserProfile && topUserProfile.length === 0) || result.tweetCount.count === "0") &&
                            <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                        }
                        {
                            (!topUserProfile && result.tweetCount.count !== "0") &&
                            <CircularProgress className={classes.circularProgress} />
                        }
                    </AccordionDetails>
                </Accordion>
            }
            {
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className={classes.heading}>{keyword("heatmap_chart_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            result && result.heatMap &&
                            <Box alignItems="center" justifyContent="center" width={"100%"}>
                                {
                                    ((result.heatMap.isAllnul) &&
                                        <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>) ||
                                    <div>
                                        <Plot
                                            style={{ width: '100%', height: "450px" }}
                                            data={result.heatMap.plot}
                                            config={result.heatMap.config}
                                            layout={result.heatMap.layout}
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
                                                        keyword('twittersna_result_hide')
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
                                                        keyword('twittersna_result_download')
                                                    }
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Box m={2} />
                                        <CustomTable title={keyword("twittersna_result_slected_tweets")}
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
                    </AccordionDetails>
                </Accordion>
            }
            {
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className={classes.heading}>{keyword("hashtag_graph_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    {
                        result && result.coHashtagGraph && result.coHashtagGraph.data.nodes.length === 0 &&
                        <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                    }
                    {
                        result && result.coHashtagGraph && result.coHashtagGraph.data.nodes.length !== 0 &&
                        <div style={{ width: '100%' }}>
                            <Box pb={3}>
                                <Grid container justify="space-between" spacing={2}
                                    alignContent={"center"}>
                                    <Grid item>
                                        <CSVLink
                                            data={result.coHashtagGraph.data.nodes}
                                            filename={"Nodes_" + keyword("hashtag_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"}
                                            className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                            {
                                                "CSV Nodes"
                                            }
                                        </CSVLink>
                                    </Grid>
                                    <Grid item>
                                        <CSVLink
                                            data={result.coHashtagGraph.data.edges}
                                            filename={"Edges_" + keyword("hashtag_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"}
                                            className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                            {
                                                "CSV Edges"
                                            }
                                        </CSVLink>
                                    </Grid>
                                </Grid>
                            </Box>
                            {
                                (coHashtagGraphReset === null && coHashtagGraphClickNode === null && result.coHashtagGraph.data.nodes.length !== 0) &&
                                <div>
                                    <Sigma graph={result.coHashtagGraph.data}
                                        renderer={"canvas"}
                                        style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                        onClickNode={(e) => onClickNodeCoHashtagGraph(e)}
                                        settings={{
                                            drawEdges: true,
                                            drawEdgeLabels: false,
                                            minNodeSize: 6,
                                            maxNodeSize: 20,
                                            minEdgeSize: 1,
                                            maxEdgeSize: 5,
                                            defaultNodeColor: "#3388AA",
                                            defaultEdgeColor: "#C0C0C0",
                                            edgeColor: "default"
                                        }}
                                    >
                                        <RandomizeNodePositions>
                                            <ForceAtlas2 iterationsPerRender={1} timeout={15000} />
                                        </RandomizeNodePositions>
                                    </Sigma>
                                </div>
                            }
                            {
                                (coHashtagGraphReset !== null && coHashtagGraphClickNode !== null) &&
                                <div>
                                    <Sigma graph={coHashtagGraphClickNode}
                                        renderer={"canvas"}
                                        style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                        onClickStage={(e) => onClickStageCoHashtagGraph(e)}
                                        settings={{
                                            drawEdges: true,
                                            drawEdgeLabels: false,
                                            minNodeSize: 6,
                                            maxNodeSize: 20,
                                            minEdgeSize: 1,
                                            maxEdgeSize: 5,
                                            defaultNodeColor: "#3388AA",
                                            defaultEdgeColor: "#C0C0C0",
                                            edgeColor: "default"
                                        }}
                                    >
                                    </Sigma>
                                </div>
                            }
                            {
                                (coHashtagGraphReset !== null && coHashtagGraphClickNode === null) &&
                                <div>
                                    <Sigma graph={coHashtagGraphReset}
                                        renderer={"canvas"}
                                        style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                        onClickNode={(e) => onClickNodeCoHashtagGraph(e)}
                                        settings={{
                                            drawEdges: true,
                                            drawEdgeLabels: false,
                                            minNodeSize: 6,
                                            maxNodeSize: 20,
                                            minEdgeSize: 1,
                                            maxEdgeSize: 5,
                                            defaultNodeColor: "#3388AA",
                                            defaultEdgeColor: "#C0C0C0",
                                            edgeColor: "default"
                                        }}
                                    >
                                    </Sigma>
                                </div>
                            }
                            <Box m={1} />
                            <OnClickInfo keyword={"twittersna_hashtag_graph_tip"} />
                            <Box m={2} />
                            {
                                coHashtagGraphTweets &&
                                <div>
                                    <Grid container justify="space-between" spacing={2}
                                        alignContent={"center"}>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"secondary"}
                                                onClick={() => setCoHashtagGraphTweets(null)}>
                                                {
                                                    keyword('twittersna_result_hide')
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => downloadClick(coHashtagGraphTweets.csvArr, "#" + coHashtagGraphTweets.selected)}>
                                                {
                                                    keyword('twittersna_result_download')
                                                }
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box m={2} />
                                    <CustomTable title={keyword("twittersna_result_slected_tweets")}
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
                    </AccordionDetails>
                </Accordion>
            }
            {
                props.request.userList.length === 0 && result &&
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography className={classes.heading}>{keyword("sosem_4mode_graph_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    {
                        result.socioSemantic4ModeGraph && result.socioSemantic4ModeGraph.data.nodes.length !== 0 &&
                            <div style={{ width: '100%' }}>
                                <Box pb={3}>
                                    <Grid container justify="space-between" spacing={2}
                                        alignContent={"center"}>
                                        <Grid item>
                                            <CSVLink
                                                data={result.socioSemantic4ModeGraph.data.nodes}
                                                filename={"Nodes_" + keyword("sosem_4mode_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"} 
                                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                                {
                                                    "CSV Nodes"
                                                }
                                            </CSVLink>
                                        </Grid>
                                        <Grid item>
                                            <CSVLink
                                                data={result.socioSemantic4ModeGraph.data.edges}
                                                filename={"Edges_" + keyword("sosem_4mode_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"} 
                                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                                {
                                                    "CSV Edges"
                                                }
                                            </CSVLink>
                                        </Grid>
                                    </Grid>
                                </Box>
                                {
                                    (socioSemantic4ModeGraphReset === null && socioSemantic4ModeGraphClickNode === null && result.socioSemantic4ModeGraph.data.nodes.length !== 0) &&
                                    <div>
                                        <Sigma graph={result.socioSemantic4ModeGraph.data}
                                            renderer={"canvas"}
                                            style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                            onClickNode={(e) => onClickNodeSocioSemantic4ModeGraph(e)}
                                            settings={{
                                                drawEdges: true,
                                                drawEdgeLabels: false,
                                                minNodeSize: 6,
                                                maxNodeSize: 20,
                                                minEdgeSize: 1,
                                                maxEdgeSize: 5,
                                                defaultNodeColor: "#3388AA",
                                                defaultEdgeColor: "#C0C0C0",
                                                edgeColor: "default"
                                            }}
                                        >
                                            <RandomizeNodePositions>
                                                <ForceAtlas2 iterationsPerRender={1} timeout={15000} scalingRatio={2} />
                                            </RandomizeNodePositions>
                                        </Sigma>
                                    </div>
                                }
                                {
                                    (socioSemantic4ModeGraphReset !== null && socioSemantic4ModeGraphClickNode !== null) &&
                                    <div>
                                        <Sigma graph={socioSemantic4ModeGraphClickNode}
                                            renderer={"canvas"}
                                            style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                            onClickStage={(e) => onClickStageSocioSemantic4ModeGraph(e)}
                                            settings={{
                                                drawEdges: true,
                                                drawEdgeLabels: false,
                                                minNodeSize: 6,
                                                maxNodeSize: 20,
                                                minEdgeSize: 1,
                                                maxEdgeSize: 5,
                                                defaultNodeColor: "#3388AA",
                                                defaultEdgeColor: "#C0C0C0",
                                                edgeColor: "default"
                                            }}
                                        >
                                        </Sigma>
                                    </div>
                                }
                                {
                                    (socioSemantic4ModeGraphReset !== null && socioSemantic4ModeGraphClickNode === null) &&
                                    <div>
                                        <Sigma graph={socioSemantic4ModeGraphReset}
                                            renderer={"canvas"}
                                            style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                            onClickNode={(e) => onClickNodeSocioSemantic4ModeGraph(e)}
                                            settings={{
                                                drawEdges: true,
                                                drawEdgeLabels: false,
                                                minNodeSize: 6,
                                                maxNodeSize: 20,
                                                minEdgeSize: 1,
                                                maxEdgeSize: 5,
                                                defaultNodeColor: "#3388AA",
                                                defaultEdgeColor: "#C0C0C0",
                                                edgeColor: "default"
                                            }}
                                        >
                                        </Sigma>
                                    </div>
                                }
                                <Box m={1}/>
                                <OnClickInfo keyword={"twittersna_sosem_4mode_graph_tip"}/>
                                <Box m={2}/>
                                {
                                    socioSemantic4ModeGraphTweets &&
                                    <div>
                                        <Grid container justify="space-between" spacing={2}
                                            alignContent={"center"}>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"secondary"}
                                                    onClick={() => setSocioSemantic4ModeGraphTweets(null)}>
                                                    {
                                                        keyword('twittersna_result_hide')
                                                    }
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    onClick={() => downloadClick(socioSemantic4ModeGraphTweets.csvArr, socioSemantic4ModeGraphTweets.selected)}>
                                                    {
                                                        keyword('twittersna_result_download')
                                                    }
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Box m={2} />
                                        <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                            colums={socioSemantic4ModeGraphTweets.columns}
                                            data={socioSemantic4ModeGraphTweets.data}
                                            actions={goToTweetAction}
                                        />
                                    </div>
                                }
                            </div>
                        }
                        {
                            result.socioSemantic4ModeGraph && result.socioSemantic4ModeGraph.data.nodes.length === 0 &&
                            <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                        }
                        {
                            result.socioSemantic4ModeGraph === undefined &&
                            <CircularProgress className={classes.circularProgress} />
                        }
                    </AccordionDetails>
                </Accordion>
            }
            {
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading}>{keyword(result.cloudChart.title)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {
                            result && result.cloudChart && result.cloudChart.json &&
                            <Box alignItems="center" justifyContent="center" width={"100%"}>
                                <div height={"500"} width={"100%"} >
                                    {
                                        (result.cloudChart.json && result.cloudChart.json.length === 0) &&
                                        <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>}
                                    {(result.cloudChart.json && result.cloudChart.json.length !== 0) &&
                                        <Grid container justify="space-between" spacing={2}
                                            alignContent={"center"}>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    onClick={() => downloadAsPNG("top_words_cloud_chart")}>
                                                    {
                                                        keyword('twittersna_result_download_png')
                                                    }
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <CSVLink
                                                    data={getCSVData()} headers={CSVheaders} filename={filesNames + ".csv"} className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                                    {
                                                        "CSV"
                                                        // keyword('twittersna_result_download_csv')
                                                    }
                                                </CSVLink>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    onClick={() => downloadAsSVG("top_words_cloud_chart")}>
                                                    {
                                                        keyword('twittersna_result_download_svg')
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
                                                        keyword('twittersna_result_hide')
                                                    }
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    onClick={() => downloadClick(cloudTweets.csvArr, "word_" + cloudTweets.selected)}>
                                                    {
                                                        keyword('twittersna_result_download')
                                                    }
                                                </Button>
                                            </Grid>
                                        </Grid>
                                        <Box m={2} />
                                        <CustomTable
                                            title={keyword("twittersna_result_slected_tweets")}
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
                    </AccordionDetails>
                </Accordion>
            }
            {
                props.request.userList.length === 0 && result &&
                <Paper>
                    <Toolbar>
                        <Typography className={classes.heading}>{keyword("export_graph_title")}</Typography>
                        <div style={{ flexGrow: 1 }} />
                        {
                            gexfExport && gexfExport.map((gexfRes, index) => {
                                return (
                                    <Button
                                        key={index}
                                        aria-label="download"
                                        disabled={_.isEmpty(gexfExport)}
                                        startIcon={<SaveIcon />}
                                        href={gexfExport ? gexfRes.getUrl : undefined}
                                        tooltip={keyword("twittersna_result_download")}>
                                        {keyword("twittersna_result_download") + " " + gexfRes.title}
                                    </Button>
                                )
                            })
                        }
                    </Toolbar>
                    <Box pb={2}>
                    <Box alignItems="center" justifyContent="center" width={"100%"}>
                        <div style={{margin: 20}}>
                            <Grid container justify="space-between" spacing={2}
                                alignContent={"center"}>
                                {
                                    gexfExport && gexfExport.map((gexfRes, index) => {
                                        return (
                                            <Grid item key={Math.random()}>
                                                <Button
                                                    key={index}
                                                    variant={"contained"}
                                                    color={"primary"}
                                                    startIcon={<BubbleChartIcon />}
                                                    disabled={_.isEmpty(gexfExport)}
                                                    href={gexfExport ? gexfRes.visualizationUrl : undefined}
                                                    target="_blank"
                                                    rel="noopener"
                                                    tooltip={gexfExport ? gexfRes.message : undefined}
                                                >
                                                    {gexfRes.title/* {keyword("twittersna_result_view_graph")} */}
                                                </Button>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                        </div>
                    </Box>
                    {
                        (!gexfExport && result.tweetCount.count !== "0") &&
                        <CircularProgress className={classes.circularProgress} />
                    }
                    </Box>
                    <Box m={1} />
                    <OnClickInfo keyword={"twittersna_export_graph_tip"} />
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
                        title={keyword("twittersna_result_url_in_tweets")}
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
                                                        keyword('twittersna_result_submit_twitter_sna')
                                                    }
                                                    </span>),
                                tooltip: keyword("twittersna_result_submit_twitter_sna"),
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