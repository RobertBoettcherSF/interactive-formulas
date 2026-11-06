# Syllabus-Repo

A learning lab for understanding relationships by changing values and following calculations.

**[Open the live site](https://robertboettchersf.github.io/interactive-formulas/?v=5)** · **[Open the topic gallery](https://robertboettchersf.github.io/interactive-formulas/gallery.html?v=5)**

## Version 0.5

1. The project is titled **Syllabus-Repo** on the introduction, gallery and browser tabs. A subdued Lorenz animation remains in the background. Click or tap anywhere to enter.
2. Chemistry keeps **36 interactive cards in eight topic groups**.
3. Mathematics now includes **122 interactive cards in ten topic groups**: numbers, powers and percentages; area and volume; equations; functions; geometry and trigonometry; probability and data; calculus; vectors in space; sequences and series; complex numbers.
4. Equations include the quadratic formula (discriminant and both real roots). Geometry includes Pythagoras, the intercept theorem, and right-triangle sine, cosine and tangent. The unit-circle sine and cosine cards remain, in radians.
5. Every Mathematics card shows a formula, what the symbols mean, sample inputs, an initial result, substituted steps, validation and Reset. Expand a topic or use the group links to explore it.
6. UK English, German, Spanish and French cover card titles, explanations, labels and gallery controls. Results and substituted numbers follow the selected locale. Language changes preserve entered values.
7. Physics retains only the two shared starter demonstrations. Computer Science remains a preparation space; its full collection has not been added.
8. Sanskrit digital rain, reduced-motion support, saved language and bright matching build stamps remain available.

**[Open Chemistry](https://robertboettchersf.github.io/interactive-formulas/chemistry.html?v=5)** · **[Open Mathematics](https://robertboettchersf.github.io/interactive-formulas/mathematics.html?v=5)**

### Mathematics scope

The quadratic formula returns real roots. A negative discriminant is shown on its own card and blocks the root cards. Pythagoras gives the hypotenuse or a missing leg, and the hypotenuse must be the longest side. The intercept theorem uses one proportion for two rays cut by parallel lines, rearranged to a missing segment. Right-triangle sine, cosine and tangent use opposite, adjacent and hypotenuse, with the angle in degrees. Separate cards give sine and cosine on the unit circle in radians. Circle, pyramid, cone and sphere cards use the standard relations for those figures. A prism volume is base area times height, including an oblique prism. Percentage means a fraction with denominator 100.

### Scientific scope and conventions

Gas cards use a user-specified molar volume or equal-temperature/equal-pressure volume ratios, not an arbitrary fixed molar volume. Stoichiometry assumes the displayed balanced coefficients and complete conversion unless the card says otherwise.

Acid–base examples state temperature and activity assumptions. Strong acid/base cards include water autoionisation at 25 °C; weak acid/base cards use quadratic mass balance but exclude inputs where neglecting water would be misleading. The pH scale is not universally limited to 0–14. Equilibrium and Nernst calculations use dimensionless quotients; dilute concentrations approximate activities only under the stated conditions.

These are educational models, not laboratory instructions. They do not replace experimental checks, activity corrections or a safety assessment.

## Run locally

No build step or package installation required:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. A local server is needed for JavaScript modules.

## Check the calculations

Run `npm test` (Node.js; no package installation needed) for the sample-result and model-domain checks.

## Files

- `index.html`: Lorenz introduction; embedded WebAssembly retained.
- `gallery.html`: topic gallery; `home.html` is a compatible entry point.
- Subject HTML files: direct entry points into the same gallery layout.
- `gallery.js`, `i18n.js`: topic state and translations; internal topic keys remain English.
- `formula-card.js`: shared interactive component, input validation and worked steps.
- `chemistry.js`: Chemistry calculations and four-language card content.
- `rain.js`: whole-akshara canvas background.
- `assets/noto-sans-devanagari.ttf`, `assets/OFL.txt`: bundled font and its SIL Open Font License.
- `styles.css`, `version.txt`: shared appearance and authoritative build stamp.

The cards use JavaScript floating-point arithmetic. Displayed results are rounded to ten significant digits, using scientific notation for very large or very small values. These are learning aids, not tools for safety-critical calculations. Numeric inputs use native browser controls; displayed results and worked steps follow the selected language.

## Publishing and build stamps

GitHub Pages serves the root of `main`. Every publish updates the version, timestamp and source-commit short SHA. The identical string appears on every HTML screen and in `version.txt`. The SHA identifies the source snapshot; the following release commit adds the stamp. Timestamps use Europe/Berlin.

Check the current release at `https://raw.githubusercontent.com/RobertBoettcherSF/interactive-formulas/main/version.txt`, never a cached CDN main path. Use a fresh `?v=` parameter when opening a release.

The supplied visualization is reused without recompiling or rewriting its Ada/WebAssembly core. No separate source archive or license grant for that core was supplied here. The bundled font is covered by the licence in `assets/OFL.txt`.
