// Insert your API key from API-Football below
const API_KEY = 'b3a6cff6fe3db533e7c06ca60adc527e';
const BASE_URL = 'https://v3.football.api-sports.io';
const LEAGUE_ID = 39; // Premier League ID
const SEASON = 2023; // Current season

// Get references to DOM elements
const standingsSection = document.getElementById('standings-section');
const scorersSection = document.getElementById('scorers-section');
const errorMessage = document.getElementById('error-message');
const standingsNav = document.getElementById('standings-nav');
const scorersNav = document.getElementById('scorers-nav');

// Highlight the active navigation button
function setActiveNav(active) {
  standingsNav.classList.toggle('active', active === 'standings');
  scorersNav.classList.toggle('active', active === 'scorers');
}

// Fetch and display Premier League standings
async function fetchStandings() {
  errorMessage.textContent = '';
  standingsSection.innerHTML = '<p>Loading standings...</p>';
  try {
    // Make API request for standings
    const res = await fetch(`${BASE_URL}/standings?league=${LEAGUE_ID}&season=${SEASON}`, {
      headers: { 'x-apisports-key': API_KEY }
    });
    if (!res.ok) throw new Error('Failed to fetch standings');
    const data = await res.json();
    // Extract standings array from response
    const standings = data.response[0].league.standings[0];
    renderStandings(standings);
  } catch (err) {
    standingsSection.innerHTML = '';
    errorMessage.textContent = err.message;
  }
}

// Render the standings table in the DOM
function renderStandings(standings) {
  let html = `<h2>Premier League Standings (${SEASON})</h2><table><thead><tr><th>#</th><th>Team</th><th>Pts</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th></tr></thead><tbody>`;
  standings.forEach(team => {
    html += `<tr><td>${team.rank}</td><td><img src="${team.team.logo}" alt="logo" style="height:20px;vertical-align:middle;"> ${team.team.name}</td><td>${team.points}</td><td>${team.all.win}</td><td>${team.all.draw}</td><td>${team.all.lose}</td><td>${team.all.goals.for}</td><td>${team.all.goals.against}</td></tr>`;
  });
  html += '</tbody></table>';
  standingsSection.innerHTML = html;
}

// Fetch and display Premier League top scorers
async function fetchScorers() {
  errorMessage.textContent = '';
  scorersSection.innerHTML = '<p>Loading top scorers...</p>';
  try {
    // Make API request for top scorers
    const res = await fetch(`${BASE_URL}/players/topscorers?league=${LEAGUE_ID}&season=${SEASON}`, {
      headers: { 'x-apisports-key': API_KEY }
    });
    if (!res.ok) throw new Error('Failed to fetch top scorers');
    const data = await res.json();
    renderScorers(data.response);
  } catch (err) {
    scorersSection.innerHTML = '';
    errorMessage.textContent = err.message;
  }
}

// Render the top scorers table in the DOM
function renderScorers(scorers) {
  let html = `<h2>Premier League Top Scorers (${SEASON})</h2><table><thead><tr><th>#</th><th>Player</th><th>Team</th><th>Goals</th></tr></thead><tbody>`;
  scorers.forEach((item, idx) => {
    html += `<tr><td>${idx + 1}</td><td><img src="${item.player.photo}" alt="photo" style="height:20px;vertical-align:middle;"> ${item.player.name}</td><td>${item.statistics[0].team.name}</td><td>${item.statistics[0].goals.total}</td></tr>`;
  });
  html += '</tbody></table>';
  scorersSection.innerHTML = html;
}

// Event listeners for navigation buttons
standingsNav.addEventListener('click', () => {
  setActiveNav('standings');
  standingsSection.style.display = 'block';
  scorersSection.style.display = 'none';
  fetchStandings(); // Fetch new data each time
});

scorersNav.addEventListener('click', () => {
  setActiveNav('scorers');
  standingsSection.style.display = 'none';
  scorersSection.style.display = 'block';
  fetchScorers(); // Fetch new data each time
});

// Initial page load: show standings by default
setActiveNav('standings');
standingsSection.style.display = 'block';
scorersSection.style.display = 'none';
fetchStandings(); 