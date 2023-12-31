import { Box, Button, Grid, Paper, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { CardCountryVisited } from "./card/CardCountry";
import { CardTravel } from "./card/CardTravel";
import { CreateTravelModal } from "./modal/CreateTravelModal";

import FlightIcon from "@mui/icons-material/Flight";
import { sortByName, sortTravelByDate } from "src/utils/sort";

export const DefaultBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { travels, countriesVisited } = useApp();
  const navigate = useNavigate();

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
            >
              {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
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
            {[...countriesVisited].sort(sortByName).map((country) => (
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
