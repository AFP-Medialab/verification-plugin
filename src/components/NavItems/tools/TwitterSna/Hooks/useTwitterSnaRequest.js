import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../../../redux/actions/errorActions";
import { setTwitterSnaLoading, setTwitterSnaResult, setTwitterSnaLoadingMessage, setUserProfileMostActive } from "../../../../../redux/actions/tools/twitterSnaActions";
import axios from "axios";
import _ from "lodash";
import { jLouvain } from 'jlouvain';

import {
  getPlotlyJsonDonuts,
  getPlotlyJsonHisto,
  getJsonCounts,
  getReactArrayURL,
  generateWordCloudPlotlyJson,
  getESQuery4Gexf,
  getUserAccounts
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

// Count tweets by hour and day
function getNbTweetsByHourDay(dayArr, hourArr, bucket) {
  // 1D-array with elements as day_hour 
  let dayHourArr = bucket.map(function (val, ind) {
    let date = new Date(val._source.datetimestamp * 1000);
    return `${date.getDay()}_${date.getHours()}`;
  });

  // Groupby day_hour
  let nbTweetArr = _.countBy(dayHourArr);
  // Convert 1D-array to 2D-array
  let nbTweetArr2D = [...Array(dayArr.length)].map(e => Array(hourArr.length).fill(0));
  Object.entries(nbTweetArr).forEach(nbTweet => {
    let day = parseInt(nbTweet[0].split("_")[0]);
    let hour = parseInt(nbTweet[0].split("_")[1]);
    nbTweetArr2D[day][hour] = nbTweet[1];
  });
  // Re-order rows according to dayArr
  let orderedNbTweetArr2D = [];
  dayArr.forEach(dayStr => {
    let dayInt = getDayAsInt(dayStr);
    orderedNbTweetArr2D.push(nbTweetArr2D[dayInt])
  });

  return orderedNbTweetArr2D;
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

function getDayAsInt(dayString) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayString);
}

function getUniqValuesOfField(tweets, field) {
  let nodeIds = tweets.filter(tweet => tweet._source[field] !== undefined)
                      .map((tweet) => { return tweet._source[field] })
                      .flat();
  let uniqNodeIds = _.uniqWith(nodeIds, _.isEqual);
  return uniqNodeIds;
}

function getNodesAsUsername(tweets) {
  let nodes = getUniqValuesOfField(tweets, "screen_name").map((val) => { return { id: val, label: val } });
  return nodes;
}

function getNodesAsHashtag(tweets) {
  let nodes = getUniqValuesOfField(tweets, "hashtags").map((val) => { return { id: val, label: val } });
  return nodes;
}

function getEdgesCombinationNodes(nodes, edgeLabel) {
  let edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push({ id: nodes[i].id + '___and___' + nodes[j].id, source: nodes[i].id, target: nodes[j].id, label: edgeLabel, weight: 1 });
    }
  }
  return edges;
}

function getEdgesUsernameToUsernameOnHashtagsExcept1st(tweets, request, fieldArr = "hashtags") {
  // Get edges between users based on each value of the given fieldArr
  let rm1stHashtagTweets = tweets.filter(tweet => tweet._source.hashtags.length > 1)
                                  .map((tweet) => { tweet._source.hashtags.splice(0, 1); return tweet; });
  let uniqElements = getUniqValuesOfField(rm1stHashtagTweets, fieldArr);

  if (fieldArr === "hashtags") {
    let requestedHashtags = request.keywordList.filter((element) => element.startsWith("#"));
    let toRemove = (requestedHashtags.length > 0) ? [...new Set(requestedHashtags.map((hashtag) => { return hashtag.replace("#","").toLowerCase(); }))] : [];
    uniqElements = uniqElements.filter(element => !toRemove.includes(element));
  }

  let edges = [];
  uniqElements.forEach(val => {
    let nodesUsername = tweets.filter(tweet => tweet._source[fieldArr] !== undefined)
                              .filter(tweet => tweet._source[fieldArr].includes(val))
                              .map((tweet) => { return { id: tweet._source.screen_name, label: tweet._source.screen_name }; });
    let uniqNodesUsername = _.uniqBy(nodesUsername, 'id');
    let edgesUsername = getEdgesCombinationNodes(uniqNodesUsername, val);
    edges.push(edgesUsername);
  });

  // Set weight as number of hashtags/co-urls... source user and target user of an edge shared together
  let weightedEdges = groupByThenSum(edges.flat(), 'id', ['label'], ['weight'], ['source', 'target']);

  return weightedEdges;
}

