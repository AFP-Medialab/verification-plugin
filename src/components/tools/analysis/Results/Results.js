import React from "react";
import {useSelector} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
}));

const Results = (props) => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    keyword("")

    const report = props.report;
    return (
        <div>
            {
                report !== null && report["thumbnails"] !== undefined &&
                report["thumbnails"]["preferred"]["url"] &&
                <Card className={classes.card}>
                    <CardHeader
                        title={report["video"]["title"]}
                        subheader={report["video"]["publishedAt"]}
                    />
                    <CardMedia
                        className={classes.media}
                        image={report["thumbnails"]["preferred"]["url"]}
                        title={report["video"]["title"]}
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {
                                report["video"]["description"]
                            }
                        </Typography>
                    </CardContent>
                </Card>
            }
        </div>
    );
}
export default Results;