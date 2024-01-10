export interface Language {
  iso: string;
  browser: string;
  name: string;
  icon: string;
}

export const LANGUAGES: Array<Language> = [
  {
    iso: "fra",
    browser: "fr",
    name: "Français",
    icon: "https://flagcdn.com/fr.svg",
  },
  {
    iso: "eng",
    browser: "en",
    name: "English",
    icon: "https://flagcdn.com/gb.svg",
  },
  {
    iso: "spa",
    browser: "es",
    name: "Español",
    icon: "https://flagcdn.com/es.svg",
  },
  {
    iso: "ita",
    browser: "it",
    name: "Italiano",
    icon: "https://flagcdn.com/it.svg",
  },
  {
    iso: "deu",
    browser: "de",
    name: "Deutsch",
    icon: "https://flagcdn.com/de.svg",
  },
];

export interface JsonLanguage {
  [iso: string]: string;
}