function getEdgesCoHashtag(tweets) {
  let coHashtagArr = tweets.filter(tweet => tweet._source.hashtags.length > 1)
                            .map((tweet) => { return tweet._source.hashtags });
  let edges = [];
  coHashtagArr.forEach(arr => {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        let sortedVertices = [arr[i], arr[j]].sort();
        edges.push({ id: sortedVertices.join(""), 
                    source: sortedVertices[0], 
                    target: sortedVertices[1],
                    label: sortedVertices.join(""), 
                    weight: 1,
                    size: 1 });
      }
    }
  });
  let uniqEdges = groupByThenSum(edges, 'id', [], ['size', 'weight'], ['source', 'target', 'label']);
  return uniqEdges;
}

function getSizeOfUserBySum(tweets, field = 'retweet_count') {
  let sizeInTweets = tweets.map((tweet) => {
    let obj = {};
    obj['screen_name'] = tweet._source.screen_name;
    obj[field] = tweet._source[field];
    return obj;
  });
  let sizeInUsernames = groupByThenSum(sizeInTweets, 'screen_name', [], [field], []);

  // Size of a node cannot be 0, therefore, increase nodes's size by 1
  let sizeInNodes = sizeInUsernames.map(obj => {
    let newObj = {};
    newObj['screen_name'] = obj['screen_name'];
    newObj['size'] = obj[field] + 1;
    return newObj;
  });

  return sizeInNodes;
}

function getSizeOfField(tweets, field) {
  let valueArr = tweets.filter(tweet => tweet._source[field] !== undefined)
                      .map((tweet) => { return tweet._source[field] })
                      .flat();
  let sizeObj = _.countBy(valueArr);
  return sizeObj;
}

function getInteractionOfUsernames(tweets, types = ['in_reply_to_screen_name', 'user_mentions']) {
  let interactionsTweets = tweets.map((tweet) => {
    let screen_name = tweet._source.screen_name;
    let interactedEntities = [];
    types.forEach(type => {
      let interactedUsers = null;
      if (type === 'user_mentions' && tweet._source[type] !== undefined) {
        interactedUsers = [...new Set(tweet._source[type].map((mentionedUser) => { return mentionedUser.screen_name; }))];
      } else if (type !== 'user_mentions' && tweet._source[type] !== undefined) {
        interactedUsers = [...new Set(tweet._source[type])];
      }
      // Exlude owner of the tweet in interaction list
      interactedEntities.push(_.without(interactedUsers, screen_name));
    });
    return { screen_name: screen_name, interactedEntities: interactedEntities.flat() }
  });

  let groupbyUsers = _.groupBy(interactionsTweets, 'screen_name');

  let results = [];
  Object.keys(groupbyUsers).forEach(user => {
    let interactions = groupbyUsers[user].map((interactEachTweet) => { return interactEachTweet.interactedEntities; });
    let flattedInteractions = [].concat(interactions).flat();

    if (flattedInteractions.length > 0) {
      results.push({ username: user, interacted: _.countBy(flattedInteractions) });
    }
  });

  return results;
}

function getTopNodeGraph(graph, prop="size", top=15) {
  let sortNodes = _.sortBy(graph.nodes, ["size"]).reverse();
  let topNodes = sortNodes.slice(0, top);
  let topNodesId = topNodes.map((node) => { return node.id; });
  let filteredEdges = graph.edges.filter(edge => _.difference([edge.source, edge.target], topNodesId).length === 0);
  return {
    nodes: topNodes,
    edges: filteredEdges
  }
}

function processCommunityGraph(graph, commObj) {
  if (commObj === undefined) {
    return graph;
  } else {
    // Set communities for nodes
    graph.nodes.forEach(node => { node.community = commObj[node.id]; });
    let filteredGraph = filterCommunities(graph, 1);
    let coloredGraph = generateColorsForCommunities(filteredGraph);
    return coloredGraph;
  }
}

