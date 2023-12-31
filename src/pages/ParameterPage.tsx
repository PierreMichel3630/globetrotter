import {
  Alert,
  AlertColor,
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseInput } from "src/components/Input";
import { useAuth } from "src/context/AuthProviderSupabase";

import DoneIcon from "@mui/icons-material/Done";
import { Helmet } from "react-helmet-async";
import { updateProfil } from "src/api/supabase/profile";
import { updateUser } from "src/api/supabase/user";
import { MessageSnackbar } from "src/components/Snackbar";
import { AvatarSelector } from "src/components/avatar/AvatarSelector";
import { Profile } from "src/models/Profile";
import { AutocompleteCountry } from "src/components/input/AutocompleteCountry";
import { Country } from "src/models/country/Country";
import { useApp } from "src/context/AppProvider";

export const ParameterPage = () => {
  const { t } = useTranslation();
  const { countries } = useApp();
  const { user, profile, setProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [originCountry, setOriginCountry] = useState<Country | null>(null);
  const [email, setEmail] = useState("");
  const [isEmailChange, setIsEmailChange] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      const country = countries.find((el) => el.id === profile.country);
      setOriginCountry(country ?? null);
    }
  }, [profile]);

  const changeUsername = async () => {
    if (user) {
      const newProfil = { id: user.id, username };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateusernamesuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
    }
  }, [user]);

  const changeEmail = async () => {
    if (user) {
      const newUser = { email };
      const { error } = await updateUser(newUser);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateemailsuccess"));
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  useEffect(() => {
    if (profile) {
      setAvatar(profile.avatar);
    }
  }, [profile]);

  const changeAvatar = async (value: string | null) => {
    if (user) {
      const newProfil = { id: user.id, avatar: value };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updateavatarsuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const changeOriginCountry = async (value: Country | null) => {
    if (user) {
      const newProfil = { id: user.id, country: value ? value.id : null };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updatecountrysuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Helmet>
        <title>{`${t("pages.parameters.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("commun.myparameters")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t("commun.username")}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <BaseInput
                value={username}
                clear={() => setUsername("")}
                onChange={(value) => setUsername(value)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<DoneIcon />}
                fullWidth
                onClick={() => changeUsername()}
                size="small"
              >
                {t("commun.validate")}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t("commun.email")}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <BaseInput
                value={email}
                clear={() => setEmail(user ? user.email ?? "" : "")}
                onChange={(value) => {
                  setIsEmailChange(true);
                  setEmail(value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<DoneIcon />}
                fullWidth
                onClick={() => changeEmail()}
                size="small"
              >
                {t("commun.validate")}
              </Button>
            </Grid>
            {isEmailChange && (
              <Grid item xs={12}>
                <Alert severity="info">{t("pages.parameters.infoemail")}</Alert>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t("commun.avatar")}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <AvatarSelector selected={avatar} onSelect={changeAvatar} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h4">{t("commun.origincountry")}</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <AutocompleteCountry
                placeholder={t("pages.parameters.selectorigincountry")}
                value={originCountry}
                onChange={(value) => {
                  changeOriginCountry(value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <MessageSnackbar
        autoHideDuration={600000}
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
        severity={severity}
      />
    </Box>
  );
};
