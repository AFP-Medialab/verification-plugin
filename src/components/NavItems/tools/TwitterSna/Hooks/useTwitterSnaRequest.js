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

// Count tweets by hour and day
function getNbTweetsByHourDay(dayArr, hourArr, bucket) {
  // 1D-array with elements as day_hour 
  let dayHourArr = bucket.map(function(val, ind) { 
    let date = new Date(val._source.date);
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
  searchedHashtags.forEach(hashtag => { colors[hashtag] = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);}); });

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
      edges.push({id: nodes[i].id + '_and_' + nodes[j].id, source: nodes[i].id, target: nodes[j].id, label: edgeLabel, weight: 1});
    }
  }
  return edges;
}

function getEdgesTweetToTweet(hits, fieldArr = "hashtags") {
  let uniqElements = getUniqValuesOfField(hits, fieldArr);
  let edges = [];
  uniqElements.forEach(val => {
    let nodesTweet = hits.tweets.filter(tweet => tweet._source[fieldArr] !== undefined)
                              .filter(tweet => tweet._source[fieldArr].includes(val))
                              .map((tweet) => { return { id: tweet._source.id, label: val }; });
    let edgesTweet = getEdgesCombinationNodes(nodesTweet, val);
    edges.push(edgesTweet);
  });

  return _.uniqBy(edges.flat(), 'id');;
}

function getEdgesUsernameToUsername(hits, request, fieldArr = "hashtags") {
  // Get edges between users based on each value of the given fieldArr
  let uniqElements = getUniqValuesOfField(hits, fieldArr);

  if (fieldArr === "hashtags") {
    let requestedHashtags = request.keywordList.filter((element) => element.startsWith("#"))
    let toRemove = (requestedHashtags.length > 0) ? [...new Set(requestedHashtags.map((hashtag) => { return hashtag.toLowerCase(); }))] : [] ;
    uniqElements = uniqElements.filter(element => !toRemove.includes(element));
  }

  let edges = [];
  uniqElements.forEach(val => {
    let nodesUsername = hits.tweets.filter(tweet => tweet._source[fieldArr] !== undefined)
                                    .filter(tweet => tweet._source[fieldArr].includes(val))
                                    .map((tweet) => { return { id: tweet._source.username, label: tweet._source.username }; });
    let uniqNodesUsername = _.uniqBy(nodesUsername, 'id');
    let edgesUsername = getEdgesCombinationNodes(uniqNodesUsername, val);
    edges.push(edgesUsername);
  });

  // Set weight as number of hashtags/co-urls... source user and target user of an edge shared together
  let weightedEdges = groupbyThenSum(edges.flat(), 'id', ['label'], ['weight'], ['source', 'target']);

  return weightedEdges;
}

function getEdgesUsernameToUsernameOnHashtagsExcept1st(hits, request, fieldArr = "hashtags") {
  // Get edges between users based on each value of the given fieldArr
  let rm1stHashtagTweets = hits.tweets.filter(tweet => tweet._source.hashtags.length > 1)
                                    .map((tweet) => {tweet._source.hashtags.splice(0, 1); return tweet;});
  let rm1stHashtagHits = {tweets: rm1stHashtagTweets};
  let uniqElements = getUniqValuesOfField(rm1stHashtagHits, fieldArr);
  
  // if (fieldArr === "hashtags") {
  //   let requestedHashtags = request.keywordList.filter((element) => element.startsWith("#"))
  //   let toRemove = (requestedHashtags.length > 0) ? [...new Set(requestedHashtags.map((hashtag) => { return hashtag.toLowerCase(); }))] : [] ;
  //   uniqElements = uniqElements.filter(element => !toRemove.includes(element));
  // }


  let edges = [];
  uniqElements.forEach(val => {
    let nodesUsername = hits.tweets.filter(tweet => tweet._source[fieldArr] !== undefined)
                                    .filter(tweet => tweet._source[fieldArr].includes(val))
                                    .map((tweet) => { return { id: tweet._source.username, label: tweet._source.username }; });
    let uniqNodesUsername = _.uniqBy(nodesUsername, 'id');
    let edgesUsername = getEdgesCombinationNodes(uniqNodesUsername, val);
    edges.push(edgesUsername);
  });

  // Set weight as number of hashtags/co-urls... source user and target user of an edge shared together
  let weightedEdges = groupbyThenSum(edges.flat(), 'id', ['label'], ['weight'], ['source', 'target']);

  return weightedEdges;
}

