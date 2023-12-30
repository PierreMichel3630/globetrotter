import { CountryTravel } from "./CountryTravel";

export interface Travel {
  id: number;
  name: string;
  startdate: Date | null;
  enddate: Date | null;
  countries: Array<CountryTravel>;
}

export interface TravelInsert {
  name: string;
  startdate: Date | null;
  enddate: Date | null;
}

export interface TravelUpdate {
  id: number;
  name: string;
  startdate: Date | null;
  enddate: Date | null;
}
