import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Travel } from "src/models/Travel";
import { LabelDiffDate } from "./LabelDiffDate";
import { ListCountries } from "./ListCountries";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ConfirmDialog } from "./modal/ConfirmModal";
import { useState } from "react";
import { useApp } from "src/context/AppProvider";
import { deleteTravelById } from "src/api/globetrotter";
import { MessageSnackbar } from "./Snackbar";
import { CreateTravelModal } from "./modal/CreateTravelModal";
import { useNavigate } from "react-router-dom";

interface Props {
  travel: Travel;
}

export const TravelBlock = ({ travel }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refreshTravel } = useApp();

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openModifyModal, setOpenModifyModal] = useState(false);
  const [message, setMessage] = useState("");

  const momentStart = moment.min(
    travel.countries.map((el) => moment(el.startdate))
  );
  const momentEnd = moment.max(
    travel.countries.map((el) => moment(el.enddate))
  );

  const labelStartDate = momentStart.format("DD MMMM YYYY");
  const labelEndDate = momentEnd.format("DD MMMM YYYY");

  const deleteTravel = () => {
    deleteTravelById(travel.id).then((res) => {
      if (res.error) {
        setMessage(t("commun.error"));
      } else {
        setOpenConfirmModal(false);
        refreshTravel();
        navigate("/map");
      }
    });
  };

  return (
    <Grid container alignItems="flex-end">
      <Grid item xs={12}>
        <Paper sx={{ m: 1, p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h2">{travel.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="span">
                {labelStartDate} - {labelEndDate}{" "}
              </Typography>
              {momentStart && momentEnd && (
                <LabelDiffDate startdate={momentStart} enddate={momentEnd} />
              )}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">
                {t("commun.countriesvisited")} ({travel.countries.length})
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ListCountries value={travel.countries} />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                fullWidth
                onClick={() => setOpenModifyModal(true)}
                size="small"
              >
                {t("commun.modify")}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                fullWidth
                color="error"
                size="small"
                onClick={() => setOpenConfirmModal(true)}
              >
                {t("commun.delete")}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <ConfirmDialog
        title={t("modal.deletemessage", { name: travel.name })}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={deleteTravel}
      />
      <CreateTravelModal
        open={openModifyModal}
        close={() => setOpenModifyModal(false)}
        travel={travel}
      />
      <MessageSnackbar
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
      />
    </Grid>
  );
};
