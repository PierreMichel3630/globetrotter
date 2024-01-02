import { Box, Divider, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectTravelsByUserUuid } from "src/api/globetrotter";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Profile } from "src/models/Profile";
import { Travel } from "src/models/Travel";
import { CountryVisited } from "src/models/country/Country";
import { Colors } from "src/style/Colors";
import { LineCompareTable, PropsLineCompare } from "./LineCompareTable";
import { AvatarAccount } from "./avatar/AvatarAccount";
import { MapCompare } from "./map/MapCompare";
import { SelectProfileModal } from "./modal/SelectProfileModal";
import { uniqBy } from "lodash";
import { Continent } from "src/models/country/Continent";
import { sortByName, sortByNumber } from "src/utils/sort";
import { filterIndependent } from "src/utils/filter";
import { CountryTravel } from "src/models/CountryTravel";
import moment from "moment";
import { getTime } from "src/utils/time";
import { CountryMostVisited } from "src/models/country/CountryMostVisited";
import { CardRecapArray } from "./card/CardRecap";
import { getFirstFriend } from "src/api/supabase/friend";
import { Friend } from "src/models/Friend";

export const CompareFriendsBlock = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { continents, countriesVisited, countries } = useApp();

  const [profileIndex, setProfileIndex] = useState<number>(0);

  const [profile1, setProfile1] = useState<Profile | null>(profile);
  const [travels1, setTravels1] = useState<Array<Travel>>([]);
  const [countriesVisited1, setCountriesVisited1] = useState<
    Array<CountryVisited>
  >([]);

  const [profile2, setProfile2] = useState<Profile | null>(profile);
  const [travels2, setTravels2] = useState<Array<Travel>>([]);
  const [countriesVisited2, setCountriesVisited2] = useState<
    Array<CountryVisited>
  >([]);

  const [openSelectProfile, setOpenSelectProfile] = useState(false);

  const color1 = Colors.blue2;
  const color2 = Colors.red;

  useEffect(() => {
    getFriends();
    setProfile1(profile);
  }, [profile]);

  useEffect(() => {
    setCountriesVisited1(countriesVisited);
    setCountriesVisited2(countriesVisited);
  }, [countriesVisited]);

  useEffect(() => {
    if (profile2) getTravels(setTravels2, profile2);
  }, [profile2]);

  useEffect(() => {
    if (profile1) getTravels(setTravels1, profile1);
  }, [profile1]);

  const getFriends = () => {
    if (profile) {
      getFirstFriend().then((res) => {
        if (res.data) {
          const friend = res.data[0] as Friend;
          setProfile2(
            friend.user1.id === profile.id ? friend.user2 : friend.user1
          );
        } else {
          setProfile2(profile);
        }
      });
    }
  };

  const getTravels = (
    set: (travels: Array<Travel>) => void,
    profile: Profile
  ) => {
    selectTravelsByUserUuid(profile.id).then((res) => {
      const travels = res.data as Array<Travel>;
      set(travels);
    });
  };

  const getCountriesVisited = (
    set: (countries: Array<CountryVisited>) => void,
    travels: Array<Travel>
  ) => {
    if (countries.length > 0) {
      const idCountries = uniqBy(
        travels.reduce(
          (acc, travel) => [
            ...acc,
            ...travel.countries.map((el) => el.country),
          ],
          [] as Array<number>
        ),
        (el) => el
      );
      const countriesVisited: Array<CountryVisited> = [];
      idCountries.forEach((id) => {
        const country = countries.find((el) => el.id === id);
        const travelsCountry = travels.filter((travel) =>
          travel.countries.map((el) => el.country).includes(id)
        );
        if (country)
          countriesVisited.push({ ...country, travels: travelsCountry });
      });
      set(countriesVisited);
    }
  };

  useEffect(() => {
    getCountriesVisited(setCountriesVisited1, travels1);
  }, [travels1, countries]);

  useEffect(() => {
    getCountriesVisited(setCountriesVisited2, travels2);
  }, [travels2, countries]);

  const onSelect = (profile: Profile) => {
    if (profileIndex === 0) {
      setProfile1(profile);
    } else {
      setProfile2(profile);
    }
    setOpenSelectProfile(false);
  };

  const getContinents = (countries: Array<CountryVisited>) =>
    uniqBy(
      countries.reduce(
        (acc, value) => [...acc, ...value.continents],
        [] as Array<Continent>
      ),
      (el) => el.id
    ).length;

  const getCountryMostVisited = (countries: Array<CountryVisited>) =>
    countries
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
          to: `/country/${country.id}`,
        } as CountryMostVisited;
      })
      .sort(sortByNumber);

  const getTimeInTravel = (countryMostVisited: Array<CountryMostVisited>) =>
    countryMostVisited.reduce((acc, value) => acc + value.number, 0);

  const countryMostVisited1 = getCountryMostVisited(countriesVisited1);
  const timeInTravel1 = moment
    .duration(getTimeInTravel(countryMostVisited1), "milliseconds")
    .asDays();

  const countryMostVisited2 = getCountryMostVisited(countriesVisited2);
  const timeInTravel2 = moment
    .duration(getTimeInTravel(countryMostVisited2), "milliseconds")
    .asDays();

  const datas: Array<PropsLineCompare> = [
    {
      label: t("commun.travels"),
      values: [
        { value: travels1.length, color: color1 },
        { value: travels2.length, color: color2 },
      ],
      isPercent: false,
    },
    {
      label: t("commun.timeintravelday"),
      values: [
        {
          value: timeInTravel1,
          color: color1,
        },
        {
          value: timeInTravel2,
          color: color2,
        },
      ],
      isPercent: false,
    },
    {
      label: t("commun.countriesvisited"),
      values: [
        { value: countriesVisited1.length, color: color1 },
        { value: countriesVisited2.length, color: color2 },
      ],
      isPercent: false,
    },
    {
      label: t("commun.continentsvisited"),
      values: [
        { value: getContinents(countriesVisited1), color: color1 },
        { value: getContinents(countriesVisited2), color: color2 },
      ],
      isPercent: false,
    },
    ...continents.sort(sortByName).map((continent) => {
      const countriesContinent = countries
        .filter((el) => {
          const idContinents = el.continents.map((continent) => continent.id);
          return continent.id !== 0
            ? idContinents.includes(continent.id)
            : true;
        })
        .filter(filterIndependent);
      const countriesContinentVisited1 = countriesContinent.filter(
        (country) => {
          const idVisited = countriesVisited1.map((el) => el.id);
          return idVisited.includes(country.id);
        }
      );
      const countriesContinentVisited2 = countriesContinent.filter(
        (country) => {
          const idVisited = countriesVisited2.map((el) => el.id);
          return idVisited.includes(country.id);
        }
      );
      return {
        label: continent.name.fra,
        values: [
          { value: countriesContinentVisited1.length, color: color1 },
          { value: countriesContinentVisited2.length, color: color2 },
        ],
        isPercent: false,
      } as PropsLineCompare;
    }),
  ];

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={2}>
            {profile1 && (
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setProfileIndex(0);
                  setOpenSelectProfile(true);
                }}
              >
                <AvatarAccount
                  avatar={profile1.avatar}
                  size={40}
                  style={{ border: `3px solid ${color1}` }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: percent(80),
                    color: color1,
                  }}
                >
                  {profile1.username}
                </Typography>
              </Grid>
            )}
            {profile2 && (
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setProfileIndex(1);
                  setOpenSelectProfile(true);
                }}
              >
                <AvatarAccount
                  avatar={profile2.avatar}
                  size={40}
                  style={{ border: `3px solid ${color2}` }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: percent(80),
                    color: color2,
                  }}
                >
                  {profile2.username}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <MapCompare
          countriesVisited1={countriesVisited1}
          countriesVisited2={countriesVisited2}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {datas.map((el, index) => (
              <Grid item xs={12} key={index}>
                <LineCompareTable
                  values={el.values}
                  label={el.label}
                  isPercent={el.isPercent}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography variant="h4">
                {t("commun.mostvisitedcountries")}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CardRecapArray values={countryMostVisited1} isPosition={false} />
            </Grid>
            <Grid item xs={6}>
              <CardRecapArray values={countryMostVisited2} isPosition={false} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <SelectProfileModal
        open={openSelectProfile}
        close={() => setOpenSelectProfile(false)}
        onValid={onSelect}
      />
    </Grid>
  );
};
