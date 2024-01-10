import { Box, Chip, Grid, InputBase, Paper } from "@mui/material";
import { px } from "csx";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";

import SearchIcon from "@mui/icons-material/Search";
import { Helmet } from "react-helmet-async";
import { CardCountry } from "src/components/card/CardCountry";
import { Colors } from "src/style/Colors";
import { sortByName } from "src/utils/sort";
import { searchString } from "src/utils/string";
import { Country } from "src/models/country/Country";
import { useUser } from "src/context/UserProvider";
import { JsonLanguageBlock } from "src/components/typography/JsonLanguageBlock";

export const ExplorePage = () => {
  const { countries, continents } = useApp();
  const { t } = useTranslation();
  const { language } = useUser();

  const [inputValue, setInputValue] = useState("");
  const [filterContinent, setFilterContinent] = useState(0);
  const [filterCountries, setFilterCountries] = useState<Array<Country>>([]);
  const [maxIndex, setMaxIndex] = useState(25);

  useEffect(() => {
    const filterCountries = [...countries]
      .sort((a, b) => sortByName(language, a, b))
      .filter((el) => {
        const resultat = searchString(inputValue, el.name[language.iso]);
        const resultatContinent =
          filterContinent === 0
            ? true
            : el.continents.map((c) => c.id).includes(filterContinent);
        return resultat && resultatContinent;
      });
    setFilterCountries(filterCountries);
  }, [countries, inputValue, filterContinent]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1600 <=
        document.documentElement.offsetHeight ||
      maxIndex >= filterCountries.length
    ) {
      return;
    }
    setMaxIndex((prev) => prev + 25);
  }, [maxIndex, filterCountries]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filterCountries, handleScroll, maxIndex]);

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.explore.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 3,
            p: 1,
            display: "flex",
            flexDirection: "column",
            backgroundColor: Colors.backgroundColor,
            gap: 1,
          }}
        >
          <Paper
            sx={{
              p: "4px 8px",
              display: "flex",
              alignItems: "center",
              borderRadius: px(50),
            }}
            elevation={3}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={t("commun.search")}
              inputProps={{ "aria-label": t("commun.search") }}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <SearchIcon />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Grid container spacing={1}>
              <Grid item>
                <Chip
                  size="small"
                  label={t("commun.world")}
                  color={filterContinent === 0 ? "primary" : "default"}
                  onClick={() => setFilterContinent(0)}
                />
              </Grid>
              {continents
                .sort((a, b) => sortByName(language, a, b))
                .map((continent) => (
                  <Grid item key={continent.id}>
                    <Chip
                      size="small"
                      color={
                        filterContinent === continent.id ? "primary" : "default"
                      }
                      label={
                        <JsonLanguageBlock
                          variant="body1"
                          value={continent.name}
                        />
                      }
                      onClick={() => setFilterContinent(continent.id)}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={1}>
              {[...filterCountries].splice(0, maxIndex).map((country) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={country.id}>
                  <CardCountry country={country} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
