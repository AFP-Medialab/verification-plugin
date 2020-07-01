import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from "@material-ui/core/GridListTile";
import Link from "@material-ui/core/Link";
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: "100%",
        maxHeight: "500px",
    },
    icon: {
        color: theme.palette.secondary.main,
        position: "relative",
        top: theme.spacing.unit,
        width: theme.typography.h5.fontSize,
        height: theme.typography.h5.fontSize,
        marginRight: 3
    },
}));

const VideoGridList = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GridList cellHeight={'auto'} className={classes.gridList} cols={1}>
                {props.list.map((tile, index) => (
                    <GridListTile key={index} cols={1}>
                        <LinkIcon className={classes.icon}/>
                        <Link variant="body2" onClick={() => {
                            props.handleClick(tile)
                        }}>{tile}</Link>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}
export default VideoGridList;