const KINDS = [
  ["all", "All"],
  ["cathay-winner", "Cathay record"],
  ["cathay-repo", "Cathay repo"],
  ["irops-hack", "IROPS hack"],
  ["production", "Production"],
  ["aerospace", "Aerospace"],
];

const FOILS = [
  ["all", "Any role"],
  ["copy-pitch", "Copy pitch"],
  ["copy-engineering", "Copy engineering"],
  ["foil", "Foil"],
  ["incumbent", "Incumbent"],
];

export function bindExplorer(data) {
  const filters = document.getElementById("filters");
  const cards = document.getElementById("cards");
  const count = document.getElementById("card-count");
  if (!filters || !cards) return;
  let kind = "all";
  let foil = "all";
  let q = "";

  function paint() {
    const list = data.projects.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false;
      if (foil !== "all" && p.copyOrFoil !== foil) return false;
      if (!q) return true;
      const blob = `${p.name} ${p.oneLiner} ${p.bu} ${p.org} ${p.reconnectTakeaway}`.toLowerCase();
      return blob.includes(q);
    });
    if (count) {
      count.textContent = `${list.length} of ${data.projects.length} projects`;
    }
    cards.innerHTML = list
      .map((p) => {
        const gh = p.github
          ? `<a href="${p.github}">GitHub</a>`
          : "<span>No public repo</span>";
        const src = (p.sources || [])
          .map((s) => `<a href="${s.url}">${s.title}</a>`)
          .join(" · ");
        return `<article class="proj">
          <h3>${p.name}</h3>
          <p class="meta">${p.year} · ${p.kind} · ${p.outcome} · ${p.copyOrFoil} · ${p.confidence}</p>
          <p>${p.oneLiner}</p>
          <p><strong>Strength.</strong> ${p.strengths[0] || ""}</p>
          <p><strong>Weakness.</strong> ${p.weaknesses[0] || ""}</p>
          <p><strong>Takeaway.</strong> ${p.reconnectTakeaway}</p>
          <p>${gh}</p>
          <p class="caption">${src}</p>
        </article>`;
      })
      .join("");
  }

  function row(name, items, attr) {
    return `<div class="filter-row" data-row="${attr}">${items
      .map(
        ([id, label], i) =>
          `<button type="button" data-${attr}="${id}" aria-pressed="${i === 0}">${label}</button>`,
      )
      .join("")}</div>`;
  }

  filters.innerHTML =
    row("kind", KINDS, "kind") +
    row("role", FOILS, "foil") +
    `<input type="search" placeholder="Search name, BU, takeaway" aria-label="Search projects" />`;

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-kind], button[data-foil]");
    if (!btn) return;
    const rowEl = btn.parentElement;
    rowEl.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b === btn));
    });
    if (btn.dataset.kind) kind = btn.dataset.kind;
    if (btn.dataset.foil) foil = btn.dataset.foil;
    paint();
  });
  filters.querySelector("input").addEventListener("input", (e) => {
    q = e.target.value.trim().toLowerCase();
    paint();
  });
  paint();
}
