import { Box } from "@mui/material";
import { percent } from "csx";
import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Point,
  ZoomableGroup,
} from "react-simple-maps";
import mapJson from "src/assets/map/countries-110m.json";
import { CountryVisited } from "src/models/country/Country";
import { Colors } from "src/style/Colors";

interface Position {
  coordinates: Point;
  zoom: number;
}

interface Props {
  countriesVisited1: Array<CountryVisited>;
  countriesVisited2: Array<CountryVisited>;
}
export const MapCompare = ({ countriesVisited1, countriesVisited2 }: Props) => {
  const [position, setPosition] = useState<Position>({
    coordinates: [0, 28],
    zoom: 1,
  });

  const handleMoveEnd = (position: Position) => {
    setPosition(position);
  };

  const idCountries1 = countriesVisited1.map((el) => el.ccn3);
  const idCountries2 = countriesVisited2.map((el) => el.ccn3);

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
        fill="transparent"
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
                const isVisit1 = idCountries1.includes(geo.id);
                const isVisit2 = idCountries2.includes(geo.id);
                let color: string = Colors.grey;
                if (isVisit1 && isVisit2) {
                  color = Colors.purple;
                } else if (isVisit1) {
                  color = Colors.blue;
                } else if (isVisit2) {
                  color = Colors.red;
                }

                return (
                  <Geography
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
