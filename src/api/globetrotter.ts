import { TravelInsert } from "src/models/Travel";
import { supabase } from "./supabase";
import { CountryTravelInsert } from "src/models/CountryTravel";

export const SUPABASE_TRAVEL = "travel";
export const SUPABASE_TRAVELS = "travels";
export const SUPABASE_COUNTRY_TRAVEL = "countrytravel";
export const SUPABASE_GROUP_BY_TRAVEL = "groupbytravel";

/* ------ TRAVEL -------*/
export const selectTravels = () => supabase.from(SUPABASE_TRAVELS).select();

export const insertTravel = (value: TravelInsert) =>
  supabase.from(SUPABASE_TRAVEL).insert(value).select().maybeSingle();

/* ------ COUNTRY TRAVEL -------*/
export const insertCountryTravel = (value: CountryTravelInsert) =>
  supabase.from(SUPABASE_COUNTRY_TRAVEL).insert(value);
