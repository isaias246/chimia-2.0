// ─────────────────────────────────────────────────────────────────────────────
// CHEMIA — Pre-authored Lewis structure SVG diagrams (IUPAC conventions)
// Each SVG follows the same visual language:
//   • Atom labels  — font-family monospace, fill #e2e8f0
//   • Bond lines   — stroke #94a3b8, stroke-width 1.5
//   • Lone pairs   — fill #94a3b8, r 2.3 (two dots = one pair)
//   • Brackets     — stroke #64748b (ionic compounds)
//   • Footer label — fill #475569, font-size 9
// ─────────────────────────────────────────────────────────────────────────────

const ATOM  = 'font-family="monospace" font-size="15" font-weight="bold" fill="#e2e8f0" text-anchor="middle"';
const BOND  = 'stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"';
const DOT   = 'fill="#94a3b8" r="2.3"';
const BKT   = 'stroke="#64748b" stroke-width="1.5" fill="none"';
const LBL   = 'font-family="sans-serif" font-size="9" fill="#475569" text-anchor="middle"';
const CHG   = 'font-family="sans-serif" font-size="11" fill="#94a3b8"';

function svg(content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140">${content}</svg>`;
}

function atom(x: number, y: number, sym: string): string {
  return `<text x="${x}" y="${y}" ${ATOM}>${sym}</text>`;
}

