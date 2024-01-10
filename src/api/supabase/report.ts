import { ReportInsert } from "src/models/Report";
import { supabase } from "../supabase";

export const SUPABASE_REPORT_TABLE = "report";

export const insertReport = (value: ReportInsert) =>
  supabase.from(SUPABASE_REPORT_TABLE).insert(value).select();

export const selectReports = () =>
  supabase.from(SUPABASE_REPORT_TABLE).select();
