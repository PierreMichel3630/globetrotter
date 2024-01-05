import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enGB from "./locales/en-GB.json";
import frFR from "./locales/fr-FR.json";
import itIT from "./locales/it-IT.json";
import deDE from "./locales/de-De.json";
import esES from "./locales/es-ES.json";

const defaultLanguage = "fr-FR";

export const defaultNamespace = "default";

export const resources = {
  eng: {
    [defaultNamespace]: enGB,
  },
  fra: {
    [defaultNamespace]: frFR,
  },
  spa: {
    [defaultNamespace]: esES,
  },
  deu: {
    [defaultNamespace]: deDE,
  },
  ita: {
    [defaultNamespace]: itIT,
  },
};

i18n.use(initReactI18next).init({
  defaultNS: defaultNamespace,
  ns: [defaultNamespace],
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
});
