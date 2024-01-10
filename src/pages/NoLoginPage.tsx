import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Helmet } from "react-helmet-async";
import logo from "src/assets/logo.png";

import screenshoot1 from "src/assets/screenshoot/Screenshot1.jpg";
import screenshoot2 from "src/assets/screenshoot/Screenshot2.jpg";
import screenshoot3 from "src/assets/screenshoot/Screenshot3.jpg";
import screenshoot4 from "src/assets/screenshoot/Screenshot4.jpg";
import screenshoot5 from "src/assets/screenshoot/Screenshot5.jpg";
import screenshoot6 from "src/assets/screenshoot/Screenshot6.jpg";
import screenshoot7 from "src/assets/screenshoot/Screenshot7.jpg";
import screenshoot8 from "src/assets/screenshoot/Screenshot8.jpg";
import screenshoot9 from "src/assets/screenshoot/Screenshot9.jpg";
import { ScreenshootBlock } from "src/components/ScreenshootBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

export const NoLoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language, setLanguage, languages } = useUser();

  const screenshots = [
    { label: t("screenshoot.countryvisited"), image: screenshoot2 },
    { label: t("screenshoot.stats"), image: screenshoot3 },
    { label: t("screenshoot.compare"), image: screenshoot6 },
    { label: t("screenshoot.timeline"), image: screenshoot4 },
    { label: t("screenshoot.explore"), image: screenshoot7 },
    { label: t("screenshoot.country"), image: screenshoot8 },
    { label: t("screenshoot.travel"), image: screenshoot9 },
    { label: t("screenshoot.friends"), image: screenshoot5 },
    { label: t("screenshoot.connexion"), image: screenshoot1 },
  ];

  if (user) {
    return <Navigate to="/map" replace />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 1 }}>
        <Helmet>
          <title>{`${t("pages.home.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          sx={{ textAlign: "center" }}
        >
          <Grid item xs={12}>
            <img src={logo} width={80} height={80} />
            <Typography variant="h1">GlobeTrotter</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">{t("commun.welcome")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              {t("commun.welcomemessage")}
            </Typography>
            <Typography variant="h6">{t("commun.getstarted")}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AccountCircleIcon />}
              onClick={() => navigate("login")}
            >
              <Typography variant="body1">{t("commun.login")}</Typography>
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<AppRegistrationIcon />}
              onClick={() => navigate("register")}
            >
              <Typography variant="body1">{t("commun.register")}</Typography>
            </Button>
          </Grid>
          <Grid item xs={12}>
            <ScreenshootBlock screenshots={screenshots} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              {t("commun.languagesavailable")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              {languages.map((el) => (
                <Grid
                  item
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => setLanguage(el)}
                >
                  <img
                    style={{
                      border:
                        language.iso === el.iso
                          ? `3px solid ${Colors.green}`
                          : "none",
                    }}
                    src={el.icon}
                    height={language.iso === el.iso ? 36 : 30}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
