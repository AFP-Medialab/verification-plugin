import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
//import ImageList from '@material-ui/core/ImageList';
//import ImageListItem from '@material-ui/core/ImageListItem';
import { Grid } from '@material-ui/core';

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
        
        paddingBottom: "10px"
    },
}));


const ImageUrlGridList = (props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={1}>
                {props.list.map((tile, index) => { 
                return(
                    <Grid item  key={index} xs={(12/props.cols)} >
                        {
                            index === (props.list.length - 1) && props.setLoading !== null 
                            ?
                                <img src={tile.url} alt={tile.url}  onLoad={props.setLoading} style={{width: "100%", height: "auto"}} />
                            :
                                <img src={tile.url} alt={tile.url}  style={{ width: "100%", height: "auto" }} />
                        }
                        
                    </Grid>
                )})}
            </Grid>
        </div>
    );
}
export default ImageUrlGridList;