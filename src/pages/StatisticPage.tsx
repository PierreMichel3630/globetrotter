import { Box, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { RecapBlock } from "src/components/RecapBlock";
import { CardContinentStat } from "src/components/card/CardContinent";
import { useApp } from "src/context/AppProvider";

export const StatisticPage = () => {
  const { t } = useTranslation();
  const { continents } = useApp();

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.statistic.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <RecapBlock />
        </Grid>
        <Grid item xs={12}>
          <CardContinentStat continent={{ id: 0, name: t("commun.world") }} />
        </Grid>
        {continents.map((continent) => (
          <Grid item xs={12} key={continent.id}>
            <CardContinentStat
              continent={{ id: continent.id, name: continent.name.fra }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
