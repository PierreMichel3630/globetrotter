import { CountryTravel } from "./CountryTravel";
import { Profile } from "./Profile";

export interface Travel {
  id: number;
  name: string;
  useruuid: Profile;
  countries: Array<CountryTravel>;
  created_at: Date;
}

export interface TravelInsert {
  name: string;
}

export interface TravelUpdate {
  id: number;
  name: string;
}
