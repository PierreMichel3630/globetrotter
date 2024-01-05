import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { percent } from "csx";
import { useState } from "react";

import { BUCKET_LANGUAGE, getUrlPublic } from "src/api/supabase/storage";
import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { style } from "typestyle";

const divFlagCss = style({
  width: 24,
  height: 24,
  borderRadius: percent(50),
  overflow: "hidden",
});

export const LanguagesMenu = () => {
  const { language, setLanguage, languages } = useUser();

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const selectLanguage = (language: Language) => {
    setLanguage(language);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      {language && (
        <>
          <IconButton
            aria-label="language"
            color="inherit"
            onClick={handleOpenMenu}
          >
            <img
              className={divFlagCss}
              src={getUrlPublic(BUCKET_LANGUAGE, language.image)}
            />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchor}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchor)}
            onClose={handleCloseMenu}
          >
            {languages.map((language) => (
              <MenuItem
                key={language.id}
                onClick={() => selectLanguage(language)}
              >
                <ListItemIcon>
                  <img
                    className={divFlagCss}
                    src={getUrlPublic(BUCKET_LANGUAGE, language.image)}
                  />
                </ListItemIcon>
                <ListItemText>{language.name}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
};
