function replaceAll(str, find, replace)
{
    return str.replace( new RegExp(find, 'g'), replace );
}

function convertToEpoch(date)
{
    let epoch = new Date(date);
    /*if( document.getElementById('gmt').checked ) {
        epoch = new Date(Date.UTC(
            epoch.getFullYear(),
            epoch.getMonth(),
            epoch.getDate(),
            epoch.getHours(),
            epoch.getMinutes()
        ));
    }*/
    epoch = epoch.getTime()/1000;
    return epoch;
}

export const createUrl = (term, account, filter, lang, geocode, near, within, from_date, to_date) =>
{
    let twitter_url = "https://twitter.com/search?f=tweets&q=";
    twitter_url = twitter_url +  replaceAll(term, "#", "%23");
    if (account !== ""){
        twitter_url += "%20from:" + account;
    }
    if (filter !== ""){
        twitter_url += "%20filter:" + filter;
    }
    if (lang !== ""){
        twitter_url += "%20lang:" + lang;
    }
    if (geocode !== ""){
        twitter_url +=  "%20geocode:" + geocode;
    }
    if (near !== ""){
        twitter_url += "%20near:" + near;
        if (within !== "") {
            twitter_url += "%20within:" + within;
        }
    }
    if (from_date){
        let epoch = convertToEpoch(from_date);
        twitter_url += "%20since%3A" + epoch;
    }
    if (to_date) {
        let epoch = convertToEpoch(to_date);
        twitter_url += "%20until%3A" + epoch;
    }
    // twitter_url = twitter_url + "&src=typd"
    return twitter_url;
}