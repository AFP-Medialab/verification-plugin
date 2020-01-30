

let json = {};

let elasticSearch_url = process.env.REACT_APP_ELK_URL;

//Functions calling elastic search and return a JSON plotly can use

//Timeline chart
export function generateEssidHistogramPlotlyJson(param, retweets, givenFrom, givenUntil) {
    let queryStart = param["from"];
    let queryEnd = param["until"];

    let dateEndQuery = new Date(queryEnd);
    let dateStartQuery = new Date(queryStart);

    let dateGivenFrom = new Date(givenFrom);
    let dateGivenUntil = new Date(givenUntil);

    let reProcess = false;
    let diff = (dateGivenUntil - dateGivenFrom) / (1000 * 3600 * 24);
    let interval = "";
    if (diff > 14) {
        interval = "1d";
        if ((dateEndQuery - dateStartQuery) / (1000 * 3600 * 24) < 14)
            reProcess = true;
    } else
        interval = "1h";


    let aggs = constructAggs(interval);
    let must = constructMatchPhrase(param, givenFrom, givenUntil);
    let mustNot = constructMatchNotPhrase(param);

    
    function usersGet(dateObj, infos) {
        dateObj["3"]["buckets"].forEach(obj => {
                infos.push({
                    date:  obj["2"]['buckets']['0']['key_as_string'],
                    key: obj["key"],
                    nb: obj["1"]["value"]
                })
        });

        return infos;
    }

    const userAction = async (query) => {
        let str_query = JSON.stringify(query).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}");
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
            str_query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();
        console.log(response);
        if (myJson["error"] === undefined) {
            json.histo = getPlotlyJsonHisto(myJson, usersGet);
            return json.histo; //getPlotlyJsonHisto(myJson, usersGet);
        } else
        {
            let res = setTimeout(() => userAction(query), 5000);
           return res;
        }
    };
    return userAction(buildQuery(aggs, must, mustNot)).then(plotlyJSON => {

        if (reProcess) {
            let aggs = constructAggs("1h");
            let must = constructMatchPhrase(param, queryStart, queryEnd);
            return (userAction(buildQuery(aggs, must, mustNot)).then(plotlyJSON2 => {

                let i = 0;

                plotlyJSON2.forEach(plot => {
                    if (i++ > 1) {
                        plotlyJSON.forEach(plot2 => {

                            if (plot.name === plot2.name) {
                                plot2.x = [...plot2.x, ...plot.x];
                                plot2.y = [...plot2.y, ...plot.y];
                            }

                        });
                    }
                });

                return plotlyJSON;
            }));
        }

        return plotlyJSON;

    });
}

//Tweet count display
export function generateTweetCountPlotlyJson(param) {
    let must = constructMatchPhrase(param);
    let mustNot = constructMatchNotPhrase(param);
    let aggs = constructAggs("glob");
    return getJson(param, aggs, must, mustNot).then(json => {
        console.log(json);
        return {
            value: json.hits.total.value,
            retweets: json.aggregations.retweets.value,
            likes: json.aggregations.likes.value,
            tweets: json.hits.hits
        }
    });
}

//Donut charts (Most liked, most retweeted, most used hashtags, most active users)
export function generateDonutPlotlyJson(param, field) {
    let keywordList = param.keywordList;
    let bannedWords = param.bannedWords;

    let aggs = constructAggs(field);
    let must = constructMatchPhrase(param);
    let mustNot = constructMatchNotPhrase(param);


    function hashtagsGet(key, values, labels, parents, mainKey) {
        values.push(key["doc_count"]);
        labels.push(key["key"]);
        parents.push(mainKey);
    }

    function mostTweetsGet(key, values, labels, parents, mainKey) {
        if (key["doc_count"] > 0) {
            values.push(key["doc_count"]);
            labels.push(key["key"]);
            parents.push(mainKey);
        }
    }

    function mostRetweetGet(key, values, labels, parents, mainKey) {
        if (key["1"]["value"] > 10) {
            values.push(key["1"]["value"]);
            labels.push(key["key"]);
            parents.push(mainKey);
        }
    }

    let query = JSON.stringify(buildQuery(aggs, must, mustNot)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}");
    const userAction = async () => {
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
            query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();
        if (field === "hashtags") {
            return getPlotlyJsonCloud(myJson, keywordList, bannedWords, hashtagsGet);
        } else if (field === "nretweets" || field === "nlikes")
            return getPlotlyJsonCloud(myJson, keywordList, bannedWords, mostRetweetGet);
        else
            return getPlotlyJsonCloud(myJson, keywordList, bannedWords, mostTweetsGet);

    };
    return userAction();
}

