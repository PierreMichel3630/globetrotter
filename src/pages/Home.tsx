import { Grid, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import { BottomNavigationBasic } from "src/components/BottomNavigation";
import { AppProvider } from "src/context/AppProvider";

import { useAuth } from "src/context/AuthProviderSupabase";

export const Home = () => {
  const { user } = useAuth();

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
          <BottomNavigationBasic />
        </Paper>
      ) : (
        <></>
      )}
    </AppProvider>
  );
};
