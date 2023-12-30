import { JsonLanguage } from "../Language";
import { Travel } from "../Travel";
import { Capital } from "./Capital";
import { Continent } from "./Continent";
import { Currency } from "./Currency";
import { Language } from "./Language";

export interface Country {
  cca2: string;
  id: number;
  name: JsonLanguage;
  description: JsonLanguage;
  independent: boolean;
  ccn3: number;
  position: [number, number];
  area: number;
  population: number;
  map: string;
  flag: string;
  coatofarms: string | null;
  car: "right" | "left";
  languages: Array<Language>;
  capitals: Array<Capital>;
  currencies: Array<Currency>;
  continents: Array<Continent>;
  images: Array<string>;
  adjacentcountries: Array<CountryAdjacent>;
}

export interface CountryAdjacent {
  id: number;
  name: JsonLanguage;
  independent: boolean;
  position: [number, number];
  ccn3: number;
  cca3: string;
  area: number;
  population: number;
  map: string;
  flag: string;
  coatofarms: string | null;
  car: "right" | "left";
}

export interface CountryVisited extends Country {
  travels: Array<Travel>;
}
