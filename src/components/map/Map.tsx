import { Box } from "@mui/material";
import { percent, viewHeight } from "csx";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Point,
  ZoomableGroup,
} from "react-simple-maps";
import mapJson from "src/assets/map/countries-50m.json";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { CountryVisited } from "src/models/country/Country";
import { Colors } from "src/style/Colors";

interface Position {
  coordinates: Point;
  zoom: number;
}

interface Props {
  countriesVisited: Array<CountryVisited>;
  countriesVisitedFriends: Array<CountryVisited>;
}
export const Map = ({ countriesVisited, countriesVisitedFriends }: Props) => {
  const { countries, travels, travelsFriends, continents } = useApp();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [strokeWidth, setStrokeWidth] = useState(10000);
  const [position, setPosition] = useState<Position>({
    coordinates: [0, 28],
    zoom: 1,
  });
  const [searchParams] = useSearchParams();

  const allTravels = [...travels, ...travelsFriends];
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

  useEffect(() => {
    let newStroke = 10000;
    if (position.zoom >= 5 && position.zoom < 10) {
      newStroke = 5000;
    } else if (position.zoom >= 10 && position.zoom < 20) {
      newStroke = 3000;
    } else if (position.zoom >= 20 && position.zoom < 40) {
      newStroke = 1000;
    } else if (position.zoom >= 40 && position.zoom < 80) {
      newStroke = 200;
    } else if (position.zoom >= 80 && position.zoom < 100) {
      newStroke = 10;
    } else if (position.zoom >= 100) {
      newStroke = 1;
    }
    setStrokeWidth(newStroke);
  }, [position.zoom]);

  const handleGeographyClick = (geography: { id: number }) => {
    const country = countries.find((el) => el.ccn3 === geography.id);
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
  const idCountriesFriends = countriesVisitedFriends.map((el) => el.ccn3);
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
        maxHeight: viewHeight(90),
        overflow: "hidden",
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1500000,
        }}
        style={{
          backgroundColor: Colors.lightgrey,
          height: percent(100),
          width: percent(100),
        }}
        width={8000000}
        height={6000000}
        fill="transparent"
        stroke="white"
        strokeWidth={strokeWidth}
      >
        <ZoomableGroup
          maxZoom={200}
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={mapJson}>
            {({ geographies }) => {
              return geographies.map((geo) => {
                const id = geo.id;
                const isOriginCountry =
                  originCountry && originCountry.ccn3 === id;
                const isVisit = idCountries.includes(id);
                const isVisitFriends = idCountriesFriends.includes(id);
                const isSelect = idCountriesSelect.includes(id);
                let color: string = Colors.grey;
                if (isSelect) {
                  color = Colors.red;
                } else if (isOriginCountry) {
                  color = Colors.blue;
                } else if (isVisit && isVisitFriends) {
                  color = Colors.purple;
                } else if (isVisit) {
                  color = Colors.green;
                } else if (isVisitFriends) {
                  color = Colors.orange;
                }
                return (
                  <Geography
                    onClick={() => handleGeographyClick(geo)}
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        outline: "none",
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
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
