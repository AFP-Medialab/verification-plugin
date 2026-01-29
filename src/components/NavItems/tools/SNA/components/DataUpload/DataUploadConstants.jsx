import React from "react";

import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";

import TiktocIcon from "../../../../../NavBar/images/SVG/DataAnalysis/Tiktok_sna.svg";

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

const metaDefaultFields = new Map([
  ["Object", "Link"],
  ["User ID", "Facebook Id"],
  ["Entry ID", "URL"],
  ["Share Time", "Post Created"],
  ["Text", "Message"],
]);

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
      <FacebookIcon alt={"crowdtangleFB"} style={{ width: 38, height: 34 }} />
    ),
    defaultFieldsMap: metaDefaultFields,
    id: "crowdTangleFb",
    tooltipText: "uploadModal_crowdtangleFB_tooltip",
  },
  twitter: {
    icon: <XIcon alt={"X"} style={{ width: 38, height: 34 }} />,
    defaultFieldsMap: snaTwitterDefaultFields,
    id: "twitter",
    tooltipText: "uploadModal_snaTwitter_tooltip",
  },
  tiktok: {
    icon: <TiktocIcon alt={"tiktok"} style={{ width: 38, height: 34 }} />,
    defaultFieldsMap: snaTiktokDefaultFields,
    id: "tiktok",
    tooltipText: "uploadModal_snaTiktok_tooltip",
  },
};

export const zeeschuimerUploadTemplates = {
  twitter: {
    icon: <XIcon alt={"X"} style={{ width: 38, height: 34 }} />,
    objectMappings: "",
    id: "zeeschuimerTwitter",
    tooltipText: "uploadModalZS_twitter_tooltip",
  },
  tiktok: {
    icon: <TiktocIcon alt={"tiktok"} style={{ width: 38, height: 34 }} />,
    objectMappings: "",
    id: "zeeschuimerTiktok",
    tooltipText: "uploadModalZS_tiktok_tooltip",
  },
};
