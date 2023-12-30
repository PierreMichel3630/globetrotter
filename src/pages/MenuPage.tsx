import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { px } from "csx";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { AvatarAccount } from "src/components/avatar/AvatarAccount";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExploreIcon from "@mui/icons-material/Explore";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, profile, logout } = useAuth();

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
    {
      value: "friends",
      label: t("commun.friends"),
      icon: <PeopleIcon />,
      to: "/friends",
    },
    {
      value: "setting",
      label: t("commun.settings"),
      icon: <SettingsIcon />,
      to: "/setting",
    },
  ];

  const disconnect = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.menu.title")} - ${t("appname")}`}</title>
      </Helmet>
      {user && profile && (
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexDirection: "column",
            p: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <AvatarAccount avatar={profile.avatar} size={70} />
            <Box>
              <Typography variant="h1">{profile.username}</Typography>
              <Typography variant="body2" sx={{ color: Colors.grey }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: px(50),
              color: Colors.grey,
              borderColor: Colors.grey,
              backgroundColor: Colors.white,
            }}
            onClick={disconnect}
          >
            {t("commun.logout")}
          </Button>
        </Grid>
      )}
      <Grid item xs={12}>
        <List>
          <Divider />
          {menus.map((menu, index) => (
            <Fragment key={index}>
              <ListItem
                disablePadding
                component={Link}
                to={menu.to}
                sx={{ backgroundColor: Colors.white }}
              >
                <ListItemButton>
                  <ListItemIcon>{menu.icon}</ListItemIcon>
                  <ListItemText primary={menu.label} />
                </ListItemButton>
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};
