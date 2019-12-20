import React from 'react';
import Box from "@material-ui/core/Box";
import useMyStyles from "../MaterialUiStyles/useMyStyles";

function CustomTile(props) {
    const classes = useMyStyles();
    return (
        <Box className={classes.customTitle}>
            {
                props.text
            }
        </Box>
    );
}
export default CustomTile;