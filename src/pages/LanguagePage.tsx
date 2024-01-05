import {
  Avatar,
  Box,
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
import { Colors } from "src/style/Colors";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useUser } from "src/context/UserProvider";

export const LanguagePage = () => {
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useUser();

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={1}>
        <Helmet>
          <title>{`${t("pages.language.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("commun.languages")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <List>
            <Divider />
            {languages.map((el, index) => (
              <Fragment key={index}>
                <ListItem disablePadding sx={{ backgroundColor: Colors.white }}>
                  <ListItemButton onClick={() => setLanguage(el)}>
                    <ListItemIcon>
                      {language.iso === el.iso && (
                        <CheckCircleIcon color="success" />
                      )}
                    </ListItemIcon>
                    <ListItemIcon>
                      <Avatar
                        alt="flag"
                        src={el.icon}
                        sx={{ width: px(30), height: px(30) }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={el.name} />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
    </Box>
  );
};
