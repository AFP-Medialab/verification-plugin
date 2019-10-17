import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";

// We can inject some CSS into the DOM.
const styles = {
    root: {
        background: 'rgb(0,170,180)',
        borderRadius: 5,
        textAlign: "center",
        color: 'white',
        fontSize: 28,
        padding: '15px',
        width: "auto",
        margin: 5,
    },
};

function CustomTile(props) {
    const { classes, children, className, ...other } = props;

    return (
        <Box className={clsx(classes.root, className)} {...other}>
            {children || 'class names'}
        </Box>
    );
}

CustomTile.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
};

export default withStyles(styles)(CustomTile);