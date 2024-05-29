import { fetchData } from "../api";
import {
  Film,
  Person,
  Planet,
  PlanetWithFilmsData,
  PlanetsResponse,
  Species,
} from "../models";

export const getReptilePlanets = async (): Promise<
  Array<PlanetWithFilmsData>
> => {
  try {
    let planets: Planet[] = [];
    // Recursively fetch and set all planets data
    const fetchPlanetsData = async (url: string) => {
      const response: PlanetsResponse = await fetchData(url);
      planets = [...planets, ...response.results];
      let nextPageUrl = response.next;
      if (nextPageUrl) return fetchPlanetsData(nextPageUrl);
    };
    await fetchPlanetsData("https://swapi.dev/api/planets");

    const planetPromises = planets?.map(async (planet: Planet) => {
      if (planet.films.length === 0) {
        return null;
      }
      const reptilePlanet = await hasPlanetReptileResident(planet);
      return reptilePlanet ? planet : null;
    });
    let filteredPlanets = await Promise.all(planetPromises);
    filteredPlanets = filteredPlanets.filter((planet) => planet !== null);
    const planetsWithFilmDataPromises = filteredPlanets.map(
      async (planet): Promise<PlanetWithFilmsData> => {
        let filmsData: Array<Film | null> = await Promise.all(
          planet.films.map(async (filmUrl) => {
            try {
              const filmData = await fetchData(filmUrl);
              return filmData;
            } catch {
              return null;
            }
          })
        );
        filmsData = filmsData.filter((data) => data !== null);
        return { ...planet, filmsData };
      }
    );
    return Promise.all(planetsWithFilmDataPromises);
  } catch (error) {
    console.error("Error fetching planets:", error);
    return [];
  }
};
// Check if a resident has a reptile specie
const isResidentReptile = async (person: Person): Promise<Boolean> => {
  const speciesUrls = person.species;

  if (speciesUrls.length) {
    const iter = async (currentIndex: number): Promise<Species | null> => {
      const url = speciesUrls[currentIndex];
      const isLastUrl = currentIndex === speciesUrls.length - 1;

      try {
        const specie: Species = await fetchData(url);
        const isReptile = specie.classification.toLowerCase() === "artificial";
        return isReptile ? specie : isLastUrl ? null : iter(currentIndex + 1);
      } catch (e) {
        return null;
      }
    };
    const reptileSpecie = await iter(0);
    return Boolean(reptileSpecie);
  }
};
// Check if a planet has a reptile resident

const hasPlanetReptileResident = async (planet: Planet): Promise<Boolean> => {
  const residentUrls = planet.residents;
  if (residentUrls.length) {
    const iter = async (currentIndex: number): Promise<Person | null> => {
      const url = residentUrls[currentIndex];
      const isLastUrl = currentIndex === residentUrls.length - 1;
      try {
        const resident = await fetchData(url);
        const isReptile = await isResidentReptile(resident);
        return isReptile ? resident : isLastUrl ? null : iter(currentIndex + 1);
      } catch (e) {
        return null;
      }
    };
    const reptileSpecie = await iter(0);
    return Boolean(reptileSpecie);
  }
  return false;
};
