import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { CountryTravel } from "src/models/CountryTravel";
import { sortByStartDateDesc } from "src/utils/sort";
import { LabelDiffDate } from "./LabelDiffDate";
import { JsonLanguageBlock } from "./typography/JsonLanguageBlock";

interface Props {
  value: Array<CountryTravel>;
}
export const ListCountries = ({ value }: Props) => {
  const { countries } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const onClickCountry = (id: number) => {
    const isMap = location.pathname.split("/")[1] === "map";
    navigate(isMap ? `?country=${id}` : `/country/${id}`);
  };
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
              onClick={(event) => {
                event.preventDefault();
                onClickCountry(country.id);
              }}
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
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        component="span"
                      >{`${labelStart} - ${labelEnd} `}</Typography>
                      <LabelDiffDate startdate={start} enddate={end} />
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          )
        );
      })}
    </List>
  );
};
