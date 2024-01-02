import { Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CompareFriendsBlock } from "src/components/CompareFriendsBlock";

export const ComparePage = () => {
  const { t } = useTranslation();
  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.compare.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <CompareFriendsBlock />
      </Grid>
    </Grid>
  );
};
