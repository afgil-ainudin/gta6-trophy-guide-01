// Hand in the GTA VI trophy guide: copy the static app and the screenshots
// into the output directory and write the dossier the judge reads.
//
// This program runs on Node 22 with the standard library only. It takes no
// arguments and no network: it reads this repository (app/, screenshots/ and
// vendor/makefun-frontend.ts) and writes /output, or the directory named by
// MAKEFUN_OUTPUT_DIR when that is set (handy outside the grader).
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The dossier is built by the kit's vendored library, vendor/makefun-frontend.ts,
// which must stay byte for byte as the kit shipped it: the scorer rebuilds the
// dossier with its own copy and compares the two. The guide itself lives in
// app/data/trophies.json; the app is plain static files under app/.
//
// The program is deterministic: it writes only from the repository's files,
// so two runs in a row produce byte-identical output (the grader runs it
// twice and requires the same bytes both times).

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory holding this file.
const here = fileURLToPath(new URL('.', import.meta.url));
// The grader gives us /output; local runs use MAKEFUN_OUTPUT_DIR instead.
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });

// The whole guide: HTML, modules, styles and the trophy data.
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

// The screenshots, first by name the cover. The folder may be absent on a
// partial checkout; the dossier builder then refuses, which is what we want.
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own (see the kit's RULES.txt, "The gate"): at most
// 4 screenshots of 256 KiB each, app/ at most 993 files and 48 MiB, and the
// dossier text at most 160 KiB. An entry over any of them is refused here
// with the library's own words, before anything is handed in.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
