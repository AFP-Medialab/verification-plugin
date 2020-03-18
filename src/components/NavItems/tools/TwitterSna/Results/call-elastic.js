
let elasticSearch_url = process.env.REACT_APP_ELK_URL;

//Functions calling elastic search and return a JSON plotly can use

    //Timeline chart
    function getElasticReponseHisto(param, givenFrom, givenUntil) {
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
            const elasticResponse = await response.json();
            if (elasticResponse["error"] !== undefined)
            {
                let res = setTimeout(() => userAction(query), 5000);
            return res;
            }
            return elasticResponse;
        };
        
        return userAction(buildQuery(aggs, must, mustNot, 0)).then(plotlyJSON => {

            if (reProcess) {
                let aggs = constructAggs("1h");
                let must = constructMatchPhrase(param, queryStart, queryEnd);
                return (userAction(buildQuery(aggs, must, mustNot, 0)).then(plotlyJSON2 => {

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

    function generatePlotlyJsonFromElasticResponseHisto(elasticResponse) {
        let dates = elasticResponse["aggregations"]["2"]["buckets"];

        var infos = [];

        const usersGet = (dateObj, infos) => {
            dateObj["3"]["buckets"].forEach(obj => {
                    infos.push({
                        date:  obj["2"]['buckets']['0']['key_as_string'],
                        key: obj["key"],
                        nb: obj["1"]["value"]
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

    export async function getPlotlyJsonHisto(request, givenFrom, givenUntil) {
        return generatePlotlyJsonFromElasticResponseHisto(await getElasticReponseHisto(request, givenFrom, givenUntil));
    }




    //Tweet count display
    async function getElasticReponseCounts(param, aggs, must, mustNot) {
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body: JSON.stringify(buildQuery(aggs, must, mustNot, 10000)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}"),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let elasticResponse = await response.json();
        if (elasticResponse["hits"]["total"]["value"] === 10000) {
            do {
                let tweets = elasticResponse.hits.hits
                let must2 = constructMatchPhrase({
                        ...param,
                        "from": tweets[tweets.length - 1]._source.date,
                        "until": param["until"],
                    });
                let mustNot2 = constructMatchNotPhrase({
                        ...param,
                        "from": tweets[tweets.length - 1]._source.date,
                        "until": param["until"],
                    });
                    elasticResponse = await completeElasticReponseCounts(aggs, must2, mustNot2, elasticResponse);
            } while (elasticResponse.current_total_hits === 10000)
        }
        
        return elasticResponse;
    }

    async function completeElasticReponseCounts(aggs, must, mustNot, elasticResponse) {
        const response = await fetch(elasticSearch_url, {
            method: 'POST',
            body: JSON.stringify(buildQuery(aggs, must, mustNot, 10000)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}"),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let arr = Array.from(elasticResponse.hits.hits);
        let id_arr = arr.map(elt => elt._id);

        const elasticResponseComplement = await response.json();
        Array.from(elasticResponseComplement.hits.hits).forEach(hit => {
            if (!id_arr.includes(hit._id)) {
                arr.push(hit);
            }
        })
        elasticResponse["current_total_hits"] = elasticResponseComplement.hits.total.value;
        elasticResponse.hits.hits = arr;
        elasticResponse.hits.total.value = arr.length;
        return elasticResponse;
    }

    export function getJsonCounts(param) {
        let must = constructMatchPhrase(param);
        let mustNot = constructMatchNotPhrase(param);
        let aggs = constructAggs("glob");
        return getElasticReponseCounts(param, aggs, must, mustNot).then(elasticResponse => {
            return {
                value: elasticResponse.hits.total.value,
                retweets: elasticResponse.aggregations.retweets.value,
                likes: elasticResponse.aggregations.likes.value,
                tweets: elasticResponse.hits.hits
            }
        });
    }




    //Donut charts (Most liked, most retweeted, most used hashtags, most active users)
    function getElasticReponseDonuts(param, field) {
        let aggs = constructAggs(field);
        let must = constructMatchPhrase(param);
        let mustNot = constructMatchNotPhrase(param);


        let query = JSON.stringify(buildQuery(aggs, must, mustNot, 0)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}");

        const userAction = async () => {
            const response = await fetch(elasticSearch_url, {
                method: 'POST',
                body:
                query,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const elasticResponse = await response.json();
            return elasticResponse;
        
        };
        return userAction();
    }

    function generatePlotlyJsonFromElasticResponseDonuts(elasticResponse, keywords, specificGetCallBack) {
        let labels = [];
        let parents = [];
        let value = [];

        let keys = elasticResponse["aggregations"]["2"]["buckets"];

        if (keys.length === 0)
            return null;
    
            //Initialisation
        labels.push(keywords.join(', ').replace(/#/g, ''));
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

    export async function getPlotlyJsonDonuts(param, field) {
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
        if (field === "hashtags") {
            return generatePlotlyJsonFromElasticResponseDonuts(await getElasticReponseDonuts(param, field), param.keywordList,  hashtagsGet);
        } else if (field === "nretweets" || field === "nlikes"){
            return generatePlotlyJsonFromElasticResponseDonuts(await getElasticReponseDonuts(param, field), param.keywordList,  mostRetweetGet);
        }
        else{
            return generatePlotlyJsonFromElasticResponseDonuts(await getElasticReponseDonuts(param, field), param.keywordList,  mostTweetsGet);
        }

    }



    // Words cloud chart
    export function generateWordCloudPlotlyJson(param) {

        let must = constructMatchPhrase(param);
        let mustNot = constructMatchNotPhrase(param);

        let query = JSON.stringify(buildQuery({}, must, mustNot, 10000)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}");
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
            console.log(myJson)
            return myJson;

        };
        return userAction();


    }



    //URL array
    function getElasticReponseURLs(param) {

        let must = constructMatchPhrase(param);
        let mustNot = constructMatchNotPhrase(param);
        let aggs = constructAggs("urls");

    

        let query = JSON.stringify(buildQuery(aggs, must, mustNot, 0)).replace(/\\/g, "").replace(/"{/g, "{").replace(/}"/g, "}");

        const userAction = async () => {
            const response = await fetch(elasticSearch_url, {
                method: 'POST',
                body:
                query,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const elasticResponse = await response.json();
            return elasticResponse;

        
        };
        return userAction();
    }

    function generateArrayFromElasticResponseURLs(elasticResponse) {
        let urlArray = [];

        let buckets = elasticResponse["aggregations"]["2"]["buckets"];

        buckets.forEach(bucket => {
            urlArray.push({url: bucket["key"], count: bucket["doc_count"]});
        });
        return urlArray;
    }

    export async function getReactArrayURL(param, urlTrad, countTrad){
        const array = generateArrayFromElasticResponseURLs(await getElasticReponseURLs(param));
        let columns = [
            {title: urlTrad, field: 'url'},
            {title: countTrad, field: 'count'},
        ];

        return {
            columns: columns,
            data: array,
        }
    }




//Build a query for elastic search
function buildQuery(aggs, must, mustNot, size) {
    let query = {
        "aggs": aggs,
        "size": size,
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
    else
        match_phrases = ""
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
