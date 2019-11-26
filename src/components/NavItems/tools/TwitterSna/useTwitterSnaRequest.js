import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setError} from "../../../../redux/actions/errorActions";
import {setTwitterSnaLoading, setTwitterSnaResult} from "../../../../redux/actions/tools/twitterSnaActions";
import axios from "axios";
import {generateDonutPlotlyJson, generateEssidHistogramPlotlyJson, generateURLArrayHTML} from "./call-elastic";
import Plot from 'react-plotly.js';

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

        const makeResult = (data, responseArrayOf6) => {
            const result = [];

            let cloudLayout = {
                title: "",
                automargin: true,
                width: 500,
                height: 500
            };
            console.log(data)

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

            cloudLayout.title = <div><b>{keyword("retweets_cloud_chart_title")}</b><br /> { titleEnd }</div>;
            result.push({
                title: "retweets_cloud_chart_title",
                component: <Plot data={responseArrayOf6[0]} layout={cloudLayout} config={config}/>
            });
            cloudLayout.title = <div><b>{keyword("likes_cloud_chart_title")}</b><br /> { titleEnd }</div>;
            result.push({
                title: "likes_cloud_chart_title",
                component: <Plot data={responseArrayOf6[1]} layout={cloudLayout} config={config}/>
            });
            cloudLayout.title = <div><b>{keyword("tweetCounter_title")}</b><br /> { titleEnd }</div>;
            result.push({
                title:"tweetCounter_title",
                component: <Plot data={responseArrayOf6[2]} layout={cloudLayout} config={config}/>
            });
            cloudLayout.title = <div><b>{keyword("hashtag_cloud_chart_title")}</b><br /> { titleEnd }</div>;
            result.push({
                title: "hashtag_cloud_chart_title",
                component: <Plot data={responseArrayOf6[3]} layout={cloudLayout} config={config}/>
            });

            dispatch(setTwitterSnaResult(request, result, false, false))
        };

        const generateGraph = (data) => {
            let givenFrom = data["query"]["from"];
            let givenUntil = data["query"]["until"];
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

            axios.all([
                generateDonutPlotlyJson(entries, "nretweets"),
                generateDonutPlotlyJson(entries, "nlikes"),
                generateDonutPlotlyJson(entries, "ntweets"),
                generateDonutPlotlyJson(entries, "hashtags"),
                generateURLArrayHTML(entries),
                generateEssidHistogramPlotlyJson(entries, false, givenFrom, givenUntil)
            ])
                .then(responseArrayOf6 => {
                    makeResult(data.query, responseArrayOf6);
                });
        };

        const lastRenderCall = (sessionId) => {
            console.log(sessionId);
            axios.get(TwintWrapperUrl + /status/ + sessionId)
                .then(response => {
                    if (response.data.status === "Error")
                        handleErrors("twitterSnaErrorMessage");
                    else {
                        generateGraph(response.data);
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
                        generateGraph(response.data);
                        setTimeout(() => getResutUntilsDone(sessionId), 2000)
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