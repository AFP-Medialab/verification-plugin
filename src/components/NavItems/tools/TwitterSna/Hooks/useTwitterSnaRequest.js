import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../../../redux/actions/errorActions";
import { setTwitterSnaLoading, setTwitterSnaResult, setTwitterSnaLoadingMessage } from "../../../../../redux/actions/tools/twitterSnaActions";
import axios from "axios";
import _ from "lodash";
import { jLouvain } from 'jlouvain';

import {
  getPlotlyJsonDonuts,
  getPlotlyJsonHisto,
  getJsonCounts,
  getReactArrayURL,
  generateWordCloudPlotlyJson
} from "../Results/call-elastic";

import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/TwitterSna.tsv";

import useAuthenticatedRequest from '../../../../Shared/Authentication/useAuthenticatedRequest';



const includeWordObj = (wordObj, wordsArray) => {
  for (let i = 0; i < wordsArray.length; i++) {
    if (wordsArray[i].word === wordObj)
      return i;
  }
  return -1;
};

function getNbTweetsInHour(date, bucket) {
  var nbTweets = 0;
  var day = date.toLocaleDateString();
  var hour = date.getHours();

  bucket.forEach(tweet => {
    var tweetDate = new Date(tweet._source.date);
    var TweetDay = tweetDate.toLocaleDateString();
    var tweetHour = tweetDate.getHours();

    if (day === TweetDay && tweetHour === hour)
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

function getUniqValuesOfField(hits, field) {
  let nodeIds = hits.tweets.filter(tweet => tweet._source[field] !== undefined)
                          .map((tweet) => {return tweet._source[field]})
                          .flat();
  let uniqNodeIds = _.uniqWith(nodeIds, _.isEqual);
  return uniqNodeIds;
}

function getNodesAsUsername(hits) {
  let nodes = getUniqValuesOfField(hits, "username").map((val) => { return {id: val, label: val}});
  return nodes;
}

function getNodesAsMentions(hits) {
  let nodes = getUniqValuesOfField(hits, "mentions").map((val) => { return {id: val, label: val}});
  return nodes;
}

function getNodesAsURLs(hits) {
  let nodes = getUniqValuesOfField(hits, "urls").map((val) => { return {id: val, label: val}});
  return nodes;
}

function getNodesAsReplyTo(hits) {
  let nodes = getUniqValuesOfField(hits, "reply_to").map((val) => { return {id: val.username, label: val.username} } );
  // let uniqNodes = uniqueJsonsArrById(nodes);
  // return uniqNodes;
  return nodes;
}

function getNodesAsTweets(hits) {
  let tweetNodes = hits.tweets.map((tweet) => { return { id: tweet._source.id, label: tweet._source.tweet }; });
  let uniqNodes = _.uniqBy(tweetNodes, 'id');
  return uniqNodes;
}

function getNodesAsHashtags(hits, request) {
  let uniqHashtags = getUniqValuesOfField(hits, "hashtags");
  let searchedHashtags = request.keywordList.filter((word) => word.startsWith("#"));
  
  let colors = []
  searchedHashtags.forEach(hashtag => { colors[hashtag] = '#'+(Math.random()*0xFFFFFF<<0).toString(16); });

  let nodes = uniqHashtags.map((hashtag) => { 
    if (searchedHashtags.includes(hashtag)) {
      return {id: hashtag, label: hashtag, color: colors[hashtag], type: 'star'}
    } else {
      return {id: hashtag, label: hashtag, color: '#C0C0C0', type: 'star'}
    }
  });
  return nodes;
}

function getEdgesCombinationNodes(nodes, edgeLabel) {
  let edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push({id: nodes[i].id + '_and_' + nodes[j].id, source: nodes[i].id, target: nodes[j].id, label: edgeLabel});
    }
  }
  return edges;
}

function getEdgesTweetToTweet(hits, fieldArr = "hashtags") {
  let uniqFieldVals = getUniqValuesOfField(hits, fieldArr);
  let edges = [];
  uniqFieldVals.forEach(val => {
    let nodesTweet = hits.tweets.filter(tweet => tweet._source[fieldArr] !== undefined)
                              .filter(tweet => tweet._source[fieldArr].includes(val))
                              .map((tweet) => { return { id: tweet._source.id, label: val }; });
    let edgesTweet = getEdgesCombinationNodes(nodesTweet, val);
    edges.push(edgesTweet);
  });

  return _.uniqBy(edges.flat(), 'id');;
}

function getEdgesUsernameToField(hits, fieldArr = "hashtags") {
  let tweets = hits.tweets.filter(tweet => tweet._source[fieldArr] !== undefined);

  let edges = tweets.map((tweet) => {
    let edgesFieldElement = [];
    let username = tweet._source.username;

    switch (fieldArr) {
      case "reply_to":
        tweet._source[fieldArr].forEach(element => {
          edgesFieldElement.push({id: username + "_and_" + element.username, source: username, target: element.username});
        });
        break;
      default:
        tweet._source[fieldArr].forEach(element => {
          edgesFieldElement.push({id: username + "_and_" + element, source: username, target: element});
        });
        break;
    }

    return edgesFieldElement;

  }).flat();

  return _.uniqBy(edges, 'id');
}

function getEdgesTweetsSharingHashtag(hits) {
  let tweetHashtags = hits.tweets.filter(tweet => tweet._source.hashtags !== undefined)
                              .map((tweet) => {return tweet._source.hashtags})
                              .flat();
  let uniqHashtags = [...new Set(tweetHashtags)];
  let edges = [];
  uniqHashtags.forEach(hashtag => {
  let nodesTweet = hits.tweets.filter(tweet => tweet._source.hashtags !== undefined)
                            .filter(tweet => tweet._source.hashtags.includes(hashtag))
                            .map(function(tweet) { return { id: tweet._source.id, label: hashtag }; });
  let edgesHashtag = getEdgesCombinationNodes(nodesTweet, hashtag);
  edges.push(edgesHashtag);
  });

  let uniqEdges = _.uniqBy(edges.flat(), 'id');
  return uniqEdges;
}

function mergeUniq2ArrOfJsonsById(arr1, arr2) {
  let uniqArr = Object.values(arr1.concat(arr2).reduce((r,o) => {
    r[o.id] = o;
    return r;
  },{}));
  return uniqArr;
}

const useTwitterSnaRequest = (request) => {
  // console.log("useTwitterSnaRequest request: ", request);

  const TwintWrapperUrl = process.env.REACT_APP_TWINT_WRAPPER_URL;
  const keyword = useLoadLanguage("components/NavItems/tools/TwitterSna.tsv", tsv);

  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();
  const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);

  useEffect(() => {
    // console.log("useTwitterSnaRequest.useEffect request: ", request);

    // Check request
    if (_.isNil(request)
      || (_.isNil(request.keywordList) || _.isEmpty(request.keywordList))
      // || (_.isNil(request.userList) || _.isEmpty(request.userList))
      || _.isNil(request.from)
      || _.isNil(request.until)) {
      // console.log("Empty request, resetting result: ", request);
      dispatch(setTwitterSnaResult(request, null, false, false));
      return;
    }

    let tweetIE = { text: "" };

    const getAllWordsMap = (elasticResponse) => {
      let hits = Array.from(elasticResponse.hits.hits);
      let wordsMap = [];

      for (let i = 0; i < hits.length; i++) {
        tweetIE.text = hits[i]._source.twittieTweet;



        let tweetWordsmap = hits[i]._source.wit;
        if (!(tweetWordsmap === null || tweetWordsmap === undefined)) {

          var arr = Array.from(tweetWordsmap);

          arr.forEach(word => {
            let j = includeWordObj(word.word, wordsMap);
            if (j !== -1) {
              wordsMap[j].nbOccurences += word.nbOccurences;

            }
            else {

              wordsMap.push(word);
            }
          });

        }
      }
      let toRemove = request.keywordList.map(word => word.replace('#', ''));


      toRemove.forEach(wordToRemove => {
        wordsMap.splice(includeWordObj(wordToRemove, wordsMap), 1);
      });
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
        modeBarButtons: [["toImage"], ["resetScale2d"]],
        displaylogo: false,
      };
      return {
        title: "user_time_chart_title",
        json: json,
        layout: layout,
        config: config,
        tweetsView: null,
      };
    };
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
      result.netGraph = { title: "Community graph", "tmpdata": responseArrayOf7[5], hashtagGraph: createHashtagGraph(data, responseArrayOf7[5]) };
      if (final) {
        result.cloudChart = createWordCloud(responseArrayOf7[7]);

        const dateEndQuery = new Date(data.until);
        const dateStartQuery = new Date(data.from);
        if ((dateEndQuery - dateStartQuery) / (1000 * 3600 * 24) <= 7)
          createHeatMap(request, responseArrayOf7[5].tweets).then((heatmap) => result.heatMap = heatmap);
        else
          result.heatMap = "tooLarge";

      }
      else
        result.cloudChart = { title: "top_words_cloud_chart_title" };
      dispatch(setTwitterSnaResult(request, result, false, true));
      return result;
    };

    const makeEntries = (data) => {
      return {
        from: request.from,
        until: request.until,
        keywordList: request.keywordList,
        bannedWords: request.bannedWords,
        userList: request.userList,
        session: data.session,
        media: (data.media) ? data.media : "none",
        lang: (data.lang) ? data.lang : "none",
        verified: data.verified
      };
    };


    const generateGraph = (data, final) => {
      let givenFrom = data.from;
      let givenUntil = data.until;
      let entries = makeEntries(data);
      let generateList = [
        getPlotlyJsonDonuts(entries, "nretweets"),
        getPlotlyJsonDonuts(entries, "nlikes"),
        getPlotlyJsonDonuts(entries, "ntweets"),
        getPlotlyJsonDonuts(entries, "hashtags"),
        getReactArrayURL(entries, keyword("elastic_url"), keyword("elastic_count")),
        getJsonCounts(entries),
        getPlotlyJsonHisto(entries, givenFrom, givenUntil)
      ];
      return axios.all(
        (final) ? [...generateList, generateWordCloudPlotlyJson(entries)] : generateList
      )
        .then(responseArrayOf8 => {
          makeResult(data, responseArrayOf8, givenFrom, givenUntil, final);
        });

    };

    const createWordCloud = (plotlyJson) => {
      let mostUsedWords = getAllWordsMap(plotlyJson);
      mostUsedWords = mostUsedWords.map(word => {
        let w = ((word.word.includes('@') ? word.word : word.word.replace(/_/g, " ")));
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
      };

    };

    async function createHeatMap(entries, hits) {

      var firstDate = new Date(entries.from);
      firstDate.setHours(1);
      firstDate.setMinutes(0);
      firstDate.setSeconds(0);
      var firstArrElt = new Date(firstDate);
      var lastDate = new Date(entries.until);
      if (lastDate.getHours() === 0 && lastDate.getMinutes() === 0)
        lastDate.setDate(lastDate.getDate() - 1);
      lastDate.setHours(1);
      lastDate.setMinutes(0);
      lastDate.setSeconds(0);
      var dates = [firstArrElt];

      while (firstDate.getTime() !== lastDate.getTime()) {
        var newDate = new Date(firstDate);
        firstDate.setDate(firstDate.getDate() + 1);
        newDate.setDate(newDate.getDate() + 1);
        dates = [...dates, newDate];
      }
      let hoursY = ['12:00:00 AM', '1:00:00 AM', '2:00:00 AM', '3:00:00 AM', '4:00:00 AM', '5:00:00 AM', '6:00:00 AM', '7:00:00 AM', '8:00:00 AM', '9:00:00 AM', '10:00:00 AM', '11:00:00 AM', '12:00:00 PM', '1:00:00 PM', '2:00:00 PM', '3:00:00 PM', '4:00:00 PM', '5:00:00 PM', '6:00:00 PM', '7:00:00 PM', '8:00:00 PM', '9:00:00 PM', '10:00:00 PM', '11:00:00 PM'];
      let isAllnul = true;
      let nbTweetsZ = [];
      let i = 0;
      let datesX = [];
      dates.forEach(date => {
        hoursY.forEach(time => {
          nbTweetsZ.push([]);
          let nbTweets = getNbTweetsInHour(date, hits);
          if (nbTweets !== 0)
            isAllnul = false;
          date.setHours(i);
          nbTweetsZ[i].push(nbTweets);

          i++;
        });
        i = 0;
        datesX = [...datesX, date.toDateString()];
      });

      return {
        plot: [{
          z: nbTweetsZ,
          x: datesX,
          y: hoursY,
          colorscale: 'Reds',
          type: 'heatmap'
        }],
        isAllnul: isAllnul
      };

    }


    function createHashtagGraph (request, hits) {

      // let hashtagNodes = getNodesHashtag(hits, request);
      // let userTweetNodes = getNodesAsUsername(hits);
      // let userMentionNodes = getNodesUserMentions(hits);
      // let nodes = mergeUniq2ArrOfJsonsById(hashtagNodes, userTweetNodes);
      // nodes = mergeUniq2ArrOfJsonsById(nodes, userMentionNodes);

      // let userMentionEdges = getEdgesUserMention(hits);
      // let userHashtagEdges = getEdgesUserHashtag(hits);
      // let edges = mergeUniq2ArrOfJsonsById(userMentionEdges, userHashtagEdges);
      // let hashtagGraph = {
      //   nodes: nodes,
      //   edges: edges
      // }

      // let graph = createCommunity(hashtagGraph);

      let nodes = getNodesAsTweets(hits);
      let edges = getEdgesTweetsSharingHashtag(hits);

      let hashtagGraph = {
        nodes: nodes,
        edges: edges
      }

      let graph = createCommunity(hashtagGraph);

      let nodesUsername = getNodesAsUsername(hits);
      let nodesMention = getNodesAsMentions(hits);
      let nodesURL = getNodesAsURLs(hits);
      let nodesReplyTo= getNodesAsReplyTo(hits);
      let nodesHashtag = getNodesAsHashtags(hits, request);
      let nodesTweet = getNodesAsTweets(hits);


      let edgesTweetToTweetOnHashtag = getEdgesTweetToTweet(hits, "hashtags");
      let edgesTweetToTweetOnURL = getEdgesTweetToTweet(hits, "urls");
      let edgesUsernameToHashtag = getEdgesUsernameToField(hits, "hashtags");
      let edgesUsernameToMention = getEdgesUsernameToField(hits, "mentions");

      let graphTweetsHashtag = {
        nodes: nodesTweet,
        edges: edgesTweetToTweetOnHashtag
      }

      let graphTweetsURL = {
        nodes: nodesTweet,
        edges: edgesTweetToTweetOnURL
      }

      return createCommunity(graphTweetsURL);
    }

    function createCommunity(graph) {
      let nodeIdArr = [];
      graph.nodes.forEach(node => {
        nodeIdArr.push(node.id);
      });
      var community = jLouvain().nodes(nodeIdArr).edges(graph.edges);
      var result  = community();
      console.log("community: ", result);

      let uniqCommunity = [...new Set(Object.values(result))]; 
      let colors = []
      uniqCommunity.forEach(com => {
        colors[com] = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
      });

      graph.nodes.forEach(node => {
        node.color = colors[result[node.id]];
      });
      return graph;
    }

    const lastRenderCall = (sessionId, request) => {

      dispatch(setTwitterSnaLoadingMessage(keyword('sna_builting_heatMap')));
      //axios.get(TwintWrapperUrl + /status/ + sessionId)
      // .then(response => {
      //   if (response.data.status === "Error")
      //        handleErrors("twitterSnaErrorMessage");
      //  else {
      generateGraph(request, true).then(() => {
        dispatch(setTwitterSnaLoading(false));
      });
      //    }
      //  })
      // .catch(e => handleErrors(e))

    };

    const getResultUntilsDone = async (sessionId, isFirst, request) => {
      const axiosConfig = {
        method: 'get',
        baseURL: TwintWrapperUrl,
        url: `/status/${sessionId}`
      };
      await authenticatedRequest(axiosConfig)
        // await axios.get(TwintWrapperUrl + /status/ + sessionId)
        .then(async response => {
          if (isFirst)
            await generateGraph(request, false);

          if (response.data.status === "Error")
            handleErrors("twitterSnaErrorMessage");
          else if (response.data.status === "Done") {
            lastRenderCall(sessionId, request);
          }
          else if (response.data.status === "CountingWords") {
            dispatch(setTwitterSnaLoadingMessage(keyword("sna_counting_words")));
            setTimeout(() => getResultUntilsDone(sessionId, false, request), 3000);
          }
          else {
            generateGraph(request, false).then(() => {
              setTimeout(() => getResultUntilsDone(sessionId, false, request), 5000);

              dispatch(setTwitterSnaLoadingMessage(keyword("sna_fetching_tweets")));
            });
          }
        })
        .catch(e => handleErrors(e));
    };


    dispatch(setTwitterSnaLoading(true));

    if (userAuthenticated) {
      const axiosConfig = {
        method: 'post',
        baseURL: TwintWrapperUrl,
        url: '/collect',
        data: request
      };
      // axios.post(TwintWrapperUrl + "/collect", request)
      authenticatedRequest(axiosConfig)
        .then(response => {
          if (response.data.status === "Error")
            handleErrors("twitterSnaErrorMessage");
          else if (response.data.status === "Done")
            lastRenderCall(response.data.session, request);
          else
            getResultUntilsDone(response.data.session, true, request);
        }).catch(error => {
          handleErrors(error);
        });
    } else {
      lastRenderCall(null, request);
    }
  }, [JSON.stringify(request)]);

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