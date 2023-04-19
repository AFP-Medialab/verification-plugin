import React from "react";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import useAuthenticationAPI from "../../../../Shared/Authentication/useAuthenticationAPI";
import { useSelector, useDispatch } from "react-redux";
import { ERR_AUTH_UNKNOWN_ERROR } from "../../../../Shared/Authentication/authenticationErrors";
import { setError } from "../../../../../redux/actions/errorActions";
import tsv from "../../../../../LocalDictionary/components/Shared/Authentication.tsv";
import tsvAdvTools from "../../../../../LocalDictionary/components/NavItems/AdvancedTools.tsv";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";
import MenuItem from "@mui/material/MenuItem";
//import { userRegistrationSentAction } from "../../../../../redux/actions/authenticationActions";
import useLoadLanguage from "../../../../../Hooks/useLoadLanguage";

const registrationValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("REGISTRATIONFORM_EMAIL_ERR_REQUIRED")
    .email("REGISTRATIONFORM_EMAIL_ERR_EMAIL"),
  firstName: yup.string().required("REGISTRATIONFORM_FIRSTNAME_ERR_REQUIRED"),
  lastName: yup.string().required("REGISTRATIONFORM_LASTNAME_ERR_REQUIRED"),
  organization: yup
    .string()
    .required("REGISTRATIONFORM_ORGANIZATION_ERR_REQUIRED"),
  organizationRole: yup
    .string()
    .required("REGISTRATIONFORM_ORGANIZATIONROLE_ERR_REQUIRED"),
  organizationRoleOther: yup.string().when("organizationRole", {
    is: "OTHER",
    then: yup
      .string()
      .required("REGISTRATIONFORM_ORGANIZATIONROLEOTHER_ERR_REQUIRED"),
    otherwise: yup.string().notRequired(),
  }),
});

