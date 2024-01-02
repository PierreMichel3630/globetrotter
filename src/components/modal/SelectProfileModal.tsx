import {
  Alert,
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { selectFriend } from "src/api/supabase/friend";
import { FRIENDSTATUS, Friend } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { sortByUsername } from "src/utils/sort";
import { BasicSearchInput } from "../Input";
import { Loading } from "../Loading";
import { CardProfile } from "../card/CardProfile";

interface Props {
  open: boolean;
  close: () => void;
  onValid: (profil: Profile) => void;
}

export const SelectProfileModal = ({ open, close, onValid }: Props) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState<Array<Profile>>([]);

  const [isLoading, setIsLoading] = useState(true);

  const getFriends = async () => {
    const { data } = await selectFriend();
    const friends = data as Array<Friend>;
    const friendsProfile = friends
      .filter((el) => el.status === FRIENDSTATUS.VALID)
      .reduce((acc, value) => {
        const previousFriendId = [...acc].map((el) => el.id);
        const newFriend = [value.user1, value.user2].filter(
          (el) => !previousFriendId.includes(el.id)
        );
        return [...acc, ...newFriend];
      }, [] as Array<Profile>);
    setProfiles(friendsProfile);
    setIsLoading(false);
  };

  useEffect(() => {
    getFriends();
  }, []);

  const profileFilter = profiles.filter(
    (el) =>
      search === "" || el.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog onClose={close} open={open} fullScreen>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.selectprofile")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={2}>
          {isLoading ? (
            <Grid item xs={12}>
              <Loading />
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <BasicSearchInput
                  label={t("commun.searchfriend")}
                  onChange={(value) => setSearch(value)}
                  value={search}
                  clear={() => setSearch("")}
                />
              </Grid>
              {profileFilter.length > 0 ? (
                profileFilter.sort(sortByUsername).map((profile) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={3}
                    key={profile.id}
                  >
                    <CardProfile
                      profile={profile}
                      onSelect={() => {
                        onValid(profile);
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="warning">{t("commun.noresult")}</Alert>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
