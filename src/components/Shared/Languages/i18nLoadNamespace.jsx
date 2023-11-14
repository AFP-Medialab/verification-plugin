import { useTranslation } from "react-i18next";

export const i18nLoadNamespace = (namespace) => {
  const { t } = useTranslation(namespace);
  return t;
};