function filterCommunities(graph, sizeToRm = 1) {
  if (graph.nodes[0].community === undefined) {
    return graph;
  } else {
    let commSize = _.countBy(graph.nodes.map((node) => { return node.community; }));
    let filteredComm = Object.entries(commSize).filter(([, v]) => v > sizeToRm).map(([k]) => k);
    let filteredNodes = graph.nodes.filter(node => filteredComm.includes(node.community.toString()));
    let filteredNodesId = filteredNodes.map((node) => { return node.id; });
    let filteredEdges = graph.edges.filter(edge => _.difference([edge.source, edge.target], filteredNodesId).length === 0);
    return {
      nodes: filteredNodes,
      edges: filteredEdges
    }
  }
}

function generateColorsForCommunities(graph) {
  let defaultColors = ["#1F77B4","#FF7F0E","#2CA02C","#D62728","#9467BD","#8C564B","#E377B2","#7F7F7F","#BCBD22","#17BECF",
                      "#00FE35","#FED4C4","#0DF9FF","#F6F926","#DC587D","#B68E00","#22FFA7","#E48F72","#222A2A","#90AD1C",
                      "#85660D","#1C8356","#16FF32","#F7E1A0","#FEAF16","#F8Q19F","#1CFFCE","#2ED9FF","#C075A6","#B00068",
                      "#0D2A63","#FECB52","#00CC96","#990099","#0099C6","#B82E2E","#72B7B2","#778AAE","#BAB0AC","#E3EE9E"];
  
  let sizeCommunities = _.countBy(graph.nodes.map(node => { return node.community; }));
  let sortedCommunities = Object.keys(sizeCommunities).sort((a,b) => sizeCommunities[b]-sizeCommunities[a])
  let uniqCommunity = sortedCommunities.map((comm) => { return parseInt(comm); });
  let colors = [];

  for (let i = 0; i < uniqCommunity.length; i++) {
    if (defaultColors[i] !== undefined) {
      colors[uniqCommunity[i]] = defaultColors[i];
    } else {
      colors[uniqCommunity[i]] = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
    }
    
  }
  
  graph.nodes.forEach(node => {
    node.color = colors[node.community];
  });
  return graph;
}

function getLegendOfGraph(communityGraph, tweets, noCommunityMsg) {
  let sizeCommunities = _.countBy(communityGraph.nodes.map(node => { return node.color; }));
  let legends = [];
  if (sizeCommunities.undefined === undefined) {
    let sortedBySize = _.fromPairs(_.sortBy(_.toPairs(sizeCommunities), 1).reverse());
    let communitiesColor = Object.keys(sortedBySize);
    legends = communitiesColor.map((color) => {
      let nodesId = communityGraph.nodes.filter(node => node.color === color).map((node) => { return node.id });

      let hashtagsCommunity = [];
      nodesId.forEach(nodeId => {
        let tweetsByUser = tweets.filter(tweet => tweet._source.screen_name === nodeId);
        let hashtagsUser = tweetsByUser.filter(tweet => tweet._source.hashtags !== undefined)
          .map((tweet) => { return tweet._source.hashtags; });
        hashtagsCommunity.push(hashtagsUser.flat());
      });

      let freqHashtags = _.countBy(hashtagsCommunity.flat());
      let sortedHashtags = _.fromPairs(_.sortBy(_.toPairs(freqHashtags), 1).reverse());
      let legend = Object.keys(sortedHashtags).slice(0, 20).join(" ");

      return {
        communityColor: color,
        legend: legend
      }
    });
  } else {
    communityGraph.nodes.map((node) => { node.color = "#3388AA"; return node; });
    legends = [
      {
        communityColor: "#3388AA",
        legend: noCommunityMsg
      }
    ]
  }

  return legends;
}

