import { loadImage, localImageGoogleSearch } from "./reverseSearchUtils";
const ImageReverseSearch = (type, urls) => {

  
    let baseUrl = {
        baidu: {
            search: "https://image.baidu.com/n/pc_search?queryImageUrl="
        },
        bing: {
            search: "https://www.bing.com/images/search?q=imgurl:",
            end: "&view=detailv2&iss=sbi"
        },
        google: {
            search: "https://www.google.com/searchbyimage?sbisrc=cr_1_5_2&image_url="
        },
        tineye: {
            search: "https://www.tineye.com/search?url="
        },
        yandex: {
            search: "https://yandex.com/images/search?url=",
            end: "&rpt=imageview"
        },
        reddit : {
            search: "http://karmadecay.com/search?kdtoolver=b1&q="
        }
    };
    if( typeof urls === "string" ) urls = [urls];

    if (type === "all")
    {
        ImageReverseSearch("baidu", urls);
        ImageReverseSearch("bing", urls);
        //ImageReverseSearch("google", urls);
        GoogleReversSearch(urls)
        ImageReverseSearch("tineye", urls);
        ImageReverseSearch("yandex", urls);
        ImageReverseSearch("reddit", urls);
        return;
    }
    let urlStart = baseUrl[type].search;
    let urlEnd = ( baseUrl[type].end !== undefined ? baseUrl[type].end : "" );
    for (let image of urls){
        window.open(urlStart + encodeURIComponent(image) + urlEnd)
    }
};

export const GoogleReversSearch = (urls) => {
    if( typeof urls === "string" ) urls = [urls];
    for (let image of urls){
        loadImage(image, localImageGoogleSearch)
    }    
}
export default ImageReverseSearch;