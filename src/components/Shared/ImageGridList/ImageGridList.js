import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';

const useStyles = makeStyles(theme => ({
    root: {
        width:"100%",
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    imageList: {
        width: "100%",
        maxHeight: "500px",
        paddingBottom: "10px"
    },
}));




const ImageImageList = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <ImageList rowHeight={props.height} className={classes.imageList} cols={props.cols!=null ? props.cols : 3}>
                {props.list.map((tile, index) => (
                    <ImageListItem  key={index} cols={1} >
                         <img src={tile} alt={tile} onClick={() => props.handleClick(props.list[index])}/>
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );
}
export default ImageImageList;