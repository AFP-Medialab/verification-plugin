import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useTrackEvent } from "@/Hooks/useAnalytics";
import { ROLES } from "@/constants/roles";
import { KNOWN_LINKS } from "@/constants/tools";
import { getclientId } from "@Shared/GoogleAnalytics/MatomoAnalytics";
import { history } from "@Shared/History/History";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";

import IconInternetArchive from "../../../../NavBar/images/SVG/Others/archive-icon.svg";
import CopyButton from "../../../../Shared/CopyButton";
import { prettifyLargeString } from "../utils";
import DownloadWaczFile from "./downloadWaczFile";

/**
 *
 * @param url {string}
 * @param mediaUrl {?string} Optional - The URL of the media in the social media post to archive
 * @returns {JSX.Element}
 * @constructor
 */
const UrlArchive = ({ url, mediaUrl }) => {
  const [platform, setPlatform] = useState(null);
  const [urls, setUrls] = useState([]);

  const client_id = getclientId();

  const session = useSelector((state) => state.userSession);
  const uid = session && session.user ? session.user.id : null;

  const role = useSelector((state) => state.userSession.user.roles);

  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  useEffect(() => {
    if (!url && typeof url !== "string") return;

    if (url.includes(KNOWN_LINKS.FACEBOOK)) {
      setPlatform(KNOWN_LINKS.FACEBOOK);
    } else if (url.includes(KNOWN_LINKS.YOUTUBE)) {
      setPlatform(KNOWN_LINKS.YOUTUBE);
    } else if (url.includes(KNOWN_LINKS.INSTAGRAM)) {
      setPlatform(KNOWN_LINKS.INSTAGRAM);
    } else {
      setPlatform(null);
    }
  }, [url]);

  if (url)
    useTrackEvent(
      "submission",
      "archive",
      "easy archiving link",
      url,
      client_id,
      history,
      uid,
    );

  const [clickedUrl, setClickedUrl] = useState(null);
  // Track the clicked Save with SPN action
  useTrackEvent(
    "archive",
    "archive_wbm_spn",
    "Archive with WBM SPN",
    clickedUrl,
    client_id,
    history,
    uid,
  );

  useEffect(() => {
    if (!platform) {
      setUrls(url);
      return;
    }

    if (platform === KNOWN_LINKS.FACEBOOK) {
      const facebookUrls = [
        `https://www.facebook.com/plugins/post.php?height=476&href=${encodeURIComponent(
          url,
        )}&show_text=true&width=1100`,
        `https://www.facebook.com/v16.0/plugins/post.php?app_id=&channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfe3fbda33dec3%26domain%3Ddevelopers.facebook.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fdevelopers.facebook.com%252Ff8686a44c9f19%26relation%3Dparent.parent&container_width=734&href=${encodeURIComponent(
          url,
        )}&set=a.462670379217792&locale=en_US&sdk=joey&show_text=true&width=1100`,
        `https://mbasic.facebook.com/${url.replace(
          "https://www.facebook.com/",
          "",
        )}`,
      ];
      setUrls(facebookUrls);
    } else if (platform === KNOWN_LINKS.YOUTUBE) {
      const youtubeUrls = [url.replace("/watch?v=", "/embed/")];
      setUrls(youtubeUrls);
    } else if (platform === KNOWN_LINKS.INSTAGRAM) {
      const embedUrl = (() => {
        const u = new URL(url);
        return u.origin + u.pathname + "embed/captioned";
      })();

      const instagramUrls = [embedUrl];
      setUrls(instagramUrls);
    }

    setUrls((prev) => [...prev, url]);
  }, [platform]);

  const saveToInternetArchive = (link) => {
    window.open("https://web.archive.org/save/" + link, "_blank");
  };

  const ArchiveLink = ({ link, link_type_keyword }) => {
    if (!link) return <></>;

    return (
      <Box>
        <Stack direction="column" spacing={1}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "start",
              alignItems: "center",
            }}
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
              onClick={() => {
                setClickedUrl(link);
                saveToInternetArchive(link);
              }}
              startIcon={<IconInternetArchive />}
            >
              {keyword("internet_archive_button")}
            </Button>
          </Box>
          {role.includes(ROLES.EXTRA_FEATURE) && (
            <DownloadWaczFile url={link} />
          )}
        </Stack>
      </Box>
    );
  };

  const getArchiveLinksForPlatform = (platform) => {
    let archiveListForPlatform;

    if (platform === KNOWN_LINKS.FACEBOOK) {
      archiveListForPlatform = (
        <>
          <Stack spacing={4}>
            <ArchiveLink link={urls[0]} link_type_keyword={"embed_link"} />
            <ArchiveLink link={urls[1]} link_type_keyword={"android_link"} />
            <ArchiveLink link={urls[2]} link_type_keyword={"mobile_link"} />
          </Stack>
        </>
      );
    } else if (platform === KNOWN_LINKS.YOUTUBE) {
      archiveListForPlatform = (
        <ArchiveLink link={urls[0]} link_type_keyword={"embed_link"} />
      );
    } else if (platform === KNOWN_LINKS.INSTAGRAM) {
      archiveListForPlatform = (
        <ArchiveLink link={urls[0]} link_type_keyword={"embed_link"} />
      );
    }

    return (
      <>
        {archiveListForPlatform}
        <ArchiveLink link={url} link_type_keyword={"link_submitted"} />
        {mediaUrl && (
          <ArchiveLink link={mediaUrl} link_type_keyword={"media_url"} />
        )}
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              urls.map((urlElement) => {
                window.open(urlElement, "_blank");
              });
            }}
            sx={{ textTransform: "none" }}
          >
            {keyword("open_links_button")}
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Card variant="outlined" m={2}>
      <CardContent>
        <Typography
          variant="h6"
          component="div"
          sx={{
            pb: 2,
          }}
        >
          {keyword("links_card_title")}
        </Typography>
        <Stack spacing={4}>{getArchiveLinksForPlatform(platform)}</Stack>
      </CardContent>
    </Card>
  );
};

export default UrlArchive;
