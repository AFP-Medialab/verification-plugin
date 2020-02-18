import React, { useState } from "react";

import { useStore, useSelector, useDispatch } from 'react-redux';

import useMyStyles from "../MaterialUiStyles/useMyStyles";

import authenticationAPI from "./authenticationAPI";
import { ERR_AUTH_UNKNOWN_ERROR } from './authenticationErrors';
import { setError } from "../../../redux/actions/errorActions";
import useLoadLanguage from "../../../Hooks/useLoadLanguage";
import tsv from "../../../LocalDictionary/components/Shared/Authentication.tsv";

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
  const store = useStore();
  const dispatch = useDispatch();

  // Events functions
  const messageI18NResolver = useLoadLanguage("components/Shared/Authentication.tsv", tsv);

  // Error handler
  const handleError = (errorKey) => {
    if (messageI18NResolver(errorKey) !== "") {
      dispatch(setError((messageI18NResolver(errorKey))));
    } else {
      dispatch(setError(messageI18NResolver(ERR_AUTH_UNKNOWN_ERROR)));
    }
  };

  // User Registration form
  const [regEmail, setRegEmail] = useState(null);

  // Access Code form
  const [acEmail, setACEmail] = useState(null);
  const acOnSubmit = () => {
    authenticationAPI.requestAccessCode(store, {
        email: acEmail
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  }

  // Login form
  const [loginAccessCode, setLoginAccessCode] = useState(null);
  const loginOnSubmit = () => {
    authenticationAPI.login(store, {
      accessCode: loginAccessCode
    }).catch(error => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  }

  return (
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
  )
}

export default AuthenticationCard;