function groupByThenSum(arrOfObjects, key, attrToSumStr, attrToSumNum, attrToSkip) {
  let results = [];
  arrOfObjects.reduce((res, value) => {
    if (!res[value[key]]) {
      let obj = {};
      obj[key] = value[key];
      if (attrToSkip.length > 0) { attrToSkip.forEach(attr => { obj[attr] = value[attr]; }); }
      if (attrToSumStr.length > 0) { attrToSumStr.forEach(attr => { obj[attr] = ''; }); }
      if (attrToSumNum.length > 0) { attrToSumNum.forEach(attr => { obj[attr] = 0; }); }
      res[value[key]] = obj;
      results.push(res[value[key]])
    }
    if (attrToSumNum.length > 0) {
      attrToSumNum.forEach(attr => {
        res[value[key]][attr] += value[attr];
      });
    }
    if (attrToSumStr.length > 0) {
      attrToSumStr.forEach(attr => {
        res[value[key]][attr] += value[attr];
      });
    }
    return res;
  }, {});
  return results;
}

function lowercaseFieldInTweets(tweets, field = 'hashtags') {
  let newTweets = tweets.map((tweet) => {
    let tweetObj = JSON.parse(JSON.stringify(tweet));
    if (tweetObj._source[field] !== undefined) {
      if (Array.isArray(tweetObj._source[field])) {
        let newArr = tweetObj._source[field].map((element) => {
          if(field === "user_mentions") {
            element.screen_name = element.screen_name.toLowerCase();
            element.name = element.name.toLowerCase();
            return element;
          } else {
            return element.toLowerCase();
          }
        });
        tweetObj._source[field] = [...new Set(newArr)];
      } else {
        tweetObj._source[field] = tweetObj._source[field].toLowerCase();
      }
    }
    return tweetObj;
  });
  return newTweets;
}

function getTweetAttrObjArr(tweets) {
  let tweetAttrObjArr = tweets.map((tweet) => {
    let hashtags = (tweet._source.hashtags !== undefined) ? tweet._source.hashtags.map((hashtag) => {return "#" + hashtag;}) : [];
    let user_mentions = (tweet._source.user_mentions !== undefined) ? tweet._source.user_mentions.map((obj) => { return "MT:@" + obj.screen_name;}) : [];
    let obj = {
      hashtags: [...new Set(hashtags)],
      user_mentions: [...new Set(user_mentions)],
      username: "AU:@" + tweet._source.screen_name
    }
    return obj;
  });
  return tweetAttrObjArr;
}

function getCoOccurCombinationFrom1Arr(arr) {
  let occurences = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      let sortedArr = [arr[i], arr[j]].sort()
      occurences.push({ id: sortedArr[0] + '___and___' + sortedArr[1], count: 1 });
    }
  }
  return occurences;
}

function getCombinationFrom2Arrs(arr1, arr2) {
  let occurences = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      occurences.push({ id: arr1[i] + '___and___' + arr2[j], count: 1 });
    }
  }
  return occurences;
}

function getCoOccurenceHashtagMention(tweetAttrObjArr) {
  let coOccur = [];
  tweetAttrObjArr.forEach((obj) => {
    if (obj.hashtags.length > 0) {
      coOccur.push(getCoOccurCombinationFrom1Arr(obj.hashtags));
    }
    if (obj.user_mentions.length > 0) {
      coOccur.push(getCoOccurCombinationFrom1Arr(obj.user_mentions));
    }
    if (obj.hashtags.length > 0 && obj.user_mentions.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.user_mentions));
    }
  })
  let coOccurGroupedBy = groupByThenSum(coOccur.flat(), 'id', [], ['count'], []);
  return coOccurGroupedBy;
}

function getEdgesFromCoOcurObjArr(coOccurObjArr) {
  let edges = [];
  coOccurObjArr.forEach((obj) => {
    let [first, second] =  obj.id.split("___and___");
    edges.push(
      {
        id: obj.id, 
        label: obj.id, 
        source: first,
        target: second,
        size: obj.count, 
        weight: obj.count
    });
  });
  return edges;
}

function getTopActiveUsers(tweets, topN) {
  let tweetCountObj = _.countBy(tweets.map((tweet) => {return tweet._source.screen_name.toLowerCase(); }));
  let topUsers2DArr = _.sortBy(Object.entries(tweetCountObj), [function(o) { return o[1]; }])
                        .reverse()
                        .slice(0, topN);
  return topUsers2DArr;
}

