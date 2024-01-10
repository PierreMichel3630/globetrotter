import { Alert, Box, Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseInput } from "src/components/Input";
import { useAuth } from "src/context/AuthProviderSupabase";

import DoneIcon from "@mui/icons-material/Done";
import { Helmet } from "react-helmet-async";
import { updateProfil } from "src/api/supabase/profile";
import { updateUser } from "src/api/supabase/user";
import { AvatarSelector } from "src/components/avatar/AvatarSelector";
import { useMessage } from "src/context/MessageProvider";
import { Profile } from "src/models/Profile";

export const ParameterPage = () => {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();
  const { user, profile, setProfile } = useAuth();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstname(profile.firstname);
      setLastname(profile.lastname);
    }
  }, [profile]);

  const changeFirstname = async () => {
    if (user) {
      const newProfil = { id: user.id, firstname };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updatefirstnamesuccess"));
        setProfile(data as Profile);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };
  const changeLastname = async () => {
    if (user) {
      const newProfil = { id: user.id, lastname };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updatelastnamesuccess"));
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

  return (
    <Container maxWidth="sm">
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
                <Typography variant="h4">{t("commun.firstname")}</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <BaseInput
                  value={firstname}
                  clear={() => setFirstname("")}
                  onChange={(value) => setFirstname(value)}
                />
              </Grid>
              {profile && profile.firstname !== firstname && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<DoneIcon />}
                    fullWidth
                    onClick={() => changeFirstname()}
                    size="small"
                  >
                    {t("commun.validate")}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="h4">{t("commun.lastname")}</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <BaseInput
                  value={lastname}
                  clear={() => setLastname("")}
                  onChange={(value) => setLastname(value)}
                />
              </Grid>
              {profile && profile.lastname !== lastname && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<DoneIcon />}
                    fullWidth
                    onClick={() => changeLastname()}
                    size="small"
                  >
                    {t("commun.validate")}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="h4">{t("commun.email")}</Typography>
              </Grid>
              <Grid item xs={12} md={8}>
                <BaseInput
                  value={email}
                  clear={() => setEmail(user ? user.email ?? "" : "")}
                  onChange={(value) => {
                    setEmail(value);
                  }}
                />
              </Grid>
              {user && user.email !== email && (
                <>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <Alert severity="info">
                      {t("pages.parameters.infoemail")}
                    </Alert>
                  </Grid>
                </>
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
        </Grid>
      </Box>
    </Container>
  );
};
