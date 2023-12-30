import { Box, Chip, Grid, InputBase, Paper } from "@mui/material";
import { px } from "csx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";

import SearchIcon from "@mui/icons-material/Search";
import { CardCountry } from "src/components/card/CardCountry";
import { sortByName } from "src/utils/sort";
import { Helmet } from "react-helmet-async";
import { Colors } from "src/style/Colors";

export const ExplorePage = () => {
  const { countries, continents } = useApp();
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState("");
  const [filterContinent, setFilterContinent] = useState(0);

  const filterCountries = [...countries].filter((el) => {
    const resultat = el.name.fra
      .toLowerCase()
      .includes(inputValue.toLowerCase());
    const resultatContinent =
      filterContinent === 0
        ? true
        : el.continents.map((c) => c.id).includes(filterContinent);
    return resultat && resultatContinent;
  });

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
              {continents.sort(sortByName).map((continent) => (
                <Grid item key={continent.id}>
                  <Chip
                    size="small"
                    color={
                      filterContinent === continent.id ? "primary" : "default"
                    }
                    label={continent.name.fra}
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
              {filterCountries.sort(sortByName).map((country) => (
                <Grid item xs={12} key={country.id}>
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
