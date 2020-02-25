import React, { useState } from "react";

import { useStore, useSelector, useDispatch } from 'react-redux';

import useMyStyles from "../MaterialUiStyles/useMyStyles";

import useAuthenticationAPI from './useAuthenticationAPI';
import { ERR_AUTH_UNKNOWN_ERROR } from './authenticationErrors';
import { setError } from "../../../redux/actions/errorActions";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/Shared/Authentication.tsv";

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

  // User Registration form
  const [regEmail, setRegEmail] = useState(null);

  // Access Code form
  const [acEmail, setACEmail] = useState(null);
  const acOnSubmit = () => {
    authenticationAPI.requestAccessCode({
        email: acEmail
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  }

  // Login form
  const [loginAccessCode, setLoginAccessCode] = useState(null);
  const loginOnSubmit = () => {
    authenticationAPI.login({
      accessCode: loginAccessCode
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  }

  if (userAuthenticated) {
    return (
      <Typography variant="caption">
        {
          `You are logged as ${user && user.firstName} ${user && user.lastName} (${user && user.email})`
        }
      </Typography>
    )
  }

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="caption">You must be logged in to use this service.</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Card raised={false} elevation={0}>
          {/* <CardContent> */}
            <Grid container justify="center" spacing={4} className={classes.grow}>
              <Grid
                  item xs={12} sm={6}
                  container justify="center" spacing={2}
              >
                  <Grid item xs={12}>
                      <Typography variant="body2">Not already registered? Register for an access to the service:</Typography>
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          label="Email address"
                          required
                          fullWidth
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          label="First name"
                          required
                          fullWidth
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          label="Last name"
                          required
                          fullWidth
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          label="Company"
                          fullWidth
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          label="Position"
                          required
                          fullWidth
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <Box mt={2}>
                          <Button variant="contained" color="primary" startIcon={<PersonAddIcon />}
                              // style={{ marginTop: 16 }}
                          >
                              Register
                          </Button>
                      </Box>
                  </Grid>
              </Grid>
              <Grid item xs>
                  <Divider orientation="vertical" style={{ marginRight: "auto", marginLeft: "auto" }} />
              </Grid>
              <Grid item xs={12} sm={5}>
                  <Grid container justify="center" spacing={2}>
                      <Grid item xs={12}>
                          <Typography variant="body2">Already registered? Get an access code:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              label="Email address"
                              required
                              fullWidth
                              onChange={e => setACEmail(e.target.value)}
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <Box mt={2}>
                              <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={acOnSubmit}>
                                  Get an access code
                              </Button>
                          </Box>
                      </Grid>
                  </Grid>
                  <Box m={8}/>
                  <Grid container justify="center" spacing={2}>
                      <Grid item xs={12}>
                          <Typography variant="body2">Login using your access code:</Typography>
                      </Grid>
                      <Grid item xs={12}>
                          <TextField
                              label="Access code"
                              required
                              fullWidth
                              onChange={e => setLoginAccessCode(e.target.value)}
                          />
                      </Grid>
                      <Grid item xs={12}>
                          <Box mt={2}>
                              <Button variant="contained" color="primary" startIcon={<LockOpenIcon />} onClick={loginOnSubmit}>
                                  Log in
                              </Button>
                          </Box>
                      </Grid>
                  </Grid>
              </Grid>
            </Grid>
          {/* </CardContent> */}
        </Card>
      </ExpansionPanelDetails>
    </ExpansionPanel>

  )
}

export default AuthenticationCard;
