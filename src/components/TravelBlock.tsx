import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Travel } from "src/models/Travel";
import { LabelDiffDate } from "./LabelDiffDate";
import { ListCountries } from "./ListCountries";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteTravelById } from "src/api/globetrotter";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { ConfirmDialog } from "./modal/ConfirmModal";
import { CreateTravelModal } from "./modal/CreateTravelModal";

interface Props {
  travel: Travel;
}

export const TravelBlock = ({ travel }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshTravel } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openModifyModal, setOpenModifyModal] = useState(false);

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
        setSeverity("error");
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
              <ListCountries value={travel.countries} />
            </Grid>
            {user && travel.useruuid.id === user.id && (
              <>
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
              </>
            )}
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
    </Grid>
  );
};
