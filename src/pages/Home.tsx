import {
  BottomNavigation,
  BottomNavigationAction,
  Grid,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AppProvider } from "src/context/AppProvider";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExploreIcon from "@mui/icons-material/Explore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { useAuth } from "src/context/AuthProviderSupabase";

export const Home = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();
  const [menu, setMenu] = useState(location.pathname.split("/").pop()!);
  const menus = [
    {
      value: "map",
      label: t("commun.map"),
      icon: <TravelExploreIcon />,
      to: "/map",
    },
    {
      value: "explore",
      label: t("commun.explore"),
      icon: <ExploreIcon />,
      to: "/explore",
    },
    {
      value: "statistics",
      label: t("commun.statistics"),
      icon: <BarChartIcon />,
      to: "/statistics",
    },
    {
      value: "timeline",
      label: t("commun.timeline"),
      icon: <AccessTimeIcon />,
      to: "/timeline",
    },
  ];

  useEffect(() => {
    setMenu(location.pathname.split("/").pop()!);
  }, [location.pathname]);

  return (
    <AppProvider>
      <Grid container sx={{ mb: 8 }}>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
      </Grid>
      {user !== null ? (
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={menu}
            onChange={(_, newValue) => {
              setMenu(newValue);
            }}
          >
            {menus.map((el, index) => (
              <BottomNavigationAction
                value={el.value}
                component={Link}
                label={el.label}
                icon={el.icon}
                to={el.to}
                key={index}
              />
            ))}
            <BottomNavigationAction
              sx={{ minWidth: "inherit", p: 0 }}
              value={"menu"}
              component={Link}
              icon={<MoreVertIcon />}
              to={"/menu"}
            />
          </BottomNavigation>
        </Paper>
      ) : (
        <></>
      )}
    </AppProvider>
  );
};
