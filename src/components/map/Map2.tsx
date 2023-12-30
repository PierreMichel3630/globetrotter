import { Box } from "@mui/material";
import { percent } from "csx";
import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Point,
  ZoomableGroup,
} from "react-simple-maps";
import mapJson from "src/assets/map/countries-110m.json";
import { useApp } from "src/context/AppProvider";
import { Colors } from "src/style/Colors";

interface Position {
  coordinates: Point;
  zoom: number;
}
export const Map2 = () => {
  const {
    travel,
    country,
    countries,
    continent,
    selectCountry,
    countriesVisited,
  } = useApp();
  const [position, setPosition] = useState<Position>({
    coordinates: [0, 28],
    zoom: 1,
  });

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
    selectCountry(country ?? null);
  };

  const handleMoveEnd = (position: Position) => {
    setPosition(position);
  };
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
                const isVisit = idCountries.includes(geo.id);
                const isSelect = idCountriesSelect.includes(geo.id);
                return (
                  <Geography
                    onClick={() => handleGeographyClick(geo)}
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      isSelect
                        ? Colors.red
                        : isVisit
                        ? Colors.green
                        : Colors.grey
                    }
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