function getEdgesUsernameToField(hits, fieldArr = "hashtags") {
  let tweets = hits.tweets.filter(tweet => tweet._source[fieldArr] !== undefined);

  let edges = tweets.map((tweet) => {
    let edgesFieldElement = [];
    let username = tweet._source.username;

    switch (fieldArr) {
      case "reply_to":
        tweet._source[fieldArr].forEach(element => {
          edgesFieldElement.push({id: username + "_and_" + element.username, source: username, target: element.username, label: fieldArr, type: "arrow"});
        });
        break;
      default:
        tweet._source[fieldArr].forEach(element => {
          edgesFieldElement.push({id: username + "_and_" + element, source: username, target: element, label: fieldArr, type: "arrow"});
        });
        break;
    }

    return edgesFieldElement;

  }).flat();

  return _.uniqBy(edges, 'id');
}

function getSizeOfUsernames(hits, field = 'nretweets') {
  let sizeInTweets = hits.tweets.map((tweet) => {
    let obj = {};
    obj['username'] = tweet._source.username;
    obj[field] = tweet._source[field];
    return obj;
  });
  let sizeInUsernames = groupbyThenSum(sizeInTweets, 'username', [], [field], []);

  // Size of a node cannot be 0, therefore, increase nodes's size by 1
  let sizeInNodes = sizeInUsernames.map(obj => { 
    let newObj = {}; 
    newObj['username'] = obj['username']; 
    newObj['size'] = obj[field] + 1; 
    return newObj; 
  });

  return sizeInNodes;
}

function getInteractionOfUsernames(hits, types = ['reply_to', 'mentions']) {
  let interactionsTweets = hits.tweets.map((tweet) => {
    let username = tweet._source.username;
    let interactedEntities = [];
    types.forEach(type => {
      let interactedUsers = null;
      if (type === 'reply_to' && tweet._source[type] !== undefined) {
        interactedUsers = [...new Set(tweet._source[type].map((repliedUser) => { return repliedUser.username; }))];
      } else if (type !== 'reply_to' && tweet._source[type] !== undefined) {
        interactedUsers = [...new Set(tweet._source[type])];
      }
      // Exlude owner of the tweet in interaction list
      interactedEntities.push(_.without(interactedUsers, username));
    });
    return {username: username, interactedEntities: interactedEntities.flat()}
  });

  let groupbyUsers = _.groupBy(interactionsTweets, 'username');

  let results = [];
  Object.keys(groupbyUsers).forEach(user => {
    let interactions = groupbyUsers[user].map((interactEachTweet) => { return interactEachTweet.interactedEntities; });
    let flattedInteractions = [].concat(interactions).flat();

    if (flattedInteractions.length > 0) {
      results.push( { username: user, interacted: _.countBy(flattedInteractions) });
    } 
});

  return results;
}

function createCommunity(graph) {
  let nodeIdArr = [];
  graph.nodes.forEach(node => {
    nodeIdArr.push(node.id);
  });
  var community = jLouvain().nodes(nodeIdArr).edges(graph.edges);
  var result  = community();
  console.log("community: ", result);
  
  if (result === undefined) {
    return graph;
  } else {
    graph.nodes.forEach(node => {
      node.community = result[node.id];
    });
  
    let sizeOfCommunities = _.countBy(Object.values(result));
    let communitiesHas1Node = Object.entries(sizeOfCommunities).filter(([, v]) => v === 1).map(([k]) => k);
  
    let filteredNodes = graph.nodes.filter((node) =>
      ( !communitiesHas1Node.includes(node.community.toString()) || ( communitiesHas1Node.includes(node.community.toString()) && (node.size > 30) ))
    ); 

    let uniqCommunity = [...new Set( filteredNodes.map((node) => {return node.community;}) )]; 
    let colors = []
    uniqCommunity.forEach(com => {
      colors[com] = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
    });
  
    filteredNodes.forEach(node => {
      node.color = colors[result[node.id]];
    });
  
    let filteredNodesId = filteredNodes.map((node) => { return node.id;});
    let filteredEdges = graph.edges.filter((edge) => _.difference([edge.source, edge.target], filteredNodesId).length ===0 );
  
    return {nodes: filteredNodes, edges: filteredEdges};
  }
}

