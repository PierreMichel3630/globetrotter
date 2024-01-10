import { Badge, BottomNavigation, BottomNavigationAction } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS } from "src/models/Friend";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChartIcon from "@mui/icons-material/BarChart";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PeopleIcon from "@mui/icons-material/People";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ExploreIcon from "@mui/icons-material/Explore";
import TranslateIcon from "@mui/icons-material/Translate";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";
import { getBreakpoint } from "src/utils/mediaQuery";
import { Menu } from "src/models/Menu";

export const BottomNavigationBasic = () => {
  const { profile } = useAuth();
  const { travelsFriends, friends } = useApp();
  const { t } = useTranslation();
  const location = useLocation();
  const [menu, setMenu] = useState(location.pathname.split("/").pop()!);
  const [menusDisplay, setMenusDisplay] = useState<Array<Menu>>([]);
  const breakpoint = getBreakpoint();

  const invitations = friends.filter(
    (el) =>
      profile !== null &&
      profile.id === el.user2.id &&
      el.status === FRIENDSTATUS.PROGRESS &&
      moment(profile.last_seen_friend).isBefore(moment(el.created_at))
  );

  const newTravels = travelsFriends.filter(
    (el) =>
      profile !== null &&
      moment(profile.last_seen_travel).isBefore(moment(el.created_at))
  );

  const menus: Array<Menu> = useMemo(
    () => [
      {
        value: "map",
        label: t("commun.map"),
        icon: (
          <Badge badgeContent={newTravels.length} color="error">
            <TravelExploreIcon />
          </Badge>
        ),
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
        icon: (
          <Badge badgeContent={invitations.length} color="error">
            <PeopleIcon />
          </Badge>
        ),
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
    ],
    [invitations.length, newTravels.length, t]
  );

  useEffect(() => {
    setMenu(location.pathname.split("/").pop()!);
  }, [location.pathname]);

  useEffect(() => {
    let max = menus.length;
    switch (breakpoint) {
      case "xs":
        max = 4;
        break;
      case "sm":
        max = 6;
        break;
      case "md":
        max = 8;
        break;
      case "lg":
        max = 10;
        break;
    }
    setMenusDisplay([...menus].splice(0, max));
  }, [breakpoint, menus]);

  return (
    <BottomNavigation
      showLabels
      value={menu}
      onChange={(_, newValue) => {
        setMenu(newValue);
      }}
    >
      {menusDisplay.map((el, index) => (
        <BottomNavigationAction
          value={el.value}
          component={Link}
          label={el.label}
          icon={el.icon}
          to={el.to}
          key={index}
        />
      ))}
      {menusDisplay.length < menus.length && (
        <BottomNavigationAction
          sx={{ minWidth: "inherit", p: 0 }}
          value={"menu"}
          component={Link}
          icon={<MoreVertIcon />}
          to={"/menu"}
        />
      )}
    </BottomNavigation>
  );
};