function line(x1: number, y1: number, x2: number, y2: number): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${BOND}/>`;
}

function dbl(x1: number, y1: number, x2: number, y2: number, ox: number, oy: number): string {
  return (
    `<line x1="${x1-ox}" y1="${y1-oy}" x2="${x2-ox}" y2="${y2-oy}" ${BOND}/>` +
    `<line x1="${x1+ox}" y1="${y1+oy}" x2="${x2+ox}" y2="${y2+oy}" ${BOND}/>`
  );
}

function dot(x: number, y: number): string {
  return `<circle cx="${x}" cy="${y}" ${DOT}/>`;
}

function pair(x1: number, y1: number, x2: number, y2: number): string {
  return dot(x1, y1) + dot(x2, y2);
}

function lbl(text: string): string {
  return `<text x="110" y="133" ${LBL}>${text}</text>`;
}

function bracket(x: number, y1: number, y2: number, dir: 1 | -1): string {
  const s = dir * 6;
  return `<path d="M ${x},${y1} L ${x+s},${y1} L ${x+s},${y2} L ${x},${y2}" ${BKT}/>`;
}

// ── H₂O ────────────────────────────────────────────────────────────────────
// Bent (angular), AX₂E₂, sp³, ∠104.5°
// O at center, two H atoms below-left and below-right, 2 lone pairs on O (top)
export const SVG_H2O = svg(
  pair(96, 52, 104, 52) +       // LP 1 (top-left of O)
  pair(116, 52, 124, 52) +      // LP 2 (top-right of O)
  line(104, 76, 78, 100) +      // O–H left bond
  line(116, 76, 142, 100) +     // O–H right bond
  atom(110, 76, "O") +
  atom(71, 108, "H") +
  atom(149, 108, "H") +
  lbl("AX₂E₂ · sp³ · ∠H–O–H = 104.5° · μ = 1.85 D")
);

// ── CO₂ ────────────────────────────────────────────────────────────────────
// Linear, AX₂, sp, 2 double bonds C=O
// Each O has 2 lone pairs (top + bottom)
export const SVG_CO2 = svg(
  pair(22, 57, 32, 57) +        // O_L LP top
  pair(22, 83, 32, 83) +        // O_L LP bottom
  pair(188, 57, 198, 57) +      // O_R LP top
  pair(188, 83, 198, 83) +      // O_R LP bottom
  dbl(39, 70, 101, 70, 0, 3) +  // O=C left double bond (offset vertical)
  dbl(119, 70, 181, 70, 0, 3) + // C=O right double bond
  atom(30, 74, "O") +
  atom(110, 74, "C") +
  atom(190, 74, "O") +
  `<text x="110" y="115" ${LBL}>AX₂ · sp · lineal · μ = 0 D (simétrica)</text>`
);

// ── NH₃ ────────────────────────────────────────────────────────────────────
// Trigonal pyramidal, AX₃E₁, sp³
// N center, 3 H atoms below, 1 lone pair on N (top)
export const SVG_NH3 = svg(
  pair(103, 47, 117, 47) +      // lone pair on N
  line(103, 69, 69, 98) +       // N–H left bond
  line(117, 69, 151, 98) +      // N–H right bond
  line(110, 73, 110, 105) +     // N–H bottom bond
  atom(110, 73, "N") +
  atom(62, 107, "H") +
  atom(158, 107, "H") +
  atom(110, 117, "H") +
  `<text x="110" y="133" ${LBL}>AX₃E₁ · sp³ · piramidal trigonal · μ = 1.47 D</text>`
);

// ── CH₄ ────────────────────────────────────────────────────────────────────
// Tetrahedral, AX₄, sp³
// C center, 4 H atoms (cross projection), no lone pairs
export const SVG_CH4 = svg(
  line(110, 61, 110, 38) +      // C–H top
  line(101, 70, 67, 70) +       // C–H left
  line(119, 70, 153, 70) +      // C–H right
  line(110, 79, 110, 102) +     // C–H bottom
  atom(110, 74, "C") +
  atom(110, 30, "H") +
  atom(58, 74, "H") +
  atom(162, 74, "H") +
  atom(110, 113, "H") +
  lbl("AX₄ · sp³ · tetraédrica · μ = 0 D (simétrica)")
);

// ── NaCl ───────────────────────────────────────────────────────────────────
// Ionic: [Na]⁺  [:Cl:]⁻
// Na⁺ in brackets; Cl⁻ with 4 lone pairs in brackets
export const SVG_NaCl = svg(
  bracket(38, 54, 82, 1) +       // Na+ left bracket
  bracket(80, 54, 82, -1) +      // Na+ right bracket
  atom(59, 74, "Na") +
  `<text x="88" y="57" ${CHG}>+</text>` +
  bracket(126, 50, 92, 1) +      // Cl- left bracket
  bracket(189, 50, 92, -1) +     // Cl- right bracket
  pair(147, 53, 163, 53) +       // Cl LP top
  pair(147, 90, 163, 90) +       // Cl LP bottom
  pair(130, 64, 130, 76) +       // Cl LP left
  pair(186, 64, 186, 76) +       // Cl LP right
  atom(157, 74, "Cl") +
  `<text x="196" y="53" ${CHG}>−</text>` +
  `<text x="110" y="119" ${LBL}>Iónico · ΔEN = 2.23 · red cristalina FCC · NC = 6</text>`
);

// ── HCl ────────────────────────────────────────────────────────────────────
// Linear diatomic, AX₁E₃ on Cl, sp³
// H–Cl single bond, 3 lone pairs on Cl
export const SVG_HCl = svg(
  line(63, 70, 135, 70) +        // H–Cl bond
  atom(55, 74, "H") +
  atom(152, 74, "Cl") +
  pair(143, 52, 162, 52) +       // Cl LP top
  pair(143, 88, 162, 88) +       // Cl LP bottom
  pair(176, 63, 176, 77) +       // Cl LP right
  lbl("AX₁E₃ · sp³ (Cl) · diatómica polar · μ = 1.08 D")
);

// ── HNO₃ ───────────────────────────────────────────────────────────────────
// Planar trigonal, AX₃ (resonance), sp²
// H–O–N with =O above and resonance –O below
export const SVG_HNO3 = svg(
  line(27, 70, 50, 70) +         // H–O bond
  pair(54, 53, 64, 53) +         // O_h LP top
  pair(54, 84, 64, 84) +         // O_h LP bottom
  line(69, 70, 98, 66) +         // O–N bond
  dbl(105, 60, 105, 30, 4, 0) +  // N=O top (double bond, horizontal offset)
  line(112, 68, 141, 90) +       // N–O bottom (single, resonance)
  pair(95, 21, 115, 21) +        // O_top LP top
  pair(89, 31, 89, 41) +         // O_top LP left
  pair(148, 97, 162, 97) +       // O_bot LP bottom
  pair(152, 83, 152, 91) +       // O_bot LP right — shown with charge
  atom(20, 74, "H") +
  atom(60, 74, "O") +
  atom(108, 70, "N") +
  atom(105, 24, "O") +
  atom(150, 98, "O") +
  `<text x="163" y="91" ${CHG}>−</text>` +
  `<text x="110" y="122" ${LBL}>AX₃ (resonancia) · sp² · plana trigonal · μ = 2.17 D</text>`
);

// ── H₂SO₄ ──────────────────────────────────────────────────────────────────
// Tetrahedral around S, AX₄, sp³
// 2 S=O (above/below) and 2 S–O–H (left/right)
export const SVG_H2SO4 = svg(
  atom(20, 72, "H") +
  line(29, 70, 50, 70) +         // H–O_L bond
  pair(53, 55, 63, 55) +         // O_L LP top
  pair(53, 83, 63, 83) +         // O_L LP bottom
  atom(58, 72, "O") +
  line(67, 70, 100, 70) +        // O_L–S bond
  atom(110, 72, "S") +
  line(119, 70, 152, 70) +       // S–O_R bond
  atom(162, 72, "O") +
  pair(157, 55, 167, 55) +       // O_R LP top
  pair(157, 83, 167, 83) +       // O_R LP bottom
  line(171, 70, 192, 70) +       // O_R–H bond
  atom(200, 72, "H") +
  dbl(110, 61, 110, 30, 4, 0) +  // S=O top double bond
  pair(96, 22, 96, 32) +         // O_top LP left
  pair(124, 22, 124, 32) +       // O_top LP right
  atom(110, 24, "O") +
  dbl(110, 79, 110, 113, 4, 0) + // S=O bottom double bond
  pair(96, 108, 96, 118) +       // O_bot LP left
  pair(124, 108, 124, 118) +     // O_bot LP right
  atom(110, 122, "O") +
  `<text x="110" y="137" ${LBL}>AX₄ · sp³ · tetraédrica (S) · μ = 2.72 D</text>`
);

// ── Ca(OH)₂ ────────────────────────────────────────────────────────────────
// Ionic: Ca²⁺ and 2 × OH⁻
// Ca²⁺ in brackets; one OH⁻ shown (×2) with O–H bond and lone pairs on O
export const SVG_CaOH2 = svg(
  bracket(32, 52, 86, 1) +       // Ca²⁺ left bracket
  bracket(85, 52, 86, -1) +      // Ca²⁺ right bracket
  atom(58, 75, "Ca") +
  `<text x="93" y="55" ${CHG}>2+</text>` +
  `<text x="108" y="75" font-family="sans-serif" font-size="14" fill="#64748b">×2</text>` +
  bracket(123, 50, 92, 1) +      // OH⁻ left bracket
  bracket(194, 50, 92, -1) +     // OH⁻ right bracket
  pair(131, 54, 145, 54) +       // O LP top
  pair(131, 90, 145, 90) +       // O LP bottom
  atom(142, 74, "O") +
  line(151, 71, 173, 71) +       // O–H bond
  atom(182, 74, "H") +
  `<text x="201" y="53" ${CHG}>−</text>` +
  `<text x="110" y="118" ${LBL}>Iónico · Ca²⁺ + 2 OH⁻ · ΔEN(Ca–O) = 2.44</text>`
);

// ── CH₃COOH ────────────────────────────────────────────────────────────────
// Structural formula: methyl (sp³) + carboxyl (sp²)
// All H atoms shown, C=O and C–O–H of carboxyl group
export const SVG_CH3COOH = svg(
  atom(48, 72, "H") +
  atom(78, 38, "H") +
  atom(78, 105, "H") +
  line(55, 70, 67, 70) +         // H_left–C₁
  line(78, 48, 78, 60) +         // H_top–C₁ (down to C₁)
  line(78, 78, 78, 95) +         // H_bot–C₁
  atom(78, 72, "C") +            // C₁ methyl
  line(87, 70, 113, 70) +        // C₁–C₂
  atom(122, 72, "C") +           // C₂ carboxyl
  dbl(122, 61, 122, 30, 4, 0) +  // C₂=O double bond (up)
  pair(107, 22, 107, 32) +       // =O LP left
  pair(137, 22, 137, 32) +       // =O LP right
  atom(122, 24, "O") +
  line(131, 70, 153, 70) +       // C₂–O_hydroxyl
  pair(158, 54, 168, 54) +       // O_hydroxyl LP top
  pair(158, 83, 168, 83) +       // O_hydroxyl LP bottom
  atom(163, 72, "O") +
  line(172, 70, 192, 70) +       // O–H
  atom(200, 72, "H") +
  `<text x="78" y="122" font-family="sans-serif" font-size="8" fill="#475569" text-anchor="middle">sp³</text>` +
  `<text x="122" y="122" font-family="sans-serif" font-size="8" fill="#475569" text-anchor="middle">sp²</text>` +
  `<text x="110" y="135" ${LBL}>CH₃ (sp³) + –COOH (sp²) · pKa = 4.74 · μ = 1.74 D</text>`
);

// ── MgS ────────────────────────────────────────────────────────────────────
// Ionic: [Mg]²⁺  [S]²⁻
// Mg²⁺ in brackets; S²⁻ with 4 lone pairs in brackets
export const SVG_MgS = svg(
  bracket(38, 54, 82, 1) +       // Mg²⁺ left bracket
  bracket(80, 54, 82, -1) +      // Mg²⁺ right bracket
  atom(59, 74, "Mg") +
  `<text x="89" y="57" ${CHG}>2+</text>` +
  bracket(120, 50, 92, 1) +      // S²⁻ left bracket
  bracket(189, 50, 92, -1) +     // S²⁻ right bracket
  pair(143, 53, 157, 53) +       // S LP top
  pair(143, 90, 157, 90) +       // S LP bottom
  pair(124, 64, 124, 76) +       // S LP left
  pair(186, 64, 186, 76) +       // S LP right
  atom(155, 74, "S") +
  `<text x="196" y="53" ${CHG}>2−</text>` +
  `<text x="110" y="119" ${LBL}>Iónico · ΔEN = 1.27 · red tipo NaCl (Fm3̄m) · NC = 6</text>`
);

export const LEWIS_SVG: Record<string, string> = {
  H2O:      SVG_H2O,
  CO2:      SVG_CO2,
  NH3:      SVG_NH3,
  CH4:      SVG_CH4,
  NaCl:     SVG_NaCl,
  HCl:      SVG_HCl,
  HNO3:     SVG_HNO3,
  H2SO4:    SVG_H2SO4,
  "Ca(OH)2": SVG_CaOH2,
  CH3COOH:  SVG_CH3COOH,
  MgS:      SVG_MgS,
};
