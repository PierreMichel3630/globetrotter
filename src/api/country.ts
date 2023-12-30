import { supabase } from "./supabase";

export const SUPABASE_COUNTRIES = "countries";
export const SUPABASE_CONTINENT = "continent";

/*----- COUNTRY -------*/
export const selectCountries = () => supabase.from(SUPABASE_COUNTRIES).select();

export const selectCountryByCode = (code: string | number) =>
  supabase.from(SUPABASE_COUNTRIES).select().eq("ccn3", code).maybeSingle();

/*----- CONTINENT -------*/
export const selectContinents = () =>
  supabase.from(SUPABASE_CONTINENT).select();
