import analysisIconOff from "../../NavBar/images/tools/video_logoOff.png";
import keyframesIconOff from "../../NavBar/images/tools/keyframesOff.png";
import thumbnailsIconOff from "../../NavBar/images/tools/youtubeOff.png";
import twitterSearchIconOff from "../../NavBar/images/tools/twitterOff.png";
import magnifierIconOff from "../../NavBar/images/tools/magnifierOff.png";
import metadataIconOff from "../../NavBar/images/tools/metadataOff.png";
import videoRightsIconOff from "../../NavBar/images/tools/copyrightOff.png";
import forensicIconOff from "../../NavBar/images/tools/forensic_logoOff.png";
import twitterSnaIconOff from "../../NavBar/images/tools/twitter-sna-off.png";

export const CONTENT_TYPE = {
    VIDEO: "Video",
    IMAGE: "Image",
    PDF: "PDF",
    AUDIO: "Audio",
    TEXT: "Text",
    ALL: "All"
};

export const DOMAIN ={
    FACEBOOK: "Facebook",
    YOUTUBE: "Youtube",
    TWITTER: "Twitter",
    OWN: "Own",
    OTHER: "Misc"
};

export const SCRAPER = {
    TWITTER: "Twitter"
}

export const TYPE_PATTERNS = [
    {
        key: CONTENT_TYPE.VIDEO,
        patterns: [/(mp4|webm|avi|mov|wmv|ogv|mpg|flv|mkv)(\?.*)?$/i,
            /(facebook\.com\/.*\/videos\/)/,/(twitter\.com\/.*\/video)/,
            /((y2u|youtube|youtu\.be).*(?!\')[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw](?=))/]
    },
    {
        key: CONTENT_TYPE.IMAGE,
        patterns: [
            /(jpg|jpeg|png|gif|svg)(\?.*)?$/i,
            /(facebook\.com\/.*\/photos\/)/,
            /(pbs\.twimg\.com\/)/, /(twitter\.com\/.*\/photo)/,
            /(i\.ytimg\.com)/]
    },
    {
        key: CONTENT_TYPE.PDF,
        patterns: [/^.*\.pdf(\?.*)?(\#.*)?/]
    },
    {
        key: CONTENT_TYPE.AUDIO,
        patterns: [/(mp3|wav|m4a)(\?.*)?$/i]
    }
];

export const DOMAIN_PATTERNS = [
    {
        key: DOMAIN.FACEBOOK,
        patterns: ["^(https?:/{2})?(www.)?facebook.com|fbcdn.net"]
    },
    {
        key: DOMAIN.YOUTUBE,
        patterns: ["^(https?:/{2})?(www.)?youtube|youtu.be|i.ytimg"]
    },
    {
        key: DOMAIN.TWITTER,
        patterns: ["^(https?:/{2})?(www.)?twitter.com|twimg.com"]
    },
    {
        key: DOMAIN.OTHER,
        patterns: ["https?:/{2}(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_+.~#?&//=]*)"]
    }
];

export const SCRAPERS = [
    {
        key: SCRAPER.TWITTER,
        patterns: "((https?:/{2})?(www.)?twitter.com/\\w{1,15}/status/\\d*)",
        requireLogIn: true,
    }
]

export const ASSISTANT_ACTIONS = [
    {
        title: "navbar_analysis",
        icon: analysisIconOff,
        domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
        ctypes: [CONTENT_TYPE.VIDEO],
        type_restriction: [],
        text: "analysis_text",
        tsvPrefix: "api",
        path: "tools/analysis",
    },
    {
        title: "navbar_keyframes",
        icon:  keyframesIconOff,
        domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER, DOMAIN.OWN),
        ctypes: [CONTENT_TYPE.VIDEO],
        type_restriction: [],
        text: "keyframes_text",
        tsvPrefix: "keyframes",
        path: "tools/keyframes",
    },
    {
        title: "navbar_thumbnails",
        icon: thumbnailsIconOff,
        domains: new Array(DOMAIN.YOUTUBE),
        ctypes: [CONTENT_TYPE.VIDEO],
        type_restriction: [],
        text: "thumbnails_text",
        tsvPrefix: "thumbnails",
        path: "tools/thumbnails",
    },
    {
        title: "navbar_twitter",
        icon: twitterSearchIconOff,
        domains: new Array(DOMAIN.TWITTER),
        ctypes: [CONTENT_TYPE.TEXT],
        type_restriction: [],
        text: "twitter_text",
        tsvPrefix: "twitter",
        path: "tools/twitter",
    },
    {
        title: "navbar_magnifier",
        icon: magnifierIconOff,
        domains: new Array(DOMAIN.OTHER, DOMAIN.OWN, DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
        ctypes: [CONTENT_TYPE.IMAGE],
        type_restriction: [],
        text: "magnifier_text",
        tsvPrefix: "magnifier",
        path: "tools/magnifier",
    },
    {
        title: "navbar_metadata",
        icon: metadataIconOff,
        domains: new Array(DOMAIN.OTHER, DOMAIN.OWN),
        ctypes: [CONTENT_TYPE.IMAGE, CONTENT_TYPE.VIDEO],
        type_restriction: [/(jpg|jpeg|mp4|mp4v|instagram)(\?.*)?$/i],
        text: "metadata_text",
        tsvPrefix: "metadata",
        path: "tools/metadata",
    },
    {
        title: "navbar_rights",
        icon:  videoRightsIconOff,
        domains: new Array(DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
        ctypes: [CONTENT_TYPE.VIDEO],
        type_restriction: [],
        text: "rights_text",
        tsvPrefix: "copyright",
        path: "tools/copyright",
    },
    {
        title: "navbar_forensic",
        icon: forensicIconOff,
        domains: new Array(DOMAIN.OTHER, DOMAIN.OWN, DOMAIN.YOUTUBE, DOMAIN.FACEBOOK, DOMAIN.TWITTER),
        ctypes: [CONTENT_TYPE.IMAGE],
        type_restriction: [],
        text: "forensic_text",
        tsvPrefix: "forensic",
        path: "tools/forensic",
    },
    {
        title: "navbar_twitter_sna",
        domains: new Array(),
        ctypes: [],
        type_restriction: [],
        text: "sna_text",
        icon:  twitterSnaIconOff,
        tsvPrefix: "twitter_sna",
        path: "tools/twitterSna"
    },
];

export const selectCorrectActions = (domain, contentType, url) => {
    let possibleActions =
        ASSISTANT_ACTIONS.filter(action=>
            action.domains.includes(domain) &&
            (action.ctypes.includes(contentType) || action.ctypes==CONTENT_TYPE.ALL) &&
            (action.type_restriction.size==0 || url.match(action.type_restriction[0])));

    return possibleActions;
}


export const matchPattern = (toMatch, matchObject) => {
    // find the record where from the regex patterns in said record, one of them matches "toMatch"
    let match = matchObject.find(record=>record.patterns.some((rgxpattern)=>toMatch.match(rgxpattern)!=null));
    return match !=null ? match.key : null;
}