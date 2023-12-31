import { Travel } from "./Travel";

export interface CountryGroupBy {
  code: string;
  travels: Array<Travel>;
}

export interface CountryTravel {
  id: number;
  country: number;
  travel: number;
  startdate: Date | null;
  enddate: Date | null;
}

export interface CountryTravelInsert {
  country: number;
  travel: number;
  startdate: Date | null;
  enddate: Date | null;
}

export interface CountryTravelUpdate {
  id: number;
  country: number;
  travel: number;
  startdate: Date | null;
  enddate: Date | null;
}
