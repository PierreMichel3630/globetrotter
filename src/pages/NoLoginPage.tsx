import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

import logo from "src/assets/logo.png";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { Helmet } from "react-helmet-async";
import { Carrousel } from "src/components/Carrousel";

import screenshoot1 from "src/assets/screenshoot/screenshoot1.png";
import screenshoot2 from "src/assets/screenshoot/screenshoot2.png";
import screenshoot3 from "src/assets/screenshoot/screenshoot3.png";
import screenshoot4 from "src/assets/screenshoot/screenshoot4.png";
import screenshoot5 from "src/assets/screenshoot/screenshoot5.png";
import { useAuth } from "src/context/AuthProviderSupabase";

export const NoLoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const images = [
    screenshoot1,
    screenshoot2,
    screenshoot3,
    screenshoot4,
    screenshoot5,
  ];

  if (user) {
    return <Navigate to="/map" replace />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 2 }}>
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
          <Grid item xs={12} sm={6}>
            <Carrousel images={images} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
