import { architectureSvg } from "./charts-insight.js";

export function verdictHtml(meta) {
  const cal = meta.calendar;
  const unknowns = meta.unknowns.map((u) => `<li>${u}</li>`).join("");
  return `<section id="verdict" class="slide">
    <h2>Start here</h2>
    <ol class="facts">
      <li><span>Judges</span> Feasibility, Business Units, path to adoption.</li>
      <li><span>Dates</span> Apply ${cal.apply}. 24h ${cal.build}. Pitch ${cal.pitch}. Demo ${cal.demo}.</li>
      <li><span>Shape</span> ${meta.verdict.shape}</li>
      <li><span>Kill shot</span> ${meta.verdict.killShot}</li>
      <li><span>Wedge</span> ${meta.verdict.wedge}</li>
    </ol>
    <p>FlyLab (employee, existing packs, humans decide) is the analogue. U-Explore is not. Pitch <strong>beside</strong> Passenger Recovery.</p>
    ${architectureSvg()}
    <p class="unknown">Unknowns</p>
    <ul class="unknown-list">${unknowns}</ul>
  </section>`;
}

export function patternHtml(patterns) {
  const cards = patterns
    .map(
      (p, i) => `<article class="pattern" id="pat-${p.id}">
        <h3><span class="num">${i + 1}</span> ${p.title}</h3>
        <p><span class="label">Winners</span> ${p.winnersDo}</p>
        <p><span class="label">We have</span> ${p.weHave}</p>
        <p><span class="label">Saturday</span> ${p.pitch}</p>
      </article>`,
    )
    .join("");
  return `<section id="patterns" class="slide">
    <h2>Ten patterns</h2>
    <p class="lede-inline">If two conflict in a sentence, keep named-BU, feasibility-2026, incumbent-IROPS, and LLM-foil.</p>
    <div class="pattern-grid">${cards}</div>
  </section>`;
}

export function failureHtml(insights) {
  const rows = insights.failures
    .map(
      (f) => `<tr><td>${f.year}</td><td>${f.name}</td><td>${f.result}</td><td>${f.why}</td></tr>`,
    )
    .join("");
  const notes = insights.corrections.map((c) => `<li>${c}</li>`).join("");
  return `<section id="failures" class="slide">
    <h2>What lost, and what we had wrong</h2>
    <table class="plain">
      <thead><tr><th>Year</th><th>Case</th><th>Result</th><th>Why it is a warning</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h3>Corrections to this pack</h3>
    <ul class="plain-list">${notes}</ul>
  </section>`;
}

export function timelineHtml(projects) {
  const winners = projects
    .filter((p) => p.kind === "cathay-winner")
    .sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
  const rows = winners
    .map(
      (p) => `<tr>
        <td>${p.year}</td>
        <td>${p.outcome}</td>
        <td>${p.name}</td>
        <td>${p.bu}</td>
        <td>${p.github ? "yes" : "no"}</td>
        <td>${p.reconnectTakeaway}</td>
      </tr>`,
    )
    .join("");
  return `<section id="timeline" class="slide">
    <h2>Cathay record 2016–2025</h2>
    <table class="plain wide">
      <thead><tr><th>Year</th><th>Result</th><th>Name</th><th>BU</th><th>GitHub</th><th>Takeaway</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </section>`;
}

export function scoreHtml(scorecard) {
  const rows = scorecard.rows
    .map(
      (r) => `<tr>
        <td>${r.label}</td>
        <td>${r.buFit}</td><td>${r.theater}</td><td>${r.feasibility}</td><td>${r.collision}</td>
        <td>${r.cite}</td>
      </tr>`,
    )
    .join("");
  return `<p>Engine: <code>mct.ts</code> CX_CX 50, walk 10, WCH +15, UM +20.
    <code>score.ts</code> tier×3 + seat×2 − delay/10. <code>guard.ts</code>. Pilot note.</p>
    <table class="plain">
      <thead><tr><th></th><th>BU</th><th>Theater</th><th>Path</th><th>Collision</th><th>Cite</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="caption">${scorecard.scale}</p>`;
}

export function learnHtml(learnings) {
  const order = ["Pitch", "Demo", "Pilot", "LATER"];
  const blocks = order
    .map((tag) => {
      const items = learnings
        .filter((l) => l.tag === tag)
        .map((l) => `<li><span class="id">${l.id}</span> ${l.text}</li>`)
        .join("");
      return `<div class="learn-group"><h3>${tag}</h3><ul>${items}</ul></div>`;
    })
    .join("");
  return `<section id="learnings" class="slide">
    <h2>How we win — grouped</h2>
    <div class="learn-cols">${blocks}</div>
  </section>`;
}
