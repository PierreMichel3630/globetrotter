import { Alert, Box, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { CountryTravel } from "src/models/CountryTravel";
import { Country } from "src/models/country/Country";
import { Colors } from "src/style/Colors";
import { sortByName } from "src/utils/sort";
import { formatNumber } from "src/utils/string";
import { Carrousel } from "./Carrousel";
import { LabelDiffArrayDate } from "./LabelDiffDate";
import { CardCountryAdjacent } from "./card/CardCountry";
import { CardTravel } from "./card/CardTravel";
import {
  JsonLanguageArrayBlock,
  JsonLanguageBlock,
} from "./typography/JsonLanguageBlock";
import { useUser } from "src/context/UserProvider";

interface Props {
  isExplore?: boolean;
  country: Country;
}

export const CountryBlock = ({ country, isExplore = true }: Props) => {
  const { t } = useTranslation();
  const { travels } = useApp();
  const { language } = useUser();

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
              <JsonLanguageBlock variant="h2" value={country.name} />
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
            {country.description[language.iso] && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h4">{t("commun.inshort")}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <JsonLanguageBlock
                    variant="body1"
                    value={country.description}
                  />
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
                justifyContent: "flex-end",
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
                justifyContent: "flex-end",
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
                justifyContent: "flex-end",
              }}
            >
              <JsonLanguageArrayBlock
                variant="h4"
                value={country.capitals.map((el) => el.name)}
              />
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
                justifyContent: "flex-end",
              }}
            >
              <JsonLanguageArrayBlock
                variant="h4"
                value={country.continents.map((el) => el.name)}
              />
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
                justifyContent: "flex-end",
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
                justifyContent: "flex-end",
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
              <Typography variant="h4" component="span">
                {t("commun.speaklanguages")} :{" "}
              </Typography>
              <JsonLanguageArrayBlock
                variant="body1"
                component="span"
                value={country.languages.map((el) => el.name)}
              />
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
            {country.adjacentcountries
              .sort((a, b) => sortByName(language, a, b))
              .map((el) => (
                <Grid item xs={6} key={el.id} sx={{ cursor: "pointer" }}>
                  <Link
                    to={isExplore ? `/country/${el.id}` : `?country=${el.id}`}
                  >
                    <CardCountryAdjacent country={el} />
                  </Link>
                </Grid>
              ))}
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
