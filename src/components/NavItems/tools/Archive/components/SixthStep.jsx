import React from "react";
import { i18nLoadNamespace } from "../../../../Shared/Languages/i18nLoadNamespace";
import UrlArchive from "./urlArchive";

const SixthStep = ({ urlInput, mediaUrl }) => {
  const keyword = i18nLoadNamespace("components/NavItems/tools/Archive");

  return (
    <>
      <UrlArchive url={urlInput} mediaUrl={mediaUrl}></UrlArchive>
    </>
  );
};

export default SixthStep;
