import { Grid, Chip, Avatar } from "@mui/material";
import { Country } from "src/models/country/Country";

interface Props {
  countries: Array<Country>;
  onDelete: (id: number) => void;
}

export const ChipCountries = ({ countries, onDelete }: Props) => {
  return (
    <Grid container spacing={1}>
      {countries.map((el) => (
        <Grid item key={el.id}>
          <Chip
            avatar={<Avatar alt="flag" src={el.flag} />}
            label={el.name.fra}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
};
