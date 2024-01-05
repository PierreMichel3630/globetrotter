import { Grid, Paper, Typography } from "@mui/material";
import { useApp } from "src/context/AppProvider";

import { percent } from "csx";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Colors } from "src/style/Colors";
import { filterIndependent } from "src/utils/filter";

import africaJson from "src/assets/map/continent/africa.topo.json";
import asiaJson from "src/assets/map/continent/asia.topo.json";
import europeJson from "src/assets/map/continent/europe.topo.json";
import northAmericaJson from "src/assets/map/continent/north-america.topo.json";
import oceaniaJson from "src/assets/map/continent/oceania.topo.json";
import southAmericaJson from "src/assets/map/continent/southAmericaLow.json";
import worldJson from "src/assets/map/countries-110m.json";
import { JsonLanguage } from "src/models/Language";
import { JsonLanguageBlock } from "../typography/JsonLanguageBlock";

interface PropsStat {
  continent: { id: number; name: string | JsonLanguage };
}

export const CardContinentStat = ({ continent }: PropsStat) => {
  const { countries, countriesVisited } = useApp();

  const continentMap = [
    {
      id: 0,
      map: worldJson,
      width: 1000,
      height: 800,
      viewBox: "150 80 700 450",
    },
    {
      id: 1,
      map: europeJson,
      width: 200,
      height: 400,
      viewBox: "50 0 180 130",
    },
    {
      id: 2,
      map: africaJson,
      width: 200,
      height: 150,
      viewBox: "35 0 200 150",
    },
    { id: 3, map: asiaJson, width: 300, height: 600, viewBox: "180 0 350 330" },
    {
      id: 4,
      map: northAmericaJson,
      width: 700,
      height: 650,
      viewBox: "0 0 330 320",
    },
    {
      id: 5,
      map: southAmericaJson,
      width: 300,
      height: 50,
      viewBox: "-70 0 200 160",
    },
    {
      id: 6,
      map: oceaniaJson,
      width: 600,
      height: 150,
      viewBox: "470 50 180 130",
    },
  ];

  const countriesContinent = countries
    .filter((el) => {
      const idContinents = el.continents.map((continent) => continent.id);
      return continent.id !== 0 ? idContinents.includes(continent.id) : true;
    })
    .filter(filterIndependent);

  const countriesContinentVisited = countriesContinent.filter((country) => {
    const idVisited = countriesVisited.map((el) => el.id);
    return idVisited.includes(country.id);
  });

  const percentVisited = (
    (countriesContinentVisited.length / countriesContinent.length) *
    100
  ).toFixed(1);

  const codeCountryVisited = countriesContinentVisited.map((el) => el.cca2);
  const idCountries = countriesVisited.map((el) => el.ccn3);
  const map = continentMap.find((el) => el.id === continent.id);

  return (
    <Paper sx={{ p: 1 }} elevation={3}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {typeof continent.name === "string" ? (
            <Typography variant="h6">{continent.name}</Typography>
          ) : (
            <JsonLanguageBlock variant="h6" value={continent.name} />
          )}
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs={4} sx={{ height: percent(100) }}>
              <Grid container spacing={2}>
                <Grid item>
                  <Typography variant="h2" component="span">
                    {percentVisited}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {" "}
                    %
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h2" component="span">
                    {countriesContinentVisited.length}
                  </Typography>
                  <Typography variant="body1" component="span">
                    / {countriesContinent.length}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {map && (
              <Grid item xs={8}>
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 110,
                  }}
                  style={{
                    height: percent(100),
                    width: percent(100),
                  }}
                  width={map.width}
                  height={map.height}
                  viewBox={map.viewBox}
                  fill="black"
                  stroke="white"
                  strokeWidth={1}
                >
                  <Geographies geography={map.map}>
                    {({ geographies }) => {
                      return geographies.map((geo) => {
                        const isVisit =
                          continent.id === 0
                            ? idCountries.includes(geo.id)
                            : codeCountryVisited.includes(geo.id);
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={isVisit ? Colors.green : Colors.grey}
                          />
                        );
                      });
                    }}
                  </Geographies>
                </ComposableMap>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
