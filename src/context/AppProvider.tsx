import { uniqBy } from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import { selectContinents, selectCountries } from "src/api/country";
import { selectTravels } from "src/api/globetrotter";
import { Travel } from "src/models/Travel";
import { Continent } from "src/models/country/Continent";
import { Country, CountryVisited } from "src/models/country/Country";
import { useAuth } from "./AuthProviderSupabase";
import { selectFriend } from "src/api/supabase/friend";
import { Friend } from "src/models/Friend";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppContext = createContext<{
  continents: Array<Continent>;
  countries: Array<Country>;
  countriesVisited: Array<CountryVisited>;
  countriesVisitedFriends: Array<CountryVisited>;
  countriesVisitedAll: Array<CountryVisited>;
  travels: Array<Travel>;
  travelsFriends: Array<Travel>;
  refreshTravel: () => void;
  friends: Array<Friend>;
  refreshFriends: () => void;
}>({
  continents: [],
  countries: [],
  countriesVisited: [],
  countriesVisitedFriends: [],
  countriesVisitedAll: [],
  travels: [],
  travelsFriends: [],
  refreshTravel: () => {},
  friends: [],
  refreshFriends: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [continents, setContinents] = useState<Array<Continent>>([]);
  const [countries, setCountries] = useState<Array<Country>>([]);
  const [travels, setTravels] = useState<Array<Travel>>([]);
  const [travelsFriends, setTravelsFriends] = useState<Array<Travel>>([]);
  const [countriesVisited, setCountriesVisited] = useState<
    Array<CountryVisited>
  >([]);
  const [countriesVisitedFriends, setCountriesVisitedFriends] = useState<
    Array<CountryVisited>
  >([]);
  const [countriesVisitedAll, setCountriesVisitedAll] = useState<
    Array<CountryVisited>
  >([]);
  const [friends, setFriends] = useState<Array<Friend>>([]);

  const getFriends = async () => {
    if (user !== null) {
      const { data } = await selectFriend();
      const friends = data as Array<Friend>;
      setFriends(friends);
    }
  };
  const refreshFriends = () => {
    getFriends();
    getTravels();
  };

  useEffect(() => {
    getFriends();
  }, [user]);

  const getCountriesVisited = (travels: Array<Travel>) => {
    if (countries.length > 0) {
      const idCountries = uniqBy(
        travels.reduce(
          (acc, travel) => [
            ...acc,
            ...travel.countries.map((el) => el.country),
          ],
          [] as Array<number>
        ),
        (el) => el
      );
      const countriesVisited: Array<CountryVisited> = [];
      idCountries.forEach((id) => {
        const country = countries.find((el) => el.id === id);
        const travelsCountry = travels.filter((travel) =>
          travel.countries.map((el) => el.country).includes(id)
        );
        if (country)
          countriesVisited.push({ ...country, travels: travelsCountry });
      });
      return countriesVisited;
    }
    return [];
  };

  useEffect(() => {
    setCountriesVisited(getCountriesVisited(travels));
  }, [travels, countries]);

  useEffect(() => {
    setCountriesVisitedFriends(getCountriesVisited(travelsFriends));
  }, [travelsFriends, countries]);

  useEffect(() => {
    setCountriesVisitedAll(
      getCountriesVisited([...travels, ...travelsFriends])
    );
  }, [travels, travelsFriends, countries]);

  const getTravels = () => {
    if (user) {
      selectTravels().then((res) => {
        const travels = res.data as Array<Travel>;
        setTravels(travels.filter((el) => el.useruuid.id === user.id));
        setTravelsFriends(travels.filter((el) => el.useruuid.id !== user.id));
      });
    }
  };

  const refreshTravel = () => {
    getTravels();
  };

  const getCountries = () => {
    selectCountries().then((res) => {
      setCountries(res.data as Array<Country>);
    });
  };

  const getContinents = () => {
    selectContinents().then((res) => {
      setContinents(res.data as Array<Continent>);
    });
  };

  useEffect(() => {
    getCountries();
    getContinents();
    getTravels();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        continents,
        countries,
        countriesVisited,
        countriesVisitedFriends,
        countriesVisitedAll,
        travels,
        travelsFriends,
        refreshTravel,
        friends,
        refreshFriends,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
