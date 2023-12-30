import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectFriend } from "src/api/supabase/friend";
import { CardProfile } from "src/components/card/CardProfile";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS, Friend } from "src/models/Friend";
import { Profile } from "src/models/Profile";

export const MyFriendsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [profiles, setProfiles] = useState<Array<Profile>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getFriends = async () => {
    if (user !== null) {
      const { data } = await selectFriend(FRIENDSTATUS.VALID);
      const friends = data as Array<Friend>;
      const profiles = friends.map((el) =>
        el.user1.id === user.id ? el.user2 : el.user1
      );
      setProfiles(profiles);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getFriends();
  }, [user]);

  return (
    <Grid container spacing={1}>
      <Helmet>
        <title>{`${t("pages.friend.title")} - GlobeTrotter`}</title>
      </Helmet>
      {profiles.map((profile) => (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={profile.id}>
          <CardProfile profile={profile} />
        </Grid>
      ))}
    </Grid>
  );
};
