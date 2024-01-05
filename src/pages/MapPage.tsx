import { Box, Chip, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Map } from "src/components/map/Map";

import { CountryBlock } from "src/components/CountryBlock";

import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ContinentBlock } from "src/components/ContinentBlock";
import { DefaultBlock } from "src/components/DefaultBlock";
import { AutocompleteInput } from "src/components/Input";
import { SearchResult } from "src/components/SearchResultBlock";
import { TravelBlock } from "src/components/TravelBlock";
import { useApp } from "src/context/AppProvider";
import { Colors } from "src/style/Colors";
import { getScoreSearch, searchString } from "src/utils/string";
import { useUser } from "src/context/UserProvider";

export const MapPage = () => {
  const { t } = useTranslation();
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

  const allTravels = [...travelsFriends, ...travels];

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
  }, [country, continent, travel]);

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
        const travelFilter = travels
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
  }, [countries, travels, continents, inputValue]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.map.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Map
          countriesVisited={countriesVisited}
          countriesVisitedFriends={
            filter.friends ? countriesVisitedFriends : []
          }
        />
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
              <Box sx={{ pl: 1, pr: 1 }}>
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
                    <Chip
                      size="small"
                      label={t("commun.meandfriends")}
                      sx={{ cursor: "pointer" }}
                      color={filter.friends ? "primary" : "default"}
                      onClick={() =>
                        setFilter((prev) => ({ ...prev, friends: true }))
                      }
                    />
                  </Grid>
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
