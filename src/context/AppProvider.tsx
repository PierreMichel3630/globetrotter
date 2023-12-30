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
  continent: Continent | null;
  selectContinent: (value: Continent | null) => void;
  countries: Array<Country>;
  country: Country | null;
  countriesVisited: Array<CountryVisited>;
  selectCountry: (value: Country | null) => void;
  travels: Array<Travel>;
  travel: Travel | null;
  selectTravel: (value: Travel | null) => void;
  addTravel: () => void;
}>({
  continents: [],
  continent: null,
  selectContinent: (value: Continent | null) => {},
  countries: [],
  country: null,
  countriesVisited: [],
  selectCountry: (value: Country | null) => {},
  travels: [],
  travel: null,
  selectTravel: (value: Travel | null) => {},
  addTravel: () => {},
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [continents, setContinents] = useState<Array<Continent>>([]);
  const [continent, setContinent] = useState<Continent | null>(null);
  const [countries, setCountries] = useState<Array<Country>>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [travels, setTravels] = useState<Array<Travel>>([]);
  const [travel, setTravel] = useState<Travel | null>(null);
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

  const addTravel = () => {
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

  useEffect(() => {
    if (country) {
      setContinent(null);
      setTravel(null);
    }
  }, [country]);

  useEffect(() => {
    if (continent) {
      setCountry(null);
      setTravel(null);
    }
  }, [continent]);

  useEffect(() => {
    if (travel) {
      setCountry(null);
      setContinent(null);
    }
  }, [travel]);

  return (
    <AppContext.Provider
      value={{
        continents,
        continent,
        selectContinent: setContinent,
        countries,
        country,
        countriesVisited,
        selectCountry: setCountry,
        travels,
        travel,
        selectTravel: setTravel,
        addTravel,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