// Words cloud chart
export function generateWordCloudPlotlyJson(param) {

    let must = constructMatchPhrase(param);
    let mustNot = constructMatchNotPhrase(param);

    let query = JSON.stringify(buildQuery({}, must, mustNot)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}");
    const userAction = async () => {

        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
            query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();

        return myJson;

    };
    return userAction();


}

//URL array
export function generateURLArrayHTML(param, elastic_url, elastic_count ) {

    let must = constructMatchPhrase(param);
    let mustNot = constructMatchNotPhrase(param);
    let aggs = constructAggs("urls");

    function getURLArray(json) {
        let urlArray = [];
        let buckets = json["aggregations"]["2"]["buckets"];
        buckets.forEach(bucket => {
            urlArray.push({url: bucket["key"], count: bucket["doc_count"]});
        });
        return urlArray;
    }

    let query = JSON.stringify(buildQuery(aggs, must, mustNot)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}");

    const userAction = async () => {
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
            query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();
        const array = getURLArray(myJson);
        let columns = [
            {title: elastic_url, field: 'url'},
            {title: elastic_count, field: 'count'},
        ];

        return {
            columns: columns,
            data: array,
        }
    };
    return userAction();
}


//Build a query for elastic search
function buildQuery(aggs, must, mustNot) {
    let query = {
        "aggs": aggs,
        "size": 10000,
        "_source": {
            "excludes": []
        },
        "stored_fields": [
            "*"
        ],
        "script_fields": {},
        "query": {
            "bool": {
                "must": must,
                "filter": [],
                "should": [],
                "must_not": mustNot
            }
        },
        "sort": [
            {"date": {"order": "asc"}}
        ]
    };
    return query;
}

//Construct the match phrase (filter for tweets)
function constructMatchNotPhrase(param) {

    let match_phrases;
    if (param.media === "video") {
        match_phrases = JSON.stringify({
            "match_phrase": {
                "video": 
                {
                    "query": "0"
                }
            }
        })
    }
    if ((param.bannedWords === null || param.bannedWords === undefined) && (param.media === "none" || param.media === "image"))
        return [];
    if (param.bannedWords === null || param.bannedWords === undefined)
        return [match_phrases];
        
    // KEYWORDS ARGS MATCH
    param.bannedWords.forEach(arg => {
        if (match_phrases !== "")
            match_phrases += ",";
        if (arg[0] === '#') {
            match_phrases += '{' +
                '"match_phrase": {' +
                    '"hashtags": {' +
                        '"query":"' + arg + '"' +
                        '}' +
                    '}' +
                '}'
        } else {
            match_phrases += '{' +
                '"match_phrase": {' +
                    '"tweet": {' +
                        '"query":"' + arg + '"' +
                        '}' +
                    '}' +
                '}';
        }
    });
    return [match_phrases]
}

//Construct the match phrase (filter for tweets)
function constructMatchPhrase(param, startDate, endDate) {
    if (startDate === undefined) {
        startDate = param["from"];
        endDate = param["until"];
    }

    let match_phrases = JSON.stringify({
            "query_string": {
                "query": "NOT _exists_:likes NOT _exists_:retweets NOT _exists_:replies",
                "analyze_wildcard": true,
                "time_zone": "Europe/Paris"
            }
        },
        {
            "match_all": {}
        });

    // SESSID MATCH
   /* match_phrases += ",{" +
        '"match_phrase": {' +
            '"essid": {' +
                '"query":"' + param["session"] + '"' +
                '}' +
            '}' +
        '}';*/

    // KEYWORDS ARGS MATCH
    param.keywordList.forEach(arg => {
        if (arg[0] === '#') {
            match_phrases += ',{' +
                '"match_phrase": {' +
                    '"hashtags": {' +
                        '"query":"' + arg + '"' +
                        '}' +
                    '}' +
                '}'
        } else {
            match_phrases += ',{' +
                '"match_phrase": {' +
                    '"tweet": {' +
                        '"query":"' + arg + '"' +
                        '}' +
                    '}' +
                '}';
        }
    });

    // USERNAME MATCH
    if (param["userList"] !== undefined) {
        param["userList"].forEach(user => {
            if (user !== "") {
                match_phrases += ',{' +
                    '"match_phrase": {' +
                        '"username": {' +
                            '"query":"' + user + '"' +
                            '}' +
                        '}' +
                    '}';
            }
        })
    }
    // RANGE SETUP
    match_phrases += "," + JSON.stringify({
        "range": {
            "date": {
                "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis",
                "gte": startDate,
                "lte": endDate
            }
        }
    });


    // FILTERS MATCH
    if (param.media === "image") {
        match_phrases += ',' + JSON.stringify({
            "exists": {
                "field": "photos"
            }
        })
    }

    // VERIFIED ACCOUNT ?


    // LANGUAGE MATCH

    return [match_phrases]
}

