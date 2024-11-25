import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import GeolocationIcon from "../../../NavBar/images/SVG/Image/Geolocation.svg";
import { Grid2 } from "@mui/material";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useGeolocate from "./Hooks/useGeolocate";
import GeolocationResults from "./Results/GeolocationResults";
import Alert from "@mui/material/Alert";
import { resetGeolocation } from "../../../../redux/reducers/tools/geolocationReducer";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

const Geolocation = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/Geolocalizer");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordWarning = i18nLoadNamespace("components/Shared/OnWarningInfo");
  const dispatch = useDispatch();
  const cleanup = () => {
    dispatch(resetGeolocation());
    setInput("");
  };

  const result = useSelector((state) => state.geolocation.result);
  const urlImage = useSelector((state) => state.geolocation.urlImage);
  const isLoading = useSelector((state) => state.geolocation.loading);
  const [processUrl, setProcessUrl] = useState(false);
  const [input, setInput] = useState(urlImage ? urlImage : "");

  const submitUrl = () => {
    setProcessUrl(true);
  };

  useGeolocate(input, processUrl, keyword);

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_geolocation")}
        description={keywordAllTools("navbar_geolocation_description")}
        icon={
          <GeolocationIcon
            style={{ fill: "#00926c", width: "40px", height: "40px" }}
          />
        }
      />

      <Alert severity="warning">{keywordWarning("warning_beta")}</Alert>

      <Box m={3} />

      <Card>
        <CardHeader
          title={keyword("geo_source")}
          className={classes.headerUploadedImage}
        />
        <form className={classes.root2}>
          <Grid2 container direction="row" spacing={3} alignItems="center">
            <Grid2 size="grow">
              <TextField
                id="standard-full-width"
                label={keyword("geo_link")}
                placeholder={keyword("geo_paste")}
                fullWidth
                disabled={isLoading}
                value={input}
                variant="outlined"
                onChange={(e) => setInput(e.target.value)}
              />
            </Grid2>
            <Grid2>
              {!result ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  onClick={submitUrl}
                >
                  {keyword("geo_submit")}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    cleanup();
                  }}
                >
                  {keyword("button_remove")}
                </Button>
              )}
            </Grid2>
            <Box m={1} />
          </Grid2>
        </form>
        {isLoading && <LinearProgress />}
      </Card>
      <Box m={3} />

      {result && !isLoading && (
        <GeolocationResults result={result} urlImage={urlImage} />
      )}
    </div>
  );
};
export default Geolocation;
