import "./App.css";
import "./i18n/config";
import moment from "moment";
import { createContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import i18next from "i18next";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import { Colors } from "./style/Colors";

import Routes from "./routes";

import "moment/dist/locale/fr";
import "moment/dist/locale/de";
import "moment/dist/locale/es";
import { AuthProviderSupabase } from "./context/AuthProviderSupabase";
import { Helmet } from "react-helmet-async";
import { Language } from "./models/Language";
import { getLanguages } from "./api/supabase/language";
import { ScrollToTopNavigator } from "./components/ScrollTop";

const DEFAULT_LANGUAGE: Language = {
  id: 2,
  iso: "fr-FR",
  name: "Français",
  abbreviation: "fr",
  image: "fr.svg",
};

export const UserContext = createContext<{
  language: Language;
  languages: Array<Language>;
  setLanguage: (language: Language) => void;
  setMode: (mode: "light" | "dark") => void;
}>({
  language:
    localStorage.getItem("language") !== null
      ? (JSON.parse(localStorage.getItem("language")!) as Language)
      : DEFAULT_LANGUAGE,
  languages: [],
  setLanguage: (language: Language) => {},
  setMode: (mode: "light" | "dark") => {},
});

function App() {
  const [languages, setLanguages] = useState<Array<Language>>([]);

  const getLanguage = () =>
    localStorage.getItem("language") !== null
      ? (JSON.parse(localStorage.getItem("language")!) as Language)
      : DEFAULT_LANGUAGE;

  const searchAllLanguage = async () => {
    const { data } = await getLanguages();
    setLanguages(data as Array<Language>);
  };

  useEffect(() => {
    searchAllLanguage();
  }, []);

  const [mode, setMode] = useState<"light" | "dark">(
    localStorage.getItem("mode") !== null
      ? (localStorage.getItem("mode")! as "light" | "dark")
      : "dark"
  );

  const [language, setLanguage] = useState<Language>(getLanguage());

  useEffect(() => {
    if (language) {
      moment.locale(language.abbreviation);
      changeLanguage(language.id.toString());
      localStorage.setItem("language", JSON.stringify(language));
    }
  }, [language]);

  const changeLanguage = async (language: string) => {
    await i18next.changeLanguage(language);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          secondary: {
            main: Colors.white,
          },
          text: {
            primary: Colors.black,
            secondary: Colors.grey2,
          },
        },
        typography: {
          fontFamily: ["Montserrat", "sans-serif"].join(","),
          h1: {
            fontSize: 50,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 30,
            },
          },
          caption: {
            fontSize: 13,
            fontWeight: 500,
            "@media (max-width:600px)": {
              fontSize: 12,
            },
          },
          body1: {
            fontSize: 13,
            fontWeight: 500,
            "@media (max-width:600px)": {
              fontSize: 12,
            },
          },
          body2: {
            fontSize: 11,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 11,
            },
          },
          h2: {
            fontSize: 22,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 20,
            },
          },
          h3: {
            fontSize: 18,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 15,
            },
          },
          h4: {
            fontSize: 16,
            fontWeight: 700,
            "@media (max-width:600px)": {
              fontSize: 14,
            },
          },
          h6: {
            fontSize: 13,
            fontWeight: 600,
            "@media (max-width:600px)": {
              fontSize: 12,
            },
          },
        },
      }),
    [mode]
  );

  return (
    <AuthProviderSupabase>
      <UserContext.Provider
        value={{ languages, language, setLanguage, setMode }}
      >
        <Helmet
          htmlAttributes={{
            lang: language.abbreviation,
          }}
        />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <ScrollToTopNavigator />
            <Routes />
          </BrowserRouter>
        </ThemeProvider>
      </UserContext.Provider>
    </AuthProviderSupabase>
  );
}

export default App;
