# Teammate briefing

Internal win memo for Reconnect. Not part of the six-step demo.

## Open

```bash
python3 -m http.server 4173 --directory docs/briefing
```

Visit http://localhost:4173 — Chrome will not load the JSON from `file://`.

- PDF: `Reconnect-competitive-intel.pdf` (regenerate with `pnpm briefing:pdf`)
- CSV: `data/projects.csv` (`pnpm briefing:csv`) — one row per project
- Present: `#slides`, then arrow keys
- Filters: kind + copy/foil role + search
- Markdown: [../competitive/README.md](../competitive/README.md)
