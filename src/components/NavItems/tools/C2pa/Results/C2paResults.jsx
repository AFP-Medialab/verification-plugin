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
} from "@mui/material";

const C2paResults = (props) => {
  const result = props.result;
  const img = props.image;
  console.log("resultss", result);
  return (
    <Card>
      <CardHeader title={"Reuslts"} />
      <Box m={2} />
      <Grid container direction="row" spacing={3}>
        <Grid item xs p={2}>
          <img
            src={img}
            style={{
              maxWidth: "100%",
              maxHeight: "60vh",
              borderRadius: "10px",
            }}
          />
        </Grid>
        <Grid item xs p={2}>
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
                      <Box p={1}></Box>
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
                            <Typography>
                              {"Make: " + result.captureInfo.make}
                            </Typography>
                            <Typography>
                              {"Model: " + result.captureInfo.model}
                            </Typography>
                            <Typography>
                              {"Capture date: " + result.captureInfo.dateTime}
                            </Typography>
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
                          result.editsAndActivity.map((obj, key) => {
                            return (
                              <Typography key={key}>
                                {obj.label + ": " + obj.description}
                              </Typography>
                            );
                          })
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
