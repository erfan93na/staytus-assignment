import {
  getReptilePlanets,
  PlanetWithFilmsData,
} from "@packages/starwars-utilities";
import StateManager from "@packages/state-manager";
// Initialize StateManager with an empty initial state and no middlewares
const initialState = { planets: [], isLoading: false, error: null };
const stateManager = new StateManager(initialState, []);

// Subscribe to state changes to update the UI
stateManager.subscribe(
  (state: {
    planets: PlanetWithFilmsData[];
    isLoading: boolean;
    error: unknown;
  }) => {
    updateErrorElement(state.error);
    updateLoadingElement(state.isLoading);
    updateUI(state.planets);
  }
);
// Toggle loading before and after fetch data
function toggleLoading(isLoading: boolean) {
  stateManager.dispatch(stateManager.getActions().updateState({ isLoading }));
}
// set error before and after fetch data
function setError(error: unknown) {
  stateManager.dispatch(stateManager.getActions().updateState({ error }));
}
// Fetch planets data and update the state
function fetchDataAndUpdateState() {
  toggleLoading(true);
  getReptilePlanets()
    .then((planets: PlanetWithFilmsData[]) => {
      setError(null);
      stateManager.dispatch(stateManager.getActions().updateState({ planets }));
    })
    .catch((e) => setError(e ?? new Error("Unknown Error")))
    .finally(() => toggleLoading(false));
}

// Function to update the UI with planet data
function updateUI(planets: PlanetWithFilmsData[]) {
  const container = document.getElementById("planet-container");
  container.innerHTML = ""; // Clear previous content
  planets.forEach((planet) => {
    const card = createPlanetCard(planet);
    container.appendChild(card);
  });
}

// Function to create a planet card element
function createPlanetCard(planet: PlanetWithFilmsData) {
  const films = planet.filmsData.map((film) => film.title).join(", ");
  const createdDate = new Date(planet.created).toDateString();

  const cardHTML = `
    <div class="planet-card p-4 rounded-lg shadow-lg space-y-4">
      <div class="planet-info bg-[#3f4045] p-4 rounded-lg block lg:hidden
       transform transition duration-300 ease-in-out hover:scale-105 
       hover:shadow-lg hover:brightness-110 hover:bg-gray-600"">
        <div class="text-yellow-500">${createdDate}</div>
        <div class="flex justify-between items-center mt-2">
          <div>
            <div class="text-xl font-bold text-white">${planet.name}</div>
            <div class="text-gray-500">${planet.climate}</div>
          </div>
        </div>
        <div class="text-gray-400 mt-2">${films}</div>
      </div>

      <div class="planet-info bg-[#27272a] p-4 rounded-lg hidden lg:block
      transform transition duration-300 ease-in-out hover:scale-105 mx-8
       hover:shadow-lg hover:brightness-110 hover:bg-gray-600"
      ">
        <div class="text-yellow-500">${createdDate}</div>
        <div class="flex justify-between items-center mt-2">
          <div>
            <div class="text-xl font-bold text-white">${planet.name}</div>
            <div class="text-gray-400 mt-1">${films}</div>
          </div>
          <div>
            <div class="text-yellow-500 text-sm">${createdDate}</div>
            <div class="text-gray-500 mt-1">${planet.climate}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  const template = document.createElement("template");
  template.innerHTML = cardHTML.trim();
  return template.content.firstChild;
}

function updateErrorElement(error: unknown) {
  const el = document.getElementById("error");
  el.style.display = error ? "block" : "none";
  el.textContent = String(error);
}
function updateLoadingElement(isLoading: boolean) {
  const el = document.getElementById("loading");
  el.style.display = isLoading ? "block" : "none";
}
fetchDataAndUpdateState();
