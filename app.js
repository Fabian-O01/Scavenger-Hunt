let stations = [];
let currentStation = null;

// initialization

document.addEventListener("DOMContentLoaded", init);

async function init() {
  const stationId = getStationIdFromUrl();

  if (!stationId) {
    showMessage("Scanne den QR-code, um zu starten!");
    return;
  }

  await loadStations();

  currentStation = findStationById(stationId);

  if (!currentStation) {
    showMessage("Unknown station.");
    return;
  }

  renderStation(currentStation);
  setupEventListeners();
}

// data loading

async function loadStations() {
  const response = await fetch("stations.json");
  const data = await response.json();
  stations = data.stations;
}

function findStationById(id) {
  return stations.find(station => station.id === id);
}


// URL handling

function getStationIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("station");
}

// rendering

function renderStation(station) {
  hideAllSections();

  document.getElementById("question").textContent = station.question;
  document.getElementById("station").classList.remove("hidden");

  if (station.hint) {
    document.getElementById("hint-button").classList.remove("hidden");
  }
}

function hideAllSections() {
  document
    .querySelectorAll(".hidden")
    .forEach(el => el.classList.add("hidden"));
}

// event handling

function setupEventListeners() {
  document
    .getElementById("submit-answer")
    .addEventListener("click", handleAnswerSubmit);

  document
    .getElementById("hint-button")
    .addEventListener("click", showHint);
}

function handleAnswerSubmit() {
  const input = document.getElementById("answer-input");
  const userAnswer = normalize(input.value);

  if (!userAnswer) return;

  const isCorrect = currentStation.answers
    .map(normalize)
    .includes(userAnswer);

  if (isCorrect) {
    showNextLocation(currentStation.nextLocation);
  } else {
    showMessage("That answer is not correct. Try again!");
  }
}

function showHint() {
  document.getElementById("hint").textContent = currentStation.hint;
  document.getElementById("hint").classList.remove("hidden");
}

// helper functions

function normalize(str) {
  return str.trim().toLowerCase();
}

function showMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.classList.remove("hidden");
}

function showNextLocation(text) {
  hideAllSections();
  document.getElementById("location-text").textContent = text;
  document.getElementById("next-location").classList.remove("hidden");
}
