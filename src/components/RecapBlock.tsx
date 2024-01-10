import { Grid } from "@mui/material";
import { uniqBy } from "lodash";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { CountryTravel } from "src/models/CountryTravel";
import { Continent } from "src/models/country/Continent";
import { CardRecap, CardRecapArray } from "./card/CardRecap";
import { sortByNumber } from "src/utils/sort";
import { getTime } from "src/utils/time";

import logoWorld from "src/assets/logo.png";
import planeIcon from "src/assets/avion.png";
import continentIcon from "src/assets/continent.png";
import bagIcon from "src/assets/bag.png";
import { JsonLanguageBlock } from "./typography/JsonLanguageBlock";

export const RecapBlock = () => {
  const { t } = useTranslation();
  const { travels, countriesVisited } = useApp();

  const continents = uniqBy(
    countriesVisited.reduce(
      (acc, value) => [...acc, ...value.continents],
      [] as Array<Continent>
    ),
    (el) => el.id
  );

  const countryMostVisited = countriesVisited
    .map((country) => {
      const time = country.travels
        .reduce((acc, value) => {
          return [
            ...acc,
            ...value.countries.filter((el) => el.country === country.id),
          ];
        }, [] as Array<CountryTravel>)
        .reduce((acc, value) => {
          const start = moment(value.startdate);
          const end = moment(value.enddate);
          return acc + end.add(1, "day").diff(start);
        }, 0);
      const timeLabel = getTime(time);
      return {
        icon: country.flag,
        label: <JsonLanguageBlock variant="h6" value={country.name} />,
        value: `${
          timeLabel.years > 0
            ? t("commun.year", { count: timeLabel.years })
            : ""
        } ${
          timeLabel.month > 0
            ? t("commun.month", {
                count: timeLabel.month,
              })
            : ""
        } ${
          timeLabel.day > 0 ? t("commun.day", { count: timeLabel.day }) : ""
        }`,
        number: time,
        to: `/country/${country.id}`,
      };
    })
    .sort(sortByNumber);

  const timeInTravel = countryMostVisited.reduce(
    (acc, value) => acc + value.number,
    0
  );

  const timeInTravelMoment = getTime(timeInTravel);

  const timeInTravelLabel =
    timeInTravel === 0
      ? `0 ${t("commun.day")}`
      : `${
          timeInTravelMoment.years > 0
            ? t("commun.year", { count: timeInTravelMoment.years })
            : ""
        } ${
          timeInTravelMoment.month > 0
            ? t("commun.month", {
                count: timeInTravelMoment.month,
              })
            : ""
        } ${
          timeInTravelMoment.day > 0
            ? t("commun.day", { count: timeInTravelMoment.day })
            : ""
        }`;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <CardRecap
          title={t("commun.timeintravel")}
          value={timeInTravelLabel}
          icon={planeIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CardRecap
          title={t("commun.travels")}
          value={travels.length}
          icon={bagIcon}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CardRecap
          title={t("commun.countriesvisited")}
          value={countriesVisited.length}
          icon={logoWorld}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <CardRecap
          title={t("commun.continentsvisited")}
          value={continents.length}
          icon={continentIcon}
        />
      </Grid>
      {countryMostVisited.length > 0 && (
        <Grid item xs={12}>
          <CardRecapArray
            title={t("commun.mostvisitedcountries")}
            values={countryMostVisited}
          />
        </Grid>
      )}
    </Grid>
  );
};
