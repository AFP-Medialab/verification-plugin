import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";

import { Close } from "@mui/icons-material";

const C2paResults = (props) => {
  const result = props.result;
  const img = props.image;
  console.log("results", result);

  const handleClose = () => {
    props.handleClose();
  };

  return (
    <Card>
      <CardHeader
        title={"Results"}
        action={
          <IconButton aria-label="close" onClick={handleClose}>
            <Close sx={{ color: "white" }} />
          </IconButton>
        }
      />
      <Box m={2} />
      <Grid container direction="row" spacing={3} p={4}>
        <Grid item xs>
          <img
            src={img}
            style={{
              maxWidth: "100%",
              maxHeight: "60vh",
              borderRadius: "10px",
            }}
          />
        </Grid>
        <Grid item xs>
          <Card p={1}>
            {/* <CardHeader title={"C2pa Info"}/> */}
            <CardContent>
              <Typography variant="h5">{"C2pa Info"}</Typography>
              <Box m={1} />
              {!result.c2paInfo ? (
                <Alert severity="info">{"No c2pa info for this image"}</Alert>
              ) : result.validationIssues ? (
                <Alert severity="error">
                  {"Content credentials could not be verified for this image"}
                </Alert>
              ) : (
                <Stack>
                  <Typography>{result.title}</Typography>
                  <Box m={1} />
                  <Box p={1}>
                    {/* <CardContent> */}
                    <Stack>
                      <Typography variant="h6">
                        {"Content Credentials"}
                      </Typography>

                      <Box p={1}>
                        <Typography>
                          {"Issuer: " + result.signatureInfo.issuer}
                        </Typography>
                        <Typography>
                          {"Date issued: " + result.signatureInfo.time}
                        </Typography>
                      </Box>
                    </Stack>
                    {/* </CardContent> */}
                    <Box m={1} />
                    <Divider m={1} />
                  </Box>
                  {/* <Box m={1} /> */}

                  <Box p={1}>
                    {/* <CardContent> */}
                    <Stack>
                      <Typography variant="h6">{"Credit"}</Typography>
                      <Box p={1}>
                        {result.producer ? (
                          <Typography>
                            {"Produced by: " + result.producer}
                          </Typography>
                        ) : (
                          <Alert severity="info">
                            {"No info on the producer of this image."}
                          </Alert>
                        )}
                      </Box>
                    </Stack>
                    {/* </CardContent> */}
                    <Box m={1} />
                    <Divider m={1} />
                  </Box>

                  <Box p={1}>
                    {/* <CardContent> */}
                    <Stack>
                      <Typography variant="h6">
                        {"Capture Information"}
                      </Typography>
                      <Box p={1}>
                        {result.captureInfo ? (
                          <>
                            {result.captureInfo.make ? (
                              <Typography>
                                {"Make: " + result.captureInfo.make}
                              </Typography>
                            ) : null}
                            {result.captureInfo.model ? (
                              <Typography>
                                {"Model: " + result.captureInfo.model}
                              </Typography>
                            ) : null}
                            {result.captureInfo.dateTime ? (
                              <Typography>
                                {"Capture date: " + result.captureInfo.dateTime}
                              </Typography>
                            ) : null}
                          </>
                        ) : (
                          <Alert severity="info">
                            {"No capture information available."}
                          </Alert>
                        )}
                      </Box>
                    </Stack>
                    <Box m={1} />
                    <Divider />
                    {/* </CardContent> */}
                  </Box>

                  <Box p={1}>
                    {/* <CardContent> */}
                    <Stack>
                      <Typography variant="h6">{"Process"}</Typography>

                      <Box p={1}>
                        {result.editsAndActivity ? (
                          <>
                            <Typography fontSize={18}>{"Edits"}</Typography>
                            <Box m={1} />
                            <Box paddingLeft={2}>
                              {result.editsAndActivity.map((obj, key) => {
                                return (
                                  <Typography key={key}>
                                    {obj.label + ": " + obj.description}
                                  </Typography>
                                );
                              })}
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>

                      <Box p={1}>
                        {result.ingredients ? (
                          <>
                            <Typography fontSize={18}>
                              {"Ingredients"}
                            </Typography>
                            <Box m={1} />
                            {result.ingredients.map((obj, key) => {
                              return (
                                <Box key={key} p={1}>
                                  <img
                                    src={obj.url}
                                    style={{
                                      maxWidth: "150px",
                                      maxHeight: "60vh",
                                      borderRadius: "10px",
                                    }}
                                  />
                                  <Typography fontSize={12}>
                                    {obj.title}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </Stack>
                    {/* </CardContent> */}
                  </Box>
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Card>
  );
};

export default C2paResults;
