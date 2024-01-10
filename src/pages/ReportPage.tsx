import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectReports } from "src/api/supabase/report";

import AddIcon from "@mui/icons-material/Add";
import { AddReportModal } from "src/components/modal/AddReportModal";
import { Report } from "src/models/Report";
import { CardReport } from "src/components/card/CardReport";
import { sortByCreatedAt } from "src/utils/sort";

export const ReportPage = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);
  const [reports, setReports] = useState<Array<Report>>([]);

  const getReports = () => {
    selectReports().then((res) => {
      if (res.data) {
        const data = res.data as Array<Report>;
        setReports(data.sort(sortByCreatedAt));
      }
    });
  };

  useEffect(() => {
    getReports();
  }, []);

  const reportsProgress = reports.filter((el) => el.status === "PROGRESS");
  const reportsAbandon = reports.filter((el) => el.status === "ABANDON");
  const reportsCorrected = reports.filter((el) => el.status === "CORRECTED");

  return (
    <Container maxWidth="sm">
      <Box sx={{ p: 1 }}>
        <Helmet>
          <title>{`${t("pages.report.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{t("pages.report.title")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => setOpen(true)}
            >
              {t("commun.addreport")}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider>{t("commun.inprogress")}</Divider>
          </Grid>
          {reportsProgress.map((el) => (
            <Grid item xs={12}>
              <CardReport report={el} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Divider>{t("commun.corrected")}</Divider>
          </Grid>
          {reportsCorrected.map((el) => (
            <Grid item xs={12}>
              <CardReport report={el} />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Divider>{t("commun.abandon")}</Divider>
          </Grid>
          {reportsAbandon.map((el) => (
            <Grid item xs={12}>
              <CardReport report={el} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <AddReportModal
        open={open}
        close={() => {
          setOpen(false);
          getReports();
        }}
      />
    </Container>
  );
};
