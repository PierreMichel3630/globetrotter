import { JsonLanguage } from "../Language";

export interface Currency {
  id: number;
  code: string;
  name: JsonLanguage;
  symbol: string | null;
}
