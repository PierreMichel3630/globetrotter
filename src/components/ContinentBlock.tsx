import { Box, Chip, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { Colors } from "src/style/Colors";
import { formatNumber } from "src/utils/string";
import { Carrousel } from "./Carrousel";
import { CardCountryAdjacent } from "./card/CardCountry";
import { Continent } from "src/models/country/Continent";
import { useState } from "react";

interface Props {
  continent: Continent;
}

export const ContinentBlock = ({ continent }: Props) => {
  const { t } = useTranslation();
  const { countriesVisited, countries, selectCountry } = useApp();
  const [filter, setFilter] = useState({
    all: true,
    visited: false,
    notvisited: false,
  });

  const countriesContinent = countries.filter((el) => {
    const idContinents = el.continents.map((continent) => continent.id);
    return idContinents.includes(continent.id);
  });

  const countriesFilter = countriesContinent.filter((country) => {
    const idVisited = countriesVisited.map((el) => el.id);
    if (filter.all) {
      return true;
    } else if (filter.visited) {
      return idVisited.includes(country.id);
    } else if (filter.notvisited) {
      return !idVisited.includes(country.id);
    }
    return true;
  });

  return (
    <Grid container alignItems="flex-end">
      <Grid item xs={12}>
        <Carrousel
          images={continent.images.map(
            (el) =>
              `https://otgkjrkkwbjtozbvcbuo.supabase.co/storage/v1/object/public/country/${el}`
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h2">{continent.name.fra}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {continent.description.fra && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h4">{t("commun.inshort")}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    {continent.description.fra}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </>
            )}
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h4" component="span">
                  {formatNumber(continent.area)}{" "}
                </Typography>
                <Typography variant="h6" component="span">
                  {t("commun.areaunite")}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                textTransform="uppercase"
                color={Colors.grey}
              >
                {t("commun.area")}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4">
                {formatNumber(continent.population)}
              </Typography>
              <Typography
                variant="h6"
                textTransform="uppercase"
                color={Colors.grey}
              >
                {t("commun.population")}
              </Typography>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h4" component="span">
                  {formatNumber(continent.density)}{" "}
                </Typography>
                <Typography variant="h6" component="span">
                  {t("commun.superficyunite")}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                textTransform="uppercase"
                color={Colors.grey}
              >
                {t("commun.area")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", gap: 1, alignItems: "center" }}
            >
              <Typography variant="h4">
                {t("commun.countries")} ({countriesContinent.length})
              </Typography>
              <Chip
                label={t("commun.all")}
                variant="filled"
                color={filter.all ? "primary" : "default"}
                onClick={() =>
                  setFilter({
                    all: true,
                    visited: false,
                    notvisited: false,
                  })
                }
              />
              <Chip
                label={t("commun.countriesvisited")}
                color={filter.visited ? "primary" : "default"}
                onClick={() =>
                  setFilter({
                    all: false,
                    visited: true,
                    notvisited: false,
                  })
                }
              />
              <Chip
                label={t("commun.countriesnotvisited")}
                color={filter.notvisited ? "primary" : "default"}
                onClick={() =>
                  setFilter({
                    all: false,
                    visited: false,
                    notvisited: true,
                  })
                }
              />
            </Grid>
            {countriesFilter.map((el) => (
              <Grid
                item
                xs={4}
                key={el.id}
                sx={{ cursor: "pointer" }}
                onClick={() => selectCountry(el)}
              >
                <CardCountryAdjacent country={el} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
