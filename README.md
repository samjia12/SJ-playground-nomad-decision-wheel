# Nomad Decision Wheel

Nomad Decision Wheel is a static, ritual-grade fate machine for digital nomads, overthinkers, degen optimists, and other beautifully unserious adults. It is entertainment-first, browser-only, and intentionally theatrical.

The live UX is the product source of truth. This repo is structured to match that behavior directly: no backend, no auth, no CMS, no framework-heavy rewrite, and no hidden server state.

## Design Principles

- Entertainment first
- Ritual first
- Shareability first
- Browser state over backend state
- Accessibility and reduced motion are not optional

## What The App Actually Does

- Renders a large SVG decision wheel
- Supports mode presets, category filters, and accuracy framing
- Tracks three counts separately:
  - `Library`
  - `Eligible`
  - `Active deck`
- Caps the visible wheel at `50` segments
- Uses a deterministic seeded shuffle when the eligible archive exceeds the visible wheel
- Stores history locally with schema migration and deduplication
- Supports shareable deep links that restore the ritual state
- Includes an outcome browser with search and category filtering

## Project Structure

```text
.
├── favicon.svg
├── social-card.svg
├── index.html
├── styles
│   ├── app.css
│   └── tokens.css
├── data
│   └── outcomes.js
├── js
│   ├── deck.js
│   ├── dom.js
│   ├── filters.js
│   ├── history.js
│   ├── main.js
│   ├── modal.js
│   ├── outcome-browser.js
│   ├── share.js
│   ├── state.js
│   ├── url-state.js
│   └── wheel.js
└── README.md
```

## Module Responsibilities

- [`data/outcomes.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/data/outcomes.js)
  Holds the normalized outcome archive, category metadata, mode presets, accuracy levels, and project-level share copy.

- [`js/state.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/state.js)
  Holds the app state shape, deck seed helpers, mode lookup helpers, and stable category serialization helpers.

- [`js/filters.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/filters.js)
  Handles category inclusion, mode preset application, restore-all behavior, and mode summary resolution.

- [`js/deck.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/deck.js)
  Owns deterministic active deck generation and the `MAX_VISIBLE_SEGMENTS = 50` rule.

- [`js/wheel.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/wheel.js)
  Renders the SVG wheel and controls spin targeting, timing, and easing.

- [`js/modal.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/modal.js)
  Owns dialog open/close behavior, focus trapping, focus return, and Escape handling.

- [`js/outcome-browser.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/outcome-browser.js)
  Handles outcome browser filtering and rendering without allowing forced-result cheating.

- [`js/url-state.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/url-state.js)
  Serializes and restores shareable ritual state from the URL.

- [`js/history.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/history.js)
  Handles localStorage persistence, migration, deduplication, and the 20-entry cap.

- [`js/share.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/share.js)
  Owns Web Share API usage, clipboard fallback, and recoverable deep-link generation.

- [`js/dom.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/dom.js)
  Contains reusable DOM lookup and rendering helpers for the rest of the app.

- [`js/main.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/main.js)
  Wires the entire product together.

## Data Model

Every outcome is normalized to a stable shape:

- `id`
- `category`
- `categoryLabel`
- `wheelLabel`
- `title`
- `detail`
- `shareText`

Backward-compatibility aliases are preserved for older UI code:

- `shortLabel`
- `label`
- `interpretation`

The archive currently contains `100` outcomes total, with `20` outcomes in each category.

## Deck Model

The product intentionally distinguishes four layers:

- `outcomeLibrary`
  The full archive.

- `eligibleOutcomes`
  Outcomes that match the active mode and active category set.

- `activeWheelPool`
  The deterministic visible deck currently loaded onto the wheel.

- `currentResult`
  The selected outcome for the latest resolved spin.

Rules:

- If `eligibleOutcomes.length <= 50`, the wheel shows every eligible outcome.
- If `eligibleOutcomes.length > 50`, the wheel shows a seeded subset.
- Result selection always comes from the visible active deck.

## Deep Link Behavior

The app restores these values from the URL:

- `mode`
- `accuracy`
- `categories`
- `deck`
- `result`

Older result links are still tolerated through stable `id` restoration plus a legacy index fallback.

## Outcome Browser

- Search by wheel label, title, detail, or category label
- Filter the browser by category
- Apply `Only This Category` back to the live wheel state
- No direct “force this result” cheat path

## History

- localStorage only
- Versioned payload
- Migration-safe
- Deduplicated by latest occurrence
- Hard-capped at 20 entries
- Clicking an entry reopens the same ritual context when enough state is available

## Accessibility

- Skip link
- `aria-live` wheel status
- Dialog semantics
- Focus trap and focus return
- Escape to close dialogs
- Reduced-motion support
- Keyboard-triggerable spin button

## Metadata And Sharing

The static HTML includes:

- meta description
- canonical URL
- Open Graph tags
- Twitter card tags
- SVG favicon
- static share artwork via [`social-card.svg`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/social-card.svg)

## Local Run

Any static server works. Example:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Deployment

- Pure client-side
- GitHub Pages friendly
- No backend or database required

Live URL:

- [https://samjia12.github.io/SJ-playground-nomad-decision-wheel/](https://samjia12.github.io/SJ-playground-nomad-decision-wheel/)

## Notes

- This is not a productivity dashboard.
- The ritual-grade copy tone is intentionally protected.
- If the wheel sounds wise, that is between you and your pattern recognition.
