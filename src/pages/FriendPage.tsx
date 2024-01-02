import {
  Alert,
  AlertColor,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  deleteFriendById,
  selectFriend,
  updateFriend,
} from "src/api/supabase/friend";
import { MessageSnackbar } from "src/components/Snackbar";
import {
  CardInvitationFriend,
  CardRequestFriend,
} from "src/components/card/CardFriend";
import { CardProfile } from "src/components/card/CardProfile";
import { AddFriendModal } from "src/components/modal/AddFriendModal";
import { CardFriendSkeleton } from "src/components/skeleton/Skeleton";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS, Friend, FriendUpdate } from "src/models/Friend";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Colors } from "src/style/Colors";
import { Profile } from "src/models/Profile";

export const FriendPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const LOADINGITEM = 2;
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<Array<Friend>>([]);
  const [openAddFriend, setOpenAddFriend] = useState(false);

  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  const getFriends = async () => {
    if (user !== null) {
      setIsLoading(true);
      const { data } = await selectFriend();
      const friends = data as Array<Friend>;
      setFriends(friends);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getFriends();
  }, [user]);

  const confirmFriend = async (friend: Friend, status: FRIENDSTATUS) => {
    const value: FriendUpdate = {
      id: friend.id,
      status: status,
    };
    const { error } = await updateFriend(value);
    if (error) {
      setSeverity("error");
      setMessage(t("commun.error"));
    } else {
      setSeverity("success");
      setMessage(
        status === FRIENDSTATUS.VALID
          ? t("alert.validatefriendrequest")
          : t("alert.refusefriendrequest")
      );
      getFriends();
    }
  };

  const deleteFriend = (profile: Profile) => {
    const friend = friends.find(
      (el) =>
        el.status === FRIENDSTATUS.VALID &&
        (el.user1.id === profile.id || el.user2.id === profile.id)
    );
    if (friend) {
      deleteFriendById(friend.id).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          setSeverity("success");
          setMessage(t("alert.deletefriend"));
          getFriends();
        }
      });
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const invitations = friends.filter(
    (el) =>
      user !== null &&
      user.id === el.user2.id &&
      el.status === FRIENDSTATUS.PROGRESS
  );

  const requests = friends.filter(
    (el) =>
      user !== null &&
      user.id === el.user1.id &&
      el.status === FRIENDSTATUS.PROGRESS
  );

  const profiles = friends
    .filter((el) => el.status === FRIENDSTATUS.VALID)
    .map((el) => (user && el.user1.id === user.id ? el.user2 : el.user1));

  return (
    <Box sx={{ p: 1 }}>
      <Helmet>
        <title>{`${t("pages.friend.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("pages.friend.title")}</Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: Colors.backgroundColor,
            position: "sticky",
            top: 0,
            zIndex: 3,
          }}
        >
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            fullWidth
            onClick={() => setOpenAddFriend(true)}
          >
            {t("commun.addfriend")}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider>
            <Chip label={t("commun.myinvitation")} size="small" />
          </Divider>
        </Grid>
        {isLoading ? (
          Array.from(new Array(LOADINGITEM)).map((_, index) => (
            <Grid key={index} item xs={12}>
              <CardFriendSkeleton />
            </Grid>
          ))
        ) : invitations.length > 0 ? (
          invitations.map((invitation) => (
            <Grid item xs={12} key={invitation.id}>
              <CardInvitationFriend
                friend={invitation}
                validate={() => confirmFriend(invitation, FRIENDSTATUS.VALID)}
                refuse={() => confirmFriend(invitation, FRIENDSTATUS.REFUSE)}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="warning">{t("commun.noresultinvitation")}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Divider>
            <Chip label={t("commun.myrequests")} size="small" />
          </Divider>
        </Grid>
        {isLoading ? (
          Array.from(new Array(LOADINGITEM)).map((_, index) => (
            <Grid key={index} item xs={12}>
              <CardFriendSkeleton />
            </Grid>
          ))
        ) : requests.length > 0 ? (
          requests.map((invitation) => (
            <Grid item xs={12} key={invitation.id}>
              <CardRequestFriend friend={invitation} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="warning">{t("commun.noresultrequest")}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Divider>
            <Chip label={t("commun.myfriends")} size="small" />
          </Divider>
        </Grid>
        {isLoading ? (
          Array.from(new Array(LOADINGITEM)).map((_, index) => (
            <Grid key={index} item xs={12}>
              <CardFriendSkeleton />
            </Grid>
          ))
        ) : profiles.length > 0 ? (
          profiles.map((profile) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={profile.id}>
              <CardProfile
                profile={profile}
                deleteToFriend={() => deleteFriend(profile)}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="warning">{t("commun.noresultfriends")}</Alert>
          </Grid>
        )}
      </Grid>
      <AddFriendModal
        open={openAddFriend}
        close={() => setOpenAddFriend(false)}
        onValid={() => {
          setOpenAddFriend(false);
          getFriends();
        }}
      />
      <MessageSnackbar
        autoHideDuration={600000}
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={message}
        severity={severity}
      />
    </Box>
  );
};
