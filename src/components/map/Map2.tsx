import { Box } from "@mui/material";
import { percent } from "csx";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Point,
  ZoomableGroup,
} from "react-simple-maps";
import mapJson from "src/assets/map/countries-110m.json";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

interface Position {
  coordinates: Point;
  zoom: number;
}
export const Map2 = () => {
  const { countries, travels, continents, countriesVisited } = useApp();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [position, setPosition] = useState<Position>({
    coordinates: [0, 28],
    zoom: 1,
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const travel = searchParams.has("travel")
    ? travels.find((el) => el.id === Number(searchParams.get("travel")))
    : undefined;

  const country = searchParams.has("country")
    ? countries.find((el) => el.id === Number(searchParams.get("country")))
    : undefined;

  const continent = searchParams.has("continent")
    ? continents.find((el) => el.id === Number(searchParams.get("continent")))
    : undefined;

  useEffect(() => {
    if (continent) {
      setPosition({
        coordinates: continent.position,
        zoom: continent.zoom,
      });
    } else if (country) {
      const centroid: [number, number] = [
        country.position[1],
        country.position[0],
      ];
      const zoom = 4;
      setPosition({ coordinates: centroid, zoom: zoom });
    } else if (travel) {
      // TO IMPLEMENT
    } else {
      setPosition({
        coordinates: [0, 28],
        zoom: 1,
      });
    }
  }, [travel, country, continent]);

  const handleGeographyClick = (geography: { id: number }) => {
    const country = countries.find((el) => el.ccn3 === geography.id);
    //  const centroid = projection.invert(path.centroid(geography));
    if (country) navigate(`?country=${country.id}`);
  };

  const handleMoveEnd = (position: Position) => {
    setPosition(position);
  };
  const originCountry =
    profile && profile.country
      ? countries.find((el) => el.id === profile.country)
      : undefined;
  const idCountries = countriesVisited.map((el) => el.ccn3);
  let idCountriesSelect: Array<number> = [];
  if (travel) {
    const ids = travel.countries.map((el) => el.country);
    idCountriesSelect = countries
      .filter((el) => ids.includes(el.id))
      .map((el) => el.ccn3);
  } else if (country) {
    idCountriesSelect = [country.ccn3];
  }

  return (
    <Box
      sx={{
        width: percent(100),
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 128,
        }}
        style={{
          backgroundColor: Colors.lightgrey,
          height: percent(100),
          width: percent(100),
        }}
        fill="black"
        stroke="white"
        strokeWidth={1}
      >
        <ZoomableGroup
          maxZoom={40}
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={mapJson}>
            {({ geographies }) => {
              return geographies.map((geo) => {
                const isOriginCountry =
                  originCountry && originCountry.ccn3 === geo.id;
                const isVisit = idCountries.includes(geo.id);
                const isSelect = idCountriesSelect.includes(geo.id);
                let color: string = Colors.grey;
                if (isSelect) {
                  color = Colors.red;
                } else if (isOriginCountry) {
                  color = Colors.blue;
                } else if (isVisit) {
                  color = Colors.green;
                }

                return (
                  <Geography
                    onClick={() => handleGeographyClick(geo)}
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </Box>
  );
};
