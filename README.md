# Antimatter Dimensions (Vue 3 Remake)

A mobile-first web remake of Antimatter Dimensions.

## Goals

- **Mobile-first**: works on iOS Safari / Android Chrome, with safe area, touch, and background handling
- **Complete game**: aiming for the original ending (Pelle)
- **Modern stack**: Vue 3 + Vite + break_eternity.js
- **Extensible**: modular architecture, easy to add new mechanics
- **Better than the original on mobile**: the original only targets desktop

## Tech Stack

- Vue 3 (`<script setup>` + Composition API)
- Vite
- break_eternity.js (supports larger numbers than break_infinity.js)
- Pure frontend, saved to localStorage
- i18n extracted from the Android `strings.xml`

## Development

Developed on Termux.

```bash
npm install
npm run dev      # local dev, open 127.0.0.1:5173 in a mobile browser
npm run build    # production build
npm run preview  # preview the production build
```

## Directory Structure

```text
src/
├── core/                    # pure logic, no Vue component imports
│   ├── events/              # event hub (logic / ui dual channels)
│   ├── time/                # time system (DeltaTime / GameSpeed)
│   ├── state/               # persistent state (reactive player) & migrations
│   ├── storage/             # save system (save / serialize separated)
│   ├── loop/                # game loop (game-loop / tick / simulate-time / input-hold)
│   ├── pre-infinity/        # pre-Infinity mechanics (tickspeed, dim boost, galaxy, sacrifice)
│   ├── prestige/            # prestige resets (Big Crunch)
│   ├── challenges/          # challenge state and rule injection (Normal/Infinity)
│   ├── infinity/            # Infinity Upgrades, Break Infinity logic
│   ├── dimensions/          # dimension base class and antimatter dimensions
│   ├── autobuyers/          # AD, Tickspeed, DimBoost, Galaxy, BigCrunch autobuyers
│   ├── achievements/        # achievement state and check logic
│   ├── statistics/          # stats tracking (matter scale, etc.)
│   ├── mechanic.js          # EffectState base class & helpers
│   ├── currency.js          # currency wrapper
│   ├── decimal.js           # Decimal re-export
│   ├── format.js            # number formatting
│   ├── lazy.js              # Lazy wrapper with global invalidation registry
│   ├── math.js              # math utilities (ExponentialCostScaling, etc.)
│   └── utils.js
│
├── ui/                      # UI layer
│   ├── components/          # all Vue components
│   │   ├── layout/          # global layout (AppBar, TabBar, FabRow, StartScreen, etc.)
│   │   ├── modal/           # modal host (BaseModal.vue + index.js)
│   │   └── tabs/            # per-tab content components
│   ├── tabs/                # tab config and state
│   ├── fab-buttons.js       # floating action button config
│   └── notifications.js
│
├── game/init.js             # startup flow (load, simulate offline, start loop)
├── App.vue
└── main.js
```

## Architecture

### Layering

- **core does not depend on ui**: nothing under `core/` imports `.vue` files or anything under `ui/`
- **ui depends on core**: UI components can read `player` and call mechanics in `core/`
- **game/init.js is the bridge**: the only place that touches both core startup and UI mount timing

### State Categories

| Type | Location | Persisted | Reactive |
|---|---|---|---|
| Persistent | `core/state/player.js` | yes | yes |
| UI state | `ui/state.js` | no | yes |
| Runtime | module-level vars in `core/*` | no | no |

### EffectState Pattern
Mechanics that provide multipliers or effects (Achievements, Infinity Upgrades, Challenges) inherit from `EffectState` in `core/mechanic.js`. This provides shared methods like `effectOrDefault`, `timesEffect`, `addEffect`, etc.

### Decimal

