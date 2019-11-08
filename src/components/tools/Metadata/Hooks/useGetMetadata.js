import {useState} from "react";

function get_real_url_img(url)
{
    let regex_drive = /https:\/\/drive\.google\.com\/file\/d\/(.*)\/view\?usp=sharing/i;
    if( regex_drive.test(url) ) {
        url = "https://drive.google.com/uc?id=" + regex_drive.exec(url)[1];
    } else if( /^https:\/\/www.dropbox.com\//i.test(url) ) {
        url = url.replace(/:\/\/www./, "://dl.");
    }
    return url;
}

const useGEtMetadata = (url, isImage) => {
    const [metadata, setMetadata] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);

    let realUrl = get_real_url_img(url);
    if (isImage){

    }
};