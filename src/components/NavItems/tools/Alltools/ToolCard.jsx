import React, { Component } from 'react';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AuthenticationIcon from "./AdvancedTools/AuthenticationIcon";
import ImprovedIcon  from "../../../NavBar/images/SVG/Improved.svg";
import BugReportIcon from '@mui/icons-material/BugReport';

export class ToolCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hovered: false
        };
    }

    onMouseEnter = e => {
        this.setState({ hovered: true });
    };

    onMouseLeave = e => {
        this.setState({ hovered: false });
    };


    render() {

        var showNew = false;
        var showRedesign = false;
        var showLock = false;
        var showExperimental = false;


        //console.log(this.props);

        if (this.props.iconsAttributes !== undefined){
            if (this.props.iconsAttributes.includes("redesigned")) {
                showRedesign = true;
            }

            if (this.props.iconsAttributes.includes("new")) {
                showNew = true;
            }

            if (this.props.iconsAttributes.includes("lock")) {
                showLock = true;
            }

            if (this.props.iconsAttributes.includes("experimental")) {
                showExperimental = true;
            }
        }

        

        const { hovered } = this.state;
        const styleCard = hovered ? {
            border: 'solid #90A4AE 2px',
            borderRadius: "10px",
            cursor: "pointer",
            backgroundColor: "#ffffff",
        }

            : {
                border: 'solid #dce0e2 2px',
                borderRadius: "10px",
                cursor: "pointer",
                backgroundColor: "#ffffff",
            };

        return (

            <Box onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={styleCard}>

                <Box p={2}>


                    <Box mr={1}>

                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                        >

                            <Grid item>
                                {this.props.icon}
                            </Grid>
                            <Grid item>
                                <Box ml={1} />
                            </Grid>

                            <Grid item xs>
                                <Typography variant="h6">{this.props.name}</Typography>
                            </Grid>


                            {showRedesign &&
                                <Grid item style={{ marginLeft: 'auto', color: "#F44336" }} >
                                    <ImprovedIcon title="Upgraded" width="40px" height="40px" />
                                </Grid>
                            }

                            {showNew &&
                                <Grid item style={{ marginLeft: 'auto', color: "#F44336" }} >
                                    <FiberNewIcon />
                                </Grid>
                            }

                            {showExperimental &&
                                <Grid item style={{ marginLeft: 'auto', color: "#F44336" }} >
                                    <BugReportIcon />
                                </Grid>
                            }


                            {showLock && !(this.state.userSession && this.state.userSession.userAuthenticated) &&
                                <Grid item style={{ marginLeft: 'auto' }} >
                                    <Box ml={2}>
                                        <AuthenticationIcon />
                                    </Box>
                                </Grid>
                            }

                        </Grid>
                    </Box>



                    <Box m={1} />


                    <div style={{ minHeight: "45px" }}>
                        <span style={{ fontSize: '10px', }}>{
                            this.props.description}
                        </span>
                    </div>






                </Box>





            </Box>

        )
    }

}

export default ToolCard;