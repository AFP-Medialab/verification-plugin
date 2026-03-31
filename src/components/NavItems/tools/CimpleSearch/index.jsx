import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { canUserSeeTool, newSna, searchCimple } from "@/constants/tools";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import HeaderTool from "@Shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "@Shared/Languages/i18nLoadNamespace";
import useMyStyles, {
  myCardStyles,
} from "@Shared/MaterialUiStyles/useMyStyles";

import { RecordingWindow, getRecordingInfo } from "../SNA/components/Recording";
import { useCimpleFilters, useCimpleSearch } from "./api";
import CimpleSearchForm from "./components/CimpleSearchForm";
import CimpleSearchResults from "./components/CimpleSearchResults";
import { createUrl } from "./utils/cimpleUtils";

const CimpleSearch = () => {
  const classes = useMyStyles();
  const cardClasses = myCardStyles();
  const keyword = i18nLoadNamespace("components/NavItems/tools/CimpleSearch");
  const keywordAllTools = i18nLoadNamespace(
    "components/NavItems/tools/Alltools",
  );
  const keywordNewSna = i18nLoadNamespace("components/NavItems/tools/NewSNA");

  const { data: filterOptions = {}, isLoading: filtersLoading } =
    useCimpleFilters();

  const { mutate: search, data: results, error, isPending } = useCimpleSearch();

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;
  const client_id = getclientId();
  const [eventUrl, setEventUrl] = useState(undefined);

  useTrackEvent(
    "submission",
    "cimple_advance_search",
    "cimple request",
    eventUrl,
    client_id,
    eventUrl,
    uid,
  );

  const handleSubmit = (formValues) => {
    const cimpleSearchApi = import.meta.env.VITE_CIMPLE_API;
    const url = createUrl(cimpleSearchApi, formValues);
    setEventUrl(url);
    search(formValues);
  };

  const [recording, setRecording] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [collections, setCollections] = useState(["Default Collection"]);
  const [selectedCollection, setSelectedCollection] =
    useState("Default Collection");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedSocialMedia, setSelectedSocialMedia] = useState([]);
  const userRoles = useSelector((state) => state.userSession.user.roles);
  const isUserAuthenticated = useSelector(
    (state) => state.userSession.userAuthenticated,
  );

  useEffect(() => {
    if (!canUserSeeTool(newSna, userRoles, isUserAuthenticated)) return;
    getRecordingInfo(setCollections, setRecording, setSelectedCollection);
  }, []);

  const hasOutput = results !== undefined || error !== null;

  return (
    <div>
      <HeaderTool
        name={keywordAllTools("navbar_cimple")}
        description={keywordAllTools("navbar_cimple_description")}
        icon={
          <searchCimple.icon
            sx={{ fill: "var(--mui-palette-primary-main)", fontSize: "40px" }}
          />
        }
      />
      <Box sx={{ mt: 3 }} />

      <Stack spacing={2}>
        <Card variant="outlined" className={cardClasses.root}>
          <CardHeader
            title={keyword("cardheader_parameters")}
            className={classes.headerUploadedImage}
          />
          {filtersLoading && <LinearProgress />}
          <div className={classes.root2}>
            {canUserSeeTool(newSna, userRoles, isUserAuthenticated) && (
              <RecordingWindow
                recording={recording}
                setRecording={setRecording}
                expanded={expanded}
                setExpanded={setExpanded}
                selectedCollection={selectedCollection}
                setSelectedCollection={setSelectedCollection}
                collections={collections}
                setCollections={setCollections}
                newCollectionName={newCollectionName}
                setNewCollectionName={setNewCollectionName}
                selectedSocialMedia={selectedSocialMedia}
                setSelectedSocialMedia={setSelectedSocialMedia}
                keyword={keywordNewSna}
              />
            )}
            <CimpleSearchForm
              filterOptions={filterOptions}
              filtersLoading={filtersLoading}
              isPending={isPending}
              handleSubmit={handleSubmit}
              keyword={keyword}
            />
          </div>
        </Card>

        {hasOutput && (
          <Box>
            {error && <Alert severity="error">{error.message}</Alert>}
            {results !== undefined && <CimpleSearchResults results={results} />}
          </Box>
        )}
      </Stack>
    </div>
  );
};

export default CimpleSearch;
