import React, { useState } from "react";

import { useStore, useSelector, useDispatch } from 'react-redux';

import useMyStyles from "../MaterialUiStyles/useMyStyles";

import useAuthenticationAPI from './useAuthenticationAPI';
import { ERR_AUTH_UNKNOWN_ERROR } from './authenticationErrors';
import { setError } from "../../../redux/actions/errorActions";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/Shared/Authentication.tsv";

import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from "@material-ui/core/Card";
// import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Divider from '@material-ui/core/Divider';
import SendIcon from '@material-ui/icons/Send';
import LockOpenIcon from '@material-ui/icons/LockOpen';


const registrationValidationSchema = yup.object().shape({
  email: yup.string()
    .required("REGISTRATIONFORM_EMAIL_ERR_REQUIRED")
    .email("REGISTRATIONFORM_EMAIL_ERR_EMAIL"),
  firstName: yup.string()
    .required("REGISTRATIONFORM_FIRSTNAME_ERR_REQUIRED"),
  lastName: yup.string()
    .required("REGISTRATIONFORM_LASTNAME_ERR_REQUIRED"),
  company: yup.string()
    .required("REGISTRATIONFORM_COMPANY_ERR_REQUIRED"),
  position: yup.string()
    .required("REGISTRATIONFORM_POSITION_ERR_REQUIRED")
});

const accessCodeValidationSchema = yup.object().shape({
  email: yup.string()
    .required("ACCESSCODEFORM_EMAIL_ERR_REQUIRED")
    .email("ACCESSCODEFORM_EMAIL_ERR_EMAIL")
});

const loginValidationSchema = yup.object().shape({
  accessCode: yup.string()
    .required("LOGINFORM_ACCESSCODE_ERR_REQUIRED")
});

/**
 * Authentication card component.
 *
 * @param {*} props
 * @returns
 */