function createCommunity2(graph, filteredHits) {

  let communities = filteredHits.tweets.filter(tweet => tweet._source.hashtags.length!==0)
                                        .map((tweet) => {return { id: tweet._source.username, community: tweet._source.hashtags[0] }; });

  let uniqCommunities = [...new Set(communities.map((obj) => { return obj.community; }))];

  let nodeIdArr = [];
  graph.nodes.forEach(node => {
    nodeIdArr.push(node.id);
  });

  // var community = jLouvain().nodes(nodeIdArr).edges(graph.edges);
  // var result  = community();
  // console.log("community: ", result);
  
  // graph.nodes.forEach(node => {
  //   node.community = communities[node.id];
  // });
  let commNodes = graph.nodes.map((node) => {
    let commArr = communities.filter(element => element.id === node.id).map((obj) => {return obj.community;});
    let uniqCommArr = [...new Set(commArr)];
    let nodes = []
    if (uniqCommArr.length === 0) { 
      node.community = "NoHashtags";
      nodes.push(node); 
    } else if (uniqCommArr.length === 1) { 
      node.community = uniqCommArr[0];
      nodes.push(node); 
    } else { 
      node.community = uniqCommArr; 
      uniqCommArr.forEach(comm => {
        let copyNode = Object.assign({}, node);
        copyNode.id = copyNode.id + "__" + comm;
        copyNode.label = copyNode.id;
        copyNode.community = comm;
        nodes.push(copyNode);
      });
      // handle edge id here
    }
    return nodes;
  }).flat();

  let sizeOfCommunities = _.countBy(Object.values(communities.map((obj) => {return obj.community;})));
  let communitiesHas1Node = Object.entries(sizeOfCommunities).filter(([, v]) => v === 1).map(([k]) => k);
  
  let filteredNodes = commNodes.filter((node) =>
    ( !communitiesHas1Node.includes(node.community.toString()) || ( communitiesHas1Node.includes(node.community.toString()) && (node.size >= 1) ))
  ); 

  let uniqFilteredCommunities = [...new Set( filteredNodes.map((node) => {return node.community;}) )]; 
  let colors = []
  uniqFilteredCommunities.forEach(com => {
    colors[com] = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
  });

  filteredNodes = filteredNodes.map((node) => {
    node.color = colors[node.community];
    return node;
  });

  let filteredNodesId = filteredNodes.map((node) => { return node.id;});


  let duplicatedNodesId = filteredNodesId.filter(name => name.includes('__#'));
  let edges = graph.edges.map((edge) => {
    let duplicateEdges = [];
    duplicatedNodesId.forEach(nodeId => {
      let copyEdge = Object.assign({}, edge);
      if (nodeId.startsWith(edge.source)) {
        copyEdge.source = nodeId;
        copyEdge.id = nodeId + "__and__" + copyEdge.target;
        duplicateEdges.push(copyEdge);
      } else if (nodeId.startsWith(edge.target)) {
        copyEdge.target = nodeId;
        copyEdge.id = copyEdge.source + "__and__" + nodeId;
        duplicateEdges.push(copyEdge);
      }
    });
    if (duplicateEdges.length === 0) {
      duplicateEdges.push(edge);
    }
    return duplicateEdges;
  }).flat();

  let uniqDuplicatNodesId = [...new Set(duplicatedNodesId.map((nodeId) => {return nodeId.split("__#")[0];}))];
  let colorsForDuplicates = [];
  uniqDuplicatNodesId.forEach(nodeId => {
    colorsForDuplicates.push([nodeId, "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})]);
  });

  filteredNodes = filteredNodes.map((node) => {
    colorsForDuplicates.forEach(dupUsername => {
      if ( node.id.startsWith(dupUsername[0]) ) {
        node.color = dupUsername[1];
      }
    });
    return node;
  })

  let filteredEdges = edges.filter((edge) => _.difference([edge.source, edge.target], filteredNodesId).length ===0 );

  return {nodes: filteredNodes, edges: filteredEdges};
}

function getLegendOfGraph(communityGraph, hits, request) {
  let sizeCommunities = _.countBy(communityGraph.nodes.map(node => {return node.color;}));
  let legends = [];
  if (sizeCommunities.undefined === undefined) {
    let sortedBySize = _.fromPairs(_.sortBy(_.toPairs(sizeCommunities), 1).reverse());
    let communitiesColor = Object.keys(sortedBySize);
    legends = communitiesColor.map((color) => {
      let nodesId = communityGraph.nodes.filter(node => node.color === color).map((node) => { return node.id });

      let hashtagsCommunity = [];
      nodesId.forEach(nodeId => {
        let tweetsByUser = hits.tweets.filter(tweet => tweet._source.username === nodeId);
        let hashtagsUser = tweetsByUser.filter(tweet => tweet._source.hashtags !== undefined)
                                        .map((tweet) => {return tweet._source.hashtags;});
        hashtagsCommunity.push(hashtagsUser.flat());
      });

      let freqHashtags = _.countBy(hashtagsCommunity.flat());
      let sortedHashtags = _.fromPairs(_.sortBy(_.toPairs(freqHashtags), 1).reverse());
      let legend = Object.keys(sortedHashtags).slice(0, 20).join(" ");
      
      

      // let edgesInside = communityGraph.edges.filter((edge) => _.difference([edge.source, edge.target], nodesId).length ===0 );

      // let legend = "";
      // let hashtagCloud = null;

      // if (edgesInside.length !== 0) {
      //   let freqHashtagsInEdges = _.countBy(edgesInside.map((edge) => {return edge.label.split(/(?=#)/);}).flat());
      //   let sortedHashtags = _.fromPairs(_.sortBy(_.toPairs(freqHashtagsInEdges), 1).reverse());
      //   hashtagCloud = Object.keys(sortedHashtags).map((hashtag) => {return {text: hashtag, value: sortedHashtags[hashtag]};})
      //   legend = Object.keys(sortedHashtags).slice(0, 20).join(" ");
      // } else {
      //   let requestHashtags = request.keywordList.filter((word) => word.startsWith("#"));
      //   legend = requestHashtags.join(" ");
      //   hashtagCloud = requestHashtags.map((hashtag) => { return {text: hashtag, value: 1}; });
      // }

      return {
        communityColor: color,
        legend: legend
      }
    });
  } else {
    communityGraph.nodes.map((node) => {node.color = "#3388AA"; return node;});
    legends = [
      {
        communityColor: "#3388AA",
        legend: "Nodes (no community found)"
      }
    ]
  }
  
  return legends;
}

function getLegendOfGraph2(communityGraph, hits, request) {

  let sizeCommunities = _.countBy(communityGraph.nodes.map(node => {
      if (node.id.includes("__#")) { 
        return node.id.split("__#")[0]+ "__" + node.color; 
      } else {
        return node.community+ "__" + node.color;
      }
    }));
  let sortedBySize = _.fromPairs(_.sortBy(_.toPairs(sizeCommunities), 1).reverse());
  let communitiesColor = Object.keys(sortedBySize);
  // let legends = communitiesColor.map((color) => {
  //   let nodesId = communityGraph.nodes.filter(node => node.color === color).map((node) => { return node.id });

  //   let hashtagsCommunity = [];
  //   nodesId.forEach(nodeId => {
  //     let tweetsByUser = hits.tweets.filter(tweet => tweet._source.username === nodeId);
  //     let hashtagsUser = tweetsByUser.filter(tweet => tweet._source.hashtags !== undefined)
  //                                     .map((tweet) => {return tweet._source.hashtags;});
  //     hashtagsCommunity.push(hashtagsUser.flat());
  //   });

  //   let freqHashtags = _.countBy(hashtagsCommunity.flat());
  //   let sortedHashtags = _.fromPairs(_.sortBy(_.toPairs(freqHashtags), 1).reverse());
  //   let legend = Object.keys(sortedHashtags).slice(0, 20).join(" ");
    


  //   return {
  //     communityColor: color,
  //     legend: legend
  //   }
  // });
  let legends = [];
  communitiesColor.forEach(element => {
    legends.push( { communityColor: element.split("__")[1], legend: element.split("__")[0] } )
  })
  return legends;
}

function mergeUniq2ArrOfJsonsById(arr1, arr2) {
  let uniqArr = Object.values(arr1.concat(arr2).reduce((r,o) => {
    r[o.id] = o;
    return r;
  },{}));
  return uniqArr;
}

function groupbyThenSum(arrOfObjects, key, attrToSumStr, attrToSumNum, attrToSkip) {
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

function getInsensativeCase(hits, field='hashtags') {
  let newTweets = hits.tweets.map((tweet) => {
    let tweetObj = JSON.parse(JSON.stringify(tweet));
    if (tweetObj._source[field] !== undefined) {
      if (Array.isArray(tweetObj._source[field])) {
        let newArr = tweetObj._source[field].map((element) => { 
          return element.toLowerCase(); 
        });
        tweetObj._source[field] = [...new Set(newArr)];
      } else {
        tweetObj._source[field] = tweetObj._source[field].toLowerCase(); 
      }
    }
    return tweetObj;
  });
  return {
    value: hits.value,
    retweets: hits.retweets,
    likes: hits.likes,
    tweets: newTweets
  };
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
      if (final) {
        result.csvArrHashtags = createCsvArrHashtags(responseArrayOf7[5]);
        result.cloudChart = createWordCloud(responseArrayOf7[7]);
        result.heatMap = createHeatMap(request, responseArrayOf7[5].tweets);
        // result.netGraph = createHashtagGraph(request, responseArrayOf7[5]);
        // debugger;
        result.netGraph = createHashtagGraph2(request, responseArrayOf7[5]);
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


    function createHashtagGraph (request, hits) {

      let insensativeHits = getInsensativeCase(hits, 'hashtags');

      let nodesUsername = getNodesAsUsername(insensativeHits);
      let edgesUserToUserOnHashtag = getEdgesUsernameToUsername(insensativeHits,request, "hashtags");
      
      let nodesSize = getSizeOfUsernames(insensativeHits, 'nretweets');
      nodesUsername.map((node) => {
        let size = nodesSize.find((e) => { return e.username === node.id }).size;
        node.size = (size !== undefined) ? size : 1;
        return node;
      });

      let graph = {
        nodes: nodesUsername,
        edges: edgesUserToUserOnHashtag
      }

      let communityGraph = createCommunity(graph);
      let userInteraction = getInteractionOfUsernames(insensativeHits, ['mentions']);
      let legend = getLegendOfGraph(communityGraph, insensativeHits, request);

      return { 
                title: "Community graph", 
                tmpdata: insensativeHits,
                hashtagGraph: communityGraph,
                userInteraction: userInteraction,
                legend: legend
              };
    }

    function createHashtagGraph2 (request, hits) {

      let insensativeHits = getInsensativeCase(hits, 'hashtags');
      let filteredTweets = insensativeHits.tweets.filter(tweet => tweet._source.hashtags !== undefined);
      let filteredHits = {tweets: filteredTweets};

      let nodesUsername = getNodesAsUsername(filteredHits);

      let edgesUserToUserOnHashtag = getEdgesUsernameToUsernameOnHashtagsExcept1st(filteredHits,request, "hashtags");
      
      let nodesSize = getSizeOfUsernames(filteredHits, 'nretweets');
      nodesUsername.map((node) => {
        let size = nodesSize.find((e) => { return e.username === node.id }).size;
        node.size = (size !== undefined) ? size : 1;
        return node;
      });

      let graph = {
        nodes: nodesUsername,
        edges: edgesUserToUserOnHashtag
      }

      
      let communityGraph = createCommunity2(graph, filteredHits);
      
      let userInteraction = getInteractionOfUsernames(filteredHits, ['mentions']);
      let legend = getLegendOfGraph2(communityGraph, filteredHits, request);

      return { 
                title: "Community graph", 
                tmpdata: filteredHits,
                hashtagGraph: communityGraph,
                userInteraction: userInteraction,
                legend: legend
              };
    }

    function createCsvArrHashtags(hits) {
      let insensativeHits = getInsensativeCase(hits, 'hashtags');
      let hashtagArr = insensativeHits.tweets.filter(tweet => tweet._source.hashtags !== undefined).map((tweet) => {
        return tweet._source.hashtags;
      }).flat();
      let freqHashtags = _.countBy(hashtagArr);

      let freqHashtagsArr = Object.entries(freqHashtags).map(([key, value]) => ({key,value}));
      let sortedArr = freqHashtagsArr.sort(function(a, b) {
          return b["value"] - a["value"] || a.key.localeCompare(b.key);
      });

      let csvArr = "Hashtag,Count" + '\n';

      sortedArr.forEach(obj => {
        csvArr += obj.key + "," + obj.value + "\n";
      })

      let filename = "_";

      return {
          csvArr: csvArr,
          filename: filename
      };

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