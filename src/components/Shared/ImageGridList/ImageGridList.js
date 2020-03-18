import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

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

const ImageGridList = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <GridList cellHeight={props.height} className={classes.gridList} cols={3}>
                {props.list.map((tile, index) => (
                    <GridListTile  key={index} cols={1} >
                         <img src={tile} alt={tile} onClick={(e) => props.handleClick(e)} />
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}
export default ImageGridList;