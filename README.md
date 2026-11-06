# Syllabus-Repo

A learning lab for understanding relationships by changing values and following calculations.

**[Open the live site](https://robertboettchersf.github.io/interactive-formulas/?v=11)** · **[Open the topic gallery](https://robertboettchersf.github.io/interactive-formulas/gallery.html?v=11)**

## Version 0.11

1. The project is titled **Syllabus-Repo** on the introduction, gallery and browser tabs. A subdued Lorenz animation remains in the background. Click or tap anywhere to enter.
2. Chemistry keeps **36 interactive cards in eight topic groups**.
3. Mathematics now includes **133 interactive cards in ten topic groups**.
4. Equations include the quadratic formula (discriminant and both real roots). Geometry includes Pythagoras, the intercept theorem, right-triangle sine, cosine and tangent, and the sine and cosine rules for any triangle. Sequences include the binomial theorem. Numbers include compound percent-per-period growth. The unit-circle sine and cosine cards remain, in radians.
5. Every Mathematics card shows a formula, what the symbols mean, sample inputs, an initial result, substituted steps, validation and Reset. Expand a topic or use the group links to explore it.
6. UK English, German, Spanish and French cover card titles, explanations, labels and gallery controls. Results and substituted numbers follow the selected locale. Language changes preserve entered values.
7. Physics now includes **91 interactive cards in ten topic groups**: motion; forces; mechanical energy and momentum; electric current and electrical energy; optics; heat and thermal energy; electromagnetism and induction; oscillations and waves; static electric and magnetic fields; nuclear and quantum relations. Optics adds Snell’s law and the thin-lens equation. Heat adds the ideal-gas law. Forces adds Kepler’s third law. Nuclear and quantum relations add the infinite square well.
8. Computer Science now includes **53 interactive cards in seven topic groups**: number systems and encoding; symmetric ciphers; codes and modular arithmetic; graphs; recursion; binary trees; algorithm complexity. Codes add an ISBN-style check, Hamming distance and a modular power. Graphs add breadth-first and depth-first counts and visit orders on four nodes, plus a Dijkstra distance and one relaxation. Binary trees add a Huffman encoded length.
9. Sanskrit digital rain is denser: narrower columns, a longer trail and tighter glyph spacing, still in the same pale green and still one whole akshara per glyph. Reduced-motion support, saved language and bright matching build stamps remain available.
10. Short sounds mark a changed formula input, a completed calculation, a language change and Reset. Sound off is saved with the language preference.

**[Open Chemistry](https://robertboettchersf.github.io/interactive-formulas/chemistry.html?v=11)** · **[Open Mathematics](https://robertboettchersf.github.io/interactive-formulas/mathematics.html?v=11)** · **[Open Physics](https://robertboettchersf.github.io/interactive-formulas/physics.html?v=11)** · **[Open Computer Science](https://robertboettchersf.github.io/interactive-formulas/computer-science.html?v=11)**

### Computer Science scope

A binary place with index p is worth 2 to the power p, and one byte is eight bits. Four hexadecimal digits use places 4096, 256, 16 and 1; one such digit is four bits. Two’s complement on n bits runs from −2 to the power n−1 up to one below that power. Unsigned addition keeps the remainder modulo 2 to the power n. A half adder and a full adder return the sum bit and the carry. Caesar and one Vigenère letter move a letter position modulo 26, with A numbered 0. An adjacency matrix of n vertices has n squared entries, and a row of ones and zeros sums to a degree. The greatest common divisor is the last non-zero remainder. Moving n disks in the Tower of Hanoi takes one less than 2 to the power n. Height counts edges from the root. Operation counts cover a linear, quadratic, logarithmic and exponential model, the adjacent comparisons of bubble sort, a balanced merge-sort level count, and a brute-force candidate count. An ISBN-style sum uses weights 1, 3, 1, 3 and a final weight of 1. Hamming distance compares equal-width binary writings. A modular power keeps the remainder of aᵇ modulo n. Breadth-first and depth-first search, and Dijkstra’s distance, use one four-node graph. Huffman length is frequency times code length.

### Physics scope

Speed is distance over time, resistance is voltage over current, and force in one dimension is mass times acceleration. The impulse relation is F·Δt = m·Δv. Work along a constant force is force times distance. Kinetic energy and gravitational energy are the two mechanical forms used in an exchange that starts from rest. Ideal-transformer voltages follow the turns, and the currents run in the opposite ratio. Photon energy is proportional to frequency, and an electron’s wavelength is the Planck constant divided by its momentum. A mass difference corresponds to Δm c². Radioactive decay uses halves of the half-life. A negative value under a speed square root is rejected, and a speed used in the Lorentz factor must stay below the speed of light. Reflection is limited to 0°–90°, and efficiency cannot exceed 1. Snell’s law rejects a product n sin θ that is larger than the other index. A thin lens has no finite distance when the denominator is zero. The ideal-gas law uses absolute temperature and a positive volume. Kepler’s third law compares two orbits through T² ∝ a³. An infinite square well has no level n = 0.

### Mathematics scope

The quadratic formula returns real roots. A negative discriminant is shown on its own card and blocks the root cards. Pythagoras gives the hypotenuse or a missing leg, and the hypotenuse must be the longest side. The intercept theorem uses one proportion for two rays cut by parallel lines, rearranged to a missing segment. Right-triangle sine, cosine and tangent use opposite, adjacent and hypotenuse, with the angle in degrees. Separate cards give sine and cosine on the unit circle in radians. The sine rule and the cosine rule apply to any triangle. The binomial theorem expands (a + b)ⁿ for a whole-number power up to 20. Compound growth multiplies by 1 + r/100 each period; it is not simple interest. Circle, pyramid, cone and sphere cards use the standard relations for those figures. A prism volume is base area times height, including an oblique prism. Percentage means a fraction with denominator 100.

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
- `computer-science.js`: Computer Science calculations and four-language card content.
- `rain.js`: whole-akshara canvas background.
- `assets/noto-sans-devanagari.ttf`, `assets/OFL.txt`: bundled font and its SIL Open Font License.
- `styles.css`, `version.txt`: shared appearance and authoritative build stamp.

The cards use JavaScript floating-point arithmetic. Displayed results are rounded to ten significant digits, using scientific notation for very large or very small values. These are learning aids, not tools for safety-critical calculations. Numeric inputs use native browser controls; displayed results and worked steps follow the selected language.

## Publishing and build stamps

GitHub Pages serves the root of `main`. Every publish updates the version, timestamp and source-commit short SHA. The identical string appears on every HTML screen and in `version.txt`. The SHA identifies the source snapshot; the following release commit adds the stamp. Timestamps use Europe/Berlin.

Check the current release at `https://raw.githubusercontent.com/RobertBoettcherSF/interactive-formulas/main/version.txt`, never a cached CDN main path. Use a fresh `?v=` parameter when opening a release.

The supplied visualization is reused without recompiling or rewriting its Ada/WebAssembly core. No separate source archive or license grant for that core was supplied here. The bundled font is covered by the licence in `assets/OFL.txt`.
