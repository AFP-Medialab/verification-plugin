import React from 'react';
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
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import useAuthenticationAPI from '../../../../Shared/Authentication/useAuthenticationAPI';
import { useSelector, useDispatch } from 'react-redux';
import { ERR_AUTH_UNKNOWN_ERROR } from '../../../../Shared/Authentication/authenticationErrors';
import { setError } from "../../../../../redux/actions/errorActions";
import tsv from "../../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
//import useMyStyles from "../../../../Shared/MaterialUiStyles/useMyStyles";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";
import MenuItem from '@material-ui/core/MenuItem';
//import { userRegistrationSentAction } from "../../../../../redux/actions/authenticationActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";


const AdvancedTools = (porps) => {

    //const classes = useMyStyles();
    // Redux store
    const dispatch = useDispatch();
    const userAuthenticated = useSelector(
        (state) => state.userSession && state.userSession.userAuthenticated
    );

    const keyword = useLoadLanguage("components/NavItems/AdvancedTools.tsv", tsv);

    //const userRegistrationLoading = useSelector(state => state.userSession && state.userSession.userRegistrationLoading);

    const registrationValidationSchema = yup.object().shape({
        email: yup.string()
            .required("REGISTRATIONFORM_EMAIL_ERR_REQUIRED")
            .email("REGISTRATIONFORM_EMAIL_ERR_EMAIL"),
        firstName: yup.string()
            .required("REGISTRATIONFORM_FIRSTNAME_ERR_REQUIRED"),
        lastName: yup.string()
            .required("REGISTRATIONFORM_LASTNAME_ERR_REQUIRED"),
        organization: yup.string()
            .required("REGISTRATIONFORM_ORGANIZATION_ERR_REQUIRED"),
        organizationRole: yup.string()
            .required("REGISTRATIONFORM_ORGANIZATIONROLE_ERR_REQUIRED"),
        organizationRoleOther: yup.string().when('organizationRole', {
            is: 'OTHER',
            then: yup.string().required("REGISTRATIONFORM_ORGANIZATIONROLEOTHER_ERR_REQUIRED"),
            otherwise: yup.string().notRequired()
        })
    });

    

    // i18n
    const messageI18NResolver = useLoadLanguage("components/Shared/Authentication.tsv", tsv);


    const [dialogState, setDialogState] = React.useState(0);
    const [textToolsState, setTextToolsState] = React.useState("The advanced tools are locked");
    const [textButton, setTextButton] = React.useState("UNLOCK");
    const [colorButton, setColorButton] = React.useState("primary");
    const [iconState, setIconState] = React.useState(<LockIcon fontSize="small" />);

    const [open, setOpen] = React.useState(false);
    
    
    useEffect(() => {

        if (userAuthenticated){
            setAuthenticatedData();
        }else{
            setNotAuthenticatedData();
        }
    // eslint-disable-next-line
    }, []);

    const setAuthenticatedData = () => {
        setDialogState(2);
        setTextToolsState(keyword("text_unlocked"));
        setTextButton(keyword("button_exit"));
        setColorButton("secondary");
        setIconState(<LockOpenIcon fontSize="small" />);
    }

    const setNotAuthenticatedData = () => {
        setDialogState(0);
        setTextToolsState(keyword("text_locked"));
        setTextButton(keyword("button_unlock2"));
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
        setStateUnlockTools(true);
        submitCode(code);
    };

    const handleCloseFinish = () => {
        setOpen(false);
        setAuthenticatedData();
    };

    
    const handleClickBack = () => {
        setDialogState(0);
    };

    const handleClickOpenRegister = () => {
        setDialogState(3);
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
            setStateUnlockTools(false);
        });
    };

    const logoutOnClick = () => {
        authenticationAPI.logout().catch(error => {
            handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
        });
    };




    // User Registration form
    const registrationForm = useForm({
        mode: "onBlur",
        validationSchema: registrationValidationSchema
    });
    const registrationOnSubmit = (data) => {
        authenticationAPI.registerUser({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            organization: data.organization,
            organizationRole: data.organizationRole,
            organizationRoleOther: data.organizationRoleOther
        }).then(result => {
            registrationForm.reset();
            setDialogState(4);
        }).catch(error => {
            handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
        });
    };
    

    

    const handleCloseRegistration = () => {
        setOpen(false);
        setDialogState(0);
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
                                    <Typography variant="subtitle2">
                                        {keyword("title")}
                                    </Typography>
                                </Grid>
                            
                        </Grid>

                        <Grid item>
                            <Typography variant="body2" style={{ color: "#737373"}}>
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
                                {keyword("title")}
                            </Typography>
                        </DialogTitle>
                        <DialogContent style={{ height: '270px' }}>
                            
                            <Typography variant="body2">
                                {keyword("text_general")}
                            </Typography>

                            <Box m={4}/>

                            <Typography variant="body2" style={{ color: "#818B95"}}>
                                {keyword("text_account")}
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
                                {keyword("button_code")}
                            </Button>


                            
                            
                            

                        </DialogContent>
                        <DialogActions>
                            <Grid container direction="column" style={{ width: "100%" }}>
                                <Typography variant="body2" style={{ color: "#818B95", textAlign: "center" }}>
                                    {keyword("text_notaccount")}
                                </Typography>
                                <Box m={2} />
                                <Button variant="outlined" color="primary" onClick={handleClickOpenRegister} style={{ border: "2px solid" }} fullWidth>
                                    {keyword("button_register")}
                                </Button>

                            </Grid>
                            
                        </DialogActions>
                    </Box>

                }


                {dialogState === 1 &&
                    <Box p={2}>
                        <DialogTitle id="max-width-dialog-title">

                            <Grid 
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                                style={{ width: "100%" }} >

                                    <Grid item>
                                        <IconButton color="primary" onClick={handleClickBack} component="span">
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                    </Grid>

                                    <Grid item>
                                        <Typography style={{ color: "#51A5B2", fontSize: "24px" }}>
                                            {keyword("title_email")}
                                        </Typography>
                                    </Grid>
                                
                            </Grid>
                        </DialogTitle>
                        <DialogContent style={{ height: '300px' }}>
                            <Typography variant="body2">
                                {keyword("text_code_email")}
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

                            <Box ml={1} margin={1}>
                                <Typography variant="body2" style={{ color: "#989898", fontSize: "13px"}}>
                                    {keyword("text_problem")}
                                </Typography>
                            </Box>

                            

                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={handleClickUnlock} fullWidth disabled={stateUnlockTools}>
                                {keyword("button_unlock")}
                            </Button>
                        </DialogActions>
                    </Box>

                }

                {dialogState === 2 &&
                    <Box p={2}>
                        <DialogTitle id="max-width-dialog-title">
                            <Typography gutterBottom style={{ color: "#51A5B2", fontSize: "24px"  }}>
                                {keyword("title_tools_unlocked")}
                            </Typography>
                        </DialogTitle>
                        <DialogContent style={{ height: '300px' }}>
                            <Typography variant="body2">
                                {keyword("text_success")}
                            </Typography>

                        </DialogContent>
                        <DialogActions>
                            <Button v color="black" onClick={handleCloseFinish} fullWidth >
                                {keyword("button_close")}
                            </Button>
                        </DialogActions>
                    </Box>

                }

                {dialogState === 3 &&
                    <Box p={2}>
                        <DialogTitle id="max-width-dialog-title">
                            <Typography gutterBottom style={{ color: "#51A5B2", fontSize: "24px" }}>
                                {keyword("title_registration")}
                            </Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body2">
                                {keyword("text_description_resgitration")}
                            </Typography>
                            <Box m={2} />
                            <form onSubmit={registrationForm.handleSubmit(registrationOnSubmit)}>
                                <Grid container justify="center" spacing={2}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="email"
                                            as={
                                                <TextField
                                                    id="registration-email"
                                                    label={messageI18NResolver("REGISTRATIONFORM_EMAIL_LABEL") || "Email address"}
                                                    placeholder={messageI18NResolver("REGISTRATIONFORM_EMAIL_PLACEHOLDER") || "Enter your email address"}
                                                    fullWidth
                                                    autoComplete="email"
                                                    required
                                                    variant="outlined"
                                                    error={_.hasIn(registrationForm.errors, "email")}
                                                    helperText={registrationForm.errors.email
                                                        && (messageI18NResolver(registrationForm.errors.email.message) || "A valid email address is required")}
                                                />
                                            }
                                            control={registrationForm.control}
                                            defaultValue=""
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="firstName"
                                            as={
                                                <TextField
                                                    id="registration-firstName"
                                                    label={messageI18NResolver("REGISTRATIONFORM_FIRSTNAME_LABEL") || "First name"}
                                                    placeholder={messageI18NResolver("REGISTRATIONFORM_FIRSTNAME_PLACEHOLDER") || "Enter your first name"}
                                                    fullWidth
                                                    autoComplete="given-name"
                                                    required
                                                    variant="outlined"
                                                    error={_.hasIn(registrationForm.errors, "firstName")}
                                                    helperText={registrationForm.errors.firstName
                                                        && (messageI18NResolver(registrationForm.errors.firstName.message) || "First name is required")}
                                                />
                                            }
                                            control={registrationForm.control}
                                            defaultValue=""
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="lastName"
                                            as={
                                                <TextField
                                                    id="registration-lastName"
                                                    label={messageI18NResolver("REGISTRATIONFORM_LASTNAME_LABEL") || "Last name"}
                                                    placeholder={messageI18NResolver("REGISTRATIONFORM_LASTNAME_PLACEHOLDER") || "Enter your last name"}
                                                    fullWidth
                                                    autoComplete="family-name"
                                                    required
                                                    variant="outlined"
                                                    error={_.hasIn(registrationForm.errors, "lastName")}
                                                    helperText={registrationForm.errors.lastName
                                                        && (messageI18NResolver(registrationForm.errors.lastName.message) || "Last name is required")}
                                                />
                                            }
                                            control={registrationForm.control}
                                            defaultValue=""
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="organization"
                                            as={
                                                <TextField
                                                    id="registration-organization"
                                                    label={messageI18NResolver("REGISTRATIONFORM_ORGANIZATION_LABEL") || "Organization"}
                                                    placeholder={messageI18NResolver("REGISTRATIONFORM_ORGANIZATION_PLACEHOLDER") || "Enter your organization name"}
                                                    fullWidth
                                                    autoComplete="organization"
                                                    required
                                                    variant="outlined"
                                                    error={_.hasIn(registrationForm.errors, "organization")}
                                                    helperText={registrationForm.errors.organization
                                                        && (messageI18NResolver(registrationForm.errors.organization.message) || "Organization name is required")}
                                                />
                                            }
                                            control={registrationForm.control}
                                            defaultValue=""
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="organizationRole"
                                            as={
                                                <TextField
                                                    id="registration-organizationRole"
                                                    label={messageI18NResolver("REGISTRATIONFORM_ORGANIZATIONROLE_LABEL") || "Role"}
                                                    placeholder={messageI18NResolver("REGISTRATIONFORM_ORGANIZATIONROLE_PLACEHOLDER") || "Select your role within organization"}
                                                    select
                                                    fullWidth
                                                    autoComplete="organization-title"
                                                    required
                                                    variant="outlined"
                                                    error={_.hasIn(registrationForm.errors, "organizationRole")}
                                                    helperText={registrationForm.errors.organizationRole
                                                        && (messageI18NResolver(registrationForm.errors.organizationRole.message) || "Role within organization is required")}
                                                >
                                                    <MenuItem key="REPORTER" value="REPORTER">{messageI18NResolver("REGISTRATIONFORM_ORGANIZATIONROLE_REPORTER_LABEL") || "Reporter"}</MenuItem>
                                                    <MenuItem key="FAKE_NEWS_CHECKER" value="FAKE_NEWS_CHECKER">{messageI18NResolver("REGISTRATIONFORM_ORGANIZATIONROLE_FAKENEWSCHECKER_LABEL") || "Fake news checker"}</MenuItem>
                                                    <MenuItem key="OTHER" value="OTHER">{messageI18NResolver("REGISTRATIONFORM_ORGANIZATIONROLE_OTHER_LABEL") || "Other"}</MenuItem>
                                                </TextField>
                                            }
                                            control={registrationForm.control}
                                            defaultValue=""
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="organizationRoleOther"
                                            as={
                                                <TextField
                                                    id="registration-organizationRoleOther"
                                                    label={messageI18NResolver("REGISTRATIONFORM_ORGANIZATIONROLEOTHER_LABEL") || "Role (other)"}
                                                    placeholder={messageI18NResolver("REGISTRATIONFORM_ORGANIZATIONROLEOTHER_PLACEHOLDER") || "Enter your role within organization"}
                                                    fullWidth
                                                    variant="outlined"
                                                    autoComplete="organization-title"
                                                    // required
                                                    error={_.hasIn(registrationForm.errors, "organizationRoleOther")}
                                                    helperText={registrationForm.errors.organizationRoleOther
                                                        && (messageI18NResolver(registrationForm.errors.organizationRoleOther.message) || "Please fill in your role within organization")}
                                                />
                                            }
                                            control={registrationForm.control}
                                            defaultValue=""
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box mt={2}>
                                            <Button color="black" fullWidth type="submit" >
                                                {keyword("button_register")}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>

                        </DialogContent>
                        <DialogActions>
                            
                        </DialogActions>
                    </Box>

                }

                {dialogState === 4 &&
                    <Box p={2}>
                        <DialogTitle id="max-width-dialog-title">
                            <Typography gutterBottom style={{ color: "#51A5B2", fontSize: "24px" }}>
                                {keyword("title_approval")}
                            </Typography>
                        </DialogTitle>
                        <DialogContent style={{ height: '300px' }}>
                            <Typography variant="body2">
                                {keyword("text_review")}
                            </Typography>

                        </DialogContent>
                        <DialogActions>
                            <Button v color="black" onClick={handleCloseRegistration} fullWidth >
                                {keyword("button_close")}
                            </Button>
                        </DialogActions>
                    </Box>

                }
                
            </Dialog>



            


        </div>

    )
    

}

export default AdvancedTools;