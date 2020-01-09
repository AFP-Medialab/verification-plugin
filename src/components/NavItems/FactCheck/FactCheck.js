import React, {useEffect, useState} from "react";
import Parser from "rss-parser"
import {useSelector} from "react-redux";
import Paper from "@material-ui/core/Paper";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import Box from "@material-ui/core/Box";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/NavItems/FactCheck.tsv";

const FactCheck = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/FactCheck.tsv", tsv);
    const language = useSelector(state => state.language);
    const [feed, setFeed] = useState(null);

    async function updateFeed(language) {

        let rssUrl;
        switch (language) {
            case "fr":
                rssUrl = "https://factuel.afp.com/rss.xml";
                break;
            case "es":
                rssUrl = "https://factual.afp.com/rss.xml";
                break;
            default:
                rssUrl = "https://factcheck.afp.com/rss.xml";
                break;
        }
        let parser = new Parser();
        setFeed(await parser.parseURL(rssUrl));
    }


    useEffect(() => {
        updateFeed(language);
    }, [language]);

    if (feed)
        console.log(feed.items);

    const finishXMLParsing = (str) => {
        return str.replace(/&#039;/g, "'").replace(/&quot;/g, "\"")
    }

    return (
        <Paper className={classes.root}>
            <CustomTile text={keyword("factCheckTitle")}/>
            <Box m={2}/>
            <Grid container align={"center"} spacing={2}>
                {
                    feed && feed.items &&
                    feed.items.map((val, key) => {
                        return (
                            <Grid item key={key}>
                                <Card className={classes.FactCheckCard}>
                                    <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                            {finishXMLParsing(val.pubDate)}
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                            {finishXMLParsing(val.title)}
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            {keyword("author") + finishXMLParsing(val.creator)}
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            {finishXMLParsing(val.content)}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => window.open(val.link, "_blank")} size="small">
                                            {keyword("learn_more")}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </Paper>
    );
};
export default FactCheck;