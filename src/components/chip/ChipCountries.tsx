import { Grid, Chip, Avatar } from "@mui/material";
import { Country } from "src/models/country/Country";
import { JsonLanguageBlock } from "../typography/JsonLanguageBlock";

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
            label={<JsonLanguageBlock variant="h2" value={el.name} />}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
};
