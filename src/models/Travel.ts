import { CountryTravel } from "./CountryTravel";
import { Profile } from "./Profile";

export interface Travel {
  id: number;
  name: string;
  startdate: Date | null;
  enddate: Date | null;
  useruuid: Profile;
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
