import history from "../History/History"
import { useSelector } from "react-redux"


    
export const getclientId = () => {
    const cookies = useSelector(state => state.cookies)
    const clientId = (cookies !== null) ? cookies.id : null
    return clientId;
}

export const toolEvent = (action_name, category, action, name, url, client_id) => {
    console.log("action_name ", action_name)
    let actions = {
        action_name : action_name,
        client_id: client_id,
        event : {
            e_c: category,
            e_a: action,
            e_n: name,
        },
        url: url,
    }
    matomoCall(actions)
}

export const trackEvent = (category, action, name, url, client_id) => {
    
    var pathname = history.location.pathname
    let actions = {
        action_name : pathname,
        client_id: client_id,
        event : {
            e_c: category,
            e_a: action,
            e_n: name,
        },
        url: url,
    }
    matomoCall(actions)
}

export const trackPageView = (path, client_id) => {
    if(path !== null)
        history.push(path.pathname)
    var pathname = history.location.pathname
    
    let actions = {
        action_name : pathname,  
        client_id: client_id,
        url: "urn:"+pathname,
        //client_id: "11edc52b-2918-4d71-9058-f7285e29d894",
    }
    matomoCall(actions)
}

const resolution = () => {

    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}


function matomoCall(actions){
    const {innerWidth, innerHeight} = resolution()
    const matomo_site = 1
    const url_params = new URLSearchParams();
    url_params.append("idsite", matomo_site)
    url_params.append("rec", 1)
    url_params.append("apiv", 1)
    url_params.append("action_name", actions.action_name)
    url_params.append("url", actions.url)
    url_params.append("_id", actions.client_id)
    url_params.append("_cvar", JSON.stringify(actions.cvar))
    if(typeof actions.event != "undefined"){
        url_params.append("e_c", actions.event.e_c)
        url_params.append("e_a", actions.event.e_a)
        url_params.append("e_n", actions.event.e_n)
    }
    url_params.append("cookie", 1)
    url_params.append("res", innerWidth+"x"+innerHeight)

    
    const url = process.env.REACT_APP_MATOMO_URL

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        body: url_params
    })
}