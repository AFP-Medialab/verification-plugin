import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../../../redux/actions/errorActions";
import { setTwitterSnaLoading, setTwitterSnaResult, setTwitterSnaLoadingMessage } from "../../../../../redux/actions/tools/twitterSnaActions";
import axios from "axios";


import {
    generateDonutPlotlyJson,
    generateEssidHistogramPlotlyJson,
    generateTweetCountPlotlyJson,
    generateURLArrayHTML,
    generateWordCloudPlotlyJson,
    getTweets
} from "../Results/call-elastic";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/TwitterSna.tsv";

const includeWordObj = (wordObj, wordsArray) => {
    for (let i = 0; i < wordsArray.length; i++) {
        if (wordsArray[i].word === wordObj.word)
            return i;
    }
    return -1;
}

function getNbTweetsInHour(date, bucket)
{
    var nbTweets = 0;
    var day = date.toLocaleDateString();
    var hour = date.getHours();
    
    bucket.forEach(tweet => {
        var tweetDate = new Date(tweet._source.date);
        var TweetDay = tweetDate.toLocaleDateString();
        var tweetHour = tweetDate.getHours();

        if (day === TweetDay && tweetHour == hour)
            nbTweets++;
    });
    return nbTweets;
}

function getnMax(objArr, n) {
    let sorted = [...(objArr.sort((a, b) => b.nbOccurences - a.nbOccurences))];
    return sorted.splice(0, n);
}

function getColor(entity) {
    if (entity === "Person") return '#8242BB';
    if (entity === "Organization") return '#BB424F';
    if (entity === "UserID") return '#42BB9E';
    if (entity === "Location") return '#BB7042';

    return '#35347B';
}

