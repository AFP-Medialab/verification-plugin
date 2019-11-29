import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setError} from "../../../../redux/actions/errorActions";
import {setTwitterSnaLoading, setTwitterSnaResult} from "../../../../redux/actions/tools/twitterSnaActions";
import axios from "axios";
import {
    generateDonutPlotlyJson,
    generateEssidHistogramPlotlyJson,
    generateTweetCountPlotlyJson,
    generateURLArrayHTML,
} from "./call-elastic";

const useTwitterSnaRequest = (request) => {
    const TwintWrapperUrl = "http://185.249.140.38/twint-wrapper";


    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    const dispatch = useDispatch();

    useEffect(() => {
        if (request === null)
            return;

        const handleErrors = (e) => {
            if (keyword(e) !== undefined)
                dispatch(setError(keyword(e)));
            else
                dispatch(setError("default twitter sna error (Add tsv)"));
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
                toImageButtonOptions: {
                    format: 'png', // one of png, svg, jpeg, webp
                    filename: data.search.search + "_" + data.from + "_" + data.until + "_Tweets",
                    scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
                },
                modeBarButtons: [["toImage"]],
                displaylogo: false
            };
            let titleEnd = data.search.search + " " + data.from + " " + data.until;
            let titles = [
                "retweets_cloud_chart_title",
                "likes_cloud_chart_title",
                "top_users_pie_chart_title",
                "hashtag_cloud_chart_title"
            ];

            let pieCharts = [];

            for (let cpt = 0; cpt < titles.length; cpt++) {
                cloudLayout.title = <div><b>{keyword(titles[cpt])}</b><br/> {titleEnd}</div>;
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
            let titleEnd = data.search.search + " " + data.from + " " + data.until;
            let layout = {
                title:  <div><b>{keyword("user_time_chart_title")}</b><br/> {titleEnd}</div>,
                automargin: true,
                xaxis: {
                    range: [ data.from, data.until],
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
                toImageButtonOptions: {
                    format: 'png', // one of png, svg, jpeg, webp
                    filename: data["search"]["search"] + "_" + data["from"] + "_" + data["until"] + "_Timeline",
                    scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
                },

                responsive: true,
                modeBarButtons: [["toImage"]],
                displaylogo: false
            };
            return {
                title: "user_time_chart_title",
                json: json,
                layout:layout,
                config:config,
                tweetsView: null,
            }
        };

        const makeResult = (data, responseArrayOf7, givenFrom, givenUntil) => {
            const result = {};
            result.pieCharts = createPieCharts(data, responseArrayOf7);
            result.urls = responseArrayOf7[4];
            result.tweetCount = responseArrayOf7[5].value;
            result.tweets = responseArrayOf7[5].tweets;
            result.histogram = createHistogram(data, responseArrayOf7[6], givenFrom, givenUntil);
            dispatch(setTwitterSnaResult(request, result, false, true))
        };

        const generateGraph = (data) => {
            let givenFrom = data.query.from;
            let givenUntil = data.query.until;
            let entries = {
                from: request.from,
                until: request.until,
                search: {
                    search: request.search.search,
                    and: request.search.and,
                },
                user_list: request.user_list,
                session: data.session
            };

            return axios.all([
                generateDonutPlotlyJson(entries, "nretweets"),
                generateDonutPlotlyJson(entries, "nlikes"),
                generateDonutPlotlyJson(entries, "ntweets"),
                generateDonutPlotlyJson(entries, "hashtags"),
                generateURLArrayHTML(entries),
                generateTweetCountPlotlyJson(entries, givenFrom, givenUntil),
                generateEssidHistogramPlotlyJson(entries, false, givenFrom, givenUntil),
            ])
                .then(responseArrayOf7 => {
                    makeResult(data.query, responseArrayOf7, givenFrom, givenUntil);
                });

        };

        const lastRenderCall = (sessionId) => {
            axios.get(TwintWrapperUrl + /status/ + sessionId)
                .then(response => {
                    if (response.data.status === "Error")
                        handleErrors("twitterSnaErrorMessage");
                    else {
                        generateGraph(response.data).then(() => {
                            dispatch(setTwitterSnaLoading(false))
                        });
                    }
                })
                .catch(e => handleErrors(e))
        };

        const getResutUntilsDone = (sessionId) => {
            axios.get(TwintWrapperUrl + /status/ + sessionId)
                .then(response => {
                    if (response.data.status === "Error")
                        handleErrors("twitterSnaErrorMessage");
                    else if (response.data.status === "Done")
                        lastRenderCall(sessionId);
                    else {
                        generateGraph(response.data).then(() => {
                            setTimeout(() => getResutUntilsDone(sessionId), 2000)
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
                    getResutUntilsDone(response.data.session)
            })
            .catch(e => handleErrors(e))
    }, [JSON.stringify(request)])
};
export default useTwitterSnaRequest;