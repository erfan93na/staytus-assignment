import { fetchData } from "../api";
import { Person, Species } from "../models";
import { getReptilePlanets } from "./get-reptile-planets";

jest.mock("../api");

const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>;

describe("getReptilePlanets", () => {
  beforeEach(() => {
    mockFetchData.mockClear();
  });

  it("should return planets with reptile residents", async () => {
    // Mock planet without films but with reptile resident
    const mockPlanet1 = {
      name: "planet1",
      films: [],
      residents: ["resident2"],
      filmsData: [],
    };
    // Mock planet with films but no reptile resident
    const mockPlanet2 = {
      name: "planet2",
      films: ["film1"],
      residents: ["resident1"],
      filmsData: [],
    };
    // Mock planet with films and reptile resident
    const mockPlanet3 = {
      name: "planet3",
      films: ["film2"],
      residents: ["resident2"],
      filmsData: [],

    };
    // Mock planet with films but no residents
    const mockPlanet4 = {
      name: "planet4",
      films: ["film3"],
      residents: [],
      filmsData: [],

    };
    const mockPlanetsResponse = {
      results: [mockPlanet1, mockPlanet2, mockPlanet3, mockPlanet4],
    };

    const mockPerson1 = {
      name: "person1",
      species: ["species1"],
    } as Person;

    const mockPerson2 = {
      name: "person2",
      species: ["species2"],
    } as Person;

    const mockSpecies1 = {
      name: "species1",
      classification: "mammal",
    } as Species;

    const mockSpecies2 = {
      name: "species2",
      classification: "artificial",
    } as Species;

    // Mocking fetchData calls based on URL
    mockFetchData.mockImplementation(async (url: string) => {
      if (url === `https://swapi.dev/api/planets`) {
        return mockPlanetsResponse;
      } else if (url === "resident1") {
        return mockPerson1;
      } else if (url === "resident2") {
        return mockPerson2;
      } else if (url === "species1") {
        return mockSpecies1;
      } else if (url === "species2") {
        return mockSpecies2;
      } else {
        throw new Error("Unknown URL");
      }
    });

    const result = await getReptilePlanets();

    expect(result).toEqual([mockPlanet3]);
  });

  it("should handle errors gracefully", async () => {
    mockFetchData.mockRejectedValue(new Error("Network error"));

    const result = await getReptilePlanets();

    expect(result).toEqual([]);
  });
});
