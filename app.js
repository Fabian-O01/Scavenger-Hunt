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

  currentStation = findStationBySlug(stationId);

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

function findStationBySlug(slug) {
  return stations.find(station => station.slug === slug);
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

function showFinalMessage(text) {
  hideAllSections();

  const container = document.getElementById("next-location");
  const textEl = document.getElementById("location-text");
  const nextLocationHeader = document.getElementById("next-location-header")

  textEl.textContent = text;
  nextLocationHeader.textContent = ""
  container.classList.remove("hidden");
}

function handleAnswerSubmit() {
  const input = document.getElementById("answer-input");
  const userAnswer = normalize(input.value);

  if (!userAnswer) return;

  const isCorrect = currentStation.answers
    .map(normalize)
    .includes(userAnswer);

  if (isCorrect) {
    if (currentStation.finalMessage) {
      showFinalMessage(currentStation.finalMessage);
    } else {
      showNextLocation(currentStation.nextLocation);
    }
  } else {
    showMessage("Leider falsch. Versucht es noch einmal!");
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

function buildGoogleMapsLink(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function showNextLocation(nextLocation) {
  hideAllSections();

  const container = document.getElementById("next-location");
  const text = document.getElementById("location-text");

  text.textContent = nextLocation.label;

  const link = document.createElement("a");
  link.href = buildGoogleMapsLink(
    nextLocation.lat,
    nextLocation.lng
  );
  link.textContent = "🗺️Open in Google Maps";
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  link.style.display = "block";
  link.style.marginTop = "1rem";
  link.style.textAlign = "center";
  link.style.fontSize = "1.1rem";

  container.appendChild(link);
  container.classList.remove("hidden");
}

