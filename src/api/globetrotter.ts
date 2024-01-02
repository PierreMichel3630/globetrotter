import { TravelInsert, TravelUpdate } from "src/models/Travel";
import { supabase } from "./supabase";
import {
  CountryTravelInsert,
  CountryTravelUpdate,
} from "src/models/CountryTravel";

export const SUPABASE_TRAVEL = "travel";
export const SUPABASE_TRAVELS = "travels";
export const SUPABASE_COUNTRY_TRAVEL = "countrytravel";
export const SUPABASE_GROUP_BY_TRAVEL = "groupbytravel";

/* ------ TRAVEL -------*/
export const selectTravels = () =>
  supabase.from(SUPABASE_TRAVELS).select("*, useruuid!inner(*)");
export const selectTravelsByUserUuid = (uuid: string) =>
  supabase.from(SUPABASE_TRAVELS).select().eq("useruuid", uuid);

export const updateTravel = (value: TravelUpdate) =>
  supabase
    .from(SUPABASE_TRAVEL)
    .update(value)
    .eq("id", value.id)
    .select()
    .maybeSingle();

export const insertTravel = (value: TravelInsert) =>
  supabase.from(SUPABASE_TRAVEL).insert(value).select().maybeSingle();

export const deleteTravelById = (id: number) =>
  supabase.from(SUPABASE_TRAVEL).delete().eq("id", id);

/* ------ COUNTRY TRAVEL -------*/
export const insertCountryTravel = (value: CountryTravelInsert) =>
  supabase.from(SUPABASE_COUNTRY_TRAVEL).insert(value);

export const updateCountryTravel = (value: CountryTravelUpdate) =>
  supabase.from(SUPABASE_COUNTRY_TRAVEL).update(value).eq("id", value.id);
