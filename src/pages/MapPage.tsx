import { Badge, Box, Chip, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Map } from "src/components/map/Map";

import { CountryBlock } from "src/components/CountryBlock";

import { px } from "csx";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateProfil } from "src/api/supabase/profile";
import { ContinentBlock } from "src/components/ContinentBlock";
import { DefaultBlock } from "src/components/DefaultBlock";
import { AutocompleteInput } from "src/components/Input";
import { SearchResult } from "src/components/SearchResultBlock";
import { TravelBlock } from "src/components/TravelBlock";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { Profile, ProfileUpdate } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { getBreakpoint } from "src/utils/mediaQuery";
import { getScoreSearch, searchString } from "src/utils/string";

export const MapPage = () => {
  const { t } = useTranslation();
  const { profile, setProfile } = useAuth();
  const navigate = useNavigate();
  const {
    travelsFriends,
    travels,
    continents,
    countries,
    countriesVisited,
    countriesVisitedFriends,
    countriesVisitedAll,
  } = useApp();
  const { language } = useUser();

  const [filter, setFilter] = useState({
    friends: false,
  });
  const [inputValue, setInputValue] = useState("");
  const [searchParams] = useSearchParams();
  const [resultsSearch, setResultsSearch] = useState<Array<SearchResult>>([]);
  const breakpoint = getBreakpoint();
  const isLarge = breakpoint === "lg" || breakpoint === "xl";

  const allTravels = useMemo(
    () => [...travelsFriends, ...travels],
    [travelsFriends, travels]
  );

  const travel = searchParams.has("travel")
    ? allTravels.find((el) => el.id === Number(searchParams.get("travel")))
    : undefined;

  const country = searchParams.has("country")
    ? countries.find((el) => el.id === Number(searchParams.get("country")))
    : undefined;

  const continent = searchParams.has("continent")
    ? continents.find((el) => el.id === Number(searchParams.get("continent")))
    : undefined;

  useEffect(() => {
    const label = country
      ? country.name[language.iso]
      : continent
      ? continent.name[language.iso]
      : travel
      ? travel.name
      : "";
    setInputValue(label);
  }, [country, continent, travel, language]);

  useEffect(() => {
    const getResult = () => {
      if (inputValue !== "") {
        const countriesFilter = countries
          .filter((el) => searchString(inputValue, el.name[language.iso]))
          .map(
            (el) =>
              ({
                type: "country",
                value: el,
                score: getScoreSearch(inputValue, el.name[language.iso]),
              } as SearchResult)
          );
        const continentFilter = continents
          .filter((el) => searchString(inputValue, el.name[language.iso]))
          .map(
            (el) =>
              ({
                type: "continent",
                value: el,
                score: getScoreSearch(inputValue, el.name[language.iso]),
              } as SearchResult)
          );
        const travelsSearch = filter.friends ? allTravels : travels;
        const travelFilter = travelsSearch
          .filter((el) => searchString(inputValue, el.name))
          .map(
            (el) =>
              ({
                type: "travel",
                value: el,
                score: getScoreSearch(inputValue, el.name),
              } as SearchResult)
          );
        setResultsSearch([
          ...countriesFilter,
          ...continentFilter,
          ...travelFilter,
        ]);
      } else {
        setResultsSearch([]);
      }
    };
    getResult();
  }, [
    countries,
    travels,
    continents,
    inputValue,
    filter,
    language,
    allTravels,
  ]);

  const newTravels = travelsFriends.filter(
    (el) =>
      profile !== null &&
      moment(profile.last_seen_travel).isBefore(moment(el.created_at))
  );

  const refreshSeen = async () => {
    if (profile !== null) {
      const newProfil: ProfileUpdate = {
        id: profile.id,
        last_seen_travel: moment().toDate(),
      };
      const { data } = await updateProfil(newProfil);
      if (data) setProfile(data as Profile);
    }
  };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.map.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12} lg={8}>
        <Map
          countriesVisited={countriesVisited}
          countriesVisitedFriends={
            filter.friends ? countriesVisitedFriends : []
          }
        />
      </Grid>
      <Grid item xs={12} lg={4}>
        <Grid
          container
          justifyContent="center"
          sx={{
            maxHeight: isLarge ? "calc(100vh - 60px)" : "fit-content",
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
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
            <AutocompleteInput
              isSelect={
                country !== undefined ||
                continent !== undefined ||
                travel !== undefined
              }
              placeholder={t("commun.search")}
              value={inputValue}
              onChange={setInputValue}
              results={resultsSearch}
              clear={() => {
                setInputValue("");
                navigate("/map");
              }}
            />
          </Grid>
          {!(country || continent || travel) && (
            <Grid item xs={12}>
              <Box sx={{ pl: 1, pr: 1, pt: px(10) }}>
                <Grid container spacing={1}>
                  <Grid item>
                    <Chip
                      size="small"
                      label={t("commun.onlyme")}
                      sx={{ cursor: "pointer" }}
                      color={filter.friends ? "default" : "primary"}
                      onClick={() =>
                        setFilter((prev) => ({ ...prev, friends: false }))
                      }
                    />
                  </Grid>
                  <Grid item>
                    <Badge badgeContent={newTravels.length} color="error">
                      <Chip
                        size="small"
                        label={t("commun.meandfriends")}
                        sx={{ cursor: "pointer" }}
                        color={filter.friends ? "primary" : "default"}
                        onClick={() => {
                          setFilter((prev) => ({ ...prev, friends: true }));
                          refreshSeen();
                        }}
                      />
                    </Badge>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
          {country ? (
            <Grid item xs={12}>
              <CountryBlock
                country={country}
                isExplore={false}
                isFriends={filter.friends}
              />
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
              <DefaultBlock
                travels={filter.friends ? allTravels : travels}
                countriesVisited={
                  filter.friends ? countriesVisitedAll : countriesVisited
                }
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
