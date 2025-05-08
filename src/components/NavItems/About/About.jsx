import React from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import CustomTile from "../../Shared/CustomTitle/CustomTitle";
import useMyStyles from "../../Shared/MaterialUiStyles/useMyStyles";
import afpImage from "./images/Logo-AFP-384.png";
import afcnLogo from "./images/afcn_logo.png";
import arijLogo from "./images/arij_logo.png";
import itiImage from "./images/iti.jpg";
import europeImage from "./images/logo_EUh2020_horizontal.png";

const About = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace("components/NavItems/About");
  const currentLang = useSelector((state) => state.language);

  return (
    <Paper variant="outlined" className={classes.root}>
      <Box
        align={"center"}
        sx={{
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CustomTile text={keyword("about_title")} />
        <Box
          sx={{
            m: 3,
          }}
        />
        <Typography variant={"body2"} align={"justify"}>
          {keyword("source_part_1")}
          {keyword("mit_licence_link_label")}
          {keyword("source_part_2")}
        </Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("description")}
        </Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("feedBack_part_1")}
          <Link href={"mailto:" + keyword("invid_email")}>
            {keyword("invid_email")}
          </Link>
        </Typography>
        <Box
          sx={{
            m: 3,
          }}
        />
        <Typography variant={"h6"}>{keyword("disclaimer")}</Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("disclaimer_text")}
        </Typography>
        <Box
          sx={{
            m: 3,
          }}
        />
        <Typography variant={"h6"}>{keyword("privacy")}</Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("privacy_text")}
        </Typography>
        <Box
          sx={{
            m: 3,
          }}
        />
        <Typography variant={"body2"} align={"justify"}>
          {keyword("info_weverify_part_1")}
          <Link target="_blank" href={keyword("info_weverify_link_website")}>
            {keyword("info_weverify_website")}
          </Link>
          {keyword("info_weverify_part_2")}
          <Link target="_blank" href={keyword("info_invid_link_twitter")}>
            {keyword("twitter")}
          </Link>
        </Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("info_invid_part_1")}
          <Link target="_blank" href={keyword("info_invid_link_website")}>
            {keyword("info_invid_website")}
          </Link>
          {keyword("info_invid_part_2")}
          <Link target="_blank" href={keyword("info_invid_link_twitter")}>
            {keyword("twitter")}
          </Link>
          {keyword("info_invid_part_3")}
        </Typography>
        <Typography variant={"body2"} align={"justify"}>
          {keyword("developed_text_part_1")}
          <Link target="_blank" href={keyword("medialab_link")}>
            {keyword("medialab_link_label")}
          </Link>
          {keyword("developed_text_part_2")}
          <Link target="_blank" href={keyword("iti_link")}>
            {keyword("iti_link_label")}
          </Link>
          {keyword("developed_text_part_3")}
          <Link target="_blank" href={keyword("lleida_link")}>
            {keyword("lleida_link_label")}
          </Link>
          <Link target="_blank" href={keyword("borelli_link")}>
            {keyword("borelli_link_label")}
          </Link>
          {keyword("developed_text_part_4")}
          <Link target="_blank" href={keyword("usfd_link")}>
            {keyword("usfd_link_label")}
          </Link>
          {keyword("arabic_translation_part_1")}
          <Link target="_blank" href={keyword("afcn_link")}>
            {keyword("afcn_link_label")}
          </Link>
          {keyword("arabic_translation_part_2")}
          <Link target="_blank" href={keyword("arij_link")}>
            {keyword("arij_link_label")}
          </Link>
        </Typography>
      </Box>
      <Grid
        container
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Grid size={{ xs: 12 }}>
          <img className={classes.AboutMedia} src={afpImage} alt={afpImage} />
        </Grid>
        <Grid>
          <img className={classes.AboutMedia} src={itiImage} alt={itiImage} />
        </Grid>
        <Grid>
          <img
            className={classes.AboutMedia}
            src={europeImage}
            alt={europeImage}
          />
        </Grid>
        {currentLang === "ar" ? (
          <>
            <Grid size={{ xs: 6 }}>
              <img
                className={classes.AboutMediaSmall}
                src={afcnLogo}
                alt={afcnLogo}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <img
                className={classes.AboutMediaSmall}
                src={arijLogo}
                alt={arijLogo}
              />
            </Grid>
          </>
        ) : null}
      </Grid>
    </Paper>
  );
};
export default About;
