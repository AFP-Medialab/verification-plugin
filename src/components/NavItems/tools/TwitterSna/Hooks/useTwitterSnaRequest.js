import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../../../../../redux/actions/errorActions";
import { 
  setTwitterSnaLoading, 
  setTwitterSnaResult, 
  setTwitterSnaLoadingMessage, 
  setUserProfileMostActive, 
  setGexfExport
} from "../../../../../redux/actions/tools/twitterSnaActions";
import axios from "axios";
import _ from "lodash";

import {
  getAggregationData,
  getTweets,
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

  // Get color for graph's nodes, edges 
  if (entity === "Hashtag") return '#3388AA';
  if (entity === "Mention" || entity === "Mention-Mention") return '#88D8B0';
  if (entity === "RetweetWC" || entity === "RetweetWC-RetweetWC") return '#FF6F69';
  if (entity === "Reply" || entity === "Reply-Reply") return '#FFEEAD';
  if (entity === "Hashtag-Hashtag") return "#a2bfc7";
  if (entity === "Else-Else") return "#C0C0C0";

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

function getNodesAsHashtag(tweets) {
  let nodes = getUniqValuesOfField(tweets, "hashtags").map((val) => { return { id: val, label: val } });
  return nodes;
}

function getEdgesCoHashtag(tweets) {
  let coHashtagArr = tweets.filter(tweet => tweet._source.hashtags !== undefined && tweet._source.hashtags.length > 1)
                            .map((tweet) => { return tweet._source.hashtags });
  let edges = [];
  coHashtagArr.forEach(arr => {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        let sortedVertices = [arr[i], arr[j]].sort();
        edges.push({ id: sortedVertices.join("___and___"),
                    source: sortedVertices[0], 
                    target: sortedVertices[1],
                    label: sortedVertices.join("___and___"),
                    weight: 1,
                    size: 1,
                    type: "curve" });
      }
    }
  });
  let uniqEdges = groupByThenSum(edges, 'id', [], ['size', 'weight'], ['source', 'target', 'label', 'type']);
  return uniqEdges;
}

function getSizeOfField(tweets, field) {
  let valueArr = tweets.filter(tweet => tweet._source[field] !== undefined)
                      .map((tweet) => { return tweet._source[field] })
                      .flat();
  let sizeObj = _.countBy(valueArr);
  return sizeObj;
}

