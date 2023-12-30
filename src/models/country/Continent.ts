import { JsonLanguage } from "../Language";

export interface Continent {
  id: number;
  name: JsonLanguage;
  description: JsonLanguage;
  position: [number, number];
  zoom: number;
  images: Array<string>;
  area: number;
  population: number;
  density: number;
}
