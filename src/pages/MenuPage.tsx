import {
  Button,
  Container,
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
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { AvatarAccount } from "src/components/avatar/AvatarAccount";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ExploreIcon from "@mui/icons-material/Explore";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import TranslateIcon from "@mui/icons-material/Translate";
import PublicIcon from "@mui/icons-material/Public";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Menu } from "src/models/Menu";

export const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, profile, logout } = useAuth();

  const menus: Array<Menu> = [
    {
      value: "map",
      label: t("commun.map"),
      icon: <TravelExploreIcon />,
      to: "/map",
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
      value: "explore",
      label: t("commun.explore"),
      icon: <ExploreIcon />,
      to: "/explore",
    },
    {
      value: "compare",
      label: t("commun.compare"),
      icon: <CompareArrowsIcon />,
      to: "/compare",
    },
    {
      value: "origincountry",
      label: t("commun.origincountry"),
      icon: <PublicIcon />,
      to: "/origincountry",
    },
    {
      value: "language",
      label: t("commun.languages"),
      icon: <TranslateIcon />,
      to: "/language",
    },
    {
      value: "setting",
      label: t("commun.settings"),
      icon: <SettingsIcon />,
      to: "/setting",
    },
    {
      value: "report",
      label: t("commun.report"),
      icon: <ReportProblemIcon />,
      to: "/report",
    },
  ];

  const disconnect = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Grid
        container
        spacing={1}
        justifyContent="center"
        sx={{ textAlign: "center", mt: 1 }}
      >
        <Helmet>
          <title>{`${t("pages.menu.title")} - ${t("appname")}`}</title>
        </Helmet>
        {user && profile && (
          <>
            <Grid item>
              <AvatarAccount avatar={profile.avatar} size={90} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h1" sx={{ wordWrap: "break-word" }}>
                {`${profile.firstname} ${profile.lastname}`}
              </Typography>
              <Typography
                variant="body2"
                sx={{ wordWrap: "break-word", color: Colors.grey }}
              >
                {user.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
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
          </>
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
    </Container>
  );
};
