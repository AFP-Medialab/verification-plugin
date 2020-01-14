import ReactGA from "react-ga";
import history from "../History/History";

export function submissionEvent (payload) {
    ReactGA.event({
        category: 'Submission',
        action: 'Submitted from ' + history.location.pathname,
        label: payload
    });
}