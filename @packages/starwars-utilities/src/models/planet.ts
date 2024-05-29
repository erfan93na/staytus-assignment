import { Film } from "./film";
import { PaginatedResponse } from "./paginated-response";
export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}
export interface PlanetWithFilmsData extends Planet {
  filmsData: Film[];
}
export type PlanetsResponse = PaginatedResponse<Planet>;