const useTwitterSnaRequest = (request) => {

    const TwintWrapperUrl = process.env.REACT_APP_TWINT_WRAPPER_URL;
    const keyword = useLoadLanguage("components/NavItems/tools/TwitterSna.tsv", tsv);

    const dispatch = useDispatch();

    useEffect(() => {
        if (request === null)
            return;

        let tweetIE = { text: "" };

        const getAllWordsMap = (elasticResponse) => {
            let hits = Array.from(elasticResponse.hits.hits);
            let wordsMap = [];

            for (let i = 0; i < hits.length; i++) {
                tweetIE.text = hits[i]._source.twittieTweet;



                let tweetWordsmap = hits[i]._source.wit;
                if (tweetWordsmap === null || tweetWordsmap === undefined)
                    return [];
                var arr = Array.from(tweetWordsmap);

                arr.forEach(word => {
                    let j = includeWordObj(word, wordsMap)
                    if (j !== -1) {
                        wordsMap[j].nbOccurences += word.nbOccurences;

                    }
                    else {

                        wordsMap.push(word);
                    }
                });

            }
            return getnMax(wordsMap, 100);
        };

        const handleErrors = (e) => {
            if (keyword(e) !== "")
                dispatch(setError(keyword(e)));
            else
                dispatch(setError(keyword("default_sna_error")));
            dispatch(setTwitterSnaLoading(false));
        };

        const createPieCharts = (data, responseArrayOf7) => {
            let cloudLayout = {
                title: "",
                automargin: true,
                width: 500,
                height: 500
            };

            let config = {
                displayModeBar: true,
                toImageButtonOptions: {
                    format: 'png', // one of png, svg, jpeg, webp
                    filename: data.keywordList.join("&") + "_" + data.from + "_" + data.until + "_Tweets",
                    scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
                },
                modeBarButtons: [["toImage"]],
                displaylogo: false
            };
            let titleEnd = data.keywordList.join("&") + " " + data.from + " " + data.until;
            let titles = [
                "retweets_cloud_chart_title",
                "likes_cloud_chart_title",
                "top_users_pie_chart_title",
                "hashtag_cloud_chart_title"
            ];

            let pieCharts = [];

            for (let cpt = 0; cpt < titles.length; cpt++) {
                cloudLayout.title = <div><b>{keyword(titles[cpt])}</b><br /> {titleEnd}</div>;
                pieCharts.push(
                    {
                        title: titles[cpt],
                        json: responseArrayOf7[cpt],
                        layout: cloudLayout,
                        config: config,
                    }
                );
            }
            return pieCharts;
        };

        const createHistogram = (data, json, givenFrom, givenUntil) => {
            let titleEnd = request.keywordList.join("&") + " " + request.from + " " + request.until;
            let layout = {
                title: <div><b>{keyword("user_time_chart_title")}</b><br /> {titleEnd}</div>,
                automargin: true,
                xaxis: {
                    range: [request.from, request.until],
                    rangeslider: { range: [givenFrom, givenUntil] },
                },
                annotations: [{
                    xref: 'paper',
                    yref: 'paper',
                    x: 1.2,
                    xanchor: 'right',
                    y: -0.4,
                    yanchor: 'top',
                    text: 'we-verify.eu',
                    showarrow: false
                }],
                autosize: true,
            };


            let config = {
                displayModeBar: true,
                toImageButtonOptions: {
                    format: 'png', // one of png, svg, jpeg, webp
                    filename: data.keywordList.join("&") + "_" + data["from"] + "_" + data["until"] + "_Timeline",
                    scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
                },

                responsive: true,
                modeBarButtons: [["toImage"]],
                displaylogo: false,
            };
            return {
                title: "user_time_chart_title",
                json: json,
                layout: layout,
                config: config,
                tweetsView: null,
            }
        };

        const createWordCloud = (plotlyJson) => {

            let mostUsedWords = getAllWordsMap(plotlyJson);
            mostUsedWords = mostUsedWords.map(word => {
                 let w = ((word.word.includes('@')?word.word:word.word.replace(/_/g, " "))); 
                 return { 'text': w, 'value': word.nbOccurences, 'entity': word.entity, 'color': getColor(word.entity) };
                });
            const options = {
                //  colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
                enableTooltip: true,
                deterministic: true,
                fontFamily: 'impact',
                fontSizes: [15, 80],
                fontStyle: 'normal',
                fontWeight: 'normal',
                padding: 1,
                rotations: 3,
                rotationAngles: [0, 30],
                scale: 'sqrt',
                spiral: 'rectangular',
                 transitionDuration: 1000,
            };

            return {
                title: "top_words_cloud_chart_title",
                json: mostUsedWords,
                options: options,
            }

        }

        const makeResult = (data, responseArrayOf7, givenFrom, givenUntil, final) => {

            const result = {};
            result.pieCharts = createPieCharts(data, responseArrayOf7);
            result.urls = responseArrayOf7[4];
            result.tweetCount = {};
            result.tweetCount.count = responseArrayOf7[5].value.toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.tweetCount.retweet = responseArrayOf7[5].retweets.toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.tweetCount.like = responseArrayOf7[5].likes.toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.tweets = responseArrayOf7[5].tweets;
            result.histogram = createHistogram(data, responseArrayOf7[6], givenFrom, givenUntil);
            if (final) {
                result.cloudChart = createWordCloud(responseArrayOf7[7]);
                createHeatMap(request, responseArrayOf7[5].tweets).then(heatMap => result.heatMap = heatMap);
            }
            dispatch(setTwitterSnaResult(request, result, false, true))
        };

    

        async function createHeatMap(entries, hits)
        {
            var firstDate = new Date(entries.from);
            firstDate.setHours(1);
            firstDate.setMinutes(0);
            firstDate.setSeconds(0);
            var firstArrElt = new Date(firstDate); 
            var lastDate = new Date(entries.until);
            lastDate.setHours(1);
            lastDate.setMinutes(0);
            lastDate.setSeconds(0);
            var dates = [firstArrElt];
            while (firstDate.getTime() !== lastDate.getTime())
            {
                var newDate = new Date(firstDate); 
                firstDate.setDate(firstDate.getDate() + 1);
                newDate.setDate(newDate.getDate() + 1);
                dates = [...dates, newDate]
            }
            var hoursY = ['12:00:00 AM', '1:00:00 AM', '2:00:00 AM', '3:00:00 AM', '4:00:00 AM', '5:00:00 AM', '6:00:00 AM', '7:00:00 AM', '8:00:00 AM', '9:00:00 AM', '10:00:00 AM', '11:00:00 AM', '12:00:00 PM','1:00:00 PM', '2:00:00 PM', '3:00:00 PM', '4:00:00 PM', '5:00:00 PM', '6:00:00 PM', '7:00:00 PM', '8:00:00 PM', '9:00:00 PM', '10:00:00 PM', '11:00:00 PM'];
            
            var nbTweetsZ = [];
            var i = 0;
            let datesX = [];
            dates.forEach(date => {
                hoursY.forEach(time => {
                    nbTweetsZ.push([])
                
                    date.setHours(i);
                    nbTweetsZ[i].push(getNbTweetsInHour(date, hits));

                    i++;
                    });
                i = 0;
                datesX = [...datesX, date.toDateString()];
            });

            console.log("FINISHED Building heatMap");
            return [{
                z: nbTweetsZ,
                x: datesX,
                y: hoursY,
                colorscale: 'Reds',
                type: 'heatmap'
            }];
        
        }


        const makeEntries = (data) => {
            return {
                from: request.from,
                until: request.until,
                keywordList: request.keywordList,
                bannedWords: request.bannedWords,
                userList: request.userList,
                session: data.session
            };
        };


        const generateGraph = (data, final) => {
            let givenFrom = data.query.from;
            let givenUntil = data.query.until;
            let entries = makeEntries(data);
            let generateList = [
                generateDonutPlotlyJson(entries, "nretweets"),
                generateDonutPlotlyJson(entries, "nlikes"),
                generateDonutPlotlyJson(entries, "ntweets"),
                generateDonutPlotlyJson(entries, "hashtags"),
                generateURLArrayHTML(entries),
                generateTweetCountPlotlyJson(entries, givenFrom, givenUntil),
                generateEssidHistogramPlotlyJson(entries, false, givenFrom, givenUntil)
            ];
            return axios.all(
                (final) ? [...generateList, generateWordCloudPlotlyJson(entries)] : generateList
            )
                .then(responseArrayOf8 => {
                    makeResult(data.query, responseArrayOf8, givenFrom, givenUntil, final);
                });

        };

        const lastRenderCall = (sessionId) => {
            axios.get(TwintWrapperUrl + /status/ + sessionId)
                .then(response => {
                    if (response.data.status === "Error")
                        handleErrors("twitterSnaErrorMessage");
                    else {
                        generateGraph(response.data, true).then(() => {
                            dispatch(setTwitterSnaLoading(false));
                        });
                    }
                })
                .catch(e => handleErrors(e))

        };

        const getResultUntilsDone = (sessionId) => {
            axios.get(TwintWrapperUrl + /status/ + sessionId)
                .then(response => {
                    console.log(response.data);
                    if (response.data.status === "Error")
                        handleErrors("twitterSnaErrorMessage");
                    else if (response.data.status === "Done")
                    {
                        lastRenderCall(sessionId);
                        dispatch(setTwitterSnaLoadingMessage(""));
                    }
                    else if (response.data.status === "CountingWords")
                    {
                        dispatch(setTwitterSnaLoadingMessage("Counting Words ADD TSV"));
                        getResultUntilsDone(sessionId);
                    }
                    else {
                        generateGraph(response.data, false).then(() => {
                            setTimeout(() => getResultUntilsDone(sessionId), 5000)

                            dispatch(setTwitterSnaLoadingMessage("Fetching Tweets ADD TSV"));
                        });
                    }
                })
                .catch(e => handleErrors(e))
        };

        
        dispatch(setTwitterSnaLoading(true));
        axios.post(TwintWrapperUrl + "/collect", request)
            .then(response => {
                if (response.data.status === "Error")
                    handleErrors("twitterSnaErrorMessage");
                else if (response.data.status === "Done")
                    lastRenderCall(response.data.session);
                else
                    getResultUntilsDone(response.data.session)

            })
            .catch(e => handleErrors(e))
    }, [JSON.stringify(request)])

    /* useEffect(() => {
         
         function unrotateMainHashtag(search) {
             console.log(document.getElementsByClassName("slicetext"));
             [...document.getElementsByClassName("slicetext")].forEach(slice => {
                 console.log(slice);
                 if (slice.dataset.unformatted === search) {
                     var transform = slice.getAttribute("transform");
         
                     let translates = transform.split(/rotate\(...\)/);
                     let newTransform = "";
                     translates.forEach(translate => newTransform += translate);
                     slice.setAttribute("transform", newTransform);
                 }
             })
         }
 
         console.log(request);
         unrotateMainHashtag(request.keywordList.join(","));
     }, [JSON.stringify(request)])*/
};
export default useTwitterSnaRequest;