function getTopNodeGraph(graph, sortByProp=["size"], topByType=[20, 20], types=["Hashtag", "Mention"]) {
  let sortNodes = _.sortBy(graph.nodes, sortByProp).reverse();
  let topNodes = []
  if (types.length !== 0) {
    types.forEach((type, idx) => {
      let topNodesType = sortNodes.filter(node => node.type === type).slice(0, topByType[idx]);
      topNodes.push(topNodesType);
    })
    topNodes = topNodes.flat();
  } else {
    topNodes = sortNodes.slice(0, topByType[0]);
  }
  let topNodesId = topNodes.map((node) => { return node.id; });
  let filteredEdges = graph.edges.filter(edge => _.difference([edge.source, edge.target], topNodesId).length === 0);
  return {
    nodes: topNodes,
    edges: filteredEdges
  }
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
    if (tweetObj._source[field] !== undefined && tweetObj._source[field] !== null) {
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

// function getTweetAttrObjArr(tweets) {
//   let tweetAttrObjArr = tweets.map((tweet) => {
//     let hashtags = (tweet._source.hashtags !== undefined) ? tweet._source.hashtags.map((hashtag) => {return "#" + hashtag;}) : [];
//     let user_mentions = (tweet._source.user_mentions !== undefined) ? tweet._source.user_mentions.map((obj) => { return "MT:@" + obj.screen_name;}) : [];
//     let obj = {
//       hashtags: [...new Set(hashtags)],
//       user_mentions: [...new Set(user_mentions)],
//       username: "AU:@" + tweet._source.screen_name
//     }
//     return obj;
//   });
//   return tweetAttrObjArr;
// }

function getTweetAttrObjArr(tweets) {
  let tweetAttrObjArr = tweets.map((tweet) => {
    let hashtags = (tweet._source.hashtags !== undefined && tweet._source.hashtags !== null)
      ? tweet._source.hashtags.map((hashtag) => { return "#" + hashtag; })
      : [];
    let userIsMentioned = (tweet._source.user_mentions !== undefined && tweet._source.user_mentions !== null)
      ? tweet._source.user_mentions.map((obj) => { return "isMTed:@" + obj.screen_name; })
      : [];
    let userRTWC = (tweet._source.quoted_status_id_str !== undefined && tweet._source.quoted_status_id_str !== null)
    ? ["RT:@" + tweet._source.screen_name]
    : [];
    let userReply = (tweet._source.in_reply_to_screen_name !== undefined && tweet._source.in_reply_to_screen_name !== null)
    ? ["Rpl:@" + tweet._source.screen_name]
    : [];

    let obj = {
      hashtags: [...new Set(hashtags)],
      userIsMentioned: [...new Set(userIsMentioned)],
      userRTWC: userRTWC,
      userReply: userReply
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
    if (obj.userIsMentioned.length > 0) {
      coOccur.push(getCoOccurCombinationFrom1Arr(obj.userIsMentioned));
    }
    if (obj.hashtags.length > 0 && obj.userIsMentioned.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userIsMentioned));
    }
  })
  let coOccurGroupedBy = groupByThenSum(coOccur.flat(), 'id', [], ['count'], []);
  return coOccurGroupedBy;
}

function getCoOccurenceHashtagMentionRTWCReply(tweetAttrObjArr) {
  let coOccur = [];
  tweetAttrObjArr.forEach((obj) => {
    if (obj.hashtags.length > 0) {
      coOccur.push(getCoOccurCombinationFrom1Arr(obj.hashtags));
    }
    if (obj.userIsMentioned.length > 0) {
      coOccur.push(getCoOccurCombinationFrom1Arr(obj.userIsMentioned));
    }

    if (obj.hashtags.length > 0 && obj.userIsMentioned.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userIsMentioned));
    }
    if (obj.hashtags.length > 0 && obj.userRTWC.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userRTWC));
    }
    if (obj.hashtags.length > 0 && obj.userReply.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.hashtags, obj.userReply));
    }
    if (obj.userIsMentioned.length > 0 && obj.userRTWC.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userIsMentioned, obj.userRTWC));
    }
    if (obj.userIsMentioned.length > 0 && obj.userReply.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userIsMentioned, obj.userReply));
    }
    if (obj.userRTWC.length > 0 && obj.userReply.length > 0) {
      coOccur.push(getCombinationFrom2Arrs(obj.userRTWC, obj.userReply));
    }
    let coOccurGroupedBy = groupByThenSum(coOccur.flat(), 'id', [], ['count'], []);
    return coOccurGroupedBy;
  })
  let coOccurGroupedBy = groupByThenSum(coOccur.flat(), 'id', [], ['count'], []);
  return coOccurGroupedBy;
}

