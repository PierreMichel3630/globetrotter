import { uniqBy } from "lodash";
import { createContext, useContext, useEffect, useState } from "react";
import { selectContinents, selectCountries } from "src/api/country";
import { selectTravels } from "src/api/globetrotter";
import { Travel } from "src/models/Travel";
import { Continent } from "src/models/country/Continent";
import { Country, CountryVisited } from "src/models/country/Country";
import { useAuth } from "./AuthProviderSupabase";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AppContext = createContext<{
  continents: Array<Continent>;
  countries: Array<Country>;
  countriesVisited: Array<CountryVisited>;
  travels: Array<Travel>;
  refreshTravel: () => void;
}>({
  continents: [],
  continent: null,
  countries: [],
  countriesVisited: [],
  travels: [],
  refreshTravel: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [continents, setContinents] = useState<Array<Continent>>([]);
  const [countries, setCountries] = useState<Array<Country>>([]);
  const [travels, setTravels] = useState<Array<Travel>>([]);
  const [countriesVisited, setCountriesVisited] = useState<
    Array<CountryVisited>
  >([]);

  useEffect(() => {
    const getCountriesVisited = () => {
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
        setCountriesVisited(countriesVisited);
      }
    };

    getCountriesVisited();
  }, [travels, countries]);

  const getTravels = () => {
    selectTravels().then((res) => {
      setTravels(res.data as Array<Travel>);
    });
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
        travels,
        refreshTravel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
