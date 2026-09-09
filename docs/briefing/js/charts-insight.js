import { hBars, scatter, svgBars } from "./charts.js";

const LIFESTYLE = new Set(["cx-discovery", "cathay-green", "u-explore"]);
const OPS = new Set(["touchcx", "naar", "gingtrip", "flylab"]);

export function winnerClassChart(projects) {
  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
  const champs = projects.filter((p) => p.outcome === "champion");
  const series = [
    {
      name: "Lifestyle / loyalty champions",
      labels: years.map(String),
      values: years.map((y) => champs.filter((p) => p.year === y && LIFESTYLE.has(p.id)).length),
    },
    {
      name: "Ops / inflight / cargo / hardware / employee",
      labels: years.map(String),
      values: years.map((y) => champs.filter((p) => p.year === y && OPS.has(p.id)).length),
    },
  ];
  return svgBars(series, {
    title: "Ops wins exist — and 2019 never ran. Empty years are not a trend.",
    yLabel: "press champions in this set",
    caption:
      "Source: Cathay/Swire press. 2019 cancelled (CX press). 2018 and 2021 champion names unpublished — plotted as zero, not guessed. 2025: student U-Explore (grey) + employee FlyLab (green). Small n; do not overfit.",
    colors: ["#8a8f86", "#0b5f52"],
  });
}

export function githubChart(projects) {
  const champs = projects.filter((p) => p.kind === "cathay-winner" && p.outcome === "champion");
  const parts = projects.filter((p) => p.kind === "cathay-repo" && p.id !== "reconnect");
  return svgBars(
    [
      {
        name: "Public GitHub in this set",
        labels: ["Press champions", "Participant repos"],
        values: [champs.filter((p) => p.github).length, parts.filter((p) => p.github).length],
      },
    ],
    {
      title: "Zero press champions in this set ship a public repo. Participants do.",
      yLabel: "count",
      caption:
        "Source: gh search + this database. GME 2021 has GitHub and is a participant, not a press champion. Stars are not the scoreboard.",
      colors: ["#0b5f52"],
    },
  );
}

export function patternChart(patterns, projects) {
  const rows = patterns
    .map((pat) => ({
      label: pat.title,
      value: projects.filter((p) => (p.patterns || []).includes(pat.id)).length,
    }))
    .sort((a, b) => b.value - a.value);
  return hBars(rows, {
    title: "How often each pattern shows up in this corpus (n = this database, not all aviation).",
    xLabel: "projects tagged",
    caption: "A tag is a claim, not a vote. High count on llm-foil means the GitHub default is still ChatGPT.",
    color: "#0b5f52",
  });
}

export function foilChart(projects) {
  const order = ["copy-pitch", "copy-engineering", "foil", "incumbent"];
  const rows = order.map((id) => ({
    label: id,
    value: projects.filter((p) => p.copyOrFoil === id).length,
  }));
  return hBars(rows, {
    title: "Most of what GitHub shows you is a foil. Incumbents are few and already bought.",
    xLabel: "projects",
    caption: "copy-pitch = steal the sentence. copy-engineering = steal the shape. foil = do not demo like this. incumbent = sit beside.",
    color: "#4d7c73",
  });
}

export function scoreScatter(scorecard) {
  const points = scorecard.rows.map((r) => ({
    x: r.feasibility,
    y: r.collision,
    label: r.label,
    accent: r.id === "reconnect",
  }));
  return scatter(points, {
    title: "We want high adoption path and low collision. We are high/high until the pitch says beside.",
    xLabel: "adoption path (1–5)",
    yLabel: "incumbent collision (1–5, worse up)",
    caption:
      "Green dot = Reconnect. FlyLab is the target quadrant (high path, low collision). Passenger Recovery sits at max collision because it *is* the incumbent. Judgement on sourced facts, not a survey.",
  });
}

export function architectureSvg() {
  return `<figure class="figure diagram"><h3>Beside, not instead — CX already bought the left box</h3>
  <svg class="chart" viewBox="0 0 720 168" role="img" aria-label="Passenger Recovery beside Reconnect">
    <rect x="16" y="20" width="300" height="124" fill="none" stroke="#1a1c19"/>
    <text x="28" y="44" font-size="14">Mass IROPS (bought)</text>
    <text x="28" y="66" font-size="12" fill="#5c635c">Passenger Recovery · 8,000 pax / 40 min</text>
    <text x="28" y="86" font-size="12" fill="#5c635c">Accenture self-rebook · 15below notify</text>
    <text x="28" y="106" font-size="12" fill="#5c635c">Amadeus Self Re-accommodation</text>
    <rect x="404" y="20" width="300" height="124" fill="none" stroke="#0b5f52"/>
    <text x="416" y="44" font-size="14" fill="#0b5f52">HKG T1 desk (this repo)</text>
    <text x="416" y="66" font-size="12" fill="#5c635c">last 90 min · agent confirm</text>
    <text x="416" y="86" font-size="12" fill="#5c635c">MCT + walk + UM + WCH + party</text>
    <text x="416" y="106" font-size="12" fill="#5c635c">reasoning[] · CANS after approve</text>
    <line x1="316" y1="82" x2="404" y2="82" stroke="#1a1c19"/>
    <text x="330" y="76" font-size="11">does not replace</text>
  </svg>
  <p class="caption">Rogers 2019 named the airborne-misconnect gap. Week-1 Altéa is read-only. HX is Navitaire — different PSS, different sentence.</p></figure>`;
}
