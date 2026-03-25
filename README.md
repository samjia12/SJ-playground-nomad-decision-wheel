# Nomad Decision Wheel V3

Nomad Decision Wheel is a static ritual-grade fate machine for digital nomads, overthinkers, degen optimists, and other beautifully unserious adults. This version keeps the dark cyber-luxury tone, but makes the product clearer, more scalable, more replayable, and easier to operate from pure browser state.

## Design Principles

- Entertainment first
- Ritual first
- Shareability first
- No backend, no accounts, no fake seriousness

## What Changed In V3

- The outcome library now scales beyond the visible wheel
- Counts are fully data-driven:
  - `Library` = full archive size
  - `Eligible` = current mode + category matches
  - `Active deck` = outcomes currently loaded onto the wheel
- The wheel now renders at most `MAX_VISIBLE_SEGMENTS = 50`
- When eligible outcomes exceed the visible cap, a seeded deck is generated so the visible wheel stays readable and shareable
- Result deep links now preserve:
  - mode
  - accuracy
  - active categories
  - deck seed
  - result id
- History is versioned and migrated in localStorage
- The top of the page now has clearer CTA hierarchy:
  - `Spin Now`
  - `Browse Outcomes`
- Added an `Outcome Browser` dialog with search and category browsing
- Lower-page narrative copy now uses progressive disclosure instead of one long uninterrupted landing block

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

## Data Model

All outcomes are normalized from one shared archive in [`data/outcomes.js`](/Users/samjia/Downloads/codex/Decision%20Wheel%20%20/data/outcomes.js).

Each outcome resolves to a stable shape:

- `id`
- `category`
- `categoryLabel`
- `wheelLabel`
- `title`
- `detail`
- `shareText`

Compatibility aliases are also preserved for older UI code:

- `shortLabel`
- `label`
- `interpretation`

## Modes

- `All Fates` keeps every category live
- `Travel Spiral` maps to `Travel Impulse`
- `Degen Exposure` maps to `Finance / Degen Satire`
- `Repair Mode` maps to `Discipline / Self-Correction`
- `Social Chaos` maps to `Romantic / Social Chaos`
- `Moon Logic` maps to `Absurd Spirituality`

## Wheel Logic

- `outcomeLibrary` is the full archive
- `eligibleOutcomes` are filtered by active mode + active categories
- `activeWheelPool` is what the wheel actually renders
- `currentResult` always comes from the active wheel pool
- If `eligibleOutcomes.length <= 50`, the wheel renders every eligible outcome
- If `eligibleOutcomes.length > 50`, a seeded shuffle selects the visible deck

This keeps the wheel readable even after the library grows.

## Categories

- Five categories remain intact: travel, finance, discipline, social, mythology
- Each category now has 20 outcomes
- Category cards act as real legend + filter controls
- Click a category to toggle it
- Click `Only` to isolate it
- Click `Restore All` to recover from over-filtering

## Outcome Browser

- Open with `Browse Outcomes`
- Search by wheel label, title, detail, or category label
- Filter inside the browser by category
- Use `Only This Category` to apply that category back to the main wheel
- Keeps the ritual intact by not allowing forced results

## History

- Stored in localStorage only
- Maximum of 20 entries
- Versioned payload with migration support
- Compatible with older entries that stored only basic result metadata
- Clicking a history item reopens that result detail and restores its mode/filter context when possible
- Repeated outcomes are deduplicated so the latest occurrence wins

## Sharing And URL State

- Result sharing uses the Web Share API when supported
- Clipboard fallback copies share text plus a recoverable link
- Deep links live in the URL hash
- The URL can restore:
  - mode
  - active categories
  - accuracy
  - deck seed
  - selected result
- Older result links are still handled through stable outcome ids and a small legacy index fallback

## Accessibility Notes

- Native `<button>` controls are used for key actions
- Result modal and outcome browser are both keyboard-closable with `Escape`
- Focus returns to a sensible trigger after closing dialogs
- The wheel status uses `aria-live`
- `prefers-reduced-motion` shortens or effectively disables non-essential motion

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

- The archive now contains 100 outcomes total
- The wheel still only surfaces a readable active deck at a time
- The project intentionally stays unserious in tone, even when the code becomes more maintainable
- If the wheel sounds wise, that is between you and your pattern recognition
