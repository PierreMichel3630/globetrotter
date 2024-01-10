import { Card, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Report } from "src/models/Report";

interface Props {
  report: Report;
}
export const CardReport = ({ report }: Props) => {
  const { t } = useTranslation();
  return (
    <Card sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h6">{report.type}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" sx={{ fontSize: 10 }}>
            {t("commun.createdat", {
              value: moment(report.created_at).format("DD MMMM YYYY"),
            })}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{report.message}</Typography>
        </Grid>
        {report.response && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6">{t("commun.response")} :</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">{report.response}</Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  );
};
