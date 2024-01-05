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
import { JsonLanguageBlock } from "./typography/JsonLanguageBlock";

interface Props {
  value: Array<CountryTravel>;
}
export const ListCountries = ({ value }: Props) => {
  const { countries } = useApp();
  return (
    <List dense sx={{ p: 0 }}>
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
                  primary={
                    country ? (
                      <JsonLanguageBlock variant="h6" value={country.name} />
                    ) : (
                      ""
                    )
                  }
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
