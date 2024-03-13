import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { px } from "csx";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Country } from "src/models/country/Country";
import { Colors } from "src/style/Colors";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { JsonLanguageBlock } from "src/components/typography/JsonLanguageBlock";
import { useMessage } from "src/context/MessageProvider";
import { updateProfil } from "src/api/supabase/profile";
import { Profile } from "src/models/Profile";
import { sortByName } from "src/utils/sort";
import { useUser } from "src/context/UserProvider";
import { BasicSearchInput } from "src/components/Input";
import { searchString } from "src/utils/string";
import { useNavigate } from "react-router-dom";

export const OriginCountryPage = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const navigate = useNavigate();
  const { profile, setProfile } = useAuth();
  const { countries } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [value, setValue] = useState("");
  const [countriesFilter, setCountriesFilter] = useState<Array<Country>>([]);
  const [maxIndex, setMaxIndex] = useState(25);

  const setOriginCountry = async (value: Country) => {
    if (profile) {
      const newProfil = { id: profile.id, country: value.id };
      const { data, error } = await updateProfil(newProfil);
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(t("alert.updatecountrysuccess"));
        setProfile(data as Profile);
        setTimeout(() => navigate("/"), 2000);
      }
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  useEffect(() => {
    const getResult = () => {
      if (value !== "") {
        const countriesFilter = countries
          .sort((a, b) => sortByName(language, a, b))
          .filter((el) => searchString(value, el.name[language.iso]));

        setCountriesFilter(countriesFilter);
      } else {
        setCountriesFilter(
          countries.sort((a, b) => sortByName(language, a, b))
        );
      }
    };
    getResult();
  }, [value, language, countries]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1600 <=
        document.documentElement.offsetHeight ||
      maxIndex >= countriesFilter.length
    ) {
      return;
    }
    setMaxIndex((prev) => prev + 25);
  }, [maxIndex, countriesFilter]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [countriesFilter, handleScroll, maxIndex]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Helmet>
            <title>{`${t("pages.origincountry.title")} - ${t(
              "appname"
            )}`}</title>
          </Helmet>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{t("commun.myorigincountry")}</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 3,
              pb: 1,
              backgroundColor: Colors.backgroundColor,
            }}
          >
            <BasicSearchInput
              label={t("commun.search")}
              value={value}
              onChange={setValue}
              clear={() => setValue("")}
            />
          </Grid>
          <Grid item xs={12}>
            <List>
              <Divider />
              {[...countriesFilter].splice(0, maxIndex).map((el) => (
                <Fragment key={el.id}>
                  <ListItem
                    disablePadding
                    sx={{ backgroundColor: Colors.white }}
                  >
                    <ListItemButton onClick={() => setOriginCountry(el)}>
                      <ListItemIcon>
                        {profile && profile.country === el.id && (
                          <CheckCircleIcon color="success" />
                        )}
                      </ListItemIcon>
                      <ListItemIcon>
                        <Avatar
                          alt="flag"
                          src={el.flag}
                          sx={{ width: px(30), height: px(30) }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={<JsonLanguageBlock value={el.name} />}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                </Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
