# Leonida Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/afgil-ainudin/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/afgil-ainudin/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 Grand Theft Auto VI trophies on
PlayStation 5 — built for the make.fun bounty **gta6-trophy-guide-01**.

## What it is

A static web app (no build step, no network) that covers every one of the
game's 55 official trophies — 1 platinum, 2 gold, 6 silver, 46 bronze — with:

- **Tracker**: a checklist saved in your browser (localStorage), with export
  to a file and import back.
- **Filters**: by kind (story, missable, collectibles, activities, online),
  by grade, by earned state, plus text search.
- **Spoiler setting**: hides the names and descriptions of story trophies
  until you earn them.
- **Roadmap to the platinum**: the order to play, from the story through
  strangers and contacts, collectibles, activities and the 100% cleanup.
- **A cited guide for every trophy**: what to do, where and how, and when it
  can be missed — written in our own words, each naming its sources
  (PowerPyx, PSNProfiles, PlayStationTrophies.org, Exophase). A source is
  cited, never copied. Trophy names and descriptions are shown as
  PlayStation publishes them.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

Open the page in desktop Chrome. Everything loads from `app/`; your
progress never leaves your machine. To hand the entry in:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `app/index.html`, `app/style.css`, `app/app.js` — the guide itself.
- `app/data/trophies.json` — the 55 official trophies with grades, kinds,
  missable flags, counts, guides and sources.
- `screenshots/` — 4 screenshots of the guide in a browser.
- `main.ts` — copies `app/` and `screenshots/` to `/output` and writes the
  dossier with the vendored `vendor/makefun-frontend.ts`.
- `serve.ts` — a tiny static server for local use.

## Sources & notes

Trophy names, descriptions and grades are the official PlayStation 5 list.
Guides cite their sources beside each trophy; where a detail is still
unconfirmed, the guide says so instead of guessing. Unofficial fan guide —
not affiliated with, endorsed by, or connected to Rockstar Games,
Take-Two Interactive or Sony Interactive Entertainment.

<sub>Entered on [make.fun](https://make.fun/?ref=zx1m9ca1&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
