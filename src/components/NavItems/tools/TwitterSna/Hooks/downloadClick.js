
export function downloadClick(request, csvArr, name, histo, type = "Tweets_") {
    let encodedUri = encodeURIComponent(csvArr);
    let link = document.createElement("a");
    link.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodedUri);
    link.setAttribute("download", type + name + "_" + request.keywordList.join('&') + '_' + ((!histo) ? (request.from + "_" + request.until) : "") + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
export function createCSVFromPieChart(obj) {
    let csvArr = "Sector,Count\n";
    for (let i = 1; i < obj.json[0].labels.length; i++) {
        csvArr += obj.json[0].labels[i] + "," + obj.json[0].values[i] + "\n";
    }
    return csvArr;
}

export function createCSVFromURLTable(urls) {
    let csvArr = "Url,Count\n";
    urls.data.forEach(row => 
        csvArr += row.url + "," + row.count + "\n"
    );
    return csvArr;
}
