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
│   ├── state/               # persistent state (reactive player)
│   ├── storage/             # save system (save / serialize separated)
│   ├── loop/                # game loop (game-loop / tick / simulate-time)
│   ├── pre-infinity/        # pre-Infinity mechanics
│   ├── dimensions/          # dimension base class and antimatter dimensions
│   ├── currency.js          # currency wrapper
│   ├── decimal.js           # Decimal re-export
│   ├── format.js            # number formatting
│   ├── math.js              # math utilities (ExponentialCostScaling, etc.)
│   ├── utils.js
│   └── dev-expose.js        # window.ad debug entry (DEV only)
│
├── ui/                      # UI layer
│   ├── components/          # all Vue components
│   │   ├── layout/          # global layout (AppBar, TabBar, etc.)
│   │   └── tabs/            # per-tab content components
│   ├── tabs/                # tab config and state
│   └── fab-buttons.js       # floating action button config
│
├── game/init.js             # startup flow
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
| UI state | `ui/state.js` (future) | no | yes |
| Runtime | module-level vars in `core/*` | no | no |

### Time System

The game has two time scales:

- **real time**: `number`, from `Date.now()`, for wall-clock tracking
- **game time**: `Decimal`, because b_e supports vastly larger values and the original `number` would overflow

`DeltaTime` updates every tick:

```js
DeltaTime.real   // number, real ms for this tick
DeltaTime.game   // Decimal, game ms for this tick
```

`GameSpeed.total` returns a `Decimal`, including all speed multipliers (dev speed, future black hole, etc.).

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

**Events currently dispatched**:

- `DIMBOOST_BEFORE` / `DIMBOOST_AFTER`
- `SACRIFICE_RESET_BEFORE` / `SACRIFICE_RESET_AFTER`
- `GALAXY_RESET_BEFORE` / `GALAXY_RESET_AFTER`
- `GAME_LOAD`

### Save System

`storage/save.js` handles localStorage; `storage/serialize.js` converts between Decimal and plain values.

Save format:

```json
{
  "antimatter": { "__d": "1e100" },
  "dimensions": { ... },
  "lastUpdate": 1234567890123
}
```

`__d` marks a Decimal. `load()` returns offline time in milliseconds; the caller decides whether to simulate.

### Game Loop

- `loop/game-loop.js`: timer-driven, handles `setInterval` and computing realDiff
- `loop/tick.js`: single-step advance, calls all mechanic ticks
- `loop/simulate-time.js`: bulk advance (offline progress, hibernation recovery)

If a single tick exceeds 60 seconds, `game-loop.js` routes through `simulateTime` instead of updating directly.

## Debugging

In DEV mode, `window.ad` exposes common objects:

```js
ad.player.antimatter.toString()
ad.DeltaTime.game.toString()
ad.setAM('1e100')         // set antimatter
ad.setD8('1e50')          // set 8th dimension
ad.save()
ad.events.logic.on(ad.events.GAME_EVENT.GALAXY_RESET_AFTER, () => console.log('galaxy'))
```

## Roadmap

### Done

- [x] Vue 3 + Vite base architecture
- [x] Mobile layout (safe area, bottom nav, FabRow)
- [x] pre-Infinity core mechanics (dimensions, tickspeed, dim boost, galaxy, sacrifice)
- [x] Save and offline progress
- [x] Event hub
- [x] Time system (real / game split)
- [x] Options page
- [x] Directory layering (core / ui / game)
- [x] CSS variables (styles/variables.css)
- [x] Safe area support (notch, bottom bar)
- [x] Achievements

### In Progress / TODO

- [ ] News ticker
- [ ] Big Crunch entry
- [ ] Infinity content

### Future

- [ ] Infinity Dimensions
- [ ] Infinity Challenges
- [ ] Replicanti
- [ ] Eternity
- [ ] Time Dimensions / Time Studies
- [ ] Dilation
- [ ] Reality / Glyphs / Perks
- [ ] Black Hole
- [ ] Automator
- [ ] Celestials (Teresa / Effarig / Enslaved / V / Ra / Lai'tela / Pelle)

## Notes

- `devSpeed` is a dev accelerator; change it in `core/time/game-speed.js`. Production should be `D(1)`
- Some mechanics (e.g. Galaxy remote scaling) trade numerical accuracy for b_e compatibility. Values may differ slightly from the original