import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import GridList from '@material-ui/core/GridList';
import ListItem from "@material-ui/core/ListItem";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles(theme => ({
    root: {
        width:"100%",
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: "100%",
        maxHeight: "500px",
    },
}));

const VideoGridList = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GridList className={classes.gridList} cols={1}>
                <List>
                    {props.list.map((tile, index) => (
                        <ListItem key={index} value={tile} onClick={()=>{props.handleClick(tile)}}>
                            <Button variant={"outlined"} color={"primary"}><LinkIcon fontSize={"small"} color={"primary"}/></Button>
                           <Link variant="body2" href={tile}>{tile}</Link>
                        </ListItem>
                    ))}
                </List>
            </GridList>
        </div>
    );
}
export default VideoGridList;