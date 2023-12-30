import { Box, Divider, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Travel } from "src/models/Travel";
import { LabelDiffDate } from "./LabelDiffDate";
import { ListCountries } from "./ListCountries";

interface Props {
  travel: Travel;
}

export const TravelBlock = ({ travel }: Props) => {
  const { t } = useTranslation();

  const momentStart = moment.min(
    travel.countries.map((el) => moment(el.startdate))
  );
  const momentEnd = moment.max(
    travel.countries.map((el) => moment(el.enddate))
  );

  const labelStartDate = momentStart.format("DD MMMM YYYY");
  const labelEndDate = momentEnd.format("DD MMMM YYYY");

  return (
    <Grid container alignItems="flex-end">
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h2">{travel.name}</Typography>
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
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">
                {t("commun.countriesvisited")} ({travel.countries.length})
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ListCountries value={travel.countries} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
