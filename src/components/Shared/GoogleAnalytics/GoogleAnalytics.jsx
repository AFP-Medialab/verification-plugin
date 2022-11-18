//import ReactGA from "react-ga";
//import history from "../History/History";
import { useLocation } from 'react-router-dom';
import history from "../History/History"

export function submissionEvent (payload) {
    var pathname = history.location.pathname
    console.log("pathname ", pathname)
    let events = [
        {
            name: "tool_submission",
            params: {
                action: 'Submitted from ' + pathname,
                label: payload
            },
        }
    ]
    ga4Call(events);

    let actions = {
        action_name : "tool_submission",
        //client_id: "11edc52b-2918-4d71-9058-f7285e29d894",
        e_c: "tool_submission",
        c_n: "video",
        c_p: payload,
        cvar: {
            page: pathname,
            content: payload
        }
    }
    matomoCall(actions)
    /*ReactGA.event({
        category: 'Submission',
        action: 'Submitted from ' + history.location.pathname,
        label: payload
    });*/
}

export function reverseSearchClick (payload) {
    let events = [
        {
            name: "reverse_search",
            params: {
                action : 'Reverse search ' + history.location.pathname + " for " + payload,
                label: payload
            } 
        }
    ]
   /* ReactGA.event({
        category: 'Reverse search',
        action: 'Reverse search ' + history.location.pathname + " for " + payload,
        label: payload
    });*/
    return true;
}
export function loadPage(path){
    history.push(path.pathname)
    var pathname = history.location.pathname
    console.log(path)
    console.log(pathname)

    let events = [
        {
            name: "page_view",
            params: {
                page_location: pathname
            }
        },
        
    ]
    ga4Call(events);

    let actions = {
        e_c: "page_view",
        action_name : pathname,
        url: "urn:"+pathname,
        //client_id: "11edc52b-2918-4d71-9058-f7285e29d894",
        cvar: {
            page: pathname,
        }
    }
    matomoCall(actions)

}

export function changeTabEvent (tabIndex, tabTitle) {
    let events = [
        {
            name: "switch_tab",
            params: {
                action: 'Switch tabs in ' + history.location.pathname,
                label: tabIndex + " - " + tabTitle, 
            },
        }
    ]
    ga4Call(events);
}

function matomoCall(actions){
    const matomo_site = 1
    const url_params = new URLSearchParams();
    url_params.append("idsite", matomo_site)
    url_params.append("rec", 1)
    url_params.append("apiv", 1)
    url_params.append("action_name", actions.action_name)
    url_params.append("url", actions.url)
    url_params.append("_id", actions.client_id)
    url_params.append("_cvar", JSON.stringify(actions.cvar))

    
    const url = process.env.REACT_APP_MATOMO_URL

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body: url_params
    })
}

function ga4Call(events) {
    const GACode  = process.env.REACT_APP_GOOGLE_ANALYTICS_KEY;
    const url_params = "measurement_id="+GACode+"&api_secret=Akub_0F8QyWH9x_-mf_mGg"
    const url_debug = "https://www.google-analytics.com/debug/mp/collect?"+url_params
    const url = "https://www.google-analytics.com/mp/collect?"+url_params

    let data = {
        client_id: "veraplugin.76",
        user_id: "vera user",
        events: events
    };
    

    fetch( url, {
        method: 'POST',
       // mode: 'no-cors',
        //cache: 'no-cache',
        //credentials: 'same-origin',
        headers: {
           'Content-Type': 'application/json',
        },
        //redirect: 'follow',
        //referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    })

}