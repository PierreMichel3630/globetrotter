import { Box, Chip, Grid, InputBase, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Map2 } from "src/components/map/Map2";

import SearchIcon from "@mui/icons-material/Search";
import { px } from "csx";
import { CountryBlock } from "src/components/CountryBlock";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import { ContinentBlock } from "src/components/ContinentBlock";
import { DefaultBlock } from "src/components/DefaultBlock";
import { TravelBlock } from "src/components/TravelBlock";
import { useApp } from "src/context/AppProvider";
import { sortByName } from "src/utils/sort";
import { Helmet } from "react-helmet-async";
import { Colors } from "src/style/Colors";

export const MapPage = () => {
  const { t } = useTranslation();
  const {
    travel,
    selectTravel,
    country,
    continents,
    selectCountry,
    continent,
    selectContinent,
  } = useApp();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const label = country
      ? country.name.fra
      : continent
      ? continent.name.fra
      : travel
      ? travel.name
      : "";
    setInputValue(label);
  }, [country, continent, travel]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.map.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Map2 />
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <Grid
            item
            xs={12}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 3,
              p: 1,
              backgroundColor: Colors.backgroundColor,
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
              {(country || continent || travel) && (
                <ArrowBackIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setInputValue("");
                    selectCountry(null);
                    selectContinent(null);
                    selectTravel(null);
                  }}
                />
              )}
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={t("commun.search")}
                inputProps={{ "aria-label": t("commun.search") }}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
              <SearchIcon />
              {(country || continent || travel) && (
                <ClearIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setInputValue("");
                    selectCountry(null);
                    selectContinent(null);
                    selectTravel(null);
                  }}
                />
              )}
            </Paper>
          </Grid>
          {!(country || continent || travel) && (
            <Grid item xs={12}>
              <Box sx={{ p: 1 }}>
                <Grid container spacing={1}>
                  {continents.sort(sortByName).map((continent) => (
                    <Grid item key={continent.id}>
                      <Chip
                        size="small"
                        label={continent.name.fra}
                        onClick={() => {
                          selectContinent(continent);
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          )}
          {country ? (
            <Grid item xs={12}>
              <CountryBlock country={country} isExplore={false} />
            </Grid>
          ) : continent ? (
            <Grid item xs={12}>
              <ContinentBlock continent={continent} />
            </Grid>
          ) : travel ? (
            <Grid item xs={12}>
              <TravelBlock travel={travel} />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <DefaultBlock />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
