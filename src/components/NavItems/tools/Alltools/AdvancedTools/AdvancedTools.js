import React, { Component } from 'react';
import { useEffect } from "react";
//import { ReactComponent as GifIcon } from "../../../NavBar/images/SVG/Image/Gif.svg"
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import TextField from "@material-ui/core/TextField";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import useAuthenticationAPI from '../../../../Shared/Authentication/useAuthenticationAPI';
import { useSelector, useDispatch } from 'react-redux';
import { ERR_AUTH_UNKNOWN_ERROR } from '../../../../Shared/Authentication/authenticationErrors';
import { setError } from "../../../../../redux/actions/errorActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";

const AdvancedTools = (porps) => {

    // Redux store
    const dispatch = useDispatch();
    const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);
    const user = useSelector(state => state.userSession && state.userSession.user);
    const userRegistrationLoading = useSelector(state => state.userSession && state.userSession.userRegistrationLoading);
    const userRegistrationSent = useSelector(state => state.userSession && state.userSession.userRegistrationSent);
    const accessCodeRequestLoading = useSelector(state => state.userSession && state.userSession.accessCodeRequestLoading);
    const accessCodeRequestSent = useSelector(state => state.userSession && state.userSession.accessCodeRequestSent);
    const userLoginLoading = useSelector(state => state.userSession && state.userSession.userLoginLoading);


    // i18n
    const messageI18NResolver = useLoadLanguage("components/Shared/Authentication.tsv", tsv);


    const [dialogState, setDialogState] = React.useState(0);
    const [textToolsState, setTextToolsState] = React.useState("The advanced tools are locked");
    const [textButton, setTextButton] = React.useState("UNLOCK");
    const [colorButton, setColorButton] = React.useState("primary");
    const [iconState, setIconState] = React.useState(<LockIcon fontSize="small" />);

    const [open, setOpen] = React.useState(false);

    const isAuthenticated = () => {
        return userAuthenticated;
    }

    useEffect(() => {

        if (isAuthenticated){
            setAuthenticatedData();
        }else{
            setNotAuthenticatedData();
        }

    }, []);

    const setAuthenticatedData = () => {
        setDialogState(2);
        setTextToolsState("The advanced tools are unlocked");
        setTextButton("EXIT");
        setColorButton("secondary");
        setIconState(<LockOpenIcon fontSize="small" />);
    }

    const setNotAuthenticatedData = () => {
        setDialogState(0);
        setTextToolsState("The advanced tools are locked");
        setTextButton("UNLOCK");
        setColorButton("primary");
        setIconState(<LockIcon fontSize="small" />);
    }


    const handleClickOpen = () => {
        if(dialogState===0){
            setOpen(true);
        }else{
            logoutOnClick();
            
            setNotAuthenticatedData();
        }
        
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [email, setEmail] = React.useState("");
    const [code, setCode] = React.useState("");
    const [stateGetCode, setStateGetCode] = React.useState(true);



    const handleGetCode = () => {
        submitGetCode(email);
        
    };

    const [stateUnlockTools, setStateUnlockTools] = React.useState(true);

    
    const handleClickUnlock = () => {
        submitCode(code)
    };

    const handleCloseFinish = () => {
        setOpen(false);
        setAuthenticatedData();
    };

    




    // Authentication API
    const authenticationAPI = useAuthenticationAPI();

    const submitGetCode = (emailInput) => {
        authenticationAPI.requestAccessCode({
            email: emailInput
        }).then(result => {
            setDialogState(1);
        }).catch(error => {
            handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
        });
    };

    const submitCode = (codeInput) => {
        authenticationAPI.login({
            accessCode: codeInput
        }).then(result => {
            setDialogState(2);
            console.log(result);
        }).catch(error => {
            handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
        });
    };

    const logoutOnClick = () => {
        authenticationAPI.logout().catch(error => {
            handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
        });
    };



    // Error handler
    const handleError = (errorKey) => {
        let errMsg = messageI18NResolver(errorKey);
        if (errMsg === "") {
            errMsg = messageI18NResolver(ERR_AUTH_UNKNOWN_ERROR);
        }
        dispatch(setError(errMsg));
    };

    return (

        <div>

            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={2}
            >

                <Grid item xs>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="flex-end"
                    >

                        <Grid item
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            spacing={1}>
                                <Grid item>
                                    {iconState}
                                </Grid>

                                <Grid item>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Advanced tools
                                    </Typography>
                                </Grid>
                            
                        </Grid>

                        <Grid item>
                            <Typography variant="body2" gutterBottom style={{ color: "#737373"}}>
                                {textToolsState}
                            </Typography>
                        </Grid>


                    </Grid>

                </Grid>

                <Grid item>
                    <Button variant="outlined" color={colorButton} onClick={handleClickOpen} style={{ border: "2px solid", heigth: "40px" }}>
                        {textButton}
                    </Button>
                </Grid>

            </Grid>


            <Dialog
                fullWidth
                maxWidth={'xs'}
                open={open}
                onClose={handleClose}
                aria-labelledby="max-width-dialog-title"
                
            >

                {dialogState === 0 &&
                    <Box p={2}>
                        <DialogTitle id="max-width-dialog-title">
                            <Typography gutterBottom style={{ color: "#51A5B2",  fontSize: "24px" }}>
                                Advanced tools
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body2">
                                There are some advanced tools that are restricted for general users. You need to register to use this tools.
                            </Typography>

                            <Box m={4}/>

                            <Typography variant="body2" style={{ color: "#818B95"}}>
                                Do you already have an account?
                            </Typography>
                            <Box m={2} />
                            <TextField                        
                                label={"Email"}
                                value={email}
                                placeholder={"Introudce your email here"}
                                fullWidth
                                variant="outlined"
                                onChange={e => {
                                    setEmail(e.target.value);
                                    if (email !== "") {
                                        setStateGetCode(false);
                                    }

                                    if (email === "") {
                                        setStateGetCode(true);
                                    }
                                }}
                            />
                            <Box m={2} />
                            <Button variant="contained" color="primary" fullWidth disabled={stateGetCode} onClick={handleGetCode}>
                                GET CODE
                            </Button>


                            <Box m={8} />
                            <Typography variant="body2" style={{ color: "#818B95" }}>
                                You don't have an account?
                            </Typography>
                            <Box m={2} />
                            <Button variant="outlined" color="primary" onClick={handleClickOpen} style={{ border: "2px solid" }} fullWidth>
                                REGISTER
                            </Button>

                        </DialogContent>
                        <DialogActions>

                        </DialogActions>
                    </Box>

                }


                {dialogState === 1 &&
                    <Box p={2}>
                        <DialogTitle id="max-width-dialog-title">
                            <Typography gutterBottom style={{ color: "#51A5B2", fontSize: "24px"  }}>
                                Check your email
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body2">
                                We have sent you a code to your email, insert it to unlock the advanced tools
                            </Typography>

                            <Box m={2} />

                            <TextField
                                label={"Code"}
                                value={code}
                                placeholder={"Introudce your code here"}
                                fullWidth
                                variant="outlined"
                                onChange={e => {
                                    setCode(e.target.value);
                                    if (email !== "") {
                                        setStateUnlockTools(false);
                                    }

                                    if (email === "") {
                                        setStateUnlockTools(true);
                                    }
                                }}
                            />
                            <Box m={2} />
                            <Button variant="contained" color="primary" onClick={handleClickUnlock} fullWidth disabled={stateUnlockTools}>
                                UNLOCK TOOLS
                            </Button>


                            <Box m={8} />
                            

                        </DialogContent>
                        <DialogActions>

                        </DialogActions>
                    </Box>

                }

                {dialogState === 2 &&
                    <Box p={2}>
                        <DialogTitle id="max-width-dialog-title">
                            <Typography gutterBottom style={{ color: "#51A5B2", fontSize: "24px"  }}>
                                Tools unlocked
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body2">
                                You have unlocked the advanced tools susccesfully, now you can close this window and start using them.
                            </Typography>

                            
                            


                            <Box m={8} />


                            <Button v color="black" onClick={handleCloseFinish} fullWidth disabled={stateUnlockTools} >
                                CLOSE
                            </Button>


                        </DialogContent>
                        <DialogActions>

                        </DialogActions>
                    </Box>

                }
                
            </Dialog>



            


        </div>

    )
    

}

export default AdvancedTools;