const AdvancedTools = () => {
  const keyword = useLoadLanguage(
    "components/NavItems/AdvancedTools.tsv",
    tsvAdvTools
  );

  //const classes = useMyStyles();
  // Redux store
  const dispatch = useDispatch();
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated
  );

  // i18n
  const messageI18NResolver = useLoadLanguage(
    "components/Shared/Authentication.tsv",
    tsv
  );

  const [dialogState, setDialogState] = React.useState(0);
  const [colorButton, setColorButton] = React.useState("primary");
  const [iconState, setIconState] = React.useState(
    <LockIcon fontSize="small" />
  );

  const [open, setOpen] = React.useState(false);

  const defaultValues = {
    email: "",
    firstName: "",
    lastName: "",
    organization: "",
    organizationRole: "",
    organizationRoleOther: "",
  };

  const setAuthenticatedData = () => {
    setDialogState(2);
    setColorButton("secondary");
    setIconState(<LockOpenIcon fontSize="small" />);
  };

  const setNotAuthenticatedData = () => {
    setDialogState(0);
    setColorButton("primary");
    setIconState(<LockIcon fontSize="small" />);
  };

  useEffect(() => {
    if (userAuthenticated) {
      setAuthenticatedData();
    } else {
      setNotAuthenticatedData();
    }
    // eslint-disable-next-line
  }, [userAuthenticated]);

  const handleClickOpen = () => {
    if (dialogState === 0) {
      setOpen(true);
    } else {
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

  const handleAlreadyCode = () => {
    setDialogState(1);
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
    authenticationAPI
      .requestAccessCode({
        email: emailInput,
      })
      .then((result) => {
        setDialogState(1);
      })
      .catch((error) => {
        handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
      });
  };

  const submitCode = (codeInput) => {
    authenticationAPI
      .login({
        accessCode: codeInput,
      })
      .then((result) => {
        setDialogState(2);
      })
      .catch((error) => {
        handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
        setStateUnlockTools(false);
      });
  };

  const logoutOnClick = () => {
    authenticationAPI.logout().catch((error) => {
      handleError(error.error ? error.error.code : ERR_AUTH_UNKNOWN_ERROR);
    });
  };

  // User Registration form
  const registrationForm = useForm({
    mode: "onBlur",
    validationSchema: registrationValidationSchema,
    defaultValues,
  });
  const registrationOnSubmit = (data) => {
    authenticationAPI
      .registerUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        organization: data.organization,
        organizationRole: data.organizationRole,
        organizationRoleOther: data.organizationRoleOther,
      })
      .then((result) => {
        registrationForm.reset();
        setDialogState(4);
      })
      .catch((error) => {
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
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-end"
          >
            <Grid
              item
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              <Grid item>{iconState}</Grid>

              <Grid item>
                <Typography variant="subtitle2">{keyword("title")}</Typography>
              </Grid>
            </Grid>

            <Grid item>
              <Typography variant="body2" style={{ color: "#737373" }}>
                {userAuthenticated
                  ? keyword("text_unlocked")
                  : keyword("text_locked")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Button
            variant="outlined"
            color={colorButton}
            onClick={handleClickOpen}
            style={{ border: "2px solid", heigth: "40px" }}
          >
            {userAuthenticated
              ? messageI18NResolver("LOGUSER_LOGOUT_LABEL")
              : messageI18NResolver("LOGINFORM_SUBMIT_LABEL")}
          </Button>
        </Grid>
      </Grid>

      <Dialog
        fullWidth
        maxWidth={"xs"}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        {dialogState === 0 && (
          <Box p={2}>
            <form>
              <DialogTitle id="max-width-dialog-title">
                <Typography
                  gutterBottom
                  style={{ color: "#51A5B2", fontSize: "24px" }}
                >
                  {keyword("title")}
                </Typography>
              </DialogTitle>
              <DialogContent style={{ height: "300px" }}>
                <Typography variant="body2">
                  {keyword("text_general")}
                </Typography>

                <Box m={4} />

                <Typography variant="body2" style={{ color: "#818B95" }}>
                  {messageI18NResolver("ACCESSCODEFORM_TITLE")}
                </Typography>
                <Box m={2} />
                <TextField
                  label={"Email"}
                  value={email}
                  placeholder={messageI18NResolver(
                    "ACCESSCODEFORM_EMAIL_PLACEHOLDER"
                  )}
                  fullWidth
                  autoComplete="email"
                  variant="outlined"
                  name="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value !== "") {
                      setStateGetCode(false);
                    }

                    if (e.target.value === "") {
                      setStateGetCode(true);
                    }
                  }}
                />
                <Box m={2} />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={stateGetCode}
                  onClick={(e) => {
                    e.preventDefault(), handleGetCode();
                  }}
                >
                  {messageI18NResolver("ACCESSCODEFORM_SUBMIT_LABEL")}
                </Button>

                <Box m={2} />

                <Typography
                  variant="body2"
                  style={{ color: "#818B95", textAlign: "left" }}
                >
                  {keyword("text_alreadycode")}
                  <span
                    style={{
                      color: "#000000",
                      marginLeft: "5px",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                    onClick={handleAlreadyCode}
                  >
                    {keyword("text_clickhere")}
                  </span>
                </Typography>
              </DialogContent>
              <DialogActions>
                <Box p={2}>
                  <Grid container direction="column" style={{ width: "100%" }}>
                    <Typography
                      variant="body2"
                      style={{ color: "#818B95", textAlign: "left" }}
                    >
                      {messageI18NResolver("REGISTRATIONFORM_TITLE")}
                    </Typography>
                    <Box m={1} />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClickOpenRegister}
                      style={{ border: "2px solid" }}
                      fullWidth
                    >
                      {messageI18NResolver("REGISTRATIONFORM_SUBMIT_LABEL")}
                    </Button>
                  </Grid>
                </Box>
              </DialogActions>
            </form>
          </Box>
        )}

        {dialogState === 1 && (
          <Box p={2}>
            <form>
              <DialogTitle id="max-width-dialog-title">
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  style={{ width: "100%" }}
                >
                  <Grid item>
                    <IconButton
                      color="primary"
                      onClick={handleClickBack}
                      component="span"
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                  </Grid>

                  <Grid item>
                    <Typography style={{ color: "#51A5B2", fontSize: "24px" }}>
                      {messageI18NResolver("ACCESSCODEFORM_EMAIL_CHECK")}
                    </Typography>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent style={{ height: "300px" }}>
                <Typography variant="body2">
                  {messageI18NResolver("ACCESSCODEFORM_SUCCESS_TEXT")}
                </Typography>

                <Box m={2} />

                <TextField
                  label={"Code"}
                  value={code}
                  placeholder={messageI18NResolver(
                    "LOGINFORM_ACCESSCODE_PLACEHOLDER"
                  )}
                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (e.target.value !== "") {
                      setStateUnlockTools(false);
                    }

                    if (e.target.value === "") {
                      setStateUnlockTools(true);
                    }
                  }}
                />

                <Box m={2} />

                <Box ml={1} margin={1}>
                  <Typography
                    variant="body2"
                    style={{ color: "#989898", fontSize: "13px" }}
                  >
                    {messageI18NResolver("ACCESSCODEFORM_SUCCESS_TEXT_SPAM")}
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault(), handleClickUnlock();
                  }}
                  fullWidth
                  disabled={stateUnlockTools}
                >
                  {messageI18NResolver("LOGINFORM_SUBMIT_LABEL")}
                </Button>
              </DialogActions>
            </form>
          </Box>
        )}

        {dialogState === 2 && (
          <Box p={2}>
            <DialogTitle id="max-width-dialog-title">
              <Typography
                gutterBottom
                style={{ color: "#51A5B2", fontSize: "24px" }}
              >
                {keyword("title_tools_unlocked")}
              </Typography>
            </DialogTitle>
            <DialogContent style={{ height: "300px" }}>
              <Typography variant="body2">{keyword("text_success")}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseFinish}
                fullWidth
              >
                {messageI18NResolver("AUTHENTICATION_FORM_CLOSE")}
              </Button>
            </DialogActions>
          </Box>
        )}

        {dialogState === 3 && (
          <Box p={2}>
            <DialogTitle id="max-width-dialog-title">
              <Typography
                gutterBottom
                style={{ color: "#51A5B2", fontSize: "24px" }}
              >
                {messageI18NResolver("REGISTRATIONFORM_TITLE_WINDOW")}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                {messageI18NResolver("AUTHCARD_EXPLANATION_TEXT")}
              </Typography>
              <Box m={2} />
              <form
                onSubmit={registrationForm.handleSubmit(registrationOnSubmit)}
              >
                <Grid container justifyContent="center" spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="email"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="registration-email"
                          label={
                            messageI18NResolver(
                              "REGISTRATIONFORM_EMAIL_LABEL"
                            ) || "Email address"
                          }
                          placeholder={
                            messageI18NResolver(
                              "REGISTRATIONFORM_EMAIL_PLACEHOLDER"
                            ) || "Enter your email address"
                          }
                          fullWidth
                          autoComplete="email"
                          required
                          variant="outlined"
                          error={_.hasIn(
                            registrationForm.formState.errors,
                            "email"
                          )}
                          helperText={
                            registrationForm.formState.errors.email &&
                            (messageI18NResolver(
                              "ACCESSCODEFORM_EMAIL_ERR_EMAIL"
                            ) ||
                              "A valid fact-checking, media or research organization email address is required")
                          }
                        />
                      )}
                      rules={{
                        pattern: {
                          value:
                            /^[A-Z0-9._%+-]+@(?!gmail|yahoo|hotmail|outlook|inbox|icloud)[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "invalid organizational email address",
                        },
                        required: true,
                      }}
                      control={registrationForm.control}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="firstName"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="registration-firstName"
                          label={
                            messageI18NResolver(
                              "REGISTRATIONFORM_FIRSTNAME_LABEL"
                            ) || "First name"
                          }
                          placeholder={
                            messageI18NResolver(
                              "REGISTRATIONFORM_FIRSTNAME_PLACEHOLDER"
                            ) || "Enter your first name"
                          }
                          fullWidth
                          autoComplete="given-name"
                          required
                          variant="outlined"
                          error={_.hasIn(
                            registrationForm.formState.errors,
                            "firstName"
                          )}
                          helperText={
                            registrationForm.formState.errors.firstName &&
                            (messageI18NResolver(
                              "REGISTRATIONFORM_FIRSTNAME_ERR_REQUIRED"
                            ) ||
                              "First name is required")
                          }
                        />
                      )}
                      rules={{
                        required: true,
                      }}
                      control={registrationForm.control}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="lastName"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="registration-lastName"
                          label={
                            messageI18NResolver(
                              "REGISTRATIONFORM_LASTNAME_LABEL"
                            ) || "Last name"
                          }
                          placeholder={
                            messageI18NResolver(
                              "REGISTRATIONFORM_LASTNAME_PLACEHOLDER"
                            ) || "Enter your last name"
                          }
                          fullWidth
                          autoComplete="family-name"
                          required
                          variant="outlined"
                          error={_.hasIn(
                            registrationForm.formState.errors,
                            "lastName"
                          )}
                          helperText={
                            registrationForm.formState.errors.lastName &&
                            (messageI18NResolver(
                              "REGISTRATIONFORM_LASTNAME_ERR_REQUIRED"
                            ) ||
                              "Last name is required")
                          }
                        />
                      )}
                      rules={{
                        required: true,
                      }}
                      control={registrationForm.control}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="organization"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="registration-organization"
                          label={
                            messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATION_LABEL"
                            ) || "Organization"
                          }
                          placeholder={
                            messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATION_PLACEHOLDER"
                            ) || "Enter your organization name"
                          }
                          fullWidth
                          autoComplete="organization"
                          required
                          variant="outlined"
                          error={_.hasIn(
                            registrationForm.formState.errors,
                            "organization"
                          )}
                          helperText={
                            registrationForm.formState.errors.organization &&
                            (messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATION_ERR_REQUIRED"
                            ) ||
                              "Organization name is required")
                          }
                        />
                      )}
                      rules={{
                        required: true,
                      }}
                      control={registrationForm.control}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="organizationRole"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="registration-organizationRole"
                          label={
                            messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLE_LABEL"
                            ) || "Role"
                          }
                          placeholder={
                            messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLE_PLACEHOLDER"
                            ) || "Select your role within organization"
                          }
                          select
                          fullWidth
                          autoComplete="organization-title"
                          required
                          variant="outlined"
                          error={_.hasIn(
                            registrationForm.formState.errors,
                            "organizationRole"
                          )}
                          helperText={
                            registrationForm.formState.errors
                              .organizationRole &&
                            (messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLE_ERR_REQUIRED"
                            ) ||
                              "Role within organization is required")
                          }
                        >
                          <MenuItem key="REPORTER" value="REPORTER">
                            {messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLE_REPORTER_LABEL"
                            ) || "Reporter"}
                          </MenuItem>
                          <MenuItem
                            key="FAKE_NEWS_CHECKER"
                            value="FAKE_NEWS_CHECKER"
                          >
                            {messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLE_FAKENEWSCHECKER_LABEL"
                            ) || "Fake news checker"}
                          </MenuItem>
                          <MenuItem key="OTHER" value="OTHER">
                            {messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLE_OTHER_LABEL"
                            ) || "Other"}
                          </MenuItem>
                        </TextField>
                      )}
                      rules={{
                        required: true,
                      }}
                      control={registrationForm.control}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="organizationRoleOther"
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="registration-organizationRoleOther"
                          label={
                            messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLEOTHER_LABEL"
                            ) || "Role (other)"
                          }
                          placeholder={
                            messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLEOTHER_PLACEHOLDER"
                            ) || "Enter your role within organization"
                          }
                          fullWidth
                          variant="outlined"
                          autoComplete="organization-title"
                          // required
                          error={_.hasIn(
                            registrationForm.formState.errors,
                            "organizationRoleOther"
                          )}
                          helperText={
                            registrationForm.formState.errors
                              .organizationRoleOther &&
                            (messageI18NResolver(
                              "REGISTRATIONFORM_ORGANIZATIONROLEOTHER_ERR_REQUIRED"
                            ) ||
                              "Please fill in your role within organization")
                          }
                        />
                      )}
                      control={registrationForm.control}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                      >
                        {messageI18NResolver("REGISTRATIONFORM_SUBMIT_LABEL")}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
            <DialogActions></DialogActions>
          </Box>
        )}

        {dialogState === 4 && (
          <Box p={2}>
            <DialogTitle id="max-width-dialog-title">
              <Typography
                gutterBottom
                style={{ color: "#51A5B2", fontSize: "24px" }}
              >
                {messageI18NResolver("REGISTRATIONFORM_SUCCESS_TITLE")}
              </Typography>
            </DialogTitle>
            <DialogContent style={{ height: "300px" }}>
              <Typography variant="body2">
                {messageI18NResolver("REGISTRATIONFORM_SUCCESS_TEXT")}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseRegistration}
                fullWidth
              >
                {messageI18NResolver("AUTHENTICATION_FORM_CLOSE")}
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>
    </div>
  );
};

export default AdvancedTools;
