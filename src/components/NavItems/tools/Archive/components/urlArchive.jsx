import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import React, { useEffect, useState } from "react";
import IconInternetArchive from "../../../../NavBar/images/SVG/Others/archive-icon.svg";
import {
  getclientId,
  trackEvent,
} from "../../../../Shared/GoogleAnalytics/MatomoAnalytics";
import { useSelector } from "react-redux";
import { history } from "../../../../Shared/History/History";
import { prettifyLargeString } from "../utils";
import CopyButton from "../../../../Shared/CopyButton";
import { KNOWN_LINKS } from "../../../Assistant/AssistantRuleBook";
import DownloadWaczFile from "./downloadWaczFile";
import { ROLES } from "../../../../../constants/roles";

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

  useEffect(() => {
    if (!platform) {
      setUrls(url);
      return;
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

    if (platform === KNOWN_LINKS.FACEBOOK) {
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
    } else if (platform === KNOWN_LINKS.YOUTUBE) {
      const youtubeUrls = [url.replace("/watch?v=", "/embed/")];
      setUrls(youtubeUrls);
    } else if (platform === KNOWN_LINKS.INSTAGRAM) {
      const instagramUrls = [
        url.substring(url.length - 1) === "/"
          ? url + "embed/captioned"
          : url + "/embed/captioned",
      ];
      setUrls(instagramUrls);
    }

    setUrls((prev) => [...prev, url]);
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
        <Typography variant="h6" component="div" pb={2}>
          {keyword("links_card_title")}
        </Typography>
        <Stack spacing={4}>{getArchiveLinksForPlatform(platform)}</Stack>
      </CardContent>
    </Card>
  );
};

export default UrlArchive;
