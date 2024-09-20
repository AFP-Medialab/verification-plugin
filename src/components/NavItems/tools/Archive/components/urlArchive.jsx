import { Box, Button, Grid2, Link, Stack, Typography } from "@mui/material";
import { i18nLoadNamespace } from "components/Shared/Languages/i18nLoadNamespace";
import { useEffect, useState } from "react";

const UrlArchive = ({ url, openLinks }) => {
  const [platform, setPlatform] = useState(null);
  const [urls, setUrls] = useState([]);
  console.log(url);

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
            <Box m={1} />
            <Typography>{keyword("embed_link")}</Typography>
            <Link href={urls[0]} pl={2}>
              {urls[0]}
            </Link>
            <Box m={1} />
            <Typography>{keyword("android_link")}</Typography>
            <Link href={urls[1]} pl={2}>
              {urls[1]}
            </Link>
            <Box m={1} />
            <Typography>{keyword("mobile_link")}</Typography>
            <Link href={urls[2]} pl={2}>
              {urls[2]}
            </Link>
          </>
        ) : (
          <>
            {platform === "youtube" ? (
              <>
                <Typography>{"Embed Link:"}</Typography>
                <Link href={urls[0]} pl={2}>
                  {urls[0]}
                </Link>
              </>
            ) : (
              <>
                {platform === "instagram" ? (
                  <>
                    <Typography>{"Embed Link:"}</Typography>
                    <Link href={urls[0]} pl={2}>
                      {urls[0]}
                    </Link>
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
