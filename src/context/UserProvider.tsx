import i18next from "i18next";
import moment from "moment";
import { createContext, useContext, useEffect, useState } from "react";
import { LANGUAGES, Language } from "src/models/Language";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const DEFAULT_LANGUAGE: Language = {
  iso: "eng",
  name: "English",
  icon: "https://flagcdn.com/gb.svg",
};

export const UserContext = createContext<{
  language: Language;
  languages: Array<Language>;
  setLanguage: (language: Language) => void;
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}>({
  language:
    localStorage.getItem("language") !== null
      ? (JSON.parse(localStorage.getItem("language")!) as Language)
      : DEFAULT_LANGUAGE,
  languages: [],
  setLanguage: (language: Language) => {},
  mode: "light",
  setMode: (mode: "light" | "dark") => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: Props) => {
  const getDefaultLanguage = () => {
    let result: undefined | Language = undefined;
    if (navigator.languages.length > 0) {
      const languageBrower = navigator.languages[0].split(/-|_/)[0];
      result = LANGUAGES.find((el) => el.iso === languageBrower);
    }
    return result ?? DEFAULT_LANGUAGE;
  };
  const getLanguage = () =>
    localStorage.getItem("language") !== null
      ? (JSON.parse(localStorage.getItem("language")!) as Language)
      : getDefaultLanguage();

  const [mode, setMode] = useState<"light" | "dark">(
    localStorage.getItem("mode") !== null
      ? (localStorage.getItem("mode")! as "light" | "dark")
      : "dark"
  );

  const [language, setLanguage] = useState<Language>(getLanguage());

  useEffect(() => {
    if (language) {
      moment.locale(language.iso);
      changeLanguage(language.iso);
      localStorage.setItem("language", JSON.stringify(language));
    }
  }, [language]);

  const changeLanguage = async (language: string) => {
    await i18next.changeLanguage(language);
  };

  return (
    <UserContext.Provider
      value={{ languages: LANGUAGES, language, setLanguage, setMode, mode }}
    >
      {children}
    </UserContext.Provider>
  );
};
