import { Box, Button, Grid, Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "src/context/AuthProviderSupabase";
import { CardCountryVisited } from "./card/CardCountry";
import { CardTravel } from "./card/CardTravel";
import { CreateTravelModal } from "./modal/CreateTravelModal";

import FlightIcon from "@mui/icons-material/Flight";
import { px } from "csx";
import { Travel } from "src/models/Travel";
import { CountryVisited } from "src/models/country/Country";
import { sortByName, sortTravelByDate } from "src/utils/sort";
import { useUser } from "src/context/UserProvider";

interface Props {
  countriesVisited: Array<CountryVisited>;
  travels: Array<Travel>;
}
export const DefaultBlock = ({ countriesVisited, travels }: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useUser();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const tabs = [
    { label: `${t("commun.travels")} (${travels.length})` },
    {
      label: `${t("commun.countriesvisited")} (${countriesVisited.length})`,
    },
  ];

  const addTravel = () => {
    if (user) {
      setOpen(true);
    } else {
      navigate("/login");
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            size="small"
            startIcon={<FlightIcon />}
            fullWidth
            onClick={addTravel}
          >
            {t("commun.addtravel")}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Tabs
              value={tab}
              onChange={(_: React.SyntheticEvent, newValue: number) =>
                setTab(newValue)
              }
              variant="fullWidth"
              sx={{ minHeight: "auto" }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  sx={{ pt: px(10), pb: px(10), minHeight: "auto" }}
                />
              ))}
            </Tabs>
          </Paper>
        </Grid>
        {tab === 0 ? (
          <>
            {[...travels].sort(sortTravelByDate).map((travel) => (
              <Grid item xs={12} key={travel.id}>
                <CardTravel travel={travel} />
              </Grid>
            ))}
          </>
        ) : (
          <>
            {[...countriesVisited]
              .sort((a, b) => sortByName(language, a, b))
              .map((country) => (
                <Grid item xs={12} key={country.id}>
                  <CardCountryVisited country={country} />
                </Grid>
              ))}
          </>
        )}
        <CreateTravelModal open={open} close={onClose} />
      </Grid>
    </Box>
  );
};
