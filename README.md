# Nomad Decision Wheel

Nomad Decision Wheel is a static single-page "fate roulette" for digital nomads, overthinkers, and financially unserious adults. It uses a 50-segment SVG wheel, fake-profound interpretations, and local-only history storage to create a polished cyber-nomad ritual experience.

## Features

- 50 handcrafted outcomes across travel, degen finance satire, discipline, social chaos, and absurd spirituality
- SVG-based decision wheel with inertial spin and accurate stopping logic
- Glassmorphism interpretation modal with Web Share API and clipboard fallback
- Persistent local history with timestamps and clear action
- Desktop-first layout with responsive tablet/mobile behavior
- Reduced-motion support and keyboard-friendly modal controls

## Run locally

Because the page uses ES modules, serve the folder with any static file server instead of opening the HTML file as a raw file URL.

### Option 1

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

### Option 2

Use any local static server you already prefer.

## Project structure

- `index.html` - page structure, Tailwind CDN config, and custom visual styling
- `data.js` - 50 outcomes and category metadata
- `app.js` - SVG wheel generation, spin physics, modal logic, sharing, and history persistence

## Notes

- All content is static and client-side only.
- History is stored in `localStorage` under `nomad-decision-wheel-history`.
- The project is intentionally entertainment-first and not real advice.
