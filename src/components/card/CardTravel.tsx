import { Card, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Travel } from "src/models/Travel";
import { LabelDiffDate } from "../LabelDiffDate";
import { ListCountries } from "../ListCountries";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Props {
  travel: Travel;
}

export const CardTravel = ({ travel }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const momentStart = moment.min(
    travel.countries.map((el) => moment(el.startdate))
  );
  const momentEnd = moment.max(
    travel.countries.map((el) => moment(el.enddate))
  );

  const labelStartDate = momentStart.format("DD MMMM YYYY");
  const labelEndDate = momentEnd.format("DD MMMM YYYY");

  return (
    <Link to={`?travel=${travel.id}`}>
      <Card variant="elevation" elevation={3} sx={{ cursor: "pointer", p: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h4" component="span">
              {travel.name}
            </Typography>
            {user && user.id !== travel.useruuid.id && (
              <Typography variant="body1" component="span">
                {` (${travel.useruuid.username})`}
              </Typography>
            )}
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
            <ListCountries value={travel.countries} />
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};
