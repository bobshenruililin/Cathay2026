const KINDS = [
  ["all", "All"],
  ["cathay-winner", "Cathay winner"],
  ["cathay-repo", "Cathay repo"],
  ["irops-hack", "IROPS hack"],
  ["production", "Production"],
  ["aerospace", "Aerospace"],
];

export function bindExplorer(data) {
  const filters = document.getElementById("filters");
  const cards = document.getElementById("cards");
  if (!filters || !cards) return;
  let kind = "all";
  let q = "";

  function paint() {
    const list = data.projects.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false;
      if (!q) return true;
      const blob = `${p.name} ${p.oneLiner} ${p.bu} ${p.org}`.toLowerCase();
      return blob.includes(q);
    });
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

  filters.innerHTML =
    KINDS.map(
      ([id, label], i) =>
        `<button type="button" data-kind="${id}" aria-pressed="${i === 0}">${label}</button>`,
    ).join("") + `<input type="search" placeholder="Search" aria-label="Search projects" />`;

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-kind]");
    if (!btn) return;
    kind = btn.dataset.kind;
    filters.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b === btn));
    });
    paint();
  });
  filters.querySelector("input").addEventListener("input", (e) => {
    q = e.target.value.trim().toLowerCase();
    paint();
  });
  paint();
}
