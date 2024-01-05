import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { CountryBlock } from "src/components/CountryBlock";
import { GoBackButton } from "src/components/navigation/GoBackButton";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Country } from "src/models/country/Country";

export const CountryPage = () => {
  const { t } = useTranslation();
  const { countries } = useApp();
  const { id } = useParams();
  const { language } = useUser();

  const [country, setCountry] = useState<Country | undefined>(undefined);

  useEffect(() => {
    if (id) {
      setCountry(countries.find((el) => el.id === Number(id)));
    }
  }, [id, countries]);

  return (
    <Grid container alignItems="flex-end">
      <Helmet>
        <title>
          {country && country.name[language.iso]
            ? `${country.name[language.iso]} - ${t("appname")}`
            : `${t("appname")}`}
        </title>
      </Helmet>
      <Grid item xs={12}>
        <GoBackButton />
      </Grid>
      {country && <CountryBlock country={country} isExplore />}
    </Grid>
  );
};
