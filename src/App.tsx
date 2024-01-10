import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "./i18n/config";

import { Colors } from "./style/Colors";

import Routes from "./routes";

import "moment/dist/locale/de";
import "moment/dist/locale/es";
import "moment/dist/locale/fr";
import { Helmet } from "react-helmet-async";
import { ScrollToTopNavigator } from "./components/ScrollTop";
import { AuthProviderSupabase } from "./context/AuthProviderSupabase";
import { MessageProvider } from "./context/MessageProvider";
import { UserProvider, useUser } from "./context/UserProvider";

function App() {
  const { mode, language } = useUser();

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
            fontSize: 10,
            fontStyle: "italic",
            fontWeight: 500,
            "@media (max-width:600px)": {
              fontSize: 10,
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
    <UserProvider>
      <AuthProviderSupabase>
        <Helmet
          htmlAttributes={{
            lang: language.iso,
          }}
        />
        <ThemeProvider theme={theme}>
          <MessageProvider>
            <CssBaseline />
            <BrowserRouter>
              <ScrollToTopNavigator />
              <Routes />
            </BrowserRouter>
          </MessageProvider>
        </ThemeProvider>
      </AuthProviderSupabase>
    </UserProvider>
  );
}

export default App;
