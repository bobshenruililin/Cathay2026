import { architectureSvg, githubChart, scoreChart, winnerClassChart } from "./charts.js";

export function renderReport(data) {
  const { meta, patterns, projects, scorecard, learnings } = data;
  const winners = projects
    .filter((p) => p.kind === "cathay-winner")
    .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
  const years = [...new Set(winners.map((p) => p.year))];

  const patternHtml = patterns
    .map(
      (p) => `<div class="pattern" id="pat-${p.id}">
        <h3>${p.title}</h3>
        <p><span class="label">Winners</span> ${p.winnersDo}</p>
        <p><span class="label">We have</span> ${p.weHave}</p>
        <p><span class="label">Saturday</span> ${p.pitch}</p>
      </div>`,
    )
    .join("");

  const timeline = years
    .map((y) => {
      const rows = winners
        .filter((p) => p.year === y)
        .map(
          (p) => `<div class="row-card">
            <div class="meta">${p.outcome}${p.github ? "" : "<br>no public repo"}</div>
            <div><strong>${p.name}</strong> · ${p.bu}<br>${p.oneLiner}<br><em>${p.reconnectTakeaway}</em></div>
          </div>`,
        )
        .join("");
      return `<div class="year-block"><h3>${y}</h3>${rows}</div>`;
    })
    .join("");

  const tableRows = scorecard.rows
    .map(
      (r) => `<tr>
        <td>${r.label}</td>
        <td>${r.buFit}</td><td>${r.theater}</td><td>${r.feasibility}</td><td>${r.collision}</td>
        <td>${r.cite}</td>
      </tr>`,
    )
    .join("");

  const learnHtml = learnings
    .map((l) => `<li><span class="tag">${l.tag}</span><span>${l.id}. ${l.text}</span></li>`)
    .join("");

  document.getElementById("report").innerHTML = `
    <section id="verdict" class="slide">
      <h2>Start here (one minute)</h2>
      <p>2026 judges score <strong>feasibility, Business Units, path to adoption</strong>.
      Apply ${meta.calendar.apply}; 24-hour ${meta.calendar.build}; pitch ${meta.calendar.pitch}; this repo’s demo ${meta.calendar.demo}.</p>
      <p>Reconnect is a <strong>desk tool</strong>, not a lifestyle app. FlyLab (employee, existing ops, humans decide) is the analogue. U-Explore is not.</p>
      <p>Incumbent objection: CX already bought mass IROPS (Passenger Recovery + Accenture rebooking bots + 15below). Pitch <strong>beside</strong>, not instead. The wedge is the last 90 minutes at HKG T1.</p>
      <dl class="verdict-grid">
        <div class="stat"><dt>Shape</dt><dd>${meta.verdict.shape}</dd></div>
        <div class="stat kill"><dt>Kill shot</dt><dd>${meta.verdict.killShot}</dd></div>
        <div class="stat"><dt>Wedge</dt><dd>${meta.verdict.wedge}</dd></div>
      </dl>
      <p class="unknown">${meta.unknowns[0]}</p>
      ${architectureSvg()}
    </section>
    <section id="charts" class="slide">
      <h2>What the record actually shows</h2>
      ${winnerClassChart(projects)}
      ${githubChart(projects)}
    </section>
    <section id="patterns" class="slide">
      <h2>Patterns that paid</h2>
      ${patternHtml}
    </section>
    <section id="timeline" class="slide">
      <h2>Cathay winners 2016–2025</h2>
      ${timeline}
    </section>
    <section id="scorecard" class="slide">
      <h2>Reconnect scorecard</h2>
      <p>Engine citations: <code>packages/engine/src/mct.ts</code> (CX_CX 50 min, walk 10, WCH 15, UM 20),
      <code>score.ts</code> (tier×3 + seat×2 − delay/10), <code>apps/console/lib/llm/guard.ts</code>,
      <code>docs/PILOT_PROPOSAL.md</code>.</p>
      ${scoreChart(scorecard)}
      <table class="score">
        <thead><tr><th></th><th>BU</th><th>Theater</th><th>Path</th><th>Collision</th><th>Cite</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <p class="caption">${scorecard.scale}</p>
    </section>
    <section id="learnings" class="slide">
      <h2>How we win — tagged</h2>
      <ul class="learn-list">${learnHtml}</ul>
    </section>
    <section id="explorer" class="slide">
      <h2>Project explorer</h2>
      <div class="filters" id="filters"></div>
      <div class="card-grid" id="cards"></div>
    </section>
    <section id="howto" class="slide howto">
      <h2>How to use this pack</h2>
      <p>Serve the folder (Chrome will not fetch JSON from <code>file://</code>):</p>
      <p><code>python3 -m http.server 4173 --directory docs/briefing</code></p>
      <p>Then open <code>http://localhost:4173</code>. Print to PDF from the browser, or use the generated
      <code>Reconnect-competitive-intel.pdf</code>. Spreadsheet: <code>data/projects.csv</code>.
      Markdown: <code>docs/competitive/</code>. Present: add <code>#slides</code> and use ← →.</p>
    </section>`;
}
