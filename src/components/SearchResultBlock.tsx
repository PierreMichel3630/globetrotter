import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useNavigate } from "react-router-dom";
import bagIcon from "src/assets/bag.png";
import logoWorld from "src/assets/logo.png";
import { Travel } from "src/models/Travel";
import { Continent } from "src/models/country/Continent";
import { Country } from "src/models/country/Country";
import { sortByScore } from "src/utils/sort";

export interface SearchResult {
  type: "continent" | "country" | "travel";
  value: Country | Continent | Travel;
  score: number;
}

interface Props {
  results: Array<SearchResult>;
  onSelect: () => void;
}

export const SearchResultBlock = ({ results, onSelect }: Props) => {
  const navigate = useNavigate();
  return (
    <Paper sx={{ p: 1, mt: 1, position: "absolute", width: percent(100) }}>
      <Grid container spacing={0.5}>
        {[...results]
          .sort(sortByScore)
          .splice(0, 10)
          .map((el, index) => (
            <Grid
              item
              xs={12}
              key={index}
              onClick={() => {
                onSelect();
                navigate(`?${el.type}=${el.value.id}`);
              }}
            >
              {
                {
                  continent: <BlockContinent value={el.value as Continent} />,
                  country: <BlockCountry value={el.value as Country} />,
                  travel: <BlockTravel value={el.value as Travel} />,
                }[el.type]
              }
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
};

interface PropsBlockCountry {
  value: Country;
}
const BlockCountry = ({ value }: PropsBlockCountry) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Avatar
        alt="flag"
        src={value.flag}
        sx={{ width: px(25), height: px(25) }}
      />
      <Typography variant="h6">{value.name.fra}</Typography>
    </Box>
  );
};

interface PropsBlockContinent {
  value: Continent;
}
const BlockContinent = ({ value }: PropsBlockContinent) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Avatar
        alt="logo"
        src={logoWorld}
        sx={{ width: px(25), height: px(25) }}
      />
      <Typography variant="h6">{value.name.fra}</Typography>
    </Box>
  );
};

interface PropsBlockTravel {
  value: Travel;
}
const BlockTravel = ({ value }: PropsBlockTravel) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <Avatar alt="logo" src={bagIcon} sx={{ width: px(25), height: px(25) }} />
      <Typography variant="h6">{value.name}</Typography>
    </Box>
  );
};
