import { fetchData } from "../api";
import { Person, Planet, PlanetsResponse, Species } from "../models";

export const getReptilePlanets = async (): Promise<Array<Planet>> => {
  try {
    const planets: PlanetsResponse = await fetchData(
      "https://swapi.dev/api/planets"
    );
    const planetPromises = planets.results?.map(async (planet: Planet) => {
      if (planet.films.length === 0) {
        return null;
      }
      const reptilePlanet = await hasPlanetReptileResident(planet);
      return reptilePlanet ? planet : null;
    });
    const filteredPlanets = await Promise.all(planetPromises);
    return filteredPlanets.filter((planet) => planet !== null);
  } catch (error) {
    console.error("Error fetching planets:", error);
    return [];
  }
};
// Check if a resident has a reptile specie
const isResidentReptile = async (person: Person): Promise<boolean> => {
  for (const speciesUrl of person.species) {
    try {
      const species: Species = await fetchData(speciesUrl);
      if (species.classification.toLowerCase() === "reptile") {
        return true;
      }
    } catch (error) {
      console.error(`Error fetching species data: ${speciesUrl}`, error);
    }
  }
  return false;
};

// Check if any resident of the planet is reptile
const hasPlanetReptileResident = async (planet: Planet): Promise<boolean> => {
  for (const residentUrl of planet.residents) {
    try {
      const resident: Person = await fetchData(residentUrl);
      const isReptile = await isResidentReptile(resident);
      if (isReptile) {
        return true;
      }
    } catch (error) {
      console.error(`Error fetching resident data: ${residentUrl}`, error);
    }
  }
  return false;
};
