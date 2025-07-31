import React from "react";

import SvgIcon from "@mui/material/SvgIcon";

import SNAIcon from "../../../../../NavBar/images/SVG/DataAnalysis/Twitter_sna.svg";

export const dataUploadModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const required_fields = [
  "Object",
  "User ID",
  "Entry ID",
  "Share Time",
  "Text",
];

const metaLogoUrl =
  "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png";

const tiktokLogoUrl =
  "https://images.seeklogo.com/logo-png/42/2/tiktok-black-icon-logo-png_seeklogo-429281.png";

const makeIcon = (imageUrl, altText) => {
  return <img src={imageUrl} alt={altText} style={{ width: 38, height: 21 }} />;
};

const MetaIcon = makeIcon(metaLogoUrl, "meta");

const tiktokIcon = makeIcon(tiktokLogoUrl, "tiktok");

const metaDefaultFields = new Map([
  ["Object", "Link"],
  ["User ID", "Facebook Id"],
  ["Entry ID", "URL"],
  ["Share Time", "Post Created"],
  ["Text", "Message"],
]);

const snaIcon = (
  <SvgIcon
    component={SNAIcon}
    inheritViewBox
    style={{ width: 38, height: 21 }}
  />
);

const snaTwitterDefaultFields = new Map([
  ["Object", "objects"],
  ["User ID", "username"],
  ["Entry ID", "id"],
  ["Share Time", "date"],
  ["Text", "text"],
]);

const snaTiktokDefaultFields = new Map([
  ["Object", "objects"],
  ["User ID", "username"],
  ["Entry ID", "id"],
  ["Share Time", "date"],
  ["Text", "text"],
]);

export const uploadTemplates = {
  crowdTangleFb: {
    icon: MetaIcon,
    defaultFieldsMap: metaDefaultFields,
    id: "crowdTangleFb",
    tooltipText: "uploadModal_crowdtangleFB_tooltip",
  },
  snaTwitter: {
    icon: snaIcon,
    defaultFieldsMap: snaTwitterDefaultFields,
    id: "snaTwitter",
    tooltipText: "uploadModal_snaTwitter_tooltip",
  },
  snaTikTok: {
    icon: tiktokIcon,
    defaultFieldsMap: snaTiktokDefaultFields,
    id: "snaTiktok",
    tooltipText: "uploadModal_snaTiktok_tooltip",
  },
};

export const zeeschuimerUploadTemplates = {
  twitter: {
    icon: snaIcon,
    objectMappings: "",
    id: "zeeschuimerTwitter",
    tooltipText: "uploadModalZS_twitter_tooltip",
  },
  tiktok: {
    icon: tiktokIcon,
    objectMappings: "",
    id: "zeeschuimerTiktok",
    tooltipText: "uploadModalZS_tiktok_tooltip",
  },
};
