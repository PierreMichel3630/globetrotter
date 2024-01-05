export interface Language {
  iso: string;
  name: string;
  icon: string;
}

export const LANGUAGES: Array<Language> = [
  {
    iso: "fra",
    name: "Français",
    icon: "https://flagcdn.com/fr.svg",
  },
  {
    iso: "eng",
    name: "English",
    icon: "https://flagcdn.com/gb.svg",
  },
  {
    iso: "spa",
    name: "Español",
    icon: "https://flagcdn.com/es.svg",
  },
  {
    iso: "ita",
    name: "Italiano",
    icon: "https://flagcdn.com/it.svg",
  },
  {
    iso: "deu",
    name: "Deutsch",
    icon: "https://flagcdn.com/de.svg",
  },
];

export interface JsonLanguage {
  [iso: string]: string;
}
