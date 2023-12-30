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
        label: country.name.fra,
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
      };
    })
    .sort(sortByNumber);

  const timeInTravel = getTime(
    countryMostVisited.reduce((acc, value) => acc + value.number, 0)
  );
  const timeInTravelLabel = `${
    timeInTravel.years > 0
      ? t("commun.year", { count: timeInTravel.years })
      : ""
  } ${
    timeInTravel.month > 0
      ? t("commun.month", {
          count: timeInTravel.month,
        })
      : ""
  } ${
    timeInTravel.day > 0 ? t("commun.day", { count: timeInTravel.day }) : ""
  }`;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CardRecap
          title={t("commun.timeintravel")}
          value={timeInTravelLabel}
          icon={planeIcon}
        />
      </Grid>
      <Grid item xs={12}>
        <CardRecap
          title={t("commun.travels")}
          value={travels.length}
          icon={bagIcon}
        />
      </Grid>
      <Grid item xs={12}>
        <CardRecap
          title={t("commun.countriesvisited")}
          value={countriesVisited.length}
          icon={logoWorld}
        />
      </Grid>
      <Grid item xs={12}>
        <CardRecap
          title={t("commun.continentsvisited")}
          value={continents.length}
          icon={continentIcon}
        />
      </Grid>
      <Grid item xs={12}>
        <CardRecapArray
          title={t("commun.mostvisitedcountries")}
          values={countryMostVisited}
        />
      </Grid>
    </Grid>
  );
};
