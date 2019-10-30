import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Image from "material-ui-image"
const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: "80%",
        height: "auto",
        maxHeight: "500px"
    },
}));

const ImageGridList = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <GridList cellHeight={160} className={classes.gridList} cols={3}>
                {props.list.map(tile => (
                    <GridListTile key={tile} cols={1}>
                        <Image src={tile} alt={tile} onClick={(e) => props.onClick(e)}/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}
export default ImageGridList;