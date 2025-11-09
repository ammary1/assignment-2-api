// CPIT-405 — Assignment 2
// Public API: Universities Search (no auth) — http://universities.hipolabs.com/search?name=QUERY
const API = "https://universities.hipolabs.com/search?name=";

// Elements
const queryInput = document.getElementById("query");
const btnSearch  = document.getElementById("btnSearch");
const btnSample  = document.getElementById("btnSample");
const statusBox  = document.getElementById("status");
const tbody      = document.getElementById("tbody");
const cards      = document.getElementById("cards");

// Helpers
const html = (strings, ...vals) => strings.map((s,i)=>s+(vals[i]??"")).join("");

function setStatus(msg, type="info"){
  statusBox.textContent = msg || "";
  statusBox.style.color = type === "error" ? "#b91c1c" : "#475569";
}

function rowTemplate(u){
  const url = (u.web_pages && u.web_pages[0]) ? u.web_pages[0] : "#";
  return html`<tr>
    <td>${u.name}</td>
    <td>${u.country} ${u["alpha_two_code"] ? `(${u["alpha_two_code"]})` : ""}</td>
    <td><a href="${url}" target="_blank" rel="noopener">${url}</a></td>
  </tr>`;
}

function cardTemplate(u){
  const url = (u.web_pages && u.web_pages[0]) ? u.web_pages[0] : "#";
  return html`<article class="card">
      <h3>${u.name}</h3>
      <div class="country">${u.country} ${u["alpha_two_code"] ? `(${u["alpha_two_code"]})` : ""}</div>
      <a href="${url}" target="_blank" rel="noopener">Visit website →</a>
    </article>`;
}

function render(list){
  // Table
  tbody.innerHTML = list.map(rowTemplate).join("");
  // Cards (optional visual)
  cards.innerHTML = list.slice(0, 8).map(cardTemplate).join("");
}

async function searchUniversities(q){
  const qTrim = (q||"").trim();
  if (!qTrim){
    setStatus("Type a keyword, e.g., 'king', then click Search.");
    tbody.innerHTML = ""; cards.innerHTML = "";
    return;
  }

  const url = API + encodeURIComponent(qTrim);
  setStatus("Loading…");

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0){
      setStatus(`No results for “${qTrim}”. Try another keyword.`);
      tbody.innerHTML = ""; cards.innerHTML = "";
      return;
    }

    setStatus(`Found ${data.length} universit${data.length === 1 ? "y" : "ies"} for “${qTrim}”.`);
    render(data);
  } catch (err){
    console.error(err);
    setStatus("Failed to fetch data. Check your internet or try again.", "error");
    tbody.innerHTML = ""; cards.innerHTML = "";
  }
}

// Events
btnSearch.addEventListener("click", () => searchUniversities(queryInput.value));
btnSample.addEventListener("click", () => { queryInput.value = "king"; searchUniversities("king"); });
queryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchUniversities(queryInput.value);
});

// Initial hint
setStatus("Enter a keyword (e.g., ‘king’) and click Search.");
