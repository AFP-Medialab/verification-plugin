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
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/960px-Facebook_logo_%28square%29.png";

const tiktokLogoUrl =
  "https://www.citypng.com/public/uploads/preview/round-tiktok-icon-logo-transparent-background-701751695033010oraha4pc0r.png";

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
    icon: (
      <img
        src={metaLogoUrl}
        alt={"crowdtangleFB"}
        style={{ width: 38, height: 34 }}
      />
    ),
    defaultFieldsMap: metaDefaultFields,
    id: "crowdTangleFb",
    tooltipText: "uploadModal_crowdtangleFB_tooltip",
  },
  twitter: {
    icon: snaIcon,
    defaultFieldsMap: snaTwitterDefaultFields,
    id: "twitter",
    tooltipText: "uploadModal_snaTwitter_tooltip",
  },
  tikTok: {
    icon: (
      <img
        src={tiktokLogoUrl}
        alt={"tiktok"}
        style={{ width: 38, height: 34 }}
      />
    ),
    defaultFieldsMap: snaTiktokDefaultFields,
    id: "tiktok",
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
    icon: (
      <img
        src={tiktokLogoUrl}
        alt={"tiktok"}
        style={{ width: 38, height: 34 }}
      />
    ),
    objectMappings: "",
    id: "zeeschuimerTiktok",
    tooltipText: "uploadModalZS_tiktok_tooltip",
  },
};
