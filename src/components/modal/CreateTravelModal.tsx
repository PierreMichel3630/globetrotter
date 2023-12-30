import {
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { TravelForm } from "src/form/TravelForm";

import CloseIcon from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  close: () => void;
}

export const CreateTravelModal = ({ open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open} fullScreen>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("form.createtravel.title")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TravelForm onValid={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