Use `Decimal.dNumberMax` for the pre-Infinity antimatter cap. b_e does not expose
`Decimal.MAX_VALUE` (that's a b_i / break_infinity name). `Decimal.dNumberMax`
equals `Number.MAX_VALUE` and is the value the original Web version uses before
Break Infinity.

### Time System

The game has two time scales:

- **real time**: `number`, from `Date.now()`, for wall-clock tracking
- **game time**: `Decimal`, because b_e supports vastly larger values and the original `number` would overflow

`DeltaTime` updates every tick:

```js
DeltaTime.real   // number, real ms for this tick
DeltaTime.game   // Decimal, game ms for this tick
```

### Events

`EventHub` has two channels, logic and ui:

```js
// Logic subscribers run first
EventHub.logic.on(GAME_EVENT.GALAXY_RESET_AFTER, () => { /* check achievements */ });

// UI subscribers run after
EventHub.ui.on(GAME_EVENT.GALAXY_RESET_AFTER, () => { /* play animation */ });

// Dispatch to both channels (logic runs before ui)
dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
```

**When to use events**: if module A needs to react to something module B does, use `EventHub` instead of importing B. This avoids circular dependencies.

### Save System

`storage/save.js` handles localStorage; `storage/serialize.js` converts between Decimal / Set and plain values. `storage/migrations.js` handles save versioning.

Save format:

```json
{
  "antimatter": { "__d": "1e100" },
  "dimensions": { ... },
  "infinity": {
    "points": { "__d": "0" },
    "upgrades": { "__s": [] }
  },
  "lastUpdate": 1234567890123
}
```

- `__d` marks a Decimal
- `__s` marks a Set (serialized as an array)

### Start Screen & Offline Progress

The game boots into a `StartScreen.vue`. It loads the save, calculates offline time, and runs the simulation via `simulate-time.js` using `runBatched` (yielding periodically to the UI thread) before the game loop officially starts.

### Autobuyers

Autobuyers inherit from `AutobuyerState` / `UpgradeableAutobuyerState` in `core/autobuyers/`.
- **AD & Tickspeed**: Unlockable with antimatter, upgradeable intervals.
- **DimBoost, Galaxy, BigCrunch**: Unlocked by completing NC 10, 11, and 12 respectively.
- Intervals reset based on the `resetTickOn` property (e.g. DimBoost resets on Galaxy).

## Themes

Two-layer theme system, mirroring the Android palette + Metro overlay approach
(colors and shape split) but simplified:

- Base palette: `light` / `dark` / `amoled` / `lightInverted` / `darkInverted`
- Applied as `theme-*` classes on `<html>` via `watchEffect` in `App.vue`
- Inverted themes use `filter: invert(100%)` on the app root
- All colors are CSS variables; see `styles/variables.css`

## Roadmap

### Done

- [x] Vue 3 + Vite base architecture
- [x] Mobile layout (safe area, bottom nav, FabRow)
- [x] pre-Infinity core mechanics (dimensions, tickspeed, dim boost, galaxy, sacrifice)
- [x] Save and offline progress (integrated into StartScreen)
- [x] Event hub
- [x] Time system (real / game split)
- [x] Options page (Themes, Orientation, Import/Export)
- [x] Directory layering (core / ui / game)
- [x] CSS variables (styles/variables.css)
- [x] Achievements (Normal & Secret UI)
- [x] Statistics tab (General & Infinity stats, matter scale)
- [x] Modal system (alert / confirm / prompt)
- [x] Big Crunch entry & logic
- [x] Normal Challenges (C1-C12) with rule injection
- [x] Infinity Upgrades
- [x] Autobuyers (AD x8, Tickspeed, DimBoost, Galaxy, BigCrunch)

### In Progress / TODO

- [ ] Break Infinity (IP formula, UI, autobuyer upgrades)
- [ ] Infinity Dimensions
- [ ] Infinity Challenges

### Future

- [ ] Replicanti
- [ ] Eternity
- [ ] Time Dimensions / Time Studies
- [ ] Dilation
- [ ] Reality / Glyphs / Perks
- [ ] Black Hole
- [ ] Automator
- [ ] Celestials (Teresa / Effarig / Nameless / V / Ra / Lai'tela / Pelle)

## Notes

- `devSpeed` is a dev accelerator; change it in `core/time/game-speed.js`. Production should be `D(1)`
- Some mechanics (e.g. Galaxy remote scaling) trade numerical accuracy for b_e compatibility. Values may differ slightly from the original

## Disclaimer & Credits
- This is an unofficial fan-made mobile remake. All original game design, mechanics, and assets belong to Hevipelle and the Antimatter Dimensions development team.
- This project is not affiliated with, endorsed by, or sponsored by the original developers.
- No commercial use is allowed. This project is strictly for educational and personal use.
- The Android UI assets and localized strings used in this project are for reference purposes to achieve mobile-native fidelity. If the original developers request their removal, they will be promptly taken down.