# Interactive Formulas

A small learning lab for understanding relationships by changing values and following calculations.

**[Open the live site](https://robertboettchersf.github.io/interactive-formulas/?v=1)**

## First edition

1. An animated introduction using the supplied Ada/WebAssembly Symmetry Visualizations, cycling through 16 demos. Continue opens the catalogue. Pause/play is available; reduced-motion preferences pause the animation by default.
2. English navigation and ready-to-fill subject spaces for Chemistry, Mathematics, Physics, and Computer Science. These collections are not yet implemented.
3. Two working sample cards: a straight-line relationship and a percentage of a whole. Both start with values and results, show substituted calculations, update immediately, and support reset.
4. A reusable `<formula-card kind="…">` component with labelled inputs, numeric validation, live results, and explanation text. Add a configuration to `formula-card.js` to extend it.
5. A bright build stamp on every screen, mirrored in `version.txt`.

No subject formula sets are included in this edition.

## Run locally

No dependencies or build step required. Serve this folder, for example:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Use a local server because the shared cards use a JavaScript module.

## Files

- `index.html`: animated introduction, original embedded WebAssembly payload retained.
- `home.html`: catalogue and two sample cards.
- `chemistry.html`, `mathematics.html`, `physics.html`, `computer-science.html`: subject spaces.
- `styles.css`, `formula-card.js`: shared layout and interactive component.
- `version.txt`: authoritative plain-text build stamp.

The cards use ordinary JavaScript floating-point arithmetic. Displayed results are rounded to ten significant digits. They are learning aids, not tools for safety-critical calculations.

## Publishing and build stamps

GitHub Pages serves the root of `main`. Each publish must update the build timestamp and the source-commit short SHA, with exactly the same string in every HTML screen and `version.txt`. The SHA identifies the source snapshot used for the stamped release; the following release commit adds that stamp. Build timestamps use Europe/Berlin.

To check the current deployed version, fetch `https://raw.githubusercontent.com/RobertBoettcherSF/interactive-formulas/main/version.txt` rather than a cached CDN main path. Use a fresh `?v=` parameter when opening a new release.

The supplied visualization is reused without recompiling or rewriting its Ada/WebAssembly core. No separate source archive or license grant for that core was supplied here.
