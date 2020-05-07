import React from "react";
import { Sigma, RandomizeNodePositions, ForceAtlas2 } from "react-sigma";
import Infomap from "@mapequation/infomap";
import _ from "lodash";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Paper } from "@material-ui/core";
// import SigmaForceUpdate from "../../../../Shared/Graph/SigmaForceUpdate"

export default class TwitterInfoMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hashtagGraph: undefined,
            legend: undefined
        };
        this.network = "";
        this.graph = {
            nodes: undefined,
            edges: undefined
        };
        this.lcTweets = undefined;
        this.infomapContent = undefined;
        this.infomap = new Infomap();
    }

    // START LIFE CYCLES METHODS

    componentDidMount() {
        this.infomap.on("data", data => console.log("Infomap data created"))
            .on("error", err => console.warn(err))
            .on("finished", content => this.handleInfoMapData(content, this.graph, this.lcTweets));

        this.lcTweets = this.createInputInfomap(this.props.result.tweets);
        this.infomap.run(this.network);
    }

    componentDidUpdate() {
        this.lcTweets = this.createInputInfomap(this.props.result.tweets);
        this.infomap.run(this.network);
    }

    shouldComponentUpdate(newProps, newState) {
        if (this.areTweetsEqual(this.props.result.tweets, newProps.result.tweets) === false
            || _.isEqual(this.state.hashtagGraph, newState.hashtagGraph) === false) {
            return true;
        }

        return false;
    }

    // OTHER METHODS

    areTweetsEqual(tweetsFromCurrentState, tweetsFromNewState) {
        if (tweetsFromCurrentState.length === tweetsFromNewState.length) {
            return true;
        }
        return false;
    }

    handleInfoMapData(content, graph, lcTweets) {
        if (this.infomapContent === undefined || this.infomapContent.net !== content.net) {
            let newNetGraph = this.createHashtagGraphInfomap(content, graph, lcTweets);
            this.setState({
                hashtagGraph: newNetGraph.hashtagGraph,
                legend: newNetGraph.legend
            });
            this.infomapContent = content;

            // console.log(this.state.hashtagGraph);

            // this.forceUpdate();
        }
    }

    createHashtagGraphInfomap(infomapFinished, graph, lcTweets) {
        var commObj = this.extractCommunityFromInfomapOutput(infomapFinished);
        let commGraph = this.processCommunityGraph(graph, commObj);
        let userInteraction = this.getInteractionOfUsernames(lcTweets, ['mentions']);
        let legend = this.getLegendOfGraph(commGraph, lcTweets);

        return {
            title: "Community graph",
            tmpdata: lcTweets,
            hashtagGraph: commGraph,
            userInteraction: userInteraction,
            legend: legend
        };
    }

    getLegendOfGraph(communityGraph, tweets) {
        let sizeCommunities = _.countBy(communityGraph.nodes.map(node => { return node.color; }));
        let legend = [];
        if (sizeCommunities.undefined === undefined) {
            let sortedBySize = _.fromPairs(_.sortBy(_.toPairs(sizeCommunities), 1).reverse());
            let communitiesColor = Object.keys(sortedBySize);
            legend = communitiesColor.map((color) => {
                let nodesId = communityGraph.nodes.filter(node => node.color === color).map((node) => { return node.id });

                let hashtagsCommunity = [];
                nodesId.forEach(nodeId => {
                    let tweetsByUser = tweets.filter(tweet => tweet._source.username === nodeId);
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
            legend = [
                {
                    communityColor: "#3388AA",
                    legend: "Nodes (no community found)"
                }
            ]
        }

        return legend;
    }

    getInteractionOfUsernames(tweets, types = ['reply_to', 'mentions']) {
        let interactionsTweets = tweets.map((tweet) => {
            let username = tweet._source.username;
            let interactedEntities = [];
            types.forEach(type => {
                let interactedUsers = null;
                if (type === 'reply_to' && tweet._source[type] !== undefined) {
                    interactedUsers = [...new Set(tweet._source[type].map((repliedUser) => { return repliedUser.username; }))];
                } else if (type !== 'reply_to' && tweet._source[type] !== undefined) {
                    interactedUsers = [...new Set(tweet._source[type])];
                }
                // Exclude owner of the tweet in interaction list
                interactedEntities.push(_.without(interactedUsers, username));
            });
            return { username: username, interactedEntities: interactedEntities.flat() }
        });

        let groupByUsers = _.groupBy(interactionsTweets, 'username');

        let results = [];
        Object.keys(groupByUsers).forEach(user => {
            let interactions = groupByUsers[user].map((interactEachTweet) => { return interactEachTweet.interactedEntities; });
            let flattedInteractions = [].concat(interactions).flat();

            if (flattedInteractions.length > 0) {
                results.push({ username: user, interacted: _.countBy(flattedInteractions) });
            }
        });

        return results;
    }

    filterCommunities(graph, sizeToRm=1) {
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

    generateColorsForCommunities(graph) {
        let uniqCommunity = [...new Set(graph.nodes.map((node) => { return node.community; }))];
        let colors = []
        uniqCommunity.forEach(com => {
            colors[com] = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
        });
        graph.nodes.forEach(node => {
            node.color = colors[node.community];
        });
        return graph;
    }

    processCommunityGraph(graph, commObj) {
        if (commObj === undefined) {
            return graph;
        } else {
            // Set communities for nodes
            graph.nodes.forEach(node => { node.community = commObj[node.id];});
            let filteredGraph = this.filterCommunities(graph, 1);
            let coloredGraph = this.generateColorsForCommunities(filteredGraph);
            return coloredGraph;
        }
    }

    extractCommunityFromInfomapOutput(content) {
        let result = content.tree.split("\n").filter(line => !line.startsWith("#"))
            .map((line) => { return line.split(" "); })
            .filter(arr => arr.length > 1);
        let commObj = {};
        result.forEach(arr => commObj[arr[2].replace(/"/g, '')] = parseInt(arr[0].split(":")[0]));
        return commObj;
    }

    createInputInfomap(tweets) {
        let lcTweets = this.lowercaseHashtagInTweets(tweets, 'hashtags');

        let nodesUsername = this.getNodesAsUsername(lcTweets);
        let edgesUserToUserOnHashtag = this.getEdgesUsernameToUsernameOnHashtagsExcept1st(lcTweets, this.props.request, "hashtags");

        let nodesSize = this.getSizeOfUsernames(lcTweets, 'nretweets');
        nodesUsername.map((node) => {
            let size = nodesSize.find((e) => { return e.username === node.id }).size;
            node.size = (size !== undefined) ? size : 1;
            return node;
        });

        this.graph = {
            nodes: nodesUsername,
            edges: edgesUserToUserOnHashtag
        }

        console.log("Info graph: ", this.graph);

        let nodeIdArr = this.graph.nodes.map((node) => { return node.id; }).sort();
        let vertices = "*Vertices " + nodeIdArr.length.toString() + "\n";
        for (const [index, element] of nodeIdArr.entries())
            vertices += index.toString() + " " + element + "\n";
        let edges = "*Edges " + this.graph.edges.length.toString() + "\n# source target [weight]\n";
        this.graph.edges.forEach(edge =>
            edges += nodeIdArr.indexOf(edge.source) + " " + nodeIdArr.indexOf(edge.target) + " " + edge.weight + "\n"
        );
        this.network = "# A network in Pajek format\n" + vertices + edges;
        return lcTweets;
    }

    lowercaseHashtagInTweets(tweets, field = 'hashtags') {
        let newTweets = tweets.map((tweet) => {
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
        return newTweets;
    }

    getNodesAsUsername(tweets) {
        let nodes = this.getUniqValuesOfField(tweets, "username").map((val) => { return { id: val, label: val } });
        return nodes;
    }

    getEdgesUsernameToUsernameOnHashtagsExcept1st(tweets, request, fieldArr = "hashtags") {
        // Get edges between users based on each value of the given fieldArr
        let rm1stHashtagTweets = tweets.filter(tweet => tweet._source.hashtags.length > 1)
                                          .map((tweet) => {tweet._source.hashtags.splice(0, 1); return tweet;});
        let uniqElements = this.getUniqValuesOfField(rm1stHashtagTweets, fieldArr);
        
        if (fieldArr === "hashtags") {
          let requestedHashtags = request.keywordList.filter((element) => element.startsWith("#"));
          let toRemove = (requestedHashtags.length > 0) ? [...new Set(requestedHashtags.map((hashtag) => { return hashtag.toLowerCase(); }))] : [] ;
          uniqElements = uniqElements.filter(element => !toRemove.includes(element));
        }
      
        let edges = [];
        uniqElements.forEach(val => {
          let nodesUsername = tweets.filter(tweet => tweet._source[fieldArr] !== undefined)
                                          .filter(tweet => tweet._source[fieldArr].includes(val))
                                          .map((tweet) => { return { id: tweet._source.username, label: tweet._source.username }; });
          let uniqNodesUsername = _.uniqBy(nodesUsername, 'id');
          let edgesUsername = this.getEdgesCombinationNodes(uniqNodesUsername, val);
          edges.push(edgesUsername);
        });
      
        // Set weight as number of hashtags/co-urls... source user and target user of an edge shared together
        let weightedEdges = this.groupByThenSum(edges.flat(), 'id', ['label'], ['weight'], ['source', 'target']);
      
        return weightedEdges;
      }

    getSizeOfUsernames(tweets, field = 'nretweets') {
        let sizeInTweets = tweets.map((tweet) => {
            let obj = {};
            obj['username'] = tweet._source.username;
            obj[field] = tweet._source[field];
            return obj;
        });
        let sizeInUsernames = this.groupByThenSum(sizeInTweets, 'username', [], [field], []);

        // Size of a node cannot be 0, therefore, increase nodes's size by 1
        let sizeInNodes = sizeInUsernames.map(obj => {
            let newObj = {};
            newObj['username'] = obj['username'];
            newObj['size'] = obj[field] + 1;
            return newObj;
        });

        return sizeInNodes;
    }

    getUniqValuesOfField(tweets, field) {
        let nodeIds = tweets.filter(tweet => tweet._source[field] !== undefined)
            .map((tweet) => { return tweet._source[field] })
            .flat();
        let uniqNodeIds = _.uniqWith(nodeIds, _.isEqual);
        return uniqNodeIds;
    }

    getEdgesCombinationNodes(nodes, edgeLabel) {
        let edges = [];
        for (let i = 0; i < nodes.length - 1; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                edges.push({ id: nodes[i].id + '_and_' + nodes[j].id, source: nodes[i].id, target: nodes[j].id, label: edgeLabel, weight: 1 });
            }
        }
        return edges;
    }

    groupByThenSum(arrOfObjects, key, attrToSumStr, attrToSumNum, attrToSkip) {
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

    render() {
        if (this.state.hashtagGraph !== undefined) {
            return (
                        <div style={{ width: '100%' }}>
                            <Sigma graph={this.state.hashtagGraph}
                                renderer={"svg"}
                                style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                settings={{
                                    labelThreshold: 13,
                                    drawEdges: false,
                                    drawEdgeLabels: false,
                                    minNodeSize: 5,
                                    maxNodeSize: 12,
                                    clone: false
                                }}>
                                <RandomizeNodePositions>
                                    <ForceAtlas2 iterationsPerRender={1} timeout={120000} />
                                </RandomizeNodePositions>
                            </Sigma>
                            <div >
                                <Paper >
                                    <ListSubheader component="div" style={{ fontSize: 18, fontWeight: 'bold' }}> Legend </ListSubheader>
                                    <List >
                                        {
                                            this.state.legend.map((community) => {
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
                        </div>
            )
        } else {
            return (
                <CircularProgress />
            )
        }

    }
}