export interface Report {
  id: number;
  type: string;
  message: string;
  status: "PROGRESS" | "CORRECTED" | "ABANDON";
  response: null | string;
  created_at: Date;
}

export interface ReportInsert {
  type: string;
  message: string;
}
