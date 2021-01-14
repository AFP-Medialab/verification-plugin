import React, {useState} from "react";
import {useSelector} from "react-redux";

import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ReactWordcloud from "react-wordcloud";

import tsv from "../../../../LocalDictionary/components/NavItems/tools/Assistant.tsv";
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

const AssistantNEResult = () => {

    const keyword = useLoadLanguage("components/NavItems/tools/Assistant.tsv", tsv);
    const classes = useMyStyles()

    const neResult = useSelector(state => state.assistant.neResultCategory);
    const neResultCount = useSelector(state => state.assistant.neResultCount);
    const neLoading = useSelector(state => state.assistant.neLoading);

    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleCollapse = (index) => {
        index === selectedIndex ?
            setSelectedIndex(null) : setSelectedIndex(index)
    }

    const options = {
        rotations: 1,
        rotationAngles: [0],
    };

    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader className={classes.assistantCardHeader}
                            title={keyword("named_entity_title")}
                />
                <LinearProgress hidden={!neLoading}/>
                <CardContent>
                    <Grid container>
                        <Grid item xs={4} style={{"maxHeight": 300, "overflowY": 'auto'}}>
                            <List>
                                {neResult.map((value, index)=>(
                                    <Box key={index}>
                                        <ListItem button onClick={() => handleCollapse(index)}>
                                            <ListItemText primary= {
                                                <Typography component={"div"} align={"left"}>
                                                    <Box fontWeight="fontWeightBold">
                                                        {value["category"]}
                                                    </Box>
                                                </Typography>}/>
                                            {index === selectedIndex ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Collapse in={index === selectedIndex}>
                                            <List component="div" disablePadding >
                                                {value["words"].map((v)=>(
                                                    <ListItem key={v}>
                                                        <ListItemText>{v}</ListItemText>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Collapse>
                                    </Box>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={1} align={"center"}>
                            <Divider orientation="vertical"/>
                        </Grid>
                        <Grid item xs={7} align={"center"}>
                            <ReactWordcloud words={neResultCount} options={options}/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}


export default AssistantNEResult;