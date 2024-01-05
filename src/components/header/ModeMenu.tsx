import { IconButton } from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { Colors } from "src/style/Colors";
import { useUser } from "src/context/UserProvider";

export const ModeMenu = () => {
  const { mode, setMode } = useUser();
  return (
    <IconButton
      aria-label="light mode"
      color="inherit"
      onClick={() => setMode(mode === "light" ? "dark" : "light")}
    >
      {mode === "light" ? (
        <LightModeIcon sx={{ fill: Colors.yellow, width: 25, height: 25 }} />
      ) : (
        <DarkModeIcon sx={{ fill: Colors.white, width: 25, height: 25 }} />
      )}
    </IconButton>
  );
};
