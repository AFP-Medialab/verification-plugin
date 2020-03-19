import React, { Fragment } from "react";
import PropTypes from 'prop-types';

import {useSelector, useDispatch } from 'react-redux';

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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Divider from '@material-ui/core/Divider';
import SendIcon from '@material-ui/icons/Send';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import Toolbar from "@material-ui/core/Toolbar";

import { userRegistrationSentAction, userAccessCodeRequestSentAction } from "../../../redux/actions/authenticationActions";


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
  // Component props
  const { requireAuthMsg } = props;

  // Defs
  const classes = useMyStyles();

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
      organization: data.organization,
      organizationRole: data.organizationRole,
      organizationRoleOther: data.organizationRoleOther
    }).then(result => {
      registrationForm.reset();
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  };
  const registrationFormSubmitDisabled = registrationForm.formState.isSubmitting || userRegistrationLoading;
  const registrationSentMsgReset = (e) => {
    dispatch(userRegistrationSentAction(false));
  };

  // Access Code form
  const accessCodeForm = useForm({
    mode: "onBlur",
    validationSchema: accessCodeValidationSchema
  });
  const accessCodeOnSubmit = (data) => {
    authenticationAPI.requestAccessCode({
      email: data.email
    }).then(result => {
      accessCodeForm.reset();
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  };
  const accessCodeFormSubmitDisabled = accessCodeForm.formState.isSubmitting || accessCodeRequestLoading;
  const accessCodeSentMsgReset = (e) => {
    dispatch(userAccessCodeRequestSentAction(false));
  };

  // Login form
  const loginForm = useForm({
    mode: "onBlur",
    validationSchema: loginValidationSchema
  });
  const loginOnSubmit = (data) => {
    authenticationAPI.login({
      accessCode: data.accessCode
    }).then(result => {
      loginForm.reset();
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  };
  const loginFormSubmitDisabled = loginForm.formState.isSubmitting || userLoginLoading;

  const logoutOnClick = () => {
    authenticationAPI.logout().catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  };

  // If authenticated
  if (userAuthenticated) {
    const logUserMsg = _.template(messageI18NResolver("LOGUSER_TEMPLATE") || "Welcome <%= user.firstName %> <%= user.lastName %> (<%= user.email %>)")({ user });
    return (
      <Fragment>
        <Toolbar>
          <Typography variant="body2">
            {
              logUserMsg
            }
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <Button variant="contained" color="secondary" startIcon={<LockIcon />} onClick={logoutOnClick}>
            {messageI18NResolver("LOGUSER_LOGOUT_LABEL") || "Logout"}
          </Button>
        </Toolbar>
      </Fragment>
    );
  }

  // Else

  const requireAuthMsgComp = (requireAuthMsg && !_.isString(requireAuthMsg)) ?
    (
      requireAuthMsg
    ) :
    (
      <Typography variant="body2">
        {
          requireAuthMsg || messageI18NResolver("AUTHCARD_REQUIREAUTH_TEXT") || "You must be logged to use this service."
        }
      </Typography>
    );
  const explanationText = messageI18NResolver("AUTHCARD_EXPLANATION_TEXT");

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        {
          requireAuthMsgComp
        }
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Card raised={false} elevation={0}>
          {
            explanationText && !(_.toString(explanationText).trim() === "") &&
            <Box mb={4}>
              <Typography variant="caption" display="block" align="justify">{explanationText}</Typography>
            </Box>
          }
          <Grid container justify="center" spacing={4} className={classes.grow}>
            <Grid item xs={12} sm={6}>
              {
                userRegistrationSent &&
                <Fragment>
                  <Typography variant="body2">
                    {messageI18NResolver("REGISTRATIONFORM_SUCCESS_TEXT") || "Your registration request has been sent successfully and will be reviewed shortly by our service. You will receive a notification by email once your account is activated."}
                  </Typography>
                  <Box mt={4}>
                    <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}
                      onClick={registrationSentMsgReset}
                    >
                      {messageI18NResolver("REGISTRATIONFORM_SUCCESS_RESET_LABEL") || "New request"}
                    </Button>
                  </Box>
                </Fragment>
              }
              {
                !userRegistrationSent &&
                <Fragment>
                  <form onSubmit={registrationForm.handleSubmit(registrationOnSubmit)}>
                    <Grid container justify="center" spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {messageI18NResolver("REGISTRATIONFORM_TITLE") || "Not already registered? Register for an access to the service:"}
                        </Typography>
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
                          name="organization"
                          as={
                            <TextField
                              id="registration-organization"
                              label={messageI18NResolver("REGISTRATIONFORM_ORGANIZATION_LABEL") || "Organization"}
                              placeholder={messageI18NResolver("REGISTRATIONFORM_ORGANIZATION_PLACEHOLDER") || "Enter your organization name"}
                              fullWidth
                              autoComplete="organization"
                              required
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
                          <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}
                            type="submit"
                            disabled={registrationFormSubmitDisabled}
                          >
                            {messageI18NResolver("REGISTRATIONFORM_SUBMIT_LABEL") || "Register"}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Fragment>
              }
            </Grid>
            <Grid item xs>
              <Divider orientation="vertical" style={{ marginRight: "auto", marginLeft: "auto" }} />
            </Grid>
            <Grid item xs={12} sm={5}>
              {
                accessCodeRequestSent &&
                <Fragment>
                  <Typography variant="body2">
                    {messageI18NResolver("ACCESSCODEFORM_SUCCESS_TEXT") || "Your access code request has been sent successfully. If your account is valid, you should receive your access code by email in a few minutes."}
                  </Typography>
                  <Box mt={4}>
                    <Button variant="contained" color="primary" startIcon={<SendIcon />}
                      onClick={accessCodeSentMsgReset}
                    >
                      {messageI18NResolver("ACCESSCODEFORM_SUCCESS_RESET_LABEL") || "New request"}
                    </Button>
                  </Box>
                </Fragment>
              }
              {
                !accessCodeRequestSent &&
                <Fragment>
                  <form onSubmit={accessCodeForm.handleSubmit(accessCodeOnSubmit)}>
                    <Grid container justify="center" spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {messageI18NResolver("ACCESSCODEFORM_TITLE") || "Already registered? Get an access code:"}
                        </Typography>
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
                            type="submit"
                            disabled={accessCodeFormSubmitDisabled}
                          >
                            {messageI18NResolver("ACCESSCODEFORM_SUBMIT_LABEL") || "Get an access code"}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                </Fragment>
              }
              <Box m={8} />
              <form onSubmit={loginForm.handleSubmit(loginOnSubmit)}>
                <Grid container justify="center" spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      {messageI18NResolver("LOGINFORM_TITLE") || "Login using your access code:"}
                    </Typography>
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
                        disabled={loginFormSubmitDisabled}
                      >
                        {messageI18NResolver("LOGINFORM_SUBMIT_LABEL") || "Login"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Card>
      </ExpansionPanelDetails>
    </ExpansionPanel>

  );
};

AuthenticationCard.propTypes = {
  requireAuthMsg: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.element
  ])
};

export default AuthenticationCard;
