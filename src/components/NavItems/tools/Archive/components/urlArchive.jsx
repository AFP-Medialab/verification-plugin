import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { useEffect, useState } from "react";
import IconInternetArchive from "../../../../NavBar/images/SVG/Others/archive-icon.svg";
import {
  getclientId,
  trackEvent,
} from "../../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useSelector } from "react-redux";
import { history } from "../../../../Shared/History/History";
import { prettifyLargeString } from "../utils";
import CopyButton from "../../../../Shared/CopyButton";

const UrlArchive = ({ url }) => {
  const [platform, setPlatform] = useState(null);
  const [urls, setUrls] = useState([]);

  const client_id = getclientId();

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  useEffect(() => {
    if (!url && typeof url !== "string") return;

    if (url.includes("facebook")) {
      setPlatform("facebook");
    } else if (url.includes("youtube")) {
      setPlatform("youtube");
    } else if (url.includes("instagram")) {
      setPlatform("instagram");
    } else {
      setPlatform(null);
    }
  }, [url]);

  useEffect(() => {
    if (!platform) {
      setUrls(url);
    }

    if (platform)
      trackEvent(
        "submission",
        "archive",
        "easy archiving link",
        url,
        client_id,
        history,
        uid,
      );

    if (platform === "facebook") {
      const facebookUrls = [
        `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(
          url,
        )}&show_text=true&width=500`,
        `https://www.facebook.com/v16.0/plugins/post.php?app_id=&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfe3fbda33dec3%26domain%3Ddevelopers.facebook.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fdevelopers.facebook.com%252Ff8686a44c9f19%26relation%3Dparent.parent&container_width=734&href=${encodeURIComponent(
          url,
        )}&set=a.462670379217792&locale=en_US&sdk=joey&show_text=true&width=500`,
        `https://mbasic.facebook.com/${url.replace(
          "https://www.facebook.com/",
          "",
        )}`,
      ];
      setUrls(facebookUrls);
    } else if (platform === "youtube") {
      const youtubeUrls = [url.replace("/watch?v=", "/embed/")];
      setUrls(youtubeUrls);
    } else if (platform === "instagram") {
      const instagramUrls = [
        url.substring(url.length - 1) === "/"
          ? url + "embed/captioned"
          : url + "/embed/captioned",
      ];
      setUrls(instagramUrls);
    }
  }, [platform]);

  const saveToInternetArchive = (link) => {
    trackEvent(
      "archive",
      "archive_wbm_spn",
      "Archive with WBM SPN",
      link,
      client_id,
      history,
      uid,
    );

    window.open("https://web.archive.org/save/" + link, "_blank");
  };

  const ArchiveLink = ({ link, link_type_keyword }) => {
    if (!link) return <></>;

    return (
      <Box>
        <Stack direction="column" spacing={1}>
          <Stack
            direction="row"
            justifyContent={"start"}
            alignItems={"center"}
            spacing={1}
          >
            <Typography>{keyword(link_type_keyword)}</Typography>
            <Link href={link} target="_blank">
              {prettifyLargeString(link)}
            </Link>
            <CopyButton
              strToCopy={link}
              labelBeforeCopy={"Copy Url"}
              labelAfterCopy={"Copied!"}
            />
          </Stack>

          <Box>
            <Button
              variant="outlined"
              onClick={() => saveToInternetArchive(link)}
              startIcon={<IconInternetArchive />}
              sx={{ textTransform: "none" }}
            >
              {keyword("internet_archive_button")}
            </Button>
          </Box>
        </Stack>

        {/*<Box />*/}
        {/*<Tooltip title={keyword("permacc_button")}>*/}
        {/*  <Button>*/}
        {/*    <IconPermaCC />*/}
        {/*  </Button>*/}
        {/*</Tooltip>*/}
      </Box>
    );
  };

  return (
    <>
      <Stack spacing={4}>
        {platform === "facebook" ? (
          <>
            <Stack spacing={4}>
              <ArchiveLink link={urls[0]} link_type_keyword={"embed_link"} />
              <ArchiveLink link={urls[1]} link_type_keyword={"android_link"} />
              <ArchiveLink link={urls[2]} link_type_keyword={"mobile_link"} />
            </Stack>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  urls.map((urlElement) => {
                    window.open(urlElement, "_blank");
                  });
                }}
              >
                {keyword("open_links_button")}
              </Button>
            </Box>
          </>
        ) : (
          <>
            {platform === "youtube" ? (
              <>
                <ArchiveLink link={urls[0]} link_type_keyword={"embed_link"} />
              </>
            ) : (
              <>
                {platform === "instagram" ? (
                  <>
                    <ArchiveLink
                      link={urls[0]}
                      link_type_keyword={"embed_link"}
                    />
                  </>
                ) : (
                  <ArchiveLink link={url} link_type_keyword={"link"} />
                )}
              </>
            )}
          </>
        )}
      </Stack>
    </>
  );
};

export default UrlArchive;
