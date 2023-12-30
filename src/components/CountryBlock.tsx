import { Alert, Box, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { CountryTravel } from "src/models/CountryTravel";
import { Country } from "src/models/country/Country";
import { Colors } from "src/style/Colors";
import { formatNumber } from "src/utils/string";
import { Carrousel } from "./Carrousel";
import { LabelDiffArrayDate } from "./LabelDiffDate";
import { CardCountryAdjacent } from "./card/CardCountry";
import { CardTravel } from "./card/CardTravel";

interface Props {
  isExplore?: boolean;
  country: Country;
}

export const CountryBlock = ({ country, isExplore = true }: Props) => {
  const { t } = useTranslation();
  const { travels, countries, selectCountry } = useApp();

  const onSelect = (code: number) => {
    const country = countries.find((el) => el.ccn3 === code);
    selectCountry(country ?? null);
  };

  const travelsCountry = travels.filter((travel) =>
    travel.countries.map((el) => el.country).includes(country.id)
  );

  const times = travelsCountry.reduce((acc, value) => {
    return [
      ...acc,
      ...value.countries.filter((el) => el.country === country.id),
    ];
  }, [] as Array<CountryTravel>);

  return (
    <Grid container alignItems="flex-end">
      <Grid item xs={12}>
        <Carrousel
          images={country.images.map(
            (el) =>
              `https://otgkjrkkwbjtozbvcbuo.supabase.co/storage/v1/object/public/country/${el}`
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h2">{country.name.fra}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" component="span">
                {t("commun.travelcount", { count: travelsCountry.length })}{" "}
              </Typography>
              {travelsCountry.length > 0 && (
                <LabelDiffArrayDate values={times} />
              )}
            </Grid>
            {travelsCountry.length > 0 ? (
              <>
                {travelsCountry.map((travel) => (
                  <Grid item xs={12} key={travel.id}>
                    <CardTravel travel={travel} />
                  </Grid>
                ))}
              </>
            ) : (
              <Grid item xs={12}>
                <Alert severity="info">{t("alert.notravelcountry")}</Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {country.description.fra && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h4">{t("commun.inshort")}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    {country.description.fra}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Typography variant="h4">{t("commun.information")}</Typography>
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
              <img src={country.flag} style={{ width: px(40) }} />
              <Typography
                variant="h6"
                textTransform="uppercase"
                color={Colors.grey}
              >
                {t("commun.flag")}
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
                {country.currencies
                  .map((el) => `${el.name.eng} (${el.symbol})`)
                  .join(",")}
              </Typography>
              <Typography
                variant="h6"
                textTransform="uppercase"
                color={Colors.grey}
              >
                {t("commun.currency")}
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
                {country.capitals.map((el) => el.name.fra).join(", ")}
              </Typography>
              <Typography
                variant="h6"
                textTransform="uppercase"
                color={Colors.grey}
              >
                {t("commun.capital")}
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
                {country.continents.map((el) => el.name.fra).join(", ")}
              </Typography>
              <Typography
                variant="h6"
                textTransform="uppercase"
                color={Colors.grey}
              >
                {t("commun.continent")}
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
                  {formatNumber(country.area)}{" "}
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
                {formatNumber(country.population)}
              </Typography>
              <Typography
                variant="h6"
                textTransform="uppercase"
                color={Colors.grey}
              >
                {t("commun.population")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">
                {t("commun.adjacentcountry")} (
                {country.adjacentcountries.length})
              </Typography>
            </Grid>
            {country.adjacentcountries.map((el) =>
              isExplore ? (
                <Grid item xs={4} key={el.id} sx={{ cursor: "pointer" }}>
                  <Link to={`/country/${el.id}`}>
                    <CardCountryAdjacent country={el} />
                  </Link>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={4}
                  key={el.id}
                  sx={{ cursor: "pointer" }}
                  onClick={() => onSelect(el.ccn3)}
                >
                  <CardCountryAdjacent country={el} />
                </Grid>
              )
            )}
          </Grid>
        </Box>
      </Grid>
      {/*<Grid item xs={12}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5664790.450026941!2d2.59110285!3d46.11068855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd54a02933785731%3A0x6bfd3f96c747d9f7!2sFrance!5e0!3m2!1sfr!2sfr!4v1703236345477!5m2!1sfr!2sfr"
          width="600"
          height="450"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </Grid>*/}
    </Grid>
  );
};
