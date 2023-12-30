import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { px } from "csx";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";
import { AccountMenu } from "./AccountMenu";
import { LanguagesMenu } from "./LanguageMenu";
import { ModeMenu } from "./ModeMenu";
import { NotificationsMenu } from "./NotificationsMenu";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "src/assets/logo.png";
import { AppsMenu } from "./AppsMenu";

export const Header = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" sx={{ boxShadow: "none" }}>
        <Toolbar id="toolbar">
          <Link to="/" style={{ display: "flex", gap: px(10) }}>
            <img src={logo} width={30} height={30} />
            <Typography
              variant="h2"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              GlobeTrotter
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <ModeMenu />
            <LanguagesMenu />
            <AppsMenu />
            {user && <NotificationsMenu />}
            {user ? (
              <AccountMenu user={user} />
            ) : (
              <>
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <Button
                    variant="outlined"
                    startIcon={<AccountCircleIcon />}
                    onClick={() => navigate("login")}
                  >
                    <Typography variant="body1">{t("header.login")}</Typography>
                  </Button>
                </Box>
                <Box sx={{ display: { xs: "flex", md: "none" } }}>
                  <IconButton
                    aria-label="connection"
                    color="inherit"
                    onClick={() => navigate("login")}
                  >
                    <AccountCircleIcon
                      color="secondary"
                      sx={{ width: 30, height: 30 }}
                    />
                  </IconButton>
                </Box>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
