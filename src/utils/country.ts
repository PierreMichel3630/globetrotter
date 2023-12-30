import { useContext, useEffect, useState } from "react";
import { UserContext } from "src/App";
import de from "src/assets/country/de.json";
import en from "src/assets/country/en.json";
import es from "src/assets/country/es.json";
import fr from "src/assets/country/fr.json";
import { CountryJson } from "src/models/Country";

export const GetLabelCountry = (code: string) => {
  const { language } = useContext(UserContext);
  const [countries, setCountries] = useState<Array<CountryJson>>([]);

  const getCountries = () => {
    switch (language.abbreviation) {
      case "fr":
        setCountries(fr);
        break;
      case "en":
        setCountries(en);
        break;
      case "de":
        setCountries(de);
        break;
      case "es":
        setCountries(es);
        break;
      default:
        setCountries(fr);
        break;
    }
  };

  useEffect(() => {
    getCountries();
  }, [language]);

  const country = countries.find((el) => el.id.toString() === code);

  return country ? country.name : "";
};
