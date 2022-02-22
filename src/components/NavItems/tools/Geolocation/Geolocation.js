import React, { useState } from "react";
import { useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import useMyStyles from "../../../Shared/MaterialUiStyles/useMyStyles"
import useLoadLanguage from "../../../../Hooks/useLoadLanguage";
import tsv from "../../../../LocalDictionary/components/NavItems/tools/Analysis.tsv";
import tsvAlltools from "../../../../LocalDictionary/components/NavItems/tools/Alltools.tsv";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { ReactComponent as GeolocationIcon } from '../../../NavBar/images/SVG/Image/Geolocation.svg';
import Grid from "@material-ui/core/Grid";
import HeaderTool from "../../../Shared/HeaderTool/HeaderTool";
import useGeolacate from "./Hooks/useGeolacte";
import GeolocationResults from "./Results/GeolocationResults";

const Geolocation = () => {

    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/Geolocalizer.tsv", tsv);
    const keywordAllTools = useLoadLanguage("components/NavItems/tools/Alltools.tsv", tsvAlltools);

    const result = useSelector(state => state.geolocation.result);
    const urlImage = useSelector(state => state.geolocation.urlImage);
    const isLoading = useSelector(state => state.geolocation.loading);


    const [input, setInput] = useState("");
    const [processUrl, setProcessUrl] = useState(false);

    const submitUrl = () => {
        setProcessUrl(true);
    };

    useGeolacate(input, processUrl)

    return (
        <div>

            <HeaderTool name={keywordAllTools("navbar_geolocation")} description={keywordAllTools("navbar_geolocation_description")} icon={<GeolocationIcon style={{ fill: "#51A5B2", width: "75px", height: "75px" }} />} />

            <Card>

                <CardHeader
                    title={keyword("geo_source")}
                    className={classes.headerUpladedImage}
                />
                <div className={classes.root2}>
                    <Grid
                        container
                        direction="row"
                        spacing={3}
                        alignItems="center"
                    >
                        <Grid item xs>

                            <TextField
                                id="standard-full-width"
                                label={keyword("geo_link")}
                                placeholder={keyword("geo_paste")}
                                fullWidth
                                disabled={isLoading}
                                value={input}
                                variant="outlined"
                                onChange={e => setInput(e.target.value)}
                            />

                        </Grid>

                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                onClick={submitUrl}
                            >
                                {keyword("geo_submit")}
                            </Button>
                        </Grid>



                        <Box m={1} />

                    </Grid>
                </div>
                <LinearProgress hidden={!isLoading} />
            </Card>
            <Box m={3} />

            {
                result && !isLoading && 
                <GeolocationResults
                    result={result}
                    urlImage={urlImage}
                />
            }



        </div>);
};
export default Geolocation;