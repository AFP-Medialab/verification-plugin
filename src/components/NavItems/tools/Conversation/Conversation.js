import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";

import { ReactComponent as ConversationIcon } from "../../../NavBar/images/SVG/DataAnalysis/Twitter_sna.svg"

import {Box, Button, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const Conversation = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsv);

    const classes = useMyStyles();

    return (
        <div>
            <HeaderTool name={keywordAllTools("navbar_conversation")} description={keywordAllTools("navbar_conversation_description")} icon={<ConversationIcon style={{ fill: "#51A5B2" }} />} />

            <Card>
                <CardHeader
                    title={keyword("cardheader_source")}
                    className={classes.headerUpladedImage}
                />
                <Box p={3}>

                </Box>
            </Card>
        </div>
    )
};

export default Conversation;