import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { CountryTravel } from "src/models/CountryTravel";
import { sortByStartDateDesc } from "src/utils/sort";
import { GetLabelDiffDate } from "./LabelDiffDate";

interface Props {
  value: Array<CountryTravel>;
}
export const ListCountries = ({ value }: Props) => {
  const { countries } = useApp();
  return (
    <List dense>
      {value.sort(sortByStartDateDesc).map((el, index) => {
        const country = countries.find((c) => c.id === el.country);
        const start = moment(el.startdate);
        const end = moment(el.enddate);
        const labelStart = start.format("DD MMMM YYYY");
        const labelEnd = end.format("DD MMMM YYYY");
        return (
          country && (
            <ListItem
              key={index}
              disablePadding
              component={Link}
              to={`?country=${country.id}`}
            >
              <ListItemButton>
                {country && (
                  <ListItemIcon>
                    <Avatar alt="flag" src={country.flag} />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={country ? country.name.fra : ""}
                  secondary={`${labelStart} - ${labelEnd} ${GetLabelDiffDate(
                    start,
                    end
                  )}`}
                />
              </ListItemButton>
            </ListItem>
          )
        );
      })}
    </List>
  );
};
