import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import React from "react";
import {useSelector} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        marginTop: 20,
        textAlign: "center",
    },
    card: {
        width: "100%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}));



const AllTools = (props) => {
    const classes = useStyles();
    const dictionary = useSelector(state => state.dictionary);
    const lang = useSelector(state => state.language);
    const keyword = (key) => {
        return (dictionary !== null) ? dictionary[lang][key] : "";
    };
    const tools = props.tools;

    return (
        <Paper className={classes.root}>
            <Grid container justify="center" spacing={2}>
                {
                    tools.map((value, key) => {
                        if (key !== 0)
                            return (
                                <Box key={key} m={1}>
                                    <Card className={classes.card}>
                                        <CardHeader
                                            avatar={value.icon}
                                            title={keyword(value.title)}
                                            subheader=""
                                        />

                                    </Card>
                                </Box>
                            )
                    })
                }
            </Grid>
        </Paper>
    );
};
export default AllTools;