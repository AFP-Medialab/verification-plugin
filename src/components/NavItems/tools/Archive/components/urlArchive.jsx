import {
  Box,
  Button,
  Grid2,
  Icon,
  Link,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { useEffect, useState } from "react";
import IconPermaCC from "../../../../NavBar/images/SVG/Others/perma-cc-icon.svg";
import IconInternetArchive from "../../../../NavBar/images/SVG/Others/archive-icon.svg";

const UrlArchive = ({ url, openLinks }) => {
  const [platform, setPlatform] = useState(null);
  const [urls, setUrls] = useState([]);

  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  useEffect(() => {
    if (url && url.includes("facebook")) {
      setPlatform("facebook");
    } else if (url && url.includes("youtube")) {
      setPlatform("youtube");
    } else if (url && url.includes("instagram")) {
      setPlatform("instagram");
    }
  }, [url]);

  useEffect(() => {
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
      const instagramUrls = [url + "embed/captioned"];
      setUrls(instagramUrls);
    }
  }, [platform]);

  const saveToInternetArchive = (link) => {
    window.open("https://web.archive.org/save/" + link, "_blank");
  };

  const ArchiveLink = ({ link, link_type_keyword }) => {
    return (
      <>
        <Grid2 container>
          <Typography>{keyword(link_type_keyword)}</Typography>
          <Box p={1} />
          <Tooltip title={keyword("permacc_button")}>
            <Button>
              <IconPermaCC />
            </Button>
          </Tooltip>
          <Tooltip title={keyword("internet_archive_button")}>
            <Button onClick={() => saveToInternetArchive(link)}>
              <IconInternetArchive />
            </Button>
          </Tooltip>
        </Grid2>
        <Link href={link} pl={2}>
          {link}
        </Link>
      </>
    );
  };

  return (
    <>
      <Stack p={2} spacing={1}>
        {platform === "facebook" ? (
          <>
            <Box p={1} />
            <Grid2>
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
            </Grid2>
            <Stack spacing={2}>
              <ArchiveLink link={urls[0]} link_type_keyword={"embed_link"} />
              <ArchiveLink link={urls[1]} link_type_keyword={"android_link"} />
              <ArchiveLink link={urls[2]} link_type_keyword={"mobile_link"} />
            </Stack>
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
                  <Typography>{keyword("unsupported_platform")}</Typography>
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
