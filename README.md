# Nomad Decision Wheel

Nomad Decision Wheel is a static, ritual-grade fate machine for digital nomads, overthinkers, degen optimists, and other beautifully unserious adults. It is entertainment-first, browser-only, and intentionally theatrical.

The live UX is the product source of truth. This repo is structured to match that behavior directly: no backend, no auth, no CMS, no framework-heavy rewrite, and no hidden server state.

## V4-lite

V4-lite keeps the same ritualware product, but tightens the maintenance story and the first-time-user clarity:

- Centralized site and host configuration for canonical/share/playground URLs
- Clearer `Library / Eligible / Active deck` explanation near the first-screen metrics
- Stronger browser UX with keyword highlighting, active-filter feedback, and recovery CTAs
- Richer history cards that surface category, mode preset, and accuracy mode
- Lightweight custom browser events for future observability without third-party analytics

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
- Dispatches lightweight `ndw:*` custom events for future instrumentation

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
│   ├── site-config.js
│   └── outcomes.js
├── js
│   ├── analytics.js
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
  Holds the normalized outcome archive, category metadata, mode presets, and accuracy levels.

- [`data/site-config.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/data/site-config.js)
  Holds the single source of truth for canonical URLs, social image URLs, project share base URLs, and the playground URL.

- [`js/analytics.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/js/analytics.js)
  Dispatches lightweight `CustomEvent` analytics hooks without introducing a third-party SDK.

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
- Highlights matched query text inside visible results
- Shows active browser state and recovery CTAs when the view gets too specific
- Apply `Only This Category` back to the live wheel state
- No direct “force this result” cheat path

## History

- localStorage only
- Versioned payload
- Migration-safe
- Deduplicated by latest occurrence
- Hard-capped at 20 entries
- Clicking an entry reopens the same ritual context when enough state is available
- Cards display the outcome title, category, time, mode preset, and accuracy mode

## Accessibility

- Skip link
- `aria-live` wheel status
- Dialog semantics
- Focus trap and focus return
- Escape to close dialogs
- Reduced-motion support
- Keyboard-triggerable spin button

## Metadata And Sharing

Site and host settings now come from a single config source:

- canonical URL
- public social image URL
- playground URL
- project share base URL

The static HTML includes:

- meta description
- canonical URL
- Open Graph tags
- Twitter card tags
- SVG favicon
- static share artwork via [`social-card.svg`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/social-card.svg)

## Custom Events

The app dispatches browser-native events for future observability:

- `ndw:spin_start`
- `ndw:spin_end`
- `ndw:share_result`
- `ndw:share_project`
- `ndw:filters_changed`
- `ndw:browser_search`

Each event includes a useful `detail` payload such as current mode, accuracy, active categories, deck seed, result id, share method, or browser query context.

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

## Manual QA Checklist

- Load the app from a plain static server and confirm there are no broken asset paths
- Verify `Library`, `Eligible`, and `Active deck` all update when mode or category filters change
- Confirm the first-screen explainer still makes sense in these edge states:
  - zero active categories
  - one eligible outcome
  - eligible pool larger than active deck
- Open the Outcome Browser and verify query highlighting, active-filter text, empty-state recovery buttons, and keyboard focus from search into results
- Spin once and confirm history persists locally with title, category, timestamp, mode, and accuracy
- Share a result and confirm the copied/shared link restores the same ritual state
- Verify `Escape`, focus trap, focus return, and reduced-motion behavior still work for dialogs

## Changelog

### V4-lite

- Added centralized site config for canonical/share/playground URLs
- Added lightweight `ndw:*` custom analytics events
- Clarified archive vs eligible vs active deck in the first screen and utility panels
- Upgraded Outcome Browser with match highlighting, active-filter feedback, and recovery CTAs
- Expanded history card metadata without breaking old localStorage entries
