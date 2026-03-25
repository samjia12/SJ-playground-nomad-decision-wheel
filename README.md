# Nomad Decision Wheel V2

Nomad Decision Wheel is a static ritual-grade fate machine for digital nomads, overthinkers, degen optimists, and other beautifully unserious adults. It keeps the original dark cyber-luxury tone, but upgrades the interaction model so the wheel is clearer, more replayable, and easier to share.

## Design Principles

- Entertainment first
- Ritual first
- Shareability first
- No backend, no accounts, no fake seriousness

## What Changed In V2

- Mode presets now actually change the active outcome pool
- Category legend is now a real filter system with toggle, isolate, and restore-all flows
- Outcome count updates live as the pool changes
- Accuracy is now a lightweight gameplay control for animation intensity and copy framing
- Result feedback now exists in two layers:
  - inline teaser immediately after spin
  - modal detail shortly after
- History remains local, but entries are now clickable and can reopen the exact result context
- Sharing now supports Web Share, clipboard fallback, and deep links that restore mode, filters, accuracy, and result

## Project Structure

```text
.
├── index.html
├── styles.css
├── data
│   └── outcomes.js
├── js
│   ├── dom.js
│   ├── filters.js
│   ├── history.js
│   ├── main.js
│   ├── modal.js
│   ├── share.js
│   ├── state.js
│   └── wheel.js
└── README.md
```

## Modes

- `All Fates` keeps every category live
- `Travel Spiral` leans into travel plus mythic wanderlust
- `Degen Exposure` narrows the pool to finance satire
- `Repair Mode` keeps the wheel in corrective discipline territory
- `Social Chaos` focuses on romantic and interpersonal instability
- `Moon Logic` blends spirituality, travel, and luminous bad ideas

## Categories

- Five categories remain intact: travel, finance, discipline, social, mythology
- Click a category to toggle it in or out
- Click `Only` to isolate one category
- Click `Restore All` to reload the full 50-outcome pool

## History

- Stored in localStorage only
- Maximum of 15 entries
- Each entry stores label, category, timestamp, mode, accuracy, and active category set
- Clicking a history item reopens that result detail

## Sharing

- Result sharing uses the Web Share API when supported
- Clipboard fallback copies the share text and deep link
- Deep links live in the URL hash and can restore:
  - current mode
  - active categories
  - accuracy setting
  - selected result

## Local Run

Any static server works. Example:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Deployment

- Pure front-end
- No backend or database
- GitHub Pages friendly
- Works with direct branch publishing

Live URL:

- [https://samjia12.github.io/SJ-playground-nomad-decision-wheel/](https://samjia12.github.io/SJ-playground-nomad-decision-wheel/)

## Notes

- All 50 original outcomes remain client-side and static
- The project intentionally stays unserious in tone, even when the UI becomes more maintainable
- If the wheel sounds wise, that is between you and your pattern recognition
