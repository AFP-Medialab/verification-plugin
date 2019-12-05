import React from "react";
import SlackFeedback from "react-slack-feedback";
import feedBackTheme from "./feedBackTheme";

const FeedBack = () => {
    const API_URL = process.env.REACT_APP_MY_WEB_HOOK_URL;

    const sendToSlack = (payload, success, error) => {

        return fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) {
                    error(res);
                    throw res
                }
                return res
            })
            .then(success)
    };

    return (
        <div>
            <SlackFeedback
                disabled={false}
                errorTimeout={8 * 1000}
                onClose={() => {
                }}
                onOpen={() => {
                }}
                sentTimeout={5 * 1000}
                showChannel={false}
                showIcon={false}
                theme={feedBackTheme}
                onSubmit={(payload, success, error) =>
                    sendToSlack(payload, success, error)
                }
                user={"Invid Feed Back"}
            />
        </div>
    )
};
export default FeedBack;