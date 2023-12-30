import { Card, CardContent, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { Travel } from "src/models/Travel";
import { ListCountries } from "../ListCountries";
import { LabelDiffDate } from "../LabelDiffDate";

interface Props {
  travel: Travel;
}

export const CardTravel = ({ travel }: Props) => {
  const { t } = useTranslation();
  const { selectTravel } = useApp();
  const momentStart = moment.min(
    travel.countries.map((el) => moment(el.startdate))
  );
  const momentEnd = moment.max(
    travel.countries.map((el) => moment(el.enddate))
  );

  const labelStartDate = momentStart.format("DD MMMM YYYY");
  const labelEndDate = momentEnd.format("DD MMMM YYYY");

  return (
    <Card
      variant="elevation"
      elevation={3}
      sx={{ cursor: "pointer" }}
      onClick={() => {
        selectTravel(travel);
      }}
    >
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h4">{travel.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="span">
              {labelStartDate} - {labelEndDate}{" "}
            </Typography>
            {momentStart && momentEnd && (
              <LabelDiffDate startdate={momentStart} enddate={momentEnd} />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" noWrap>
              {t("commun.countriesvisited")} :
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ListCountries value={travel.countries} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
