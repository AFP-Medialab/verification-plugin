import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsvConversation from "../../../../LocalDictionary/components/NavItems/tools/Conversation.tsv";
import tsvAllTools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";

import { setConversationInput}  from "../../../../redux/actions/tools/conversationActions";

import { ReactComponent as ConversationIcon } from "../../../NavBar/images/SVG/DataAnalysis/Twitter_sna.svg"

import {Box, Button, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const Conversation = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Conversation.tsv", tsvConversation);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAllTools);

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
                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="center"
                    >
                        <Grid item xs>
                            <TextField
                                id="standard-full-width"
                                label={keyword("conversation_urlbox")}
                                placeholder={keyword("conversation_urlbox_placeholder")}
                                fullWidth
                                
                                variant="outlined"
                                
                            />

            
                        </Grid>

                        <Grid item>
                            <Button variant="contained" color="primary">
                                {keyword("button_submit") || ""}
                            </Button>

                        </Grid>

                    </Grid>
                </Box>
            </Card>
        </div>
    )
};

export default Conversation;