function getEdgesFromCoOcurObjArr(coOccurObjArr) {
  let edges = [];
  coOccurObjArr.forEach((obj) => {
    let [first, second] =  obj.id.split("___and___");

    let connectionType = null;
    if (first.startsWith("#") && second.startsWith("#")) {
      connectionType = "Hashtag-Hashtag";
    } else if (first.startsWith("isMTed:@") && second.startsWith("isMTed:@")) {
      connectionType = "Mention-Mention";
    } else if (first.startsWith("RT:@") && second.startsWith("RT:@")) {
      connectionType = "RetweetWC-RetweetWC";
    } else if (first.startsWith("Rpl:@") && second.startsWith("Rpl:@")) {
      connectionType = "Reply-Reply";
    } else {
      connectionType = "Else-Else";
    }

    edges.push(
      {
        id: obj.id, 
        label: obj.id, 
        source: first,
        target: second,
        size: obj.count, 
        weight: obj.count,
        color: getColor(connectionType),
        type: "curve"
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
      let hits = Array.from(elasticResponse);
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

    const createTimeLineChart = (request, json, givenFrom, givenUntil) => {
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
          x: 1.15,
          xanchor: 'right',
          y: -0.4,
          yanchor: 'top',
          text: 'we-verify.eu',
          showarrow: false
        },
        {
          xref: 'paper',
          yref: 'paper',
          x: 1.15,
          xanchor: 'right',
          y: -0.6,
          yanchor: 'top',
          text: keyword('twitter_local_time'),
          showarrow: false
        }],
        autosize: true,
      };
      let config = {
        displayModeBar: true,
        toImageButtonOptions: {
          format: 'png', // one of png, svg, jpeg, webp
          filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_Timeline",
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

    const createPieCharts = (request, jsonPieCharts) => {
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
          filename: request.keywordList.join("&") + "_" + request.from + "_" + request.until + "_Tweets",
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },
        modeBarButtons: [["toImage"]],
        displaylogo: false
      };
      let titleEnd = request.keywordList.join("&") + " " + request.from + " " + request.until;
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
            json: jsonPieCharts[cpt],
            layout: cloudLayout,
            config: config,
            tip: tips[cpt]
          }
        );
      }
      return pieCharts;
    };

    const getJsonDataForTimeLineChart = (dataResponse) => {
      let dates = dataResponse;

      var infos = [];

      const usersGet = (dateObj, infos) => {
        dateObj["3"]["buckets"].forEach(obj => {
          infos.push({
            date: obj["dt"]['buckets']['0']['key_as_string'],
            key: obj["key"],
            nb: obj["rt"]["value"]
          })
        });

        return infos;
      }


      dates.forEach(dateObj => {
        usersGet(dateObj, infos);
        infos.push({
          date: dateObj['key_as_string'],
          key: "Tweets",
          nb: dateObj["doc_count"],
        });
        infos.push({
          date: dateObj['key_as_string'],
          key: "Retweets",
          nb: dateObj["1"]["value"]
        });
      });

      var lines = [];
      while (infos.length !== 0) {

        let info = infos.pop();
        let date = info.date;
        let nb = info.nb;
        var type = "markers";
        if (info.key === "Tweets" || info.key === "Retweets")
          type = 'lines';
        let plotlyInfo = {
          mode: type,
          name: info.key,
          x: [],
          y: []
        }

        for (let i = 0; i < infos.length; ++i) {
          if (infos[i].key === info.key) {
            plotlyInfo.x.push(infos[i].date);
            plotlyInfo.y.push(infos[i].nb);
            infos.splice(i, 1);
            i--;
          }
        }
        plotlyInfo.x.push(date);
        plotlyInfo.y.push(nb);
        lines.push(plotlyInfo);
      }

      return lines;
    }

    const getJsonDataForPieChart = (dataResponse, paramKeywordList, specificGetCallBack) => {

      let labels = [];
      let parents = [];
      let value = [];

      let keys = dataResponse;

      if (keys.length === 0)
          return null;
  
          //Initialisation
      labels.push(paramKeywordList.join(', ').replace(/#/g, ''));
      parents.push("");
      value.push("");

      if (keys[0]['key'].charAt(0) === '#')
          keys.shift();
      keys.forEach(key => {
          specificGetCallBack(key, value, labels, parents, paramKeywordList.join(', ').replace(/#/g, ''));
      });
      
      let obj = [{
          type: "sunburst",
          labels: labels,
          parents: parents,
          values: value,
          textinfo: "label+value",
          outsidetextfont: {size: 20, color: "#377eb8"},
      }];
      return obj;
    }

    const getJsonDataForPieCharts = (esResponse, paramKeywordList) => {

      function topByCount(key, values, labels, parents, mainKey) {
        if (key["doc_count"] > 0) {
          values.push(key["doc_count"]);
          labels.push(key["key"]);
          parents.push(mainKey);
        }
      }

      function topBySum(key, values, labels, parents, mainKey) {
        if (key["_1"]["value"] > 10) {
          values.push(key["_1"]["value"]);
          labels.push(key["key"]);
          parents.push(mainKey);
        }
      }

      let jsonPieCharts = [];
      if (esResponse["top_user_retweet"]) {
        jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user_retweet"]["buckets"], paramKeywordList, topBySum));
      }
      if (esResponse["top_user_favorite"]) {
        jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user_favorite"]["buckets"], paramKeywordList, topBySum));
      }
      if (esResponse["top_user"]) {
        jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user"]["buckets"], paramKeywordList, topByCount));
      }
      if (esResponse["top_user_mentions"]) {
        jsonPieCharts.push(getJsonDataForPieChart(esResponse["top_user_mentions"]["buckets"], paramKeywordList, topByCount));
      }

      return jsonPieCharts;
    }

    const getJsonDataForURLTable = (dataResponse) => {
      let columns = [
        { title: keyword("elastic_url"), field: 'url' },
        { title: keyword("elastic_count"), field: 'count' },
      ];

      let data = dataResponse.map((obj) => {
        let newObj = {};
        newObj['url'] = obj['key'];
        newObj['count'] = obj['doc_count'];
        return newObj;
      })

      return {
        columns: columns,
        data: data,
      }
    }

    const makeResult = (request, responseArrayOf9, givenFrom, givenUntil, final) => {

      let responseAggs = responseArrayOf9[0]['aggregations']

      const result = {};
      result.histogram = createTimeLineChart(request, getJsonDataForTimeLineChart(responseAggs['date_histo']['buckets']), givenFrom, givenUntil);
      result.tweetCount = {};
      result.tweetCount.count = responseAggs['tweet_count']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
      result.tweetCount.retweet = responseAggs['retweets']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
      result.tweetCount.like = responseAggs['likes']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
      result.pieCharts = createPieCharts(request, getJsonDataForPieCharts(responseAggs, request.keywordList));
      result.urls = getJsonDataForURLTable(responseAggs['top_url_keyword']['buckets']);

      result.cloudChart = { title: "top_words_cloud_chart_title" };
      if (final) {
        result.tweets = responseArrayOf9[1].tweets;
        result.heatMap = createHeatMap(request, result.tweets);
        result.coHashtagGraph = createCoHashtagGraph(result.tweets);
        result.socioSemanticGraph = createSocioSemanticGraph(result.tweets);
        result.cloudChart = createWordCloud(result.tweets);

        result.socioSemantic4ModeGraph = createSocioSemantic4ModeGraph(result.tweets);
        
        let authors = getTopActiveUsers(result.tweets, 100).map((arr) => {return arr[0];});
        if (authors.length > 0) {
          getUserAccounts(authors).then((data) => dispatch(setUserProfileMostActive(data.hits.hits)))
        }

        result.activeContributors = createActiveContributorsHist(result.tweets, 25);
        result.visibleContributors = createVisibleContributorsHist(result.tweets, 25);
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
      // let generateList = [
      //   getReactArrayURL(entries, keyword("elastic_url"), keyword("elastic_count")),
      //   getJsonCounts(entries),
      //   getPlotlyJsonHisto(entries, givenFrom, givenUntil)
      // ];
      if (final) {
        axios.all([getESQuery4Gexf(entries)])
        .then(response => {
          dispatch(setGexfExport(response[0]));
        })
      }
      return axios.all(
        (final) ? [getAggregationData(entries), getTweets(entries)] : [getAggregationData(entries)]
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

      let config = {
        displayModeBar: true,
        toImageButtonOptions: {
          format: 'png', // one of png, svg, jpeg, webp
          filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_Heatmap",
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },

        responsive: true,
        modeBarButtons: [["toImage"], ["resetScale2d"]],
        displaylogo: false,
      }

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
        config: config,
        isAllnul: isAllnul
      };
    }

    function createCoHashtagGraph(tweets) {
      let lcTweets = lowercaseFieldInTweets(tweets);
      let nodes = getNodesAsHashtag(lcTweets);
      let sizeObj = getSizeOfField(lcTweets, "hashtags");
      nodes.map((node) => { 
        node.size= sizeObj[node.id];
        node.label = "#" + node.label + ": " + sizeObj[node.id].toString();
        return node;
      });

      let edges = getEdgesCoHashtag(lcTweets);
      let graph = {
        nodes: nodes,
        edges: edges
      }
      let topNodeGraph = getTopNodeGraph(graph, ["size"], [15], []);
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
      let freqMentionObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.userIsMentioned; }).flat());
      Object.entries(freqHashtagObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Hashtag"), type: "Hashtag" }));
      Object.entries(freqMentionObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Mention"), type: "Mention" }));

      let topNodeGraph = getTopNodeGraph({ nodes: nodes, edges: edges}, ["size"], [20, 10], ['Hashtag', 'Mention']);
      return {
        data: topNodeGraph
      };
    }

    const createSocioSemantic4ModeGraph = (tweets) => {
      let lcTweets = lowercaseFieldInTweets(tweets, 'hashtags');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'user_mentions');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'screen_name');
      lcTweets = lowercaseFieldInTweets(lcTweets, 'in_reply_to_screen_name');
      
      let tweetAttrObjArr = getTweetAttrObjArr(lcTweets);

      let coOccurObjArr = getCoOccurenceHashtagMentionRTWCReply(tweetAttrObjArr);
      let edges = getEdgesFromCoOcurObjArr(coOccurObjArr);
      
      let nodes = [];
      let freqHashtagObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.hashtags; }).flat());
      let freqMentionObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.userIsMentioned; }).flat());
      let freqRTWCObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.userRTWC; }).flat());
      let freqReplyObj = _.countBy(tweetAttrObjArr.map((obj) => { return obj.userReply; }).flat());
      Object.entries(freqHashtagObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Hashtag"), type: "Hashtag" }));
      Object.entries(freqMentionObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Mention"), type: "Mention" }));
      Object.entries(freqRTWCObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("RetweetWC"), type: "RetweetWC" }));
      Object.entries(freqReplyObj).forEach(arr => nodes.push({ id: arr[0], label: arr[0] + ": " + arr[1], size: arr[1], color: getColor("Reply"), type: "Reply" }));

      let topNodeGraph = getTopNodeGraph({ nodes: nodes, edges: edges}, ["size"], [20, 10, 10, 10], ['Hashtag', 'Mention', 'RetweetWC', 'Reply']);
      return {
        data: topNodeGraph
      };
    }

    const createActiveContributorsHist = (tweets, topN) => {
      let origTweetSent = tweets.filter(tweet => 
        tweet._source.quoted_status_id_str === null && tweet._source.user_mentions.length === 0 && tweet._source.in_reply_to_screen_name === null )
        .map((tweet) => {return tweet._source.screen_name;});
      
      let genuineReplySent = tweets.filter(tweet => 
        tweet._source.quoted_status_id_str === null && ( tweet._source.user_mentions.length !== 0 || tweet._source.in_reply_to_screen_name !== null ))
        .map((tweet) => {return tweet._source.screen_name;});
      
      let retweetSent = tweets.filter(tweet => 
        tweet._source.quoted_status_id_str !== null )
        .map((tweet) => {return tweet._source.screen_name;});

      let allContributors = _.countBy(origTweetSent.concat(genuineReplySent).concat(retweetSent));
      let sortedAllContributors = Object.entries(allContributors).sort((a,b)=> b[1]-a[1]);
      let topContributors = sortedAllContributors.slice(0, topN).map((element) => {return element[0];})

      let topOrigTweetSent = origTweetSent.filter(n => topContributors.includes(n));
      let topGenuineReplySent = genuineReplySent.filter(n => topContributors.includes(n));
      let topRetweetSent = retweetSent.filter(n => topContributors.includes(n));

      let data = [
        {
          histfunc: "count",
          x: topGenuineReplySent,
          type: "histogram",
          name: "genuineReplySent"
        },
        {
          histfunc: "count",
          x: topRetweetSent,
          type: "histogram",
          name: "retweetSent"
        },
        {
          histfunc: "count",
          x: topOrigTweetSent,
          type: "histogram",
          name: "origTweetSent"
        }
      ];
      let layout = {
        barmode: "stack",
        "xaxis": {
          "categoryorder": "array",
          "categoryarray": topContributors
        },
        "yaxis": {
          "title": "Tweets"
        },
      };
      let config = {
        displayModeBar: true,
        toImageButtonOptions: {
          format: 'png', // one of png, svg, jpeg, webp
          filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_ActiveContributors",
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },
        responsive: true,
        modeBarButtons: [["toImage"], ["resetScale2d"]],
        displaylogo: false,
      }
      return {
        data: data,
        layout: layout,
        config: config
      }
    }

    const createVisibleContributorsHist = (tweets, topN) => {

      let nbRepliedAccounts = tweets.filter(tweet => tweet._source.reply_count > 0)
        .map((tweet) => { return { user: tweet._source.screen_name, count: tweet._source.reply_count }; });
      let mentionedAccounts = tweets.filter(tweet => tweet._source.user_mentions.length !== 0)
        .map((tweet) => { return [...new Set(tweet._source.user_mentions.map((obj) => {return obj.screen_name;}))]; });
      let nbMentionedAccounts =  Object.entries( _.countBy(mentionedAccounts.flat()))
        .map((arr) => { return { user: arr[0], count: arr[1] }; });
      let genuineReplyReceived = groupByThenSum(nbRepliedAccounts.concat(nbMentionedAccounts), "user", [], ["count"], []);

      let nbRetweetedAccounts = tweets.filter(tweet => tweet._source.retweet_count > 0 || tweet._source.quote_count > 0)
        .map((tweet) => { return { user: tweet._source.screen_name, count: tweet._source.retweet_count + tweet._source.quote_count }; });;
      let retweetReceived = groupByThenSum(nbRetweetedAccounts, "user", [], ["count"], []);
      
      let allVisibleContributors = groupByThenSum(genuineReplyReceived.concat(retweetReceived), "user", [], ["count"], []);

      let sortedGenuineReplyReceived = _.sortBy(genuineReplyReceived, ['count','user']).reverse();
      let sortedRetweetReceived = _.sortBy(retweetReceived, ['count','user']).reverse();
      let sortedContributors = _.sortBy(allVisibleContributors, ['count','user']).reverse();

      let topContributors = sortedContributors.slice(0, topN).map((element) => {return element.user;});
      let topGenuineReplyReceived = sortedGenuineReplyReceived.filter(n => topContributors.includes(n.user));
      let topRetweetReceived = sortedRetweetReceived.filter(n => topContributors.includes(n.user));

      let topGenuineReplyReceived_x = topGenuineReplyReceived.map((obj) => {return obj.user});
      let topGenuineReplyReceived_y = topGenuineReplyReceived.map((obj) => {return obj.count});
      let topRetweetReceived_x = topRetweetReceived.map((obj) => {return obj.user});
      let topRetweetReceived_y = topRetweetReceived.map((obj) => {return obj.count});

      let data = [
        {
          histfunc: "sum",
          x: topGenuineReplyReceived_x,
          y: topGenuineReplyReceived_y,
          type: "histogram",
          name: "genuineReplyReceived"
        },
        {
          histfunc: "sum",
          x: topRetweetReceived_x,
          y: topRetweetReceived_y,
          type: "histogram",
          name: "retweetReceived"
        },
      ];
      let layout = {
        barmode: "stack",
        "xaxis": {
          "categoryorder": "array",
          "categoryarray": topContributors
        },
        "yaxis": {
          "title": "Tweets"
        },
      };
      let config = {
        displayModeBar: true,
        toImageButtonOptions: {
          format: 'png', // one of png, svg, jpeg, webp
          filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_VisibleContributors",
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        },
        responsive: true,
        modeBarButtons: [["toImage"], ["resetScale2d"]],
        displaylogo: false,
      }

      return {
        data: data,
        layout: layout,
        config: config
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

              dispatch(setTwitterSnaLoading(true));
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