const useTwitterSnaRequest = (request) => {

  const TwintWrapperUrl = process.env.REACT_APP_TWINT_WRAPPER_URL;
  const keyword = useLoadLanguage("components/NavItems/tools/TwitterSna.tsv", tsv);

  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();
  const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);

  useEffect(() => {

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

    const createPieCharts = (data, responseArrayOf9) => {
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
        "mention_cloud_chart_title"
      ];
      let tips = [
        "twittersna_most_retweet_tip",
        "twittersna_most_likes_tip",
        "twittersna_most_active_tip",
        "twittersna_most_mentions_tip"
      ]

      let pieCharts = [];

      for (let cpt = 0; cpt < titles.length; cpt++) {
        cloudLayout.title = <div><b>{keyword(titles[cpt])}</b><br /> {titleEnd}</div>;
        pieCharts.push(
          {
            title: titles[cpt],
            json: responseArrayOf9[cpt],
            layout: cloudLayout,
            config: config,
            tip: tips[cpt]
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
      json.map((obj) => {
        obj.x = obj.x.map((timestamp) => {return new Date(parseInt(timestamp) * 1000)});
        return obj;
      })
      return {
        title: "user_time_chart_title",
        json: json,
        layout: layout,
        config: config,
        tweetsView: null,
      };
    };
    const makeResult = (data, responseArrayOf9, givenFrom, givenUntil, final) => {

      const result = {};
      result.pieCharts = createPieCharts(data, responseArrayOf9);
      result.urls = responseArrayOf9[4];
      result.tweetCount = {};
      result.tweetCount.count = responseArrayOf9[5].value.toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
      result.tweetCount.retweet = responseArrayOf9[5].retweets.toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
      result.tweetCount.like = responseArrayOf9[5].likes.toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
      result.tweets = responseArrayOf9[5].tweets;
      result.histogram = createHistogram(data, responseArrayOf9[6], givenFrom, givenUntil);
      if (final) {
        result.cloudChart = createWordCloud(responseArrayOf9[7]);
        result.heatMap = createHeatMap(request, responseArrayOf9[5].tweets);
        result.userGraph = createUserGraphBasedHashtagLouvain(request, responseArrayOf9[5].tweets);
        result.coHashtagGraph = createCoHashtagGraph(responseArrayOf9[5].tweets);
        result.gexf = responseArrayOf9[8];
        result.socioSemanticGraph = createSocioSemanticGraph(responseArrayOf9[5].tweets);
        
        let authors = getTopActiveUsers(result.tweets, 100).map((arr) => {return arr[0];});
        if (authors.length > 0) {
          getUserAccounts(authors).then((data) => dispatch(setUserProfileMostActive(data.hits.hits)))
        }
      }
      else
        result.cloudChart = { title: "top_words_cloud_chart_title" };
      dispatch(setTwitterSnaResult(request, result, false, false));
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
        getPlotlyJsonDonuts(entries, "retweet_count"),
        getPlotlyJsonDonuts(entries, "favorite_count"),
        getPlotlyJsonDonuts(entries, "ntweets"),
        getPlotlyJsonDonuts(entries, "user_mentions"),
        getReactArrayURL(entries, keyword("elastic_url"), keyword("elastic_count")),
        getJsonCounts(entries),
        getPlotlyJsonHisto(entries, givenFrom, givenUntil)
      ];
      return axios.all(
        (final) ? [...generateList, generateWordCloudPlotlyJson(entries), getESQuery4Gexf(entries)] : generateList
      )
        .then(responseArrayOf9 => {
          makeResult(data, responseArrayOf9, givenFrom, givenUntil, final);
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

    function createHeatMap(entries, hits) {

      let hourAxis = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
      let dayAxis = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      let isAllnul = true; // All cells are null
      if (hits.length !== 0) {
        isAllnul = false;
      }
      // 2D-array with cells as number of tweets by day and hour
      let nbTweetArr2D = getNbTweetsByHourDay(dayAxis, hourAxis, hits);
      return {
        plot: [{
          z: nbTweetArr2D,
          x: hourAxis,
          y: dayAxis,
          colorscale: [[0.0, 'rgb(247,251,255)'], [0.125, 'rgb(222,235,247)'], [0.25, 'rgb(198,219,239)'],
          [0.375, 'rgb(158,202,225)'], [0.5, 'rgb(107,174,214)'], [0.625, 'rgb(66,146,198)'],
          [0.75, 'rgb(33,113,181)'], [0.875, 'rgb(8,81,156)'], [1.0, 'rgb(8,48,107)']],
          type: 'heatmap'
        }],
        isAllnul: isAllnul
      };
    }

    function createUserGraphBasedHashtagLouvain(request, tweets) {

      let lcTweets = lowercaseFieldInTweets(tweets, 'hashtags');

      let filteredTweets = lcTweets.filter(tweet => tweet._source.hashtags !== undefined);
      let nodesUsername = getNodesAsUsername(filteredTweets);
      let edgesUserToUserOnHashtag = getEdgesUsernameToUsernameOnHashtagsExcept1st(filteredTweets, request, "hashtags");

      let nodesSize = getSizeOfUserBySum(lcTweets, 'retweet_count');
      nodesUsername.map((node) => {
        let size = nodesSize.find((e) => { return e.screen_name === node.id }).size;
        node.size = (size !== undefined) ? size : 1;
        return node;
      });

      let graph = {
        nodes: nodesUsername,
        edges: edgesUserToUserOnHashtag
      }

      let nodeIdArr = [];
      graph.nodes.forEach(node => {
        nodeIdArr.push(node.id);
      });
      var community = jLouvain().nodes(nodeIdArr).edges(graph.edges);
      var commObj = community();
      let commGraph = processCommunityGraph(graph, commObj);
      let userInteraction = getInteractionOfUsernames(lcTweets, ['user_mentions']);
      let legend = getLegendOfGraph(commGraph, lcTweets, keyword("twittersna_no_community"));

      return {
        data: commGraph,
        userInteraction: userInteraction,
        legend: legend
      };
    }

    function createCoHashtagGraph(tweets) {
      let lcTweets = lowercaseFieldInTweets(tweets);
      let nodes = getNodesAsHashtag(lcTweets);
      let sizeObj = getSizeOfField(lcTweets, "hashtags");
      nodes.map((node) => { 
        node.size= sizeObj[node.id];
        node.label = node.label + ": " + sizeObj[node.id].toString();
        return node;
      });

      let edges = getEdgesCoHashtag(lcTweets);
      let graph = {
        nodes: nodes,
        edges: edges
      }
      let topNodeGraph = getTopNodeGraph(graph, "size", 15);
      return {
        data: topNodeGraph
      };
    }

    const createSocioSemanticGraph = (tweets) => {
      let lcTweets = lowercaseFieldInTweets(tweets, 'hashtags');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'user_mentions');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'screen_name');
      
      let tweetAttrObjArr = getTweetAttrObjArr(lcTweets);
      let coOccurObjArr = getCoOccurenceHashtagMention(tweetAttrObjArr);
      let edges = getEdgesFromCoOcurObjArr(coOccurObjArr);
      
      let nodes = [];
      let freqHashtagObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.hashtags; }).flat());
      let freqMentionObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.user_mentions; }).flat());
      Object.entries(freqHashtagObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Hashtag"), type: "Hashtag" }));
      Object.entries(freqMentionObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("UserID"), type: "Mention" }));

      let topNodeGraph = getTopNodeGraph({ nodes: nodes, edges: edges}, "size", 100);
      return {
        data: topNodeGraph
      };
    }

    const lastRenderCall = (sessionId, request) => {

      dispatch(setTwitterSnaLoadingMessage(keyword('twittersna_building_graphs')));
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
            dispatch(setTwitterSnaLoadingMessage(keyword("twittersna_counting_words")));
            setTimeout(() => getResultUntilsDone(sessionId, false, request), 3000);
          }
          else {
            generateGraph(request, false).then(() => {
              setTimeout(() => getResultUntilsDone(sessionId, false, request), 5000);

              dispatch(setTwitterSnaLoadingMessage(keyword("twittersna_fetching_tweets")));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(request)]);

};
export default useTwitterSnaRequest;