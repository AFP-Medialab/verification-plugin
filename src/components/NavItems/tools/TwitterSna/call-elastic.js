let json = {};

let elasticSearch_url = 'http://185.249.140.38/elk/twinttweets/_search';

let dev = false;
if (dev) {
    elasticSearch_url = 'http://localhost:9200/twinttweets/_search';
}

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
    let must = [constructMatchPhrase(param, givenFrom, givenUntil)]

    function usersGet(dateObj, infos) {

        dateObj["3"]["buckets"].forEach(obj => {
            if (obj["1"]["value"] > 5) {
                infos.push({
                    date: dateObj['key_as_string'],
                    key: obj["key"],
                    nb: obj["1"]["value"]
                })
            }
        });

        return infos;
    }


    function retweetsGet(dateObj, infos) {
        infos.push({
            date: dateObj['key_as_string'],
            key: "Retweets",
            nb: dateObj["1"].value
        });
        return infos;
    }

    const userAction = async (query) => {
        let str_query = JSON.stringify(query).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body:
            str_query,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const myJson = await response.json();
        if (myJson["error"] === undefined) {
            if (retweets)
                return getPlotlyJsonHisto(myJson, retweetsGet);
            else
                return getPlotlyJsonHisto(myJson, usersGet);
        } else
            window.alert("There was a problem calling elastic search");
    }
    return userAction(buildQuery(aggs, must)).then(plotlyJSON => {

        if (reProcess) {
            let aggs = constructAggs("1h");
            let must = [constructMatchPhrase(param, queryStart, queryEnd)]
            return (userAction(buildQuery(aggs, must)).then(plotlyJSON2 => {

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
    let must = [
        constructMatchPhrase(param)
    ]
    return getJson(param, {}, must).then(json => json["hits"]["total"]);
}

//Donut charts (Most liked, most retweeted, most used hashtags, most active users)
export function generateDonutPlotlyJson(param, field) {
    let mainKey = param["search"]["search"];

    let aggs = constructAggs(field);
    let must = [constructMatchPhrase(param)];


    function hashtagsGet(key, values, labels, parents, mainKey) {
        values.push(key["doc_count"]);
        labels.push(key["key"]);
        parents.push(mainKey["key"]);
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

    let query = JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
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
            return getPlotlyJsonCloud(myJson, hashtagsGet, mainKey);
        } else if (field === "nretweets" || field == "nlikes")
            return getPlotlyJsonCloud(myJson, mostRetweetGet, mainKey);
        else
            return getPlotlyJsonCloud(myJson, mostTweetsGet, mainKey);

    };

    return userAction();
}

// Words cloud chart
export function generateWordCloudPlotlyJson(param) {

    let must = [
        constructMatchPhrase(param)
    ]

    let query = JSON.stringify(buildQuery({}, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
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

    }
    return userAction();


}

//URL array
export function generateURLArrayHTML(param) {

    let must = [constructMatchPhrase(param)];
    let aggs = constructAggs("urls");

    function getURLArray(json) {
        let urlArray = [];
        let buckets = json["aggregations"]["2"]["buckets"];
        buckets.forEach(bucket => {
            urlArray.push({url: bucket["key"], count: bucket["doc_count"]});
        });
        return urlArray;
    }

    let query = JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
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
        return getURLArray(myJson);
    };
    return userAction();
}


//Build a query for elastic search
function buildQuery(aggs, must) {
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
                "must_not": []
            }
        },
        "sort": [
            {"date": {"order": "asc"}}
        ]
    }
    return query;
}

//Construct the match phrase (filter for tweets)
function constructMatchPhrase(param, startDate, endDate) {
    if (startDate === undefined) {
        startDate = param["from"];
        endDate = param["until"];
    }
    let andArgs = (param["search"]["and"] === undefined || param["search"]["and"][0] === "") ? [] : param["search"]["and"];

    let match_phrases = JSON.stringify({
            "query_string": {
                "query": "NOT _exists_:likes NOT _exists_:retweets NOT _exists_:replies",
                "analyze_wildcard": true,
                "time_zone": "Europe/Paris"
            }
        },
        {
            "match_all": {}
        })

    // SESSID MATCH
    match_phrases += ",{" +
        '"match_phrase": {' +
        '"essid": {' +
        '"query":"' + param["session"] + '"' +
        '}' +
        '}' +
        '}';


    // AND ARGS MATCH
    andArgs.forEach(arg => {
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
    if (param["user_list"] !== undefined) {
        param["user_list"].forEach(user => {
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

    return match_phrases


}

//Construct the aggregations (chose what information we will have in the response)
function constructAggs(field) {


    let fieldInfo = '{' +
        '"2":'
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
    } else if (field === "nretweets" || field === "nlikes") {
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
    } else if (field.includes('1')) {
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
                        },
                        "size": 5
                    },
                    "aggs": {
                        "1": {
                            "sum": {
                                "field": "nretweets"
                            }
                        }
                    }
                },
                "1": {
                    "sum": {
                        "field": "nretweets"
                    }
                }
            }
        });
    } else {
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
async function getJson(param, aggs, must) {
    console.log(JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}"));
    const response = await fetch(elasticSearch_url, {
        method: 'POST',
        body: JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}"),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let myJson = await response.json();

    if (myJson["hits"]["total"]["value"] === 10000) {
        do {
            let must2 = [
                constructMatchPhrase({
                    "from": myJson.hits.hits[myJson.hits.hits.length - 1]._source.date,
                    "until": param["until"],
                    "search": param.search,
                    "session": param.session
                })
            ]
            myJson = await completeJson(aggs, must2, myJson);
        } while (myJson.current_total_hits === 10000)
    }
    json = myJson;
    console.log(myJson);
    return myJson;
}

async function completeJson(aggs, must, myJson) {
    console.log("ElasticSearch: Completing request");
    const response = await fetch(elasticSearch_url, {
        method: 'POST',
        body: JSON.stringify(buildQuery(aggs, must)).replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}"),
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
function getPlotlyJsonCloud(json, specificGet, hashTagKey) {
    let labels = [];
    let parents = [];
    let value = [];


    let keys = json["aggregations"]["2"]["buckets"];

    if (keys.length === 0)
        return null;
    let mainKey = keys[0];

    if (mainKey["key"].charAt(0) === '#') {
        labels.push(mainKey["key"]);
        keys.shift();
    } else {
        mainKey = hashTagKey;
        labels.push(hashTagKey);
    }

    parents.push("");
    value.push(0);

    keys.forEach(key => {
        specificGet(key, value, labels, parents, mainKey);
    })
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

    let infos = [];

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
    let lines = [];
    let i = 0;
    while (infos.length !== 0) {

        let info = infos.pop();
        let date = info.date;
        let nb = info.nb;
        let type = "markers";
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
    return json
}
