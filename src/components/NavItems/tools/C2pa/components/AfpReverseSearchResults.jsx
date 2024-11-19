import React from "react";
import { Alert, Box, Button, Grid2, Stack } from "@mui/material";
import { ROLES } from "../../../../../constants/roles";
import Typography from "@mui/material/Typography";
import C2paCard from "./c2paCard";
import { useSelector } from "react-redux";
import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";

const AfpReverseSearchResults = ({
  thumbnailImage,
  downloadHdImage,
  hdImage,
  thumbnailImageCaption,
  hdImageC2paData,
}) => {
  const role = useSelector((state) => state.userSession.user.roles);
  const keyword = i18nLoadNamespace("components/NavItems/tools/C2pa");

  return (
    <Stack direction="row" spacing={4}>
      <Box width="100%">
        <Grid2 container direction="row" spacing={2} p={4} width="100%">
          <Grid2 container direction="column" size={{ xs: 6 }} spacing={2}>
            <Grid2>
              <img
                src={thumbnailImage}
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  borderRadius: "10px",
                }}
              />
            </Grid2>

            {hdImage &&
              (role.includes(ROLES.AFP_C2PA_GOLD) ||
                role.includes(ROLES.EXTRA_FEATURE)) && (
                <Grid2>
                  <Button
                    variant="contained"
                    onClick={downloadHdImage}
                    sx={{ textTransform: "none" }}
                  >
                    {keyword("reverse_search_original_image_download_button")}
                  </Button>
                </Grid2>
              )}

            {thumbnailImageCaption &&
            typeof thumbnailImageCaption === "string" ? (
              <Grid2 mt={2}>
                <Stack direction="column" spacing={1}>
                  <Typography>{keyword("image_caption_title")}</Typography>

                  <Typography variant={"caption"}>
                    {thumbnailImageCaption}
                  </Typography>
                </Stack>
              </Grid2>
            ) : (
              <Alert severity="info" sx={{ width: "fit-content" }}>
                {keyword("no_caption_available_alert")}
              </Alert>
            )}
          </Grid2>
          <Grid2 container direction="column" size={{ xs: 6 }} spacing={2}>
            <Alert severity="info" sx={{ width: "fit-content" }}>
              {keyword("afp_produced_image_info")}
            </Alert>
            {hdImageC2paData && <C2paCard c2paData={hdImageC2paData} />}
          </Grid2>
        </Grid2>
      </Box>
    </Stack>
  );
};

export default AfpReverseSearchResults;
