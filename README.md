# Interactive Formulas

A learning lab for understanding relationships by changing values and following calculations.

**[Open the live site](https://robertboettchersf.github.io/interactive-formulas/?v=2)** · **[Open the topic gallery](https://robertboettchersf.github.io/interactive-formulas/gallery.html?v=2)**

## Version 0.2

1. A single Lorenz Attractor introduction, using the supplied Ada/WebAssembly payload unchanged. Click or tap anywhere to open the gallery. Keyboard users can focus the full-screen link and press Enter. Reduced-motion preferences show a static trail.
2. A topic gallery opening on Physics. Choose Chemistry, Mathematics, Physics or Computer Science with the topic tiles. Direct topic URLs and the older subject-page URLs still work.
3. UK English, German, Spanish and French language buttons. The language is saved locally; without a saved preference the gallery uses UK English. Results and substituted numbers use the corresponding locale. Switching language preserves entered values.
4. Sanskrit digital rain, using complete akshara strings (including conjuncts), with a bundled Devanagari font. Pause/play is available and reduced-motion preferences are respected.
5. The same two starter cards as version 0.1: a straight-line relationship and a percentage of a whole. They are clearly labelled as shared demonstrations in Physics and Mathematics, not subject-specific collections. Chemistry and Computer Science show honest preparation notices. No full subject formula sets are included.
6. A bright build stamp on every screen, mirrored exactly in `version.txt`.

## Run locally

No build step or package installation required:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. A local server is needed for JavaScript modules.

## Files

- `index.html`: Lorenz introduction; embedded WebAssembly retained.
- `gallery.html`: topic gallery; `home.html` is a compatible entry point.
- Subject HTML files: direct entry points into the same gallery layout.
- `gallery.js`, `i18n.js`: topic state and translations; internal topic keys remain English.
- `formula-card.js`: shared interactive component and the two existing sample calculations.
- `rain.js`: whole-akshara canvas background.
- `assets/noto-sans-devanagari.ttf`, `assets/OFL.txt`: bundled font and its SIL Open Font License.
- `styles.css`, `version.txt`: shared appearance and authoritative build stamp.

The cards use JavaScript floating-point arithmetic. Displayed results are rounded to ten significant digits. These are learning aids, not tools for safety-critical calculations. Numeric inputs use native browser controls; displayed results and worked steps follow the selected language.

## Publishing and build stamps

GitHub Pages serves the root of `main`. Every publish updates the version, timestamp and source-commit short SHA. The identical string appears on every HTML screen and in `version.txt`. The SHA identifies the source snapshot; the following release commit adds the stamp. Timestamps use Europe/Berlin.

Check the current release at `https://raw.githubusercontent.com/RobertBoettcherSF/interactive-formulas/main/version.txt`, never a cached CDN main path. Use a fresh `?v=` parameter when opening a release.

The supplied visualization is reused without recompiling or rewriting its Ada/WebAssembly core. No separate source archive or license grant for that core was supplied here. The bundled font is covered by the licence in `assets/OFL.txt`.
