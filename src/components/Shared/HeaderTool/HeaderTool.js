import React, { Component } from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

export class HeaderTool extends Component {

    render() {

        var name = this.props.name;
        var description = this.props.description;
        var icon = this.props.icon;

        return(

            <div>
                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >

                    {icon}
                    <Typography variant="h4" color={'primary'}>
                        {name}
                    </Typography>

                </Grid>

                <Box ml={1}>
                    <Typography variant="body1">
                        {description}
                    </Typography>
                </Box>
                <Box m={3} />

            </div>

        )
    }


} 
export default HeaderTool;