//Construct the aggregations (chose what information we will have in the response)
function constructAggs(field) {

    let fieldInfo = ((field === "glob")? '{"retweets":' : '{"2":');

    //Hashtag donut & Urls Array
    if (field === "hashtags" || field === "urls") {
        fieldInfo += JSON.stringify({
            "terms": {
                "field": field,
                "order": {
                    "_count": "desc"
                },
                "size": 20
            }
        })
    }
    //Retweets & Likes users donuts
    else if (field === "nretweets" || field === "nlikes") {

        fieldInfo += JSON.stringify({
            "terms": {
                "field": "username",
                "order": {
                    "1": "desc"
                },
                "size": 14
            },
            "aggs": {
                "1": {
                    "sum": {
                        "field": field
                    }
                }
            }
        })

    }
    //Histogram
    else if (field.includes('1')) {
        fieldInfo += JSON.stringify({
            "date_histogram": {
                "field": "date",
                "calendar_interval": field,
                "time_zone": "Europe/Paris",
                "min_doc_count": 1
            },
            "aggs": {
                "3": {
                    "terms": {
                        "field": "username",
                        "order": {
                            "1": "desc"
                        }
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "nretweets"
                            }
                        },
                        "2": {
                            "terms": {
                                "field": "date"
                            }
                        }
                    },
                    
                },
                "1": {
                    "sum": {
                        "field": "nretweets"
                    }
                }
            }
        });
    }
    //Count
    else if (field === "glob")
    {
        fieldInfo += "{" +
            '"sum" :' +
                '{"field":"nretweets"}},"likes": {"sum":{"field":"nlikes"}}';
    }
    else {
        fieldInfo += JSON.stringify({
                "terms": {
                    "field": "username",
                    "order": {
                        "_count": "desc"
                    },
                    "size": 14
                }
            });
        }

        fieldInfo += '}'
        return fieldInfo;
}

//To fetch all the tweets (Bypass the 10 000 limit with elastic search)
async function getJson(param, aggs, must, mustNot) {
    const response = await fetch(elasticSearch_url, {
        method: 'POST',
        body: JSON.stringify(buildQuery(aggs, must, mustNot)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}"),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let myJson = await response.json();
    if (myJson["hits"]["total"]["value"] === 10000) {
        do {
            let must2 = constructMatchPhrase({
                    ...param,
                    "from": myJson.hits.hits[myJson.hits.hits.length - 1]._source.date,
                    "until": param["until"],
                });
            let mustNot2 = constructMatchNotPhrase({
                    ...param,
                    "from": myJson.hits.hits[myJson.hits.hits.length - 1]._source.date,
                    "until": param["until"],
                });
            myJson = await completeJson(aggs, must2, mustNot2, myJson);
        } while (myJson.current_total_hits === 10000)
    }
    
    return myJson;
}

async function completeJson(aggs, must, mustNot, myJson) {
    const response = await fetch(elasticSearch_url, {
        method: 'POST',
        body: JSON.stringify(buildQuery(aggs, must, mustNot)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}"),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let arr = Array.from(myJson.hits.hits);
    let id_arr = arr.map(elt => elt._id);
    const myJson2 = await response.json();
    Array.from(myJson2.hits.hits).forEach(hit => {
        if (!id_arr.includes(hit._id)) {
            arr.push(hit);
        }
    })
    myJson["current_total_hits"] = myJson2.hits.total.value;
    myJson.hits.hits = arr;
    myJson.hits.total.value = arr.length;
    return myJson;
}


//To build the PlotlyJSON from elastic response
function getPlotlyJsonCloud(json, keywords, bannedWords, specificGetCallBack) {
    let labels = [];
    let parents = [];
    let value = [];

    let keys = json["aggregations"]["2"]["buckets"];

    if (keys.length === 0)
        return null;
   // let mainKey = keys[0];

   // if (mainKey["key"].charAt(0) === '#') {
     //   labels.push(mainKey["key"]);
       // keys.shift();
    //} else {
       // mainKey = keywords;
        labels.push(keywords.join(', ').replace(/#/g, ''));
    //}

    parents.push("");
    value.push(0);
    if (keys[0]['key'].charAt(0) === '#')
        keys.shift();
    keys.forEach(key => {
        specificGetCallBack(key, value, labels, parents, keywords.join(', ').replace(/#/g, ''));
    });
    
    let obj = [{
        type: "sunburst",
        labels: labels,
        parents: parents,
        values: value,
        outsidetextfont: {size: 20, color: "#377eb8"},
    }];
    
    return obj;
}

function getPlotlyJsonHisto(json, specificGet) {
    let dates = json["aggregations"]["2"]["buckets"];

    var infos = [];

    dates.forEach(dateObj => {
        specificGet(dateObj, infos);
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


//To access tweets collection
export function getTweets() {
    return json.tweets;
}
