export const BASE_URL = "https://swapi.dev/api";

 export const fetchData = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
};
