import ReactGA from "react-ga";
import history from "../History/History";

export function submissionEvent (payload) {
    ReactGA.event({
        category: 'Submission',
        action: 'Submitted from ' + history.location.pathname,
        label: payload
    });
}

export function reverseSearchClick (payload) {
    ReactGA.event({
        category: 'Reverse search',
        action: 'Reverse search ' + history.location.pathname + " for " + payload,
        label: payload
    });
    return true;
}

export function changeTabEvent (tabIndex, tabTitle) {
    ReactGA.event({
        category: 'switchTab',
        action: 'Switch tabs in ' + history.location.pathname,
        label: tabIndex + " - " + tabTitle
    });
}