const AuthenticationCard = (props) => {
  // Defs
  const classes = useMyStyles();

  // Redux store
  const dispatch = useDispatch();
  const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);
  const user = useSelector(state => state.userSession && state.userSession.user);

  // i18n
  const messageI18NResolver = useLoadLanguage("components/Shared/Authentication.tsv", tsv);
  
  // Authentication API
  const authenticationAPI = useAuthenticationAPI();
  
  // Error handler
  const handleError = (errorKey) => {
    let errMsg = messageI18NResolver(errorKey);
    if (errMsg === "") {
      errMsg = messageI18NResolver(ERR_AUTH_UNKNOWN_ERROR);
    }
    dispatch(setError(errMsg));
  };

  // Forms

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
      company: data.company,
      position: data.position
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  };

  // Access Code form
  const accessCodeForm = useForm({
    mode: "onBlur",
    validationSchema: accessCodeValidationSchema
  });
  const accessCodeOnSubmit = (data) => {
    authenticationAPI.requestAccessCode({
      email: data.email
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  };

  // Login form
  const loginForm = useForm({
    mode: "onBlur",
    validationSchema: loginValidationSchema
  });
  const loginOnSubmit = (data) => {
    authenticationAPI.login({
      accessCode: data.accessCode
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  };
  
  // If authenticated
  if (userAuthenticated) {
    return (
      <Typography variant="caption">
        {
          `You are logged as ${user && user.firstName} ${user && user.lastName} (${user && user.email})`
        }
      </Typography>
    );
  }

  // Else
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption">You must be logged in to use this service.</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Card raised={false} elevation={0}>
          {/* <CardContent> */}
          <Grid container justify="center" spacing={4} className={classes.grow}>
            <Grid item xs={12} sm={6}>
              <form onSubmit={registrationForm.handleSubmit(registrationOnSubmit)}>
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2">Not already registered? Register for an access to the service:</Typography>
                  </Grid>
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
                          error={_.hasIn(registrationForm.errors, "email")}
                          helperText={registrationForm.errors.email
                            && (messageI18NResolver(registrationForm.errors.email.message) || "Email address is required")}
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
                      name="company"
                      as={
                        <TextField
                          id="registration-company"
                          label={messageI18NResolver("REGISTRATIONFORM_COMPANY_LABEL") || "Company"}
                          placeholder={messageI18NResolver("REGISTRATIONFORM_COMPANY_PLACEHOLDER") || "Enter your company name"}
                          fullWidth
                          autoComplete="organization"
                          required
                          error={_.hasIn(registrationForm.errors, "company")}
                          helperText={registrationForm.errors.company
                            && (messageI18NResolver(registrationForm.errors.company.message) || "Company is required")}
                        />
                      }
                      control={registrationForm.control}
                      defaultValue=""
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="position"
                      as={
                        <TextField
                          id="registration-position"
                          label={messageI18NResolver("REGISTRATIONFORM_POSITION_LABEL") || "Position"}
                          placeholder={messageI18NResolver("REGISTRATIONFORM_POSITION_PLACEHOLDER") || "Enter your position"}
                          fullWidth
                          autoComplete="organization-title"
                          required
                          error={_.hasIn(registrationForm.errors, "position")}
                          helperText={registrationForm.errors.position
                            && (messageI18NResolver(registrationForm.errors.position.message) || "Position is required")}
                        />
                      }
                      control={registrationForm.control}
                      defaultValue=""
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box mt={2}>
                      <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}
                        type="submit"
                        disabled={!(registrationForm.formState.isValid || registrationForm.formState.isSubmitting)}
                      >
                        {messageI18NResolver("REGISTRATIONFORM_BUTTON_LABEL") || "Register"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Grid item xs>
              <Divider orientation="vertical" style={{ marginRight: "auto", marginLeft: "auto" }} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <form onSubmit={accessCodeForm.handleSubmit(accessCodeOnSubmit)}>
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2">Already registered? Get an access code:</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      as={
                        <TextField
                          id="access-code-email"
                          label={messageI18NResolver("ACCESSCODEFORM_EMAIL_LABEL") || "Email address"}
                          placeholder={messageI18NResolver("ACCESSCODEFORM_EMAIL_PLACEHOLDER") || "Enter your email address"}
                          fullWidth
                          autoComplete="email"
                          required
                          error={_.hasIn(accessCodeForm.errors, "email")}
                          helperText={accessCodeForm.errors.email
                            && (messageI18NResolver(accessCodeForm.errors.email.message) || "Email address is required")}
                        />
                      }
                      control={accessCodeForm.control}
                      defaultValue=""
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box mt={2}>
                      <Button variant="contained" color="primary" startIcon={<SendIcon />}
                        // onClick={acOnSubmit}
                        type="submit"
                        disabled={!(accessCodeForm.formState.isValid || accessCodeForm.formState.isSubmitting)}
                      >
                        {messageI18NResolver("ACCESSCODEFORM_BUTTON_LABEL") || "Get an access code"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
              <Box m={8} />
              <form onSubmit={loginForm.handleSubmit(loginOnSubmit)}>
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2">Login using your access code:</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="accessCode"
                      as={
                        <TextField
                          id="login-access-code"
                          label={messageI18NResolver("LOGINFORM_ACCESSCODE_LABEL") || "Access Code"}
                          placeholder={messageI18NResolver("LOGINFORM_ACCESSCODE_PLACEHOLDER") || "Enter your access code"}
                          fullWidth
                          // autoComplete="email"
                          required
                          error={_.hasIn(loginForm.errors, "accessCode")}
                          helperText={loginForm.errors.accessCode
                            && (messageI18NResolver(loginForm.errors.accessCode.message) || "Access code is required")}
                        />
                      }
                      control={loginForm.control}
                      defaultValue=""
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box mt={2}>
                      <Button variant="contained" color="primary" startIcon={<LockOpenIcon />}
                        // onClick={loginOnSubmit}
                        type="submit"
                        disabled={!(loginForm.formState.isValid || loginForm.formState.isSubmitting)}
                      >
                        {messageI18NResolver("LOGINFORM_BUTTON_LABEL") || "Log in"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
          {/* </CardContent> */}
        </Card>
      </ExpansionPanelDetails>
    </ExpansionPanel>

  );
};

export default AuthenticationCard;
