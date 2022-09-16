import { useState } from "react";
import SlackFeedback from "react-slack-feedback";
import feedBackTheme from "./feedBackTheme";
import useLoadLanguage from "../../Hooks/useLoadLanguage";
import tsv from "../../LocalDictionary/components/FeedBack.tsv";
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import useMyStyles from "../Shared/MaterialUiStyles/useMyStyles";


const FeedBack = () => {
    const API_URL = process.env.REACT_APP_MY_WEB_HOOK_URL;
    const keyword = useLoadLanguage("components/FeedBack.tsv", tsv);
    const classes = useMyStyles();
    const [isOpened, setIsOpened] = useState(false);
    const [classTitle, setClassTitle] = useState(classes.feedbackButtonTitleHide);

    const translationJson = {
        "checkbox.option": "Send url with feedback",
        "close": keyword("close"),
        "error.archived": keyword("archived"),
        "error.badrequest": keyword("badrequest"),
        "error.forbidden": keyword("forbidden"),
        "error.internal": keyword("internal"),
        "error.notfound": keyword("notfound"),
        "error.unexpected":  keyword("unexpected"),
        "error.upload": "Error uploading image!",
        "feedback.type.improvement": keyword("improvement"),
        "feedback.type.bug": keyword("bug"),
        "feedback.type.feature": keyword("feature"),
        "header.title": <span className={classes.feedbackHeaderTitle}>{keyword("title")}</span>,
        "image.remove": keyword("remove"),
        "label.channel": "Channel",
        "label.message": keyword("message"),
        "label.type": keyword("type"),
        "placeholder": keyword("placeholder"),
        "submit.sending": keyword("sending"),
        "submit.sent": keyword("sent"),
        "submit.text": keyword("submit_text"),
        "upload.text": "Attach Image",
        "trigger.text": <span className={classTitle}>{keyword("button")}</span>,
        "footer.text": "React Slack Feedback"
    };
    
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
        <div 
            onMouseEnter={e => {
                setClassTitle(classes.feedbackButtonTitleShow);
            }}
            onMouseLeave={e => {
                if(!isOpened){
                    setClassTitle(classes.feedbackButtonTitleHide);
                }
            }}>

            <SlackFeedback
                disabled={false}
                errorTimeout={8 * 1000}
                onClose={() => {
                    setIsOpened(false);
                    setClassTitle(classes.feedbackButtonTitleHide);
                }}
                onOpen={() => {
                    setIsOpened(true);
                }}
                sentTimeout={5 * 1000}
                showChannel={false}
                showIcon={true}
                theme={feedBackTheme}
                onSubmit={(payload, success, error) =>
                    sendToSlack(payload, success, error)
                }
                user={"Invid Feed Back"}
                translations={translationJson}
                icon={() => <QuestionAnswerOutlinedIcon/>}
            />
        </div>
    )
};
export default